'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VenueForm {
  name: string;
  description: string;
  address: string;
  cover_photo: string;
  is_guest_open: boolean;
  prefers_groups: boolean;
  show_about: boolean;
  status: string;
  importance: string;
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={onChange}
      style={{ padding: '2px' }}
      className={`inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${value ? 'bg-live-red' : 'bg-white/20'}`}
    >
      <span
        className="h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  );
}

export default function VenueEditView() {
  const params = useParams();
  const router = useRouter();
  const venueId = params.id as string;
  const currentLocale = (params.locale as string) || 'en';

  const [form, setForm] = useState<VenueForm>({
    name: '', description: '', address: '', cover_photo: '',
    is_guest_open: false, prefers_groups: false, show_about: false,
    status: 'active', importance: '0',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchVenue = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error: rpcErr } = await supabase.rpc('get_admin_venue_details', { p_venue_id: venueId });
      if (rpcErr) throw rpcErr;
      const v = (data as any)?.venue;
      if (!v) throw new Error('Venue not found');
      setForm({
        name: v.name || '',
        description: v.description || '',
        address: v.address || '',
        cover_photo: v.cover_photo || '',
        is_guest_open: v.is_guest_open ?? false,
        prefers_groups: v.prefers_groups ?? false,
        show_about: v.show_about ?? false,
        status: v.status || 'active',
        importance: v.importance?.toString() || '0',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load venue.');
    } finally {
      setIsLoading(false);
    }
  }, [venueId]);

  useEffect(() => { fetchVenue(); }, [fetchVenue]);

  const handleChange = (key: keyof VenueForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess(false);
    try {
      const { error: rpcErr } = await supabase.rpc('update_admin_venue', {
        p_venue_id: venueId,
        p_name: form.name,
        p_description: form.description || null,
        p_address: form.address || null,
        p_cover_photo: form.cover_photo || null,
        p_is_guest_open: form.is_guest_open,
        p_prefers_groups: form.prefers_groups,
        p_show_about: form.show_about,
        p_status: form.status,
        p_importance: form.importance ? parseInt(form.importance, 10) : 0,
      });
      if (rpcErr) throw rpcErr;
      setSuccess(true);
      setTimeout(() => router.push(`/${currentLocale}/admin/venues/${venueId}`), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save venue.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <AdminLayout>
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-live-red" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/${currentLocale}/admin/venues/${venueId}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="size-5 text-white" />
          </Link>
          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Edit Venue</h2>
            <p className="mt-1 text-sm text-white/60 font-mono">{form.name}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving || success} className="bg-live-red hover:bg-live-red/90 text-white gap-2">
          {success ? <><CheckCircle2 className="size-4" /> Saved!</> :
            isSaving ? <><Loader2 className="size-4 animate-spin" /> Saving…</> :
            <><Save className="size-4" /> Save Changes</>}
        </Button>
      </div>

      {error && (
        <div className="mb-6 flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Basic Info</h3>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Name *</label>
              <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="bg-black/40 border-white/10 focus-visible:ring-live-red/40 focus-visible:border-live-red/60" placeholder="Venue name" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Description</label>
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={4}
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40 resize-none"
                placeholder="Describe this venue…" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Address</label>
              <Input value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="bg-black/40 border-white/10 focus-visible:ring-live-red/40 focus-visible:border-live-red/60" placeholder="Street address" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Cover Photo URL</label>
              <Input value={form.cover_photo} onChange={(e) => handleChange('cover_photo', e.target.value)} className="bg-black/40 border-white/10 focus-visible:ring-live-red/40 focus-visible:border-live-red/60" placeholder="https://..." />
              {form.cover_photo && (
                <div className="mt-3 aspect-video w-full overflow-hidden rounded-lg border border-white/10">
                  <img src={form.cover_photo} alt="Cover" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Settings</h3>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Status</label>
              <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Importance</label>
              <Input type="number" value={form.importance} onChange={(e) => handleChange('importance', e.target.value)} className="bg-black/40 border-white/10 focus-visible:ring-live-red/40 focus-visible:border-live-red/60" placeholder="0" />
              <p className="mt-1 text-xs text-white/40">Higher values rank this venue higher in listings.</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111114] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Options</h3>
            {([
              ['is_guest_open', 'Guest List Open', 'Allow users to check in'],
              ['prefers_groups', 'Prefers Groups', 'This venue is better for groups'],
              ['show_about', 'Show About', 'Show description to app users'],
            ] as [keyof VenueForm, string, string][]).map(([key, label, hint]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{label}</div>
                  <div className="text-xs text-white/50 mt-0.5">{hint}</div>
                </div>
                <Toggle value={form[key] as boolean} onChange={() => handleChange(key, !form[key])} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
