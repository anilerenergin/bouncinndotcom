import { SiteShell } from '@/components/SiteShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { ManifestoSection } from '@/components/sections/ManifestoSection';

export default function HomePage() {
  return (
    <SiteShell>
      <HeroSection />
      <ManifestoSection />
    </SiteShell>
  );
}
