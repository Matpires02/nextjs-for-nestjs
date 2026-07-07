'use server';

import { verifyLoginSession } from '@/lib/login/manage-login';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';

const IMAGE_UPLOAD_MAX_SIZE =
  Number(process.env.NEXT_PUBLIC_MAX_SIZE) || 921600;

export async function uploadImageAction(
  formData: FormData,
): Promise<{ url: string; error?: string }> {
  const isAuthenticated = await verifyLoginSession();
  if (!isAuthenticated) {
    return {
      error: 'Faça login em outra aba antes de salvar',
      url: '',
    };
  }

  if (!(formData instanceof FormData)) {
    return { error: 'Dados inválidos', url: '' };
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { error: 'Arquivo inválido', url: '' };
  }

  if (file.size > IMAGE_UPLOAD_MAX_SIZE) {
    return { error: 'Arquivo muito grande', url: '' };
  }

  if (!file.type.startsWith('image/')) {
    return { error: 'Imagem Inválida', url: '' };
  }

  const uploadResponse = await authenticatedApiRequest<{ url: string }>(
    `/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );
  if (!uploadResponse.success) {
    return { error: uploadResponse.errors[0], url: '' };
  }
  const url = `${process.env.IMAGE_SERVER_URL}${uploadResponse.data.url}`;

  return { url: url };
}
