import { Metadata } from 'next';
import EventsView from '@/components/admin/EventsView';

export const metadata: Metadata = {
  title: 'Events | Admin Dashboard',
};

export default function AdminEventsPage() {
  return <EventsView />;
}
