'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2, AlertTriangle, ArrowLeft, Save, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EventForm {
  title: string;
  about: string;
  address: string;
  cover_photo: string;
  starts_at: string;
  ends_at: string;
  prefers_groups: boolean;
  ticket_url: string;
  capacity: string;
  is_guest_open: boolean;
  show_about: boolean;
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  // Converts ISO string to YYYY-MM-DDTHH:mm for <input type="datetime-local">
  return new Date(iso).toISOString().slice(0, 16);
}

export default function EventEditView() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const currentLocale = (params.locale as string) || 'en';

  const [form, setForm] = useState<EventForm>({
    title: '', about: '', address: '', cover_photo: '',
    starts_at: '', ends_at: '', prefers_groups: false,
    ticket_url: '', capacity: '', is_guest_open: false, show_about: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchEvent = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error: rpcErr } = await supabase.rpc('get_admin_event_details', {
        p_event_id: eventId
      });
      if (rpcErr) throw rpcErr;
      
      const ev = (data as any)?.event;
      if (!ev) throw new Error('Event not found');
      
      setForm({
        title: ev.title || '',
        about: ev.about || '',
        address: ev.address || '',
        cover_photo: ev.cover_photo || '',
        starts_at: toDatetimeLocal(ev.starts_at),
        ends_at: toDatetimeLocal(ev.ends_at),
        prefers_groups: ev.prefers_groups ?? false,
        ticket_url: ev.ticket_url || '',
        capacity: ev.capacity?.toString() || '',
        is_guest_open: ev.is_guest_open ?? false,
        show_about: ev.show_about ?? false,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load event.');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleChange = (key: keyof EventForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const { error: rpcErr } = await supabase.rpc('update_admin_event', {
        p_event_id: eventId,
        p_title: form.title,
        p_about: form.about || null,
        p_address: form.address || null,
        p_cover_photo: form.cover_photo || null,
        p_starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
        p_ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        p_prefers_groups: form.prefers_groups,
        p_ticket_url: form.ticket_url || null,
        p_capacity: form.capacity ? parseInt(form.capacity, 10) : null,
        p_is_guest_open: form.is_guest_open,
        p_show_about: form.show_about,
      });
      
      if (rpcErr) throw rpcErr;
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${currentLocale}/admin/events/${eventId}`);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save event.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-live-red" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${currentLocale}/admin/events/${eventId}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="size-5 text-white" />
          </Link>
          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Edit Event</h2>
            <p className="mt-1 text-sm text-white/60 font-mono">{form.title}</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || success}
          className="bg-live-red hover:bg-live-red/90 text-white gap-2"
        >
          {success ? (
            <><CheckCircle2 className="size-4" /> Saved!</>
          ) : isSaving ? (
            <><Loader2 className="size-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="size-4" /> Save Changes</>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-6 flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Basic Info</h3>
            
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="bg-black/40 border-white/10 focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
                placeholder="Event title"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">About / Description</label>
              <textarea
                value={form.about}
                onChange={(e) => handleChange('about', e.target.value)}
                rows={5}
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40 resize-none"
                placeholder="Describe this event…"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Address</label>
              <Input
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="bg-black/40 border-white/10 focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
                placeholder="Event address"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Cover Photo URL</label>
              <Input
                value={form.cover_photo}
                onChange={(e) => handleChange('cover_photo', e.target.value)}
                className="bg-black/40 border-white/10 focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
                placeholder="https://..."
              />
              {form.cover_photo && (
                <div className="mt-3 aspect-video w-full overflow-hidden rounded-lg border border-white/10">
                  <img src={form.cover_photo} alt="Cover" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          <div className="rounded-xl border border-white/10 bg-[#111114] p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Timing & Logistics</h3>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Start Date & Time *</label>
              <input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => handleChange('starts_at', e.target.value)}
                className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40 [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">End Date & Time</label>
              <input
                type="datetime-local"
                value={form.ends_at}
                onChange={(e) => handleChange('ends_at', e.target.value)}
                className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40 [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Capacity</label>
              <Input
                type="number"
                value={form.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                className="bg-black/40 border-white/10 focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Ticket URL</label>
              <Input
                value={form.ticket_url}
                onChange={(e) => handleChange('ticket_url', e.target.value)}
                className="bg-black/40 border-white/10 focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
                placeholder="https://tickets.example.com/..."
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111114] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Options</h3>

            {/* Guest List Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Guest List Open</div>
                <div className="text-xs text-white/50 mt-0.5">Allow users to mark themselves as going</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.is_guest_open}
                onClick={() => handleChange('is_guest_open', !form.is_guest_open)}
                style={{ padding: '2px' }}
                className={`inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${form.is_guest_open ? 'bg-live-red' : 'bg-white/20'}`}
              >
                <span
                  className="h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: form.is_guest_open ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>

            {/* Prefers Groups Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Prefers Groups</div>
                <div className="text-xs text-white/50 mt-0.5">This event is better suited for groups</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.prefers_groups}
                onClick={() => handleChange('prefers_groups', !form.prefers_groups)}
                style={{ padding: '2px' }}
                className={`inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${form.prefers_groups ? 'bg-live-red' : 'bg-white/20'}`}
              >
                <span
                  className="h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: form.prefers_groups ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>

            {/* Show About Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Show About</div>
                <div className="text-xs text-white/50 mt-0.5">Show the description to app users</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.show_about}
                onClick={() => handleChange('show_about', !form.show_about)}
                style={{ padding: '2px' }}
                className={`inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${form.show_about ? 'bg-live-red' : 'bg-white/20'}`}
              >
                <span
                  className="h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: form.show_about ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
