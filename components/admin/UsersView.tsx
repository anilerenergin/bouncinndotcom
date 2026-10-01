'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Loader2, AlertTriangle, Search, Filter,
  ChevronLeft, ChevronRight, User, ShieldAlert,
  ArrowUpDown, CheckCircle2, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';

interface UserData {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender_id: number;
  gender_name: string;
  status: 'active' | 'deleted' | 'banned';
  role: string;
  created_at: string;
  is_verified: boolean;
  account_tier: string;
  current_age: number;
  photo_urls?: string[];
}

interface Gender {
  id: number;
  code: string;
  name: Record<string, string>;
}

export default function UsersView() {
  const params = useParams();
  const currentLocale = (params.locale as string) || 'en';
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deleted' | 'banned'>('all');
  const [genderFilter, setGenderFilter] = useState<number | 'all'>('all');
  const [minAge, setMinAge] = useState<string>('');
  const [maxAge, setMaxAge] = useState<string>('');
  
  const [sortBy, setSortBy] = useState<'created_at' | 'username' | 'current_age'>('created_at');
  const [sortDesc, setSortDesc] = useState(true);
  
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    // Fetch genders for the filter dropdown
    const fetchGenders = async () => {
      const { data } = await supabase.from('genders').select('*');
      if (data) setGenders(data as Gender[]);
    };
    fetchGenders();
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const params: any = {
        p_search: debouncedSearch || null,
        p_status: statusFilter === 'all' ? null : statusFilter,
        p_gender_id: genderFilter === 'all' ? null : genderFilter,
        p_min_age: minAge ? parseInt(minAge, 10) : null,
        p_max_age: maxAge ? parseInt(maxAge, 10) : null,
        p_sort_column: sortBy,
        p_sort_desc: sortDesc,
        p_limit: limit,
        p_offset: (page - 1) * limit
      };

      const { data, error: rpcErr } = await supabase.rpc('get_admin_users', params);
      
      if (rpcErr) throw rpcErr;
      
      const parsedData = data as { totalCount: number; users: UserData[] };
      setUsers(parsedData.users || []);
      setTotalCount(parsedData.totalCount || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, genderFilter, minAge, maxAge, sortBy, sortDesc, page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, genderFilter, minAge, maxAge, sortBy, sortDesc]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handleSort = (column: 'created_at' | 'username' | 'current_age') => {
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
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Users</h2>
          <p className="mt-1 text-sm text-white/60">
            Manage your user base. Showing {users.length} of {totalCount} users.
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-end">
          
          {/* Search */}
          <div className="sm:col-span-2 xl:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name or username..."
                className="h-10 w-full pl-9 bg-black/40 border-white/10 text-sm focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40"
            >
              <option value="all">All Genders</option>
              {genders.map(g => (
                <option key={g.id} value={g.id}>{g.name['en'] || g.code}</option>
              ))}
            </select>
          </div>

          {/* Age Range */}
          <div className="flex gap-2 sm:col-span-2 xl:col-span-2">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Min Age</label>
              <Input
                type="number"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                placeholder="18"
                className="h-10 bg-black/40 border-white/10 text-sm focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Max Age</label>
              <Input
                type="number"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                placeholder="100"
                className="h-10 bg-black/40 border-white/10 text-sm focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-white/10 bg-[#111114] overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-xs uppercase text-white/60 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('username')}>
                  <div className="flex items-center gap-2">
                    User {sortBy === 'username' && <ArrowUpDown className="size-3" />}
                  </div>
                </th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('current_age')}>
                  <div className="flex items-center gap-2">
                    Age {sortBy === 'current_age' && <ArrowUpDown className="size-3" />}
                  </div>
                </th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Gender</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Tier</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap cursor-pointer hover:text-white" onClick={() => handleSort('created_at')}>
                  <div className="flex items-center gap-2">
                    Joined {sortBy === 'created_at' && <ArrowUpDown className="size-3" />}
                  </div>
                </th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-[#111114]/50 backdrop-blur-sm z-10">
                      <Loader2 className="size-8 animate-spin text-live-red" />
                    </div>
                  </td>
                </tr>
              )}
              
              {!isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-64 text-center text-white/40">
                    <User className="mx-auto mb-3 size-8 opacity-20" />
                    <p>No users found matching these filters.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {user.photo_urls && user.photo_urls.length > 0 ? (
                            <img src={user.photo_urls[0]} alt={user.first_name} className="h-full w-full object-cover" />
                          ) : (
                            <User className="size-5 text-white/50" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {user.first_name} {user.last_name}
                            {user.is_verified && <CheckCircle2 className="size-3.5 text-blue-400" />}
                          </div>
                          <div className="text-xs text-white/50">@{user.username || 'unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        user.status === 'banned' ? 'bg-red-500/20 text-red-400' :
                        'bg-white/10 text-white/40'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.current_age || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {user.gender_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block rounded px-2 py-1 text-xs font-bold ${
                        user.account_tier === 'premium' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/50'
                      }`}>
                        {user.account_tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white/60">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link href={`/${currentLocale}/admin/users/${user.id}`}>
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
            Showing <span className="font-bold text-white">{users.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="font-bold text-white">{Math.min(page * limit, totalCount)}</span> of <span className="font-bold text-white">{totalCount}</span> results
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
