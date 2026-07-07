import { PostModel } from '@/models/post/post-model';
import { apiRequest } from '@/utils/api-request';
import { cache } from 'react';

export const findAllPublicPostCached = cache(async () => {
  const postsResponse = await apiRequest<PostModel[]>(`/post`, {
    next: {
      tags: ['posts'],
      revalidate: 86400,
    },
  });

  return postsResponse;
});
export const findPublicPostBySlugCached = cache(async (slug: string) => {
  const postsResponse = await apiRequest<PostModel>(`/post/${slug}`, {
    next: {
      tags: [`post-${slug}`],
      revalidate: 86400,
    },
  });

  return postsResponse;
});
