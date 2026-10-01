import { Metadata } from 'next';
import EventEditView from '@/components/admin/EventEditView';

export const metadata: Metadata = {
  title: 'Edit Event | Admin Dashboard',
};

export default function AdminEventEditPage() {
  return <EventEditView />;
}
