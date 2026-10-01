import { Metadata } from 'next';
import UsersView from '@/components/admin/UsersView';

export const metadata: Metadata = {
  title: 'Users | Admin Dashboard',
};

export default function AdminUsersPage() {
  return <UsersView />;
}
