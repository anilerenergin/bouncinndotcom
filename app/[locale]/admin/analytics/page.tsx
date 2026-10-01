import { Metadata } from 'next';
import AnalyticsView from '@/components/admin/AnalyticsView';

export const metadata: Metadata = {
  title: 'Analytics | Admin Dashboard',
};

export default function AdminAnalyticsPage() {
  return <AnalyticsView />;
}
