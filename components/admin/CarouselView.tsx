'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Edit2, Trash2, Calendar, GripVertical, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';

export default function CarouselView() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formId, setFormId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('custom'); // acts as our deeplinkType
  const [formStatus, setFormStatus] = useState('active');
  const [formStartTime, setFormStartTime] = useState('');
  const [formEndTime, setFormEndTime] = useState('');
  const [formSponsoredEnds, setFormSponsoredEnds] = useState('');
  const [formIndex, setFormIndex] = useState(0);
  const [formImage, setFormImage] = useState('');
  const [formDeeplink, setFormDeeplink] = useState('');
  const [formIsSponsored, setFormIsSponsored] = useState(true);
  
  const [formEventId, setFormEventId] = useState<string | null>(null);
  const [formVenueId, setFormVenueId] = useState<string | null>(null);

  // Search Modal State
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTarget, setSearchTarget] = useState<'event' | 'venue' | null>(null);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [debouncedModalSearch] = useDebounce(modalSearchTerm, 500);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_carousel');
      if (error) throw error;
      setItems(data.carousel || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openNewModal = () => {
    setEditingItem(null);
    setFormId(null);
    setFormTitle('');
    setFormType('custom');
    setFormStatus('active');
    
    // Default dates
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    
    setFormStartTime(now.toISOString().slice(0, 16));
    setFormEndTime(nextWeek.toISOString().slice(0, 16));
    setFormSponsoredEnds(nextWeek.toISOString().slice(0, 16));
    
    setFormIndex(items.length);
    setFormImage('');
    setFormDeeplink('');
    setFormIsSponsored(true);
    setFormEventId(null);
    setFormVenueId(null);
    setShowEditModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormId(item.id);
    setFormTitle(item.sponsored_title);
    setFormType(item.type);
    setFormStatus(item.status);
    
    setFormStartTime(new Date(item.start_time).toISOString().slice(0, 16));
    setFormEndTime(new Date(item.end_time).toISOString().slice(0, 16));
    setFormSponsoredEnds(new Date(item.sponsored_ends).toISOString().slice(0, 16));
    
    setFormIndex(item.carousel_index);
    setFormImage(item.image_url || '');
    setFormDeeplink(item.deep_link || '');
    setFormIsSponsored(item.is_sponsored);
    setFormEventId(item.event_id);
    setFormVenueId(item.venue_id);
    
    setShowEditModal(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const params = {
        p_id: formId,
        p_sponsored_title: formTitle,
        p_type: formType,
        p_start_time: new Date(formStartTime).toISOString(),
        p_end_time: new Date(formEndTime).toISOString(),
        p_carousel_index: parseInt(formIndex.toString()),
        p_sponsored_ends: new Date(formSponsoredEnds).toISOString(),
        p_status: formStatus,
        p_event_id: formEventId,
        p_venue_id: formVenueId,
        p_image_url: formImage || null,
        p_deep_link: formDeeplink || null,
        p_is_sponsored: formIsSponsored
      };
      
      const { error } = await supabase.rpc('upsert_admin_carousel', params);
      if (error) throw error;
      
      await fetchItems();
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this carousel item?')) return;
    try {
      const { error } = await supabase.rpc('delete_admin_carousel', { p_id: id });
      if (error) throw error;
      await fetchItems();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  // Search Effect
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

  if (isLoading) return (
    <AdminLayout>
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-live-red" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Home Carousel</h2>
          <p className="mt-1 text-sm text-white/60">Manage banners displayed at the top of the home feed.</p>
        </div>
        <Button onClick={openNewModal} className="bg-live-red hover:bg-live-red/90 text-white">
          <Plus className="mr-2 size-4" /> Add Banner
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#111114] flex flex-col">
            <div className="aspect-[21/9] w-full bg-black/40 relative">
              {item.image_url ? (
                <img src={item.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-white/20">No Image</div>
              )}
              <div className="absolute top-2 left-2 flex gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                  item.status === 'active' ? 'bg-green-500/80 text-white' : 
                  item.status === 'ended' ? 'bg-red-500/80 text-white' : 'bg-white/20 text-white'
                }`}>
                  {item.status}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-black/60 text-white backdrop-blur-md">
                  Idx: {item.carousel_index}
                </span>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-white truncate mb-1" title={item.sponsored_title}>{item.sponsored_title}</h3>
              
              <div className="space-y-1 mb-4 flex-1">
                <div className="text-xs text-white/60 flex items-center gap-1">
                  <span className="font-semibold text-white/40 uppercase tracking-widest text-[10px]">Type:</span> {item.type}
                </div>
                {item.type === 'event' && item.event_title && (
                  <div className="text-xs text-white/60 truncate">
                    <span className="font-semibold text-white/40 uppercase tracking-widest text-[10px]">Event:</span> {item.event_title}
                  </div>
                )}
                {item.type === 'venue' && item.venue_name && (
                  <div className="text-xs text-white/60 truncate">
                    <span className="font-semibold text-white/40 uppercase tracking-widest text-[10px]">Venue:</span> {item.venue_name}
                  </div>
                )}
                <div className="text-xs text-white/60 flex items-center gap-1 pt-1">
                  <Calendar className="size-3 text-white/40" /> 
                  {new Date(item.start_time).toLocaleDateString()} - {new Date(item.end_time).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-auto">
                <Button variant="outline" size="sm" onClick={() => openEditModal(item)} className="flex-1 border-white/10 bg-black/40 hover:bg-white/10 hover:text-white">
                  <Edit2 className="mr-2 size-3" /> Edit
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)} className="shrink-0 border-white/10 bg-black/40 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-white/20 p-12 text-center">
            <p className="text-sm text-white/60">No carousel items found.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <h3 className="mb-6 text-xl font-bold">{formId ? 'Edit Banner' : 'Add Banner'}</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Title</label>
                  <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="bg-black/40 border-white/10" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Image URL</label>
                  <Input value={formImage} onChange={(e) => setFormImage(e.target.value)} className="bg-black/40 border-white/10" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Status</label>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white">
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Sort Index</label>
                  <Input type="number" value={formIndex} onChange={(e) => setFormIndex(parseInt(e.target.value) || 0)} className="bg-black/40 border-white/10" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Target</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <Button variant={formType === 'custom' ? 'default' : 'outline'} onClick={() => { setFormType('custom'); setFormEventId(null); setFormVenueId(null); }} className={formType === 'custom' ? 'bg-live-red hover:bg-live-red/90 text-white' : 'border-white/10 bg-black/40 hover:bg-white/10 hover:text-white'}>Custom Link</Button>
                  <Button variant={formType === 'event' ? 'default' : 'outline'} onClick={() => { setSearchTarget('event'); setShowSearchModal(true); setModalSearchTerm(''); setSearchResults([]); }} className={formType === 'event' ? 'bg-live-red hover:bg-live-red/90 text-white' : 'border-white/10 bg-black/40 hover:bg-white/10 hover:text-white'}>Open Event</Button>
                  <Button variant={formType === 'venue' ? 'default' : 'outline'} onClick={() => { setSearchTarget('venue'); setShowSearchModal(true); setModalSearchTerm(''); setSearchResults([]); }} className={formType === 'venue' ? 'bg-live-red hover:bg-live-red/90 text-white' : 'border-white/10 bg-black/40 hover:bg-white/10 hover:text-white'}>Open Venue</Button>
                </div>
                
                {formType === 'custom' && (
                  <Input 
                    value={formDeeplink} 
                    onChange={(e) => setFormDeeplink(e.target.value)} 
                    placeholder="e.g. https://sponsor-website.com" 
                    className="bg-black/40 border-white/10 text-sm" 
                  />
                )}
                
                {formType === 'event' && formEventId && (
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80">
                    <span className="truncate">Selected Event: <span className="font-mono text-white/50 ml-2">{formEventId}</span></span>
                  </div>
                )}
                
                {formType === 'venue' && formVenueId && (
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80">
                    <span className="truncate">Selected Venue: <span className="font-mono text-white/50 ml-2">{formVenueId}</span></span>
                  </div>
                )}
                
                {(formType === 'event' || formType === 'venue') && (
                  <Button 
                    variant="link" 
                    className="px-0 text-live-red hover:text-live-red/80 h-auto mt-2 text-xs"
                    onClick={() => { setSearchTarget(formType); setShowSearchModal(true); setModalSearchTerm(''); setSearchResults([]); }}
                  >
                    Search for another {formType}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Start Time</label>
                  <Input type="datetime-local" value={formStartTime} onChange={(e) => setFormStartTime(e.target.value)} className="bg-black/40 border-white/10" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">End Time</label>
                  <Input type="datetime-local" value={formEndTime} onChange={(e) => setFormEndTime(e.target.value)} className="bg-black/40 border-white/10" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Sponsor Ends</label>
                  <Input type="datetime-local" value={formSponsoredEnds} onChange={(e) => setFormSponsoredEnds(e.target.value)} className="bg-black/40 border-white/10" />
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="is_sponsored" checked={formIsSponsored} onChange={(e) => setFormIsSponsored(e.target.checked)} className="rounded border-white/10 bg-black/40 text-live-red" />
                <label htmlFor="is_sponsored" className="text-sm font-medium">Is Sponsored</label>
              </div>

            </div>
            
            <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-6">
              <Button variant="ghost" onClick={() => setShowEditModal(false)} className="text-white/60 hover:text-white">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-live-red text-white hover:bg-live-red/90 min-w-[100px]">
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal for Event/Venue Selection */}
      {showSearchModal && searchTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowSearchModal(false)}>
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
                        if (searchTarget === 'event') {
                          setFormType('event');
                          setFormEventId(item.id);
                          setFormVenueId(null);
                          setFormDeeplink('');
                        }
                        if (searchTarget === 'venue') {
                          setFormType('venue');
                          setFormVenueId(item.id);
                          setFormEventId(null);
                          setFormDeeplink('');
                        }
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
