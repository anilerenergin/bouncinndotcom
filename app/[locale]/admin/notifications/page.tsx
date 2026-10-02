import { Metadata } from 'next';
import NotificationsView from '@/components/admin/NotificationsView';

export const metadata: Metadata = {
  title: 'Send Notification | Admin Dashboard'
};

export default function AdminNotificationsPage() {
  return <NotificationsView />;
}
