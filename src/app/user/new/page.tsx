import { CreateUserForm } from '@/components/CreateUserForm';
import { Metadata } from 'next';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Criar Conta',
};
export default async function CreateUserPage() {
  return <CreateUserForm />;
}
