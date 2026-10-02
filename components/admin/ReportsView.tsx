'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Loader2, AlertTriangle, Search, ChevronLeft,
  ChevronRight, Flag, ExternalLink, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';

interface ReportData {
  id: string;
  reason: string;
  details: string;
  type: string;
  created_at: string;
  reporter_id: string;
  reported_id: string;
  reported_chat_id: string;
  reported_message_id: string;
  reporter_first_name: string;
  reporter_last_name: string;
  reporter_username: string;
  reporter_email: string;
  reported_first_name: string;
  reported_last_name: string;
  reported_username: string;
}

export default function ReportsView() {
  const params = useParams();
  const currentLocale = (params.locale as string) || 'en';

  const [reports, setReports] = useState<ReportData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [reasonFilter, setReasonFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [page, setPage] = useState(1);
  const limit = 50;

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const rpcParams: any = {
        p_reason: reasonFilter,
        p_type: typeFilter,
        p_limit: limit,
        p_offset: (page - 1) * limit,
      };
      if (debouncedSearch) rpcParams.p_search = debouncedSearch;

      const { data, error: rpcErr } = await supabase.rpc('get_admin_reports', rpcParams);
      if (rpcErr) throw rpcErr;
      const parsed = data as { totalCount: number; reports: ReportData[] };
      setReports(parsed.reports || []);
      setTotalCount(parsed.totalCount || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, reasonFilter, typeFilter, page, limit]);

  useEffect(() => { fetchReports(); }, [fetchReports]);
  useEffect(() => { setPage(1); }, [debouncedSearch, reasonFilter, typeFilter]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Reports</h2>
          <p className="mt-1 text-sm text-white/60">Showing {reports.length} of {totalCount} reports.</p>
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
                placeholder="Search usernames, emails, details..."
                className="h-10 w-full pl-9 bg-black/40 border-white/10 text-sm focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Reason</label>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus:border-live-red/60 focus:outline-none focus:ring-1 focus:ring-live-red/40"
            >
              <option value="all">All Reasons</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="inappropriate">Inappropriate</option>
              <option value="fake">Fake</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">Type</label>
            <Input
              value={typeFilter === 'all' ? '' : typeFilter}
              onChange={(e) => setTypeFilter(e.target.value || 'all')}
              placeholder="e.g. user, event, message..."
              className="h-10 w-full bg-black/40 border-white/10 text-sm focus-visible:ring-live-red/40 focus-visible:border-live-red/60"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#111114] overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-xs uppercase text-white/60 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Date</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Reporter</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Reported</th>
                <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Reason & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              {isLoading && (
                <tr><td colSpan={4} className="h-64 relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111114]/50 backdrop-blur-sm z-10">
                    <Loader2 className="size-8 animate-spin text-live-red" />
                  </div>
                </td></tr>
              )}
              {!isLoading && reports.length === 0 ? (
                <tr><td colSpan={4} className="h-64 text-center text-white/40">
                  <Flag className="mx-auto mb-3 size-8 opacity-20" />
                  <p>No reports found.</p>
                </td></tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="text-sm">{new Date(report.created_at).toLocaleDateString()}</div>
                      <div className="text-xs text-white/50">{new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-white/40 bg-white/5 inline-block px-1.5 py-0.5 rounded">
                        {report.type || 'Unknown Type'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="font-bold text-white">{report.reporter_first_name} {report.reporter_last_name}</div>
                      <Link href={`/${currentLocale}/admin/users/${report.reporter_id}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-0.5">
                        @{report.reporter_username} <ExternalLink className="size-3" />
                      </Link>
                      {report.reporter_email && (
                        <div className="text-xs text-white/50 mt-1 flex items-center gap-1">
                          <Mail className="size-3" /> {report.reporter_email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      {report.reported_id ? (
                        <>
                          <div className="font-bold text-white">{report.reported_first_name} {report.reported_last_name}</div>
                          <Link href={`/${currentLocale}/admin/users/${report.reported_id}`} className="text-xs text-red-400 hover:underline flex items-center gap-1 mt-0.5">
                            @{report.reported_username} <ExternalLink className="size-3" />
                          </Link>
                        </>
                      ) : (
                        <span className="text-white/40 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top max-w-md">
                      <div className="font-bold uppercase tracking-wider text-xs mb-1 text-yellow-500">
                        {report.reason}
                      </div>
                      <div className="text-sm text-white/80 break-words whitespace-pre-wrap bg-black/30 p-2 rounded border border-white/5">
                        {report.details || <span className="italic text-white/40">No additional details provided.</span>}
                      </div>
                      {(report.reported_chat_id || report.reported_message_id) && (
                         <div className="mt-2 text-xs font-mono text-white/40 bg-black/50 p-2 rounded">
                           {report.reported_chat_id && <div>Chat ID: {report.reported_chat_id}</div>}
                           {report.reported_message_id && <div>Msg ID: {report.reported_message_id}</div>}
                         </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between bg-black/20 mt-auto">
          <p className="text-sm text-white/50">
            Showing <span className="font-bold text-white">{reports.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="font-bold text-white">{Math.min(page * limit, totalCount)}</span> of <span className="font-bold text-white">{totalCount}</span> results
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
