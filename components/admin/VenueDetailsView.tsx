'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import {
  Loader2, AlertTriangle, ArrowLeft, MapPin,
  Users, Eye, Calendar, Pencil, User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VenueDetailsView() {
  const params = useParams();
  const venueId = params.id as string;
  const currentLocale = (params.locale as string) || 'en';

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('get_admin_venue_details', {
        p_venue_id: venueId
      });
      if (rpcErr) throw rpcErr;
      if (!rpcData) throw new Error('Venue not found');
      setData(rpcData);
    } catch (err: any) {
      setError(err.message || 'Failed to load venue details.');
    } finally {
      setIsLoading(false);
    }
  }, [venueId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  if (isLoading) return (
    <AdminLayout>
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-live-red" />
      </div>
    </AdminLayout>
  );

  if (error || !data) return (
    <AdminLayout>
      <div className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <span>{error || 'Venue not found'}</span>
      </div>
    </AdminLayout>
  );

  const { venue, checkins, events } = data;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/${currentLocale}/admin/venues`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="size-5 text-white" />
          </Link>
          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{venue.name}</h2>
            <p className="mt-1 text-sm text-white/60 font-mono">ID: {venue.id}</p>
          </div>
        </div>
        <Link href={`/${currentLocale}/admin/venues/${venueId}/edit`}>
          <Button className="bg-white/10 hover:bg-white/20 text-white gap-2">
            <Pencil className="size-4" /> Edit Venue
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1">
          {/* Cover Photo */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-2">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-white/5">
              {venue.cover_photo ? (
                <img src={venue.cover_photo} alt={venue.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="size-10 text-white/20" />
                </div>
              )}
            </div>
          </div>

          {/* Venue Info */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Venue Details</h3>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex justify-between">
                <span className="text-white/50">Status</span>
                <span className={`font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded-full ${venue.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>{venue.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Type</span>
                <span className="capitalize">{venue.venue_type?.replace(/_/g, ' ') || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Importance</span>
                <span className="font-bold">{venue.importance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Guest List</span>
                <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${venue.is_guest_open ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/40'}`}>{venue.is_guest_open ? 'Open' : 'Closed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Total Check-ins</span>
                <span className="font-bold text-white">{venue.actual_checkin_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Views</span>
                <span className="flex items-center gap-1"><Eye className="size-3" /> {venue.view_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Events Held</span>
                <span className="font-bold">{venue.event_count}</span>
              </div>
              {venue.address && (
                <div className="pt-2">
                  <span className="block text-white/50 mb-1">Address</span>
                  <p className="flex gap-1.5 text-white/80"><MapPin className="size-4 shrink-0 mt-0.5 text-white/40" />{venue.address}</p>
                </div>
              )}
              {venue.description && venue.show_about && (
                <div className="pt-2">
                  <span className="block text-white/50 mb-1">Description</span>
                  <p className="bg-black/30 p-3 rounded-lg text-sm text-white">{venue.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Current Visitors */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Users className="size-4" /> Check-ins ({checkins.length})
            </h3>
            {checkins.length === 0 ? (
              <p className="text-sm text-white/40">No check-ins yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {checkins.map((c: any, i: number) => (
                  <Link href={`/${currentLocale}/admin/users/${c.user_id}`} key={i} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="size-10 rounded-full bg-black/50 overflow-hidden shrink-0">
                      {c.photo_urls?.[0] ? (
                        <img src={c.photo_urls[0]} alt={c.first_name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="size-5 m-2.5 text-white/50" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm truncate">{c.first_name} {c.last_name}</div>
                      <div className="text-xs text-white/50 truncate">@{c.username}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Related Events */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Calendar className="size-4" /> Events at this Venue ({events.length})
            </h3>
            {events.length === 0 ? (
              <p className="text-sm text-white/40">No events at this venue.</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {events.map((e: any, i: number) => (
                  <Link href={`/${currentLocale}/admin/events/${e.id}`} key={i} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="size-10 rounded-lg bg-black/50 overflow-hidden shrink-0">
                      {e.cover_photo ? (
                        <img src={e.cover_photo} alt={e.title} className="w-full h-full object-cover" />
                      ) : (
                        <Calendar className="size-5 m-2.5 text-white/50" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-bold text-sm truncate">{e.title}</div>
                      <div className="text-xs text-white/50">{new Date(e.starts_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-xs text-white/60 text-right shrink-0">
                      <span className="font-bold text-white">{e.checkin_count}</span> check-ins
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
