'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertTriangle, Send, Users, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';

export default function NotificationsView() {
  const [genders, setGenders] = useState<any[]>([]);
  const [orientations, setOrientations] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [genderId, setGenderId] = useState('');
  const [orientationId, setOrientationId] = useState('');
  const [accountTier, setAccountTier] = useState('');
  
  const [titleEn, setTitleEn] = useState('');
  const [titleTr, setTitleTr] = useState('');
  const [titleDe, setTitleDe] = useState('');
  const [titleNl, setTitleNl] = useState('');
  
  const [messageEn, setMessageEn] = useState('');
  const [messageTr, setMessageTr] = useState('');
  const [messageDe, setMessageDe] = useState('');
  const [messageNl, setMessageNl] = useState('');
  
  const [deeplinkType, setDeeplinkType] = useState('app'); // 'app', 'profile', 'event', 'venue'
  const [deeplink, setDeeplink] = useState('');
  
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTarget, setSearchTarget] = useState<'event' | 'venue' | null>(null);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [debouncedModalSearch] = useDebounce(modalSearchTerm, 500);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [genRes, oriRes] = await Promise.all([
          supabase.from('genders').select('id, name'),
          supabase.from('sexual_orientations').select('id, name')
        ]);
        if (genRes.data) setGenders(genRes.data);
        if (oriRes.data) setOrientations(oriRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (deeplinkType === 'app') setDeeplink('');
    else if (deeplinkType === 'profile') setDeeplink('/profile');
    else if (deeplinkType === 'event') {
      if (!deeplink.startsWith('/events/')) setDeeplink('');
    }
    else if (deeplinkType === 'venue') {
      if (!deeplink.startsWith('/venues/')) setDeeplink('');
    }
  }, [deeplinkType]);

  useEffect(() => {
    if (!showSearchModal || !searchTarget) return;
    const fetchResults = async () => {
      setIsSearching(true);
      try {
        if (searchTarget === 'event') {
          const { data, error } = await supabase.rpc('get_admin_events', {
            p_search: debouncedModalSearch || null,
            p_limit: 15,
            p_offset: 0,
            p_sort_column: 'checkin_count',
            p_sort_desc: true,
            p_status: 'not_past'
          });
          if (error) throw error;
          setSearchResults((data as any).events || []);
        } else if (searchTarget === 'venue') {
          const { data, error } = await supabase.rpc('get_admin_venues', {
            p_search: debouncedModalSearch || null,
            p_limit: 15,
            p_offset: 0,
            p_sort_column: 'checkins_count',
            p_sort_desc: true
          });
          if (error) throw error;
          setSearchResults((data as any).venues || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };
    fetchResults();
  }, [debouncedModalSearch, showSearchModal, searchTarget]);

  const handleCalculateCount = async () => {
    setIsCounting(true);
    try {
      const params: any = {};
      if (minAge) params.p_min_age = parseInt(minAge);
      if (maxAge) params.p_max_age = parseInt(maxAge);
      if (genderId) params.p_gender_id = parseInt(genderId);
      if (orientationId) params.p_sexual_orientation_id = parseInt(orientationId);
      if (accountTier) params.p_account_tier = accountTier;
      
      const { data, error } = await supabase.rpc('admin_get_segmented_user_count', params);
      if (error) throw error;
      setUserCount(data as number);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsCounting(false);
    }
  };

  const handleSend = async () => {
    if (!titleEn || !messageEn) {
      setSendError('English title and message are required.');
      return;
    }
    
    setIsSending(true);
    setSendError('');
    setSendSuccess(false);
    
    try {
      const params: any = {
        p_title_en: titleEn,
        p_title_tr: titleTr || titleEn,
        p_title_de: titleDe || titleEn,
        p_title_nl: titleNl || titleEn,
        p_message_en: messageEn,
        p_message_tr: messageTr || messageEn,
        p_message_de: messageDe || messageEn,
        p_message_nl: messageNl || messageEn,
        p_deeplink: deeplink || null,
      };
      
      if (minAge) params.p_min_age = parseInt(minAge);
      if (maxAge) params.p_max_age = parseInt(maxAge);
      if (genderId) params.p_gender_id = parseInt(genderId);
      if (orientationId) params.p_sexual_orientation_id = parseInt(orientationId);
      if (accountTier) params.p_account_tier = accountTier;
      
      const { data, error } = await supabase.rpc('admin_send_segmented_notification', params);
      if (error) throw error;
      
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
      
      // Reset fields
      setTitleEn(''); setTitleTr(''); setTitleDe(''); setTitleNl('');
      setMessageEn(''); setMessageTr(''); setMessageDe(''); setMessageNl('');
      setDeeplink('');
      setDeeplinkType('app');
      
    } catch (err: any) {
      setSendError(err.message || 'Failed to send notifications');
    } finally {
      setIsSending(false);
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
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Send Notification</h2>
        <p className="mt-1 text-sm text-white/60">Broadcast push notifications to specific segments of active users.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Segmentation */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Users className="size-4" /> User Segmentation
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Min Age</label>
                <Input type="number" value={minAge} onChange={(e) => setMinAge(e.target.value)} placeholder="e.g. 18" className="bg-black/40 border-white/10" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Max Age</label>
                <Input type="number" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} placeholder="e.g. 35" className="bg-black/40 border-white/10" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Gender</label>
                <select value={genderId} onChange={(e) => setGenderId(e.target.value)} className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white">
                  <option value="">All Genders</option>
                  {genders.map(g => <option key={g.id} value={g.id}>{g.name.en || g.id}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Orientation</label>
                <select value={orientationId} onChange={(e) => setOrientationId(e.target.value)} className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white">
                  <option value="">All Orientations</option>
                  {orientations.map(o => <option key={o.id} value={o.id}>{o.name.en || o.id}</option>)}
                </select>
              </div>
            </div>
            
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Account Tier</label>
              <select value={accountTier} onChange={(e) => setAccountTier(e.target.value)} className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white">
                <option value="">All Tiers</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                {userCount !== null && (
                  <p className="text-sm">Targeting <strong className="text-live-red text-lg">{userCount}</strong> users</p>
                )}
              </div>
              <Button onClick={handleCalculateCount} disabled={isCounting} variant="outline" className="border-white/20 hover:bg-white/10">
                {isCounting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Calculate Target Size
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#111114] p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Message Content</h3>
            
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">English (Default) *</label>
              <div className="space-y-2">
                <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Title" className="bg-black/40 border-white/10" />
                <textarea value={messageEn} onChange={(e) => setMessageEn(e.target.value)} placeholder="Message" rows={2} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white resize-none" />
              </div>
            </div>
            
            <details className="group">
              <summary className="text-sm font-medium text-white/60 cursor-pointer hover:text-white transition-colors">
                Add Translations (Optional)
              </summary>
              <div className="mt-4 space-y-4 pl-4 border-l-2 border-white/10">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Turkish</label>
                  <div className="space-y-2">
                    <Input value={titleTr} onChange={(e) => setTitleTr(e.target.value)} placeholder="Başlık" className="bg-black/40 border-white/10" />
                    <textarea value={messageTr} onChange={(e) => setMessageTr(e.target.value)} placeholder="Mesaj" rows={2} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white resize-none" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">German</label>
                  <div className="space-y-2">
                    <Input value={titleDe} onChange={(e) => setTitleDe(e.target.value)} placeholder="Titel" className="bg-black/40 border-white/10" />
                    <textarea value={messageDe} onChange={(e) => setMessageDe(e.target.value)} placeholder="Nachricht" rows={2} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white resize-none" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Dutch</label>
                  <div className="space-y-2">
                    <Input value={titleNl} onChange={(e) => setTitleNl(e.target.value)} placeholder="Titel" className="bg-black/40 border-white/10" />
                    <textarea value={messageNl} onChange={(e) => setMessageNl(e.target.value)} placeholder="Bericht" rows={2} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white resize-none" />
                  </div>
                </div>
              </div>
            </details>
            
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Deeplink Target</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Button variant={deeplinkType === 'app' ? 'default' : 'outline'} onClick={() => setDeeplinkType('app')} className={deeplinkType === 'app' ? 'bg-live-red hover:bg-live-red/90 text-white' : 'border-white/10 bg-black/40 hover:bg-white/10 hover:text-white'}>Open App</Button>
                <Button variant={deeplinkType === 'profile' ? 'default' : 'outline'} onClick={() => setDeeplinkType('profile')} className={deeplinkType === 'profile' ? 'bg-live-red hover:bg-live-red/90 text-white' : 'border-white/10 bg-black/40 hover:bg-white/10 hover:text-white'}>Open Profile</Button>
                <Button variant={deeplinkType === 'event' ? 'default' : 'outline'} onClick={() => { setDeeplinkType('event'); setSearchTarget('event'); setShowSearchModal(true); setModalSearchTerm(''); setSearchResults([]); }} className={deeplinkType === 'event' ? 'bg-live-red hover:bg-live-red/90 text-white' : 'border-white/10 bg-black/40 hover:bg-white/10 hover:text-white'}>Open Event</Button>
                <Button variant={deeplinkType === 'venue' ? 'default' : 'outline'} onClick={() => { setDeeplinkType('venue'); setSearchTarget('venue'); setShowSearchModal(true); setModalSearchTerm(''); setSearchResults([]); }} className={deeplinkType === 'venue' ? 'bg-live-red hover:bg-live-red/90 text-white' : 'border-white/10 bg-black/40 hover:bg-white/10 hover:text-white'}>Open Venue</Button>
              </div>
              
              <Input 
                value={deeplink} 
                onChange={(e) => setDeeplink(e.target.value)} 
                placeholder={deeplinkType === 'app' ? 'No specific target (opens app)' : 'e.g. /events/uuid-here'} 
                className="bg-black/40 border-white/10 text-sm" 
                readOnly={deeplinkType === 'event' || deeplinkType === 'venue' || deeplinkType === 'profile' || deeplinkType === 'app'}
              />
              {(deeplinkType === 'event' || deeplinkType === 'venue') && (
                <Button 
                  variant="link" 
                  className="px-0 text-live-red hover:text-live-red/80 h-auto mt-2 text-xs"
                  onClick={() => { setSearchTarget(deeplinkType); setShowSearchModal(true); setModalSearchTerm(''); setSearchResults([]); }}
                >
                  Search for another {deeplinkType}
                </Button>
              )}
            </div>
            
            {sendError && (
              <div className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" /><span>{sendError}</span>
              </div>
            )}
            
            {sendSuccess && (
              <div className="flex gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
                <span>Notification sent successfully!</span>
              </div>
            )}
            
            <Button onClick={handleSend} disabled={isSending} className="w-full bg-live-red hover:bg-live-red/90 text-white gap-2">
              {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Send Notification
            </Button>
          </div>
        </div>
      </div>
      
      {/* Search Modal */}
      {showSearchModal && searchTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowSearchModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-2xl flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-white capitalize">Select {searchTarget}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSearchModal(false)} className="h-8 w-8 text-white/50 hover:text-white">
                <X className="size-4" />
              </Button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <Input
                value={modalSearchTerm}
                onChange={(e) => setModalSearchTerm(e.target.value)}
                placeholder={`Search ${searchTarget}s...`}
                className="h-10 w-full pl-9 bg-black/40 border-white/10 text-sm focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
                autoFocus
              />
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-[200px] border border-white/5 rounded-lg bg-black/20">
              {isSearching ? (
                <div className="flex h-full items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-live-red" />
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex h-full items-center justify-center py-8 text-white/40 text-sm">
                  {modalSearchTerm ? `No ${searchTarget}s found.` : `Type to search for ${searchTarget}s...`}
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setDeeplink(`/${searchTarget}s/${item.id}`);
                        setShowSearchModal(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="h-10 w-10 shrink-0 rounded bg-white/10 overflow-hidden">
                        {(item.cover_photo || item.photo_url) ? (
                          <img src={item.cover_photo || item.photo_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white/20 text-xs text-center leading-tight">No Img</div>
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-sm text-white truncate">{item.title || item.name}</div>
                        <div className="text-xs text-white/50 truncate font-mono">{item.id}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
