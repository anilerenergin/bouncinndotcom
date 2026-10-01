import { Metadata } from 'next';
import EventDetailsView from '@/components/admin/EventDetailsView';

export const metadata: Metadata = {
  title: 'Event Details | Admin Dashboard',
};

export default function AdminEventDetailsPage() {
  return <EventDetailsView />;
}
