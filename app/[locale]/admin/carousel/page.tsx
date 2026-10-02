import { Metadata } from 'next';
import CarouselView from '@/components/admin/CarouselView';

export const metadata: Metadata = {
  title: 'Home Carousel | Admin Dashboard'
};

export default function AdminCarouselPage() {
  return <CarouselView />;
}
