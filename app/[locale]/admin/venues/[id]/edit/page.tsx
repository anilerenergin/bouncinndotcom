import { Metadata } from 'next';
import VenueEditView from '@/components/admin/VenueEditView';
export const metadata: Metadata = { title: 'Edit Venue | Admin Dashboard' };
export default function AdminVenueEditPage() { return <VenueEditView />; }
