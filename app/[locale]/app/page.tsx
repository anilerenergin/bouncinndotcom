import { SiteShell } from '@/components/SiteShell';
import { AppPromotionsSection } from '@/components/sections/AppPromotionsSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { RealTimeContextSection } from '@/components/sections/RealTimeContextSection';

export default function AppPage() {
  return (
    <SiteShell>
      <div className="pt-36 md:pt-24">
        <HowItWorksSection />
        <RealTimeContextSection />
        <AppPromotionsSection />
      </div>
    </SiteShell>
  );
}
