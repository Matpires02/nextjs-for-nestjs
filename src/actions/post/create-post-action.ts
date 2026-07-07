'use server';

import { PublicPost } from '@/dto/post/dto';
import { verifyLoginSession } from '@/lib/login/manage-login';
import {
  CreatePostForApiSchema,
  PublicPostForApiSchema,
} from '@/lib/post/schemas';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/utils/get-zod-error-message';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

type CreatePostState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados Inválidos'],
    };
  }

  const formdataObj = Object.fromEntries(formData.entries());
  const zodParsedObj = CreatePostForApiSchema.safeParse(formdataObj);

  const isAuthenticated = await verifyLoginSession();
  if (!isAuthenticated) {
    return {
      errors: ['Faça login em outra aba antes de salvar'],
      formState: PublicPostForApiSchema.parse(prevState.formState),
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error.format());
    return {
      errors,
      formState: PublicPostForApiSchema.parse(prevState.formState),
    };
  }

  const newPost = zodParsedObj.data;

  const createPostResponse = await authenticatedApiRequest<PublicPost>(
    `/post/me`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    },
  );

  if (!createPostResponse.success) {
    return {
      formState: PublicPostForApiSchema.parse(formdataObj),
      errors: createPostResponse.errors,
    };
  }

  const createdPost = createPostResponse.data;

  revalidateTag('posts', 'max');

  redirect(`/admin/post/${createdPost.id}?created=1`);
}
