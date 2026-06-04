import type { Metadata } from 'next';
import StaffPortal from '@/components/staff/StaffPortal';

export const metadata: Metadata = {
  title: 'Staff Portal | Bouncinn',
  description: 'Code-based staff access for promotion redemption.',
};

export default function StaffPage() {
  return <StaffPortal />;
}
