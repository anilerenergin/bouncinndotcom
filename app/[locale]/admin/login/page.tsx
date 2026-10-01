import { Metadata } from 'next';
import AdminLogin from '@/components/admin/AdminLogin';

export const metadata: Metadata = {
  title: 'Admin Login | Bouncinn',
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
