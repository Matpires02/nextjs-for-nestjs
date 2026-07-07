'use server';

import { PublicPost } from '@/dto/post/dto';
import { verifyLoginSession } from '@/lib/login/manage-login';
import {
  PostUpdateSchema,
  PublicPostForApiSchema,
  UpdatePostForApiSchema,
} from '@/lib/post/schemas';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/utils/get-zod-error-message';
import { makeRandomString } from '@/utils/make-random-string';
import { revalidateTag } from 'next/cache';

type UpdatePostState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: UpdatePostState,
  formData: FormData,
): Promise<UpdatePostState> {
  const isAuthenticated = await verifyLoginSession();

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados Inválidos'],
    };
  }

  const id = formData.get('id')?.toString() || '';

  if (!id) {
    return {
      formState: prevState.formState,
      errors: ['Dados Inválidos'],
    };
  }

  const formdataObj = Object.fromEntries(formData.entries());
  const zodParsedObj = UpdatePostForApiSchema.safeParse(formdataObj);

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
      formState: PublicPostForApiSchema.parse(formdataObj),
    };
  }

  const newPost = zodParsedObj.data;

  const updatePostResponse = await authenticatedApiRequest<PublicPost>(
    `/post/me/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(newPost),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!updatePostResponse.success) {
    return {
      formState: PublicPostForApiSchema.parse(formdataObj),
      errors: updatePostResponse.errors,
    };
  }

  const post = updatePostResponse.data;

  revalidateTag('posts', 'max');
  revalidateTag(`post-${post.slug}`, 'max');

  return {
    formState: PublicPostForApiSchema.parse(post),
    errors: [],
    success: makeRandomString(),
  };
}
