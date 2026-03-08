'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, TrendingUp, DollarSign, User, Settings, LogOut, Bell, Loader2 } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { useGetUserProfileQuery } from "@/hooks/api/use-user";
import { useLogoutMutation } from "@/hooks/api/blockchain/use-wallet";
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/loans', label: 'Loans', icon: DollarSign },
    { href: '/dashboard/credit', label: 'Credit Score', icon: TrendingUp },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const { data: profileData, isLoading } = useGetUserProfileQuery();
  const { mutateAsync: logout } = useLogoutMutation();

  const handleLogout = async () => {
    disconnect();
    await logout();
    router.push('/login');
  };

  const user = profileData?.user;
  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : "??";

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Top Navigation */}
      <nav className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center">
              <img src="/logo-white.png" alt="CrediX Logo" className="h-8 w-auto" />
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <button className="text-foreground/60 hover:text-foreground transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>
              {isLoading ? (
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              ) : (
                <button className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold" title={user?.name || address}>
                  {userInitials}
                </button>
              )}
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-foreground/60 hover:text-foreground transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed md:sticky md:top-[73px] left-0 top-[73px] h-[calc(100vh-73px)] w-64 border-r border-border bg-background transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } z-30`}>
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground transition-colors text-left">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:top-[73px]">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
