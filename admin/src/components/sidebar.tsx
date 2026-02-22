'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SIDEBAR_ITEMS } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Megaphone,
  FileText,
  Heart,
  Gift,
  Pill,
  BookOpen,
  MapPin,
  Bus,
  Calendar,
  Car,
  Home,
  Users,
  MessageSquareWarning,
  Terminal,
  Settings,
  ChevronLeft,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Megaphone,
  FileText,
  Heart,
  Gift,
  Pill,
  BookOpen,
  MapPin,
  Bus,
  Calendar,
  Car,
  Home,
  Users,
  MessageSquareWarning,
  Terminal,
  Settings,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-[260px]',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              K
            </div>
            <span className="text-lg font-bold">KadirliApp</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              K
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn('h-8 w-8 shrink-0', collapsed && 'absolute -right-3 top-5 z-50 rounded-full border bg-card shadow-sm')}
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
          />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-64px)]">
        <nav className="flex flex-col gap-1 p-3">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'justify-center px-2',
                )}
                title={collapsed ? item.title : undefined}
              >
                {Icon && <Icon className="h-5 w-5 shrink-0" />}
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
