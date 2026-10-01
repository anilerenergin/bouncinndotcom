import { Metadata } from 'next';
import RemoteConfigView from '@/components/admin/RemoteConfigView';

export const metadata: Metadata = {
  title: 'Remote Config | Admin Dashboard',
};

export default function AdminRemoteConfigPage() {
  return <RemoteConfigView />;
}
