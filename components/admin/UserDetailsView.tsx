'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2, AlertTriangle, ArrowLeft, Calendar, 
  MapPin, Clock, ShieldCheck, CreditCard, 
  Heart, CheckCircle2, User as UserIcon
} from 'lucide-react';
import Link from 'next/link';

export default function UserDetailsView() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const currentLocale = (params.locale as string) || 'en';

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('get_admin_user_details', {
        p_user_id: userId
      });
      
      if (rpcErr) throw rpcErr;
      if (!rpcData) throw new Error('User not found');
      
      setData(rpcData);
    } catch (err: any) {
      setError(err.message || 'Failed to load user details.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

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
          <span>{error || 'User not found'}</span>
        </div>
      </AdminLayout>
    );
  }

  const { profile, eventCheckins, venueCheckins, matches, purchases } = data;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href={`/${currentLocale}/admin/users`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="size-5 text-white" />
        </Link>
        <div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl flex items-center gap-2">
            {profile.first_name} {profile.last_name}
            {profile.is_verified && <CheckCircle2 className="size-6 text-blue-400" />}
          </h2>
          <p className="mt-1 text-sm text-white/60 font-mono">@{profile.username} • ID: {profile.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Column: Profile Info & Photos */}
        <div className="space-y-6 lg:col-span-1">
          {/* Profile Card */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Profile Details</h3>
            
            <div className="space-y-4 text-sm text-white/80">
              <div className="flex justify-between">
                <span className="text-white/50">Status</span>
                <span className={`font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded-full ${
                  profile.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  profile.status === 'banned' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/40'
                }`}>
                  {profile.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Account Tier</span>
                <span className={`font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded-full ${
                  profile.account_tier === 'premium' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-white/40'
                }`}>
                  {profile.account_tier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Role</span>
                <span className="font-bold">{profile.role}</span>
              </div>
              <div className="h-px w-full bg-white/10 my-2"></div>
              <div className="flex justify-between">
                <span className="text-white/50">Age</span>
                <span>{profile.current_age || '-'} ({profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Gender</span>
                <span className="capitalize">{profile.gender_name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Orientation</span>
                <span className="capitalize">{profile.sexual_orientation_name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Joined</span>
                <span>{new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
              {profile.bio && (
                <div className="pt-2">
                  <span className="block text-white/50 mb-1">Bio</span>
                  <p className="text-white bg-black/30 p-3 rounded-lg text-sm">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Photos Card */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Photos ({profile.photo_urls?.length || 0})</h3>
            {profile.photo_urls && profile.photo_urls.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {profile.photo_urls.map((url: string, idx: number) => (
                  <div key={idx} className="aspect-[3/4] relative rounded-lg overflow-hidden bg-white/5">
                    <img src={url} alt={`Photo ${idx+1}`} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-lg border border-dashed border-white/10 text-white/40">
                <UserIcon className="size-8 mb-2 opacity-30" />
                <p className="text-sm">No photos uploaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Activity, Matches, Purchases */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Matches */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Heart className="size-4" /> Matches ({matches.length})
            </h3>
            {matches.length === 0 ? (
              <p className="text-sm text-white/40">No matches found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                {matches.map((m: any) => (
                  <Link href={`/${currentLocale}/admin/users/${m.matched_user_id}`} key={m.match_id} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="size-10 rounded-full bg-black/50 overflow-hidden shrink-0">
                      {m.photo_urls && m.photo_urls[0] ? (
                        <img src={m.photo_urls[0]} alt={m.first_name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="size-5 m-2.5 text-white/50" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm truncate">{m.first_name} {m.last_name}</div>
                      <div className="text-xs text-white/50 truncate">@{m.username}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Event Check-ins */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Calendar className="size-4" /> Event Check-ins ({eventCheckins.length})
            </h3>
            {eventCheckins.length === 0 ? (
              <p className="text-sm text-white/40">No event check-ins.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {eventCheckins.map((c: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <div>
                      <div className="font-bold text-sm">{c.title}</div>
                      <div className="text-xs text-white/50 mt-1 flex items-center gap-1">
                        <Clock className="size-3" /> {new Date(c.checked_in_at).toLocaleString()}
                      </div>
                    </div>
                    {c.checked_out_at && (
                      <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/60">Checked Out</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Venue Check-ins */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <MapPin className="size-4" /> Venue Check-ins ({venueCheckins.length})
            </h3>
            {venueCheckins.length === 0 ? (
              <p className="text-sm text-white/40">No venue check-ins.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {venueCheckins.map((c: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="font-bold text-sm">{c.name}</div>
                    <div className="text-xs text-white/50 flex items-center gap-1">
                      <Clock className="size-3" /> {new Date(c.checked_in_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purchases */}
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <CreditCard className="size-4" /> Purchases ({purchases.length})
            </h3>
            {purchases.length === 0 ? (
              <p className="text-sm text-white/40">No purchases found.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {purchases.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <div>
                      <div className="font-bold text-sm font-mono">{p.store_product_id}</div>
                      <div className="text-xs text-white/50 mt-1 capitalize">{p.platform}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/70">{new Date(p.purchase_time).toLocaleDateString()}</div>
                      <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${p.status === 'active' ? 'text-green-400' : 'text-white/40'}`}>
                        {p.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
