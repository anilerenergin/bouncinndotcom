import { Metadata } from 'next';
import UserDetailsView from '@/components/admin/UserDetailsView';

export const metadata: Metadata = {
  title: 'User Details | Admin Dashboard',
};

export default function AdminUserDetailsPage() {
  return <UserDetailsView />;
}
