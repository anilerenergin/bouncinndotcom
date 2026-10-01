'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Loader2, AlertTriangle, Search, ChevronLeft, 
  ChevronRight, ArrowUpDown, Calendar, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';

interface EventData {
  id: string;
  title: string;
  cover_photo: string;
  starts_at: string;
  ends_at: string;
  checkin_count: number;
  actual_checkin_count: number;
  view_count: number;
  is_guest_open: boolean;
  venue_name: string;
}

export default function EventsView() {
  const params = useParams();
  const currentLocale = (params.locale as string) || 'en';
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');
  
  const [sortBy, setSortBy] = useState<'starts_at' | 'title' | 'checkin_count'>('starts_at');
  const [sortDesc, setSortDesc] = useState(true);
  
  const [page, setPage] = useState(1);
  const limit = 50;

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const params: any = {
        p_status: statusFilter,
        p_sort_column: sortBy,
        p_sort_desc: sortDesc,
        p_limit: limit,
        p_offset: (page - 1) * limit
      };
      
      if (debouncedSearch) {
        params.p_search = debouncedSearch;
      }
      
      const { data, error: rpcErr } = await supabase.rpc('get_admin_events', params);
      
      if (rpcErr) throw rpcErr;
      
      const parsedData = data as { totalCount: number; events: EventData[] };
      setEvents(parsedData.events || []);
      setTotalCount(parsedData.totalCount || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, sortBy, sortDesc, page, limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortBy, sortDesc]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handleSort = (column: 'starts_at' | 'title' | 'checkin_count') => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(true);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Events</h2>
          <p className="mt-1 text-sm text-white/60">
            Manage all events across venues. Showing {events.length} of {totalCount} events.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Section */}
      <div className="mb-6 rounded-xl border border-white/10 bg-[#111114] p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          
          {/* Search */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by event title..."
                className="h-10 w-full pl-9 bg-black/40 border-white/10 text-sm focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="past">Past</option>
            </select>
          </div>

        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-xl border border-white/10 bg-[#111114] overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-xs uppercase text-white/60 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-2">
                    Event {sortBy === 'title' && <ArrowUpDown className="size-3" />}
                  </div>
                </th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('starts_at')}>
                  <div className="flex items-center gap-2">
                    Date {sortBy === 'starts_at' && <ArrowUpDown className="size-3" />}
                  </div>
                </th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Venue</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap cursor-pointer hover:text-white text-right" onClick={() => handleSort('checkin_count')}>
                  <div className="flex items-center justify-end gap-2">
                    Check-ins {sortBy === 'checkin_count' && <ArrowUpDown className="size-3" />}
                  </div>
                </th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap text-right">Views</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-[#111114]/50 backdrop-blur-sm z-10">
                      <Loader2 className="size-8 animate-spin text-live-red" />
                    </div>
                  </td>
                </tr>
              )}
              
              {!isLoading && events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-64 text-center text-white/40">
                    <Calendar className="mx-auto mb-3 size-8 opacity-20" />
                    <p>No events found matching these filters.</p>
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {event.cover_photo ? (
                            <img src={event.cover_photo} alt={event.title} className="h-full w-full object-cover" />
                          ) : (
                            <Calendar className="size-5 text-white/50" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white max-w-[200px] truncate">{event.title}</div>
                          {event.is_guest_open && <div className="text-[10px] uppercase text-green-400 font-bold">Guest List Open</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{new Date(event.starts_at).toLocaleDateString()}</div>
                      <div className="text-xs text-white/50">{new Date(event.starts_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-white/70">
                        <MapPin className="size-3.5" />
                        <span className="truncate max-w-[150px] block">{event.venue_name || 'No Venue'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-bold text-white">{event.actual_checkin_count}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-white/60">
                      {event.view_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link href={`/${currentLocale}/admin/events/${event.id}`}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between bg-black/20 mt-auto">
          <p className="text-sm text-white/50">
            Showing <span className="font-bold text-white">{events.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="font-bold text-white">{Math.min(page * limit, totalCount)}</span> of <span className="font-bold text-white">{totalCount}</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="size-8 border-white/10 bg-transparent hover:bg-white/10 hover:text-white text-white/70"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium px-2">Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading || totalPages === 0}
              className="size-8 border-white/10 bg-transparent hover:bg-white/10 hover:text-white text-white/70"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
