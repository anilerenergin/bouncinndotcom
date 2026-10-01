'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Loader2, Download, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ANALYTICS_VIEWS = [
  'analytics_activation_funnel',
  'analytics_active_hours',
  'analytics_active_location_presence',
  'analytics_churn_risk',
  'analytics_current_online_users',
  'analytics_dau_mau',
  'analytics_demographic_distribution',
  'analytics_event_metrics',
  'analytics_geofence_conversion',
  'analytics_investor_pitch_snapshot',
  'analytics_investor_summary',
  'analytics_match_funnel',
  'analytics_match_quality',
  'analytics_messaging',
  'analytics_network_liquidity',
  'analytics_power_users_segmentation',
  'analytics_premium_conversion_time',
  'analytics_real_checkins',
  'analytics_real_world_meetups',
  'analytics_retention_exact',
  'analytics_retention_approx',
  'analytics_revenue',
  'analytics_time_to_first_action',
  'analytics_user_growth',
  'analytics_user_presence_sessions',
  'analytics_venue_verified_visits'
];

export default function AnalyticsView() {
  const [selectedView, setSelectedView] = useState(ANALYTICS_VIEWS[0]);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (viewName: string) => {
    setIsLoading(true);
    setError('');
    setData([]);

    try {
      const { data: viewData, error: viewError } = await supabase.rpc(
        'get_admin_analytics',
        { view_name: viewName }
      );

      if (viewError) throw viewError;
      
      setData(viewData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedView);
  }, [selectedView]);

  const handleDownloadCSV = () => {
    if (!data.length) return;

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Convert to CSV
    const csvRows = [];
    csvRows.push(headers.join(',')); // Add header row

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header] === null || row[header] === undefined ? '' : String(row[header]);
        return `"${val.replace(/"/g, '""')}"`; // Escape quotes
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedView}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Analytics</h2>
          <p className="mt-1 text-sm text-white/60">View and download your Supabase analytics data.</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-[#111114] px-3 text-sm text-white focus:border-live-red/60 focus:outline-none"
          >
            {ANALYTICS_VIEWS.map(view => (
              <option key={view} value={view}>{view}</option>
            ))}
          </select>
          
          <Button 
            onClick={handleDownloadCSV}
            disabled={isLoading || data.length === 0}
            className="h-10 bg-live-red text-white hover:bg-live-red/90"
          >
            <Download className="mr-2 size-4" />
            Download CSV
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-6 flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="rounded-xl border border-white/10 bg-[#111114] overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-live-red" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-white/40">
            <BarChart3 className="mb-3 size-8 opacity-20" />
            <p className="text-sm">No data available for this view.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="bg-white/5 text-xs uppercase text-white/60 border-b border-white/10">
                <tr>
                  {Object.keys(data[0]).map((header) => (
                    <th key={header} className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    {Object.keys(data[0]).map((key) => (
                      <td key={key} className="px-6 py-4 whitespace-nowrap">
                        {row[key] !== null ? String(row[key]) : <span className="text-white/20">null</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
