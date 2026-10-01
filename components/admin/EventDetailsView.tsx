'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import {
  Loader2, AlertTriangle, ArrowLeft, Calendar, 
  MapPin, Clock, Users, Eye, Link as LinkIcon, User as UserIcon, Pencil
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EventDetailsView() {
  const params = useParams();
  const eventId = params.id as string;
  const currentLocale = (params.locale as string) || 'en';

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('get_admin_event_details', {
        p_event_id: eventId
      });
      
      if (rpcErr) throw rpcErr;
      if (!rpcData) throw new Error('Event not found');
      
      setData(rpcData);
    } catch (err: any) {
      setError(err.message || 'Failed to load event details.');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-live-red" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{error || 'Event not found'}</span>
        </div>
      </AdminLayout>
    );
  }

  const { event, checkins } = data;
  const eventDate = new Date(event.starts_at);
  const isPast = event.ends_at ? new Date(event.ends_at) < new Date() : eventDate < new Date(Date.now() - 86400000);

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${currentLocale}/admin/events`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="size-5 text-white" />
          </Link>
          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl flex items-center gap-2">
              {event.title}
            </h2>
            <p className="mt-1 text-sm text-white/60 font-mono">ID: {event.id}</p>
          </div>
        </div>
        <Link href={`/${currentLocale}/admin/events/${eventId}/edit`}>
          <Button className="bg-white/10 hover:bg-white/20 text-white gap-2">
            <Pencil className="size-4" /> Edit Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Column: Event Info & Cover */}
        <div className="space-y-6 lg:col-span-1">
          {/* Cover Photo */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-2">
             <div className="aspect-video relative rounded-lg overflow-hidden bg-white/5">
                {event.cover_photo ? (
                  <img src={event.cover_photo} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="size-10 text-white/20" />
                  </div>
                )}
             </div>
          </div>

          {/* Event Card */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Event Details</h3>
            
            <div className="space-y-4 text-sm text-white/80">
              <div className="flex justify-between">
                <span className="text-white/50">Status</span>
                <span className={`font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded-full ${
                  isPast ? 'bg-white/10 text-white/50' : 'bg-green-500/20 text-green-400'
                }`}>
                  {isPast ? 'Past' : 'Upcoming/Ongoing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Guest List</span>
                <span className={`font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded-full ${
                  event.is_guest_open ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/40'
                }`}>
                  {event.is_guest_open ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="h-px w-full bg-white/10 my-2"></div>
              <div className="flex justify-between">
                <span className="text-white/50">Start Time</span>
                <span>{eventDate.toLocaleString()}</span>
              </div>
              {event.ends_at && (
                <div className="flex justify-between">
                  <span className="text-white/50">End Time</span>
                  <span>{new Date(event.ends_at).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/50">Capacity</span>
                <span className="font-bold">{event.capacity || 'Unlimited'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Views</span>
                <span className="flex items-center gap-1.5"><Eye className="size-3" /> {event.view_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Ticket Clicks</span>
                <span className="flex items-center gap-1.5 font-bold">{event.ticket_click_count || 0}</span>
              </div>
              {event.ticket_url && (
                <div className="flex justify-between">
                  <span className="text-white/50">Tickets</span>
                  <a href={event.ticket_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
                    Link <LinkIcon className="size-3" />
                  </a>
                </div>
              )}
              
              {event.about && (
                <div className="pt-2">
                  <span className="block text-white/50 mb-1">About</span>
                  <p className="text-white bg-black/30 p-3 rounded-lg text-sm">{event.about}</p>
                </div>
              )}
            </div>
          </div>

          {/* Venue Card */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Venue Information</h3>
            <div className="space-y-4 text-sm text-white/80">
              {event.venue_name ? (
                <>
                  <div className="font-bold text-lg">{event.venue_name}</div>
                  <div className="flex gap-2 text-white/60">
                    <MapPin className="size-4 shrink-0 mt-0.5" />
                    <span>{event.venue_address || event.address || 'No address provided'}</span>
                  </div>
                </>
              ) : (
                <div className="text-white/50 flex gap-2">
                   <MapPin className="size-4" /> 
                   <span>{event.address || 'No venue or address provided'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Attendees */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Check-ins */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6 flex flex-col h-full max-h-[800px]">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Users className="size-4" /> Attendees ({event.actual_checkin_count})
            </h3>
            {checkins.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-white/40">
                <Users className="size-8 mb-2 opacity-20" />
                <p className="text-sm">No one has checked into this event yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-2">
                {checkins.map((c: any, i: number) => (
                  <Link href={`/${currentLocale}/admin/users/${c.user_id}`} key={i} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="size-10 rounded-full bg-black/50 overflow-hidden shrink-0">
                      {c.photo_urls && c.photo_urls[0] ? (
                        <img src={c.photo_urls[0]} alt={c.first_name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="size-5 m-2.5 text-white/50" />
                      )}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="font-bold text-sm truncate">{c.first_name} {c.last_name}</div>
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
