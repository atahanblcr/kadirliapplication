'use client';

import { Users, FileText, Clock, Megaphone, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DashboardStats } from '@/types';

interface KpiCardsProps {
  stats: DashboardStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      title: 'Toplam Kullanıcı',
      value: stats.totalUsers.toLocaleString('tr-TR'),
      growth: stats.userGrowth,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Aktif İlanlar',
      value: stats.activeAds.toLocaleString('tr-TR'),
      growth: stats.adGrowth,
      icon: FileText,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Bekleyen Onaylar',
      value: stats.pendingApprovals.toLocaleString('tr-TR'),
      growth: stats.approvalGrowth,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      title: 'Bugünkü Duyurular',
      value: stats.todayAnnouncements.toLocaleString('tr-TR'),
      growth: stats.announcementGrowth,
      icon: Megaphone,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.growth >= 0;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn('rounded-lg p-2', card.bg)}>
                <Icon className={cn('h-5 w-5', card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <div className="mt-1 flex items-center gap-1 text-sm">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={cn(
                    'font-medium',
                    isPositive ? 'text-green-600' : 'text-red-600',
                  )}
                >
                  {isPositive ? '+' : ''}{card.growth}%
                </span>
                <span className="text-muted-foreground">son 30 gün</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
