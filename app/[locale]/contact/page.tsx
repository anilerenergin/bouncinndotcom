import { SiteShell } from '@/components/SiteShell';
import { CtaFooterSection } from '@/components/sections/CtaFooterSection';

export default function ContactPage() {
  return (
    <SiteShell>
      <div className="pt-32 md:pt-16">
        <CtaFooterSection />
      </div>
    </SiteShell>
  );
}
