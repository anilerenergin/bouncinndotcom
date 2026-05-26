import { Calendar, ExternalLink, MapPin, Ticket, Users } from 'lucide-react';
import Link from 'next/link';
import type { PublicEventDetail, PublicVenueDetail } from '@/lib/public-link-detail';

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function humanize(value: string | null) {
  if (!value) return null;
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function HeroImage({ image, title }: { image: string | null; title: string }) {
  return (
    <div className="relative aspect-[4/5] min-h-[360px] overflow-hidden bg-[#111114] md:aspect-[16/9] md:min-h-[520px]">
      {image ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
          aria-label={title}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(255,72,72,0.22),transparent_36%),linear-gradient(135deg,#17171a,#050506)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/55 to-black/25" />
    </div>
  );
}

function InfoPill({ icon: Icon, children }: { icon: typeof Calendar; children: React.ReactNode }) {
  return (
    <div className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white/82">
      <Icon className="size-4 text-live-red" />
      <span>{children}</span>
    </div>
  );
}

export function PublicEventPage({ event }: { event: PublicEventDetail }) {
  const start = formatDate(event.starts_at);
  const place = event.venue?.name || event.address || 'Bouncinn event';

  return (
    <main className="min-h-dvh bg-[#050506] pb-10 text-white selection:bg-live-red/30">
      <HeroImage image={event.cover_photo || event.venue?.cover_photo || null} title={event.title} />
      <section className="relative z-10 -mt-44 px-5">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="mb-5 inline-flex text-sm font-bold text-white/70 hover:text-white">
            BOUNCINN
          </Link>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-live-red">Event</p>
          <h1 className="mt-2 text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">{event.title}</h1>
          <p className="mt-4 text-lg font-semibold text-white/78">{place}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {start ? <InfoPill icon={Calendar}>{start}</InfoPill> : null}
            {event.venue?.name ? <InfoPill icon={MapPin}>{event.venue.name}</InfoPill> : null}
          </div>

          <div className="mt-8 rounded-lg border border-white/10 bg-[#111114]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
            {event.address || event.venue?.address ? (
              <div className="flex gap-3 rounded-lg border border-white/10 bg-black/25 p-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-live-red" />
                <p className="text-sm leading-6 text-white/72">{event.address || event.venue?.address}</p>
              </div>
            ) : null}

            <div className="mt-5 grid gap-3">
              {event.ticket_url ? (
                <a
                  href={event.ticket_url}
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-live-red px-4 text-sm font-black text-white shadow-[0_14px_34px_rgba(255,72,72,0.2)] hover:bg-live-red/90"
                >
                  <Ticket className="mr-2 size-4" />
                  Get tickets
                </a>
              ) : null}
              <a
                href={`https://app.bouncinn.com/event/${event.id}`}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-black text-white hover:bg-white/10"
              >
                <ExternalLink className="mr-2 size-4" />
                Open in Bouncinn
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function PublicVenuePage({ venue }: { venue: PublicVenueDetail }) {
  const type = humanize(venue.venue_type);

  return (
    <main className="min-h-dvh bg-[#050506] pb-10 text-white selection:bg-live-red/30">
      <HeroImage image={venue.cover_photo} title={venue.name} />
      <section className="relative z-10 -mt-44 px-5">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="mb-5 inline-flex text-sm font-bold text-white/70 hover:text-white">
            BOUNCINN
          </Link>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-live-red">Venue</p>
          <h1 className="mt-2 text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">{venue.name}</h1>
          {type ? <p className="mt-4 text-lg font-semibold text-white/78">{type}</p> : null}

          <div className="mt-6 flex flex-wrap gap-2">
            {venue.address ? <InfoPill icon={MapPin}>{venue.address}</InfoPill> : null}
            {venue.prefers_groups ? <InfoPill icon={Users}>Group friendly</InfoPill> : null}
          </div>

          <div className="mt-8 rounded-lg border border-white/10 bg-[#111114]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
            {venue.upcomingEvents.length > 0 ? (
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white/50">Upcoming</h2>
                <div className="mt-3 space-y-2">
                  {venue.upcomingEvents.map((event) => (
                    <Link
                      href={`/event/${event.id}`}
                      key={event.id}
                      className="block rounded-lg border border-white/10 bg-black/25 p-4 hover:bg-white/[0.06]"
                    >
                      <p className="font-black text-white">{event.title}</p>
                      <p className="mt-1 text-sm text-white/55">{formatDate(event.starts_at)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <a
              href={`https://app.bouncinn.com/venue/${venue.id}`}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-live-red px-4 text-sm font-black text-white shadow-[0_14px_34px_rgba(255,72,72,0.2)] hover:bg-live-red/90"
            >
              <ExternalLink className="mr-2 size-4" />
              Open in Bouncinn
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
