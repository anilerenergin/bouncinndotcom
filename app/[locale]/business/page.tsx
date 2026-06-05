import { SiteShell } from '@/components/SiteShell';
import { FeatureHighlightsSection } from '@/components/sections/FeatureHighlightsSection';

export default function BusinessPage() {
  return (
    <SiteShell>
      <div className="pt-36 md:pt-24">
        <FeatureHighlightsSection />
      </div>
    </SiteShell>
  );
}
