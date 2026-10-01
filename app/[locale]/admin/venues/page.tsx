import { Metadata } from 'next';
import VenuesView from '@/components/admin/VenuesView';
export const metadata: Metadata = { title: 'Venues | Admin Dashboard' };
export default function AdminVenuesPage() { return <VenuesView />; }
