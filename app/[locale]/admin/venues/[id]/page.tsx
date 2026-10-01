import { Metadata } from 'next';
import VenueDetailsView from '@/components/admin/VenueDetailsView';
export const metadata: Metadata = { title: 'Venue Details | Admin Dashboard' };
export default function AdminVenueDetailsPage() { return <VenueDetailsView />; }
