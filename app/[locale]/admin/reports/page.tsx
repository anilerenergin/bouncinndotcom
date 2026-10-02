import { Metadata } from 'next';
import ReportsView from '@/components/admin/ReportsView';

export const metadata: Metadata = {
  title: 'Reports | Admin Dashboard'
};

export default function AdminReportsPage() {
  return <ReportsView />;
}
