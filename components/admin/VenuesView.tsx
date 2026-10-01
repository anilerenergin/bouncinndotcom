'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Loader2, AlertTriangle, Search, ChevronLeft,
  ChevronRight, ArrowUpDown, MapPin, Users, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';

interface VenueData {
  id: string;
  name: string;
  address: string;
  cover_photo: string;
  status: string;
  venue_type: string;
  is_guest_open: boolean;
  view_count: number;
  actual_checkin_count: number;
  importance: number;
  created_at: string;
}

export default function VenuesView() {
  const params = useParams();
  const currentLocale = (params.locale as string) || 'en';

  const [venues, setVenues] = useState<VenueData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('all');

  const [sortBy, setSortBy] = useState<'checkins_count' | 'name' | 'created_at'>('checkins_count');
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 50;

  const fetchVenues = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const rpcParams: any = {
        p_status: statusFilter,
        p_sort_column: sortBy,
        p_sort_desc: sortDesc,
        p_limit: limit,
        p_offset: (page - 1) * limit,
      };
      if (debouncedSearch) rpcParams.p_search = debouncedSearch;

      const { data, error: rpcErr } = await supabase.rpc('get_admin_venues', rpcParams);
      if (rpcErr) throw rpcErr;
      const parsed = data as { totalCount: number; venues: VenueData[] };
      setVenues(parsed.venues || []);
      setTotalCount(parsed.totalCount || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load venues.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, sortBy, sortDesc, page, limit]);

  useEffect(() => { fetchVenues(); }, [fetchVenues]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, sortBy, sortDesc]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handleSort = (col: 'checkins_count' | 'name' | 'created_at') => {
    if (sortBy === col) setSortDesc(!sortDesc);
    else { setSortBy(col); setSortDesc(true); }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Venues</h2>
          <p className="mt-1 text-sm text-white/60">Showing {venues.length} of {totalCount} venues.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      <div className="mb-6 rounded-xl border border-white/10 bg-[#111114] p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or address..."
                className="h-10 w-full pl-9 bg-black/40 border-white/10 text-sm focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#111114] overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-xs uppercase text-white/60 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Venue {sortBy === 'name' && <ArrowUpDown className="size-3" />}</div>
                </th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Type</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap text-right cursor-pointer hover:text-white" onClick={() => handleSort('checkins_count')}>
                  <div className="flex items-center justify-end gap-2">Check-ins {sortBy === 'checkins_count' && <ArrowUpDown className="size-3" />}</div>
                </th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap text-right">Views</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              {isLoading && (
                <tr><td colSpan={6} className="h-64 relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111114]/50 backdrop-blur-sm z-10">
                    <Loader2 className="size-8 animate-spin text-live-red" />
                  </div>
                </td></tr>
              )}
              {!isLoading && venues.length === 0 ? (
                <tr><td colSpan={6} className="h-64 text-center text-white/40">
                  <MapPin className="mx-auto mb-3 size-8 opacity-20" />
                  <p>No venues found.</p>
                </td></tr>
              ) : (
                venues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {venue.cover_photo ? (
                            <img src={venue.cover_photo} alt={venue.name} className="h-full w-full object-cover" />
                          ) : (
                            <MapPin className="size-5 text-white/50" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white max-w-[200px] truncate">{venue.name}</div>
                          <div className="text-xs text-white/50 truncate max-w-[200px]">{venue.address || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        venue.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
                      }`}>{venue.status || 'active'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-white/60">
                      {venue.venue_type?.replace(/_/g, ' ') || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-bold text-white">{venue.actual_checkin_count}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-white/60">{venue.view_count || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link href={`/${currentLocale}/admin/venues/${venue.id}`}>
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
        <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between bg-black/20 mt-auto">
          <p className="text-sm text-white/50">
            Showing <span className="font-bold text-white">{venues.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="font-bold text-white">{Math.min(page * limit, totalCount)}</span> of <span className="font-bold text-white">{totalCount}</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || isLoading} className="size-8 border-white/10 bg-transparent hover:bg-white/10 hover:text-white text-white/70">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium px-2">Page {page} of {totalPages}</span>
            <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || isLoading} className="size-8 border-white/10 bg-transparent hover:bg-white/10 hover:text-white text-white/70">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
