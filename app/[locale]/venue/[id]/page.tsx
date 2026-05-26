import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicVenuePage } from '@/components/public-details/PublicDetailPage';
import { getPublicLinkDetail } from '@/lib/public-link-detail';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = await getPublicLinkDetail('venue', id).catch(() => null);

  if (!detail || detail.type !== 'venue') {
    return { title: 'Venue | Bouncinn' };
  }

  return {
    title: `${detail.item.name} | Bouncinn`,
    description: detail.item.description || detail.item.address || 'Bouncinn venue',
    openGraph: {
      title: detail.item.name,
      description: detail.item.description || detail.item.address || 'Bouncinn venue',
      images: detail.item.cover_photo ? [detail.item.cover_photo] : undefined,
    },
  };
}

export default async function VenueDetailPage({ params }: Props) {
  const { id } = await params;
  const detail = await getPublicLinkDetail('venue', id).catch(() => null);

  if (!detail || detail.type !== 'venue') notFound();

  return <PublicVenuePage venue={detail.item} />;
}
