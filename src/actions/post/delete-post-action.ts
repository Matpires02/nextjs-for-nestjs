'use server';

import { PublicPost } from '@/dto/post/dto';
import { verifyLoginSession } from '@/lib/login/manage-login';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { revalidateTag } from 'next/cache';

export async function deletePostAction(id: string) {
  const isAuthenticated = await verifyLoginSession();
  if (!isAuthenticated) {
    return {
      error: 'Faça login em outra aba antes de salvar',
    };
  }

  if (!id || typeof id !== 'string') {
    return {
      error: 'Dados Inválidos',
    };
  }

  const postResponse = await authenticatedApiRequest<PublicPost>(
    `/post/me/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!postResponse.success) {
    return {
      error: 'Erro ao encontrar post',
    };
  }

  const deletePostResponse = await authenticatedApiRequest<PublicPost>(
    `/post/me/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!deletePostResponse.success) {
    return {
      error: 'Erro ao apagar post',
    };
  }

  revalidateTag('posts', 'max');
  revalidateTag(`post-${postResponse.data.slug}`, 'max');

  return {
    error: undefined,
  };
}
