'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Loader2, LogOut, BarChart3, LayoutDashboard, Users, SlidersHorizontal, Calendar, MapPin, Menu, X, Flag, Bell, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentLocale = (params.locale as string) || 'en';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No session');

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (userError || userData?.role !== 'su') throw new Error('Not authorized');
        setUserEmail(session.user.email ?? 'Superuser');
      } catch {
        await supabase.auth.signOut();
        router.push(`/${currentLocale}/admin/login`);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router, currentLocale]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
    { name: 'Reports', href: `/${currentLocale}/admin/reports`, icon: Flag },
    { name: 'Notifications', href: `/${currentLocale}/admin/notifications`, icon: Bell },
    { name: 'Carousel', href: `/${currentLocale}/admin/carousel`, icon: ImageIcon },
  ];

  const activeItem = navItems.find(item =>
    pathname === item.href || (item.name !== 'Overview' && pathname.startsWith(item.href))
  );

  const SidebarContent = () => (
    <>
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
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-live-red/10 text-live-red'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 text-xs text-white/50 truncate px-2">{userEmail}</div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="mr-3 size-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#050506] text-white overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-white/10 bg-[#0A0A0C]/90 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0A0A0C] transition-transform duration-300 ease-in-out lg:hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#050506] min-w-0">
        {/* Topbar */}
        <header className="h-14 lg:h-16 border-b border-white/10 flex items-center gap-3 px-4 lg:px-6 bg-[#0A0A0C]/50 backdrop-blur shrink-0">
          {/* Hamburger - mobile only */}
          <button
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-md text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          <span className="text-sm font-medium text-white/80 truncate">
            {activeItem?.name || 'Admin'}
          </span>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
