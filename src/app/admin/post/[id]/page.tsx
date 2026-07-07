import ManagePostForm from '@/components/Admin/ManagePostForm';
import { findPostByIdAdmin } from '@/lib/post/queries/admin';
import { PublicPostForApiSchema } from '@/lib/post/schemas';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type AdminPostIdPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Editar post',
};

export default async function AdminPostIdPage({
  params,
}: AdminPostIdPageProps) {
  const allowUploadImage = Boolean(Number(process.env.ALLOW_UPLOAD_IMAGE));

  const { id } = await params;
  const postResponse = await findPostByIdAdmin(id);

  if (!postResponse.success) {
    console.error(postResponse.errors);
    notFound();
  }

  const publicPost = PublicPostForApiSchema.parse(postResponse.data);

  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-xl font-extrabold'>Editar post</h1>
      <ManagePostForm
        allowUploadImage={allowUploadImage}
        mode='update'
        publicPost={publicPost}
      />
    </div>
  );
}
