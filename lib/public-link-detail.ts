export type PublicDetailKind = 'event' | 'venue';

export type PublicEventDetail = {
  id: string;
  title: string;
  about: string | null;
  address: string | null;
  cover_photo: string | null;
  starts_at: string;
  ends_at: string | null;
  ticket_url: string | null;
  capacity: number | null;
  prefers_groups: boolean | null;
  is_guest_open: boolean;
  latitude: number | null;
  longitude: number | null;
  venue: {
    id: string;
    name: string;
    address: string | null;
    cover_photo: string | null;
    latitude: number | null;
    longitude: number | null;
    venue_type: string | null;
  } | null;
  company: {
    id: string;
    company_name: string;
  } | null;
};

export type PublicVenueDetail = {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  cover_photo: string | null;
  prefers_groups: boolean | null;
  opening_hours: Record<string, unknown> | null;
  latitude: number | null;
  longitude: number | null;
  status: string | null;
  venue_type: string | null;
  is_guest_open: boolean;
  company: {
    id: string;
    company_name: string;
  } | null;
  upcomingEvents: Array<{
    id: string;
    title: string;
    cover_photo: string | null;
    starts_at: string;
    ends_at: string | null;
  }>;
};

export type PublicLinkDetail =
  | { type: 'event'; item: PublicEventDetail }
  | { type: 'venue'; item: PublicVenueDetail };

export async function getPublicLinkDetail(kind: PublicDetailKind, id: string): Promise<PublicLinkDetail | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase public config is missing.');
  }

  const url = new URL(`${supabaseUrl}/functions/v1/public-link-detail`);
  url.searchParams.set('type', kind);
  url.searchParams.set('id', id);

  const response = await fetch(url, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    cache: 'no-store',
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || 'Failed to load public link detail.');
  }

  return response.json() as Promise<PublicLinkDetail>;
}
