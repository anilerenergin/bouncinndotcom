'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Loader2, LogOut, BarChart3, LayoutDashboard, Users, SlidersHorizontal, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const currentLocale = (params.locale as string) || 'en';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('No session');
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (userError || userData?.role !== 'su') {
          throw new Error('Not authorized');
        }

        setUserEmail(session.user.email ?? 'Superuser');
      } catch (err) {
        await supabase.auth.signOut();
        router.push(`/${currentLocale}/admin/login`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, currentLocale]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${currentLocale}/admin/login`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#09090B] text-white grid place-items-center">
        <Loader2 className="size-8 animate-spin text-live-red" />
      </main>
    );
  }

  const navItems = [
    { name: 'Overview', href: `/${currentLocale}/admin`, icon: LayoutDashboard },
    { name: 'Analytics', href: `/${currentLocale}/admin/analytics`, icon: BarChart3 },
    { name: 'Remote Config', href: `/${currentLocale}/admin/remote-config`, icon: SlidersHorizontal },
    { name: 'Users', href: `/${currentLocale}/admin/users`, icon: Users },
    { name: 'Events', href: `/${currentLocale}/admin/events`, icon: Calendar },
    { name: 'Venues', href: `/${currentLocale}/admin/venues`, icon: MapPin },
  ];

  return (
    <div className="flex h-screen bg-[#050506] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-[#0A0A0C]/90 flex flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <Image src="/images/icon.png" alt="Bouncinn" width={28} height={28} className="h-7 w-auto" />
          <div>
            <h1 className="text-sm font-black tracking-tight">BOUNCINN</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-live-red">Admin</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.name !== 'Overview' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive 
                        ? 'bg-live-red/10 text-live-red' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon className="size-4" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 text-xs text-white/50 truncate px-2">{userEmail}</div>
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="mr-3 size-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#050506]">
        {/* Topbar (optional, but good for mobile toggle later) */}
        <header className="h-16 border-b border-white/10 flex items-center px-6 bg-[#0A0A0C]/50 backdrop-blur">
          <h2 className="text-sm font-medium text-white/80">
            {navItems.find(item => pathname === item.href || (item.name !== 'Overview' && pathname.startsWith(item.href)))?.name || 'Admin'}
          </h2>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
