import { UpdateUser } from '@/components/Admin/UpdateUser';
import SpinLoader from '@/components/SpinLoader';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'User Admin',
};

export default async function AdminUserPage() {
  return (
    <Suspense fallback={<SpinLoader containerClasses='mb-16' />}>
      <UpdateUser />
    </Suspense>
  );
}
