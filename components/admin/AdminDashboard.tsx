'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { 
  Users, Activity, UserPlus, Heart, MapPin, 
  MessageSquare, Layers, Loader2, AlertTriangle 
} from 'lucide-react';

interface Metrics {
  totalUsers: number;
  activeUsers: number;
  usersOnline24h: number;
  signUps24h: number;
  totalMatches: number;
  totalRealLifeMatches: number;
  totalMessages: number;
  totalSwipes: number;
  topEvents: { name: string; count: number }[];
  topVenues: { name: string; count: number }[];
  genderDist: { label: string; value: number }[];
  sexualOrientationDist: { label: string; value: number }[];
  ageDist: { label: string; value: number }[];
  activePremiumCount: number;
  totalSold1m: number;
  totalSold3m: number;
  totalSold1y: number;
  premiumRecurringUsers: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error: rpcError } = await supabase.rpc('get_admin_overview_metrics');
        if (rpcError) throw rpcError;
        setMetrics(data as Metrics);
      } catch (err: any) {
        setError(err.message || 'Failed to load metrics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="size-10 animate-spin text-live-red" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !metrics) {
    return (
      <AdminLayout>
        <div className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{error || 'No data found'}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Overview</h2>
        <p className="mt-2 text-sm text-white/60">Live pulse of the Bouncinn ecosystem.</p>
      </div>

      {/* Primary KPI Cards */}
      <div className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-4">
        <MetricCard icon={<Users />} label="Total Users" value={metrics.totalUsers.toLocaleString()} />
        <MetricCard icon={<Activity />} label="Active Users" value={metrics.activeUsers.toLocaleString()} trend={`${((metrics.activeUsers / Math.max(metrics.totalUsers, 1)) * 100).toFixed(1)}%`} />
        <MetricCard icon={<UserPlus />} label="Sign Ups (24h)" value={metrics.signUps24h.toLocaleString()} />
        <MetricCard icon={<Activity className="text-green-400" />} label="Online (24h)" value={metrics.usersOnline24h.toLocaleString()} />
        
        <MetricCard icon={<Heart className="text-pink-500" />} label="Total Matches" value={metrics.totalMatches.toLocaleString()} />
        <MetricCard icon={<MapPin className="text-live-red" />} label="Real Life Matches" value={metrics.totalRealLifeMatches.toLocaleString()} />
        <MetricCard icon={<MessageSquare className="text-blue-400" />} label="Total Messages" value={metrics.totalMessages.toLocaleString()} />
        <MetricCard icon={<Layers className="text-purple-400" />} label="Total Swipes" value={metrics.totalSwipes.toLocaleString()} />
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Premium Subscriptions</h3>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
          <MetricCard icon={<Users className="text-yellow-400" />} label="Active Premium" value={metrics.activePremiumCount.toLocaleString()} />
          <MetricCard icon={<Activity className="text-green-400" />} label="Sold (1 Month)" value={metrics.totalSold1m.toLocaleString()} />
          <MetricCard icon={<Activity className="text-blue-400" />} label="Sold (3 Months)" value={metrics.totalSold3m.toLocaleString()} />
          <MetricCard icon={<Activity className="text-purple-400" />} label="Sold (1 Year)" value={metrics.totalSold1y.toLocaleString()} />
          <MetricCard icon={<Heart className="text-live-red" />} label="Recurring Buyers" value={metrics.premiumRecurringUsers.toLocaleString()} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Top Events */}
        <div className="rounded-xl border border-white/10 bg-[#111114]/80 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Top 5 Events (Check-ins)</h3>
          <div className="space-y-4">
            {metrics.topEvents.length > 0 ? metrics.topEvents.map((evt, i) => (
              <BarRow key={i} label={evt.name} value={evt.count} max={metrics.topEvents[0].count} color="bg-live-red" />
            )) : <p className="text-sm text-white/30">No event check-ins recently.</p>}
          </div>
        </div>

        {/* Top Venues */}
        <div className="rounded-xl border border-white/10 bg-[#111114]/80 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Top 5 Venues (Check-ins)</h3>
          <div className="space-y-4">
            {metrics.topVenues.length > 0 ? metrics.topVenues.map((v, i) => (
              <BarRow key={i} label={v.name} value={v.count} max={metrics.topVenues[0].count} color="bg-blue-500" />
            )) : <p className="text-sm text-white/30">No venue check-ins recently.</p>}
          </div>
        </div>

        {/* Demographics: Gender & Sexual Orientation */}
        <div className="rounded-xl border border-white/10 bg-[#111114]/80 p-6 backdrop-blur-xl space-y-8">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Gender Distribution</h3>
            <div className="space-y-3">
              {metrics.genderDist.length > 0 ? metrics.genderDist.map((g, i) => (
                <BarRow key={i} label={g.label || 'Unknown'} value={g.value} max={Math.max(...metrics.genderDist.map(d => d.value))} color="bg-purple-500" />
              )) : <p className="text-sm text-white/30">No data.</p>}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Sexual Orientation</h3>
            <div className="space-y-3">
              {metrics.sexualOrientationDist.length > 0 ? metrics.sexualOrientationDist.map((s, i) => (
                <BarRow key={i} label={s.label || 'Unknown'} value={s.value} max={Math.max(...metrics.sexualOrientationDist.map(d => d.value))} color="bg-pink-500" />
              )) : <p className="text-sm text-white/30">No data.</p>}
            </div>
          </div>
        </div>

        {/* Demographics: Age */}
        <div className="rounded-xl border border-white/10 bg-[#111114]/80 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">Age Distribution</h3>
          <div className="space-y-4 flex flex-col h-full justify-start">
            {metrics.ageDist.length > 0 ? metrics.ageDist.sort((a,b) => a.label.localeCompare(b.label)).map((a, i) => (
              <BarRow key={i} label={a.label} value={a.value} max={Math.max(...metrics.ageDist.map(d => d.value))} color="bg-emerald-500" />
            )) : <p className="text-sm text-white/30">No data.</p>}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

function MetricCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string | number, trend?: string }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-gradient-to-br from-[#1A1A1F] to-[#111114] p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-white/80">
          {icon}
        </div>
        {trend && (
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white/70">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-white/50">{label}</p>
        <p className="mt-1 text-2xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function BarRow({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
  const percentage = max > 0 ? Math.max((value / max) * 100, 2) : 0; // min 2% for visibility

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium">
        <span className="text-white/80">{label}</span>
        <span className="text-white/50">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div 
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
