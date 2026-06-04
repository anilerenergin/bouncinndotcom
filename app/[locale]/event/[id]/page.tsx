import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicEventPage } from '@/components/public-details/PublicDetailPage';
import { getPublicLinkDetail } from '@/lib/public-link-detail';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = await getPublicLinkDetail('event', id).catch(() => null);

  if (!detail || detail.type !== 'event') {
    return { title: 'Event | Bouncinn' };
  }

  return {
    title: `${detail.item.title} | Bouncinn`,
    description: detail.item.venue?.name || 'Bouncinn event',
    openGraph: {
      title: detail.item.title,
      description: detail.item.venue?.name || 'Bouncinn event',
      images: detail.item.cover_photo ? [detail.item.cover_photo] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const detail = await getPublicLinkDetail('event', id).catch(() => null);

  if (!detail || detail.type !== 'event') notFound();

  return <PublicEventPage event={detail.item} />;
}
