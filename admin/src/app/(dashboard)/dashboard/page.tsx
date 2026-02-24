'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, DashboardStats, UserGrowthData, ModuleUsageData, RecentActivity, PendingApproval } from '@/types';
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { UserGrowthChart } from '@/components/dashboard/user-growth-chart';
import { ModuleUsageChart } from '@/components/dashboard/module-usage-chart';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivityFeed } from '@/components/dashboard/recent-activity';
import { PendingApprovalsList } from '@/components/dashboard/pending-approvals';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data - backend entegrasyon sonrası kaldırılacak
const mockStats: DashboardStats = {
  totalUsers: 12847,
  activeAds: 342,
  pendingApprovals: 18,
  todayAnnouncements: 5,
  userGrowth: 12.5,
  adGrowth: -3.2,
  approvalGrowth: 8.1,
  announcementGrowth: 25.0,
};

const mockUserGrowth: UserGrowthData[] = [
  { date: '2026-01-01', users: 10200 },
  { date: '2026-01-15', users: 10580 },
  { date: '2026-02-01', users: 11200 },
  { date: '2026-02-07', users: 11650 },
  { date: '2026-02-14', users: 12300 },
  { date: '2026-02-21', users: 12847 },
];

const mockModuleUsage: ModuleUsageData[] = [
  { name: 'İlanlar', count: 4520 },
  { name: 'Duyurular', count: 3200 },
  { name: 'Eczane', count: 2800 },
  { name: 'Etkinlikler', count: 1900 },
  { name: 'Rehber', count: 1500 },
  { name: 'Mekanlar', count: 1200 },
  { name: 'Taksi', count: 980 },
  { name: 'Ulaşım', count: 750 },
];

const mockActivities: RecentActivity[] = [
  { id: '1', type: 'user_register', description: 'Yeni kullanıcı kaydı: Ahmet Y.', created_at: '2026-02-21T14:30:00Z' },
  { id: '2', type: 'ad_created', description: 'Yeni ilan: "Satılık Arsa - Merkez"', created_at: '2026-02-21T14:15:00Z' },
  { id: '3', type: 'ad_approved', description: 'İlan onaylandı: "Kiralık Daire"', created_at: '2026-02-21T13:45:00Z' },
  { id: '4', type: 'announcement_created', description: 'Belediye duyurusu eklendi', created_at: '2026-02-21T13:20:00Z' },
  { id: '5', type: 'death_notice', description: 'Vefat ilanı eklendi: Mehmet Kaya', created_at: '2026-02-21T12:50:00Z' },
  { id: '6', type: 'complaint', description: 'Yeni şikayet: İlan #2341', created_at: '2026-02-21T12:30:00Z' },
];

const mockPending: PendingApproval[] = [
  { id: '1', type: 'ad', title: 'Satılık Arsa - Akdam Mah.', created_at: '2026-02-21T14:00:00Z', user: { id: 'u1', full_name: 'Ali Demir' } },
  { id: '2', type: 'ad', title: 'Kiralık Dükkan - Merkez', created_at: '2026-02-21T13:30:00Z', user: { id: 'u2', full_name: 'Fatma Yılmaz' } },
  { id: '3', type: 'death', title: 'Vefat: Hasan Öztürk', created_at: '2026-02-21T12:00:00Z', user: { id: 'u3', full_name: 'Veli Öztürk' } },
  { id: '4', type: 'campaign', title: 'Kış İndirimi Kampanyası', created_at: '2026-02-21T11:00:00Z', user: { id: 'u4', full_name: 'Café Merkez' } },
];

export default function DashboardPage() {
  // Backend entegrasyonu hazır olduğunda bu query'ler aktifleştirilecek
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const { data } = await api.get<ApiResponse<{
          stats: {
            total_users: number;
            pending_approvals: { ads: number; deaths: number; campaigns: number; total: number };
            announcements_sent_today: number;
            new_ads_today: number;
          };
          charts: { user_growth: { date: string; count: number }[] };
        }>>('/admin/dashboard');
        const s = data.data.stats;
        return {
          totalUsers: s.total_users,
          activeAds: s.new_ads_today,
          pendingApprovals: s.pending_approvals.total,
          todayAnnouncements: s.announcements_sent_today,
          userGrowth: 0,
          adGrowth: 0,
          approvalGrowth: 0,
          announcementGrowth: 0,
        } satisfies DashboardStats;
      } catch {
        return mockStats;
      }
    },
    placeholderData: mockStats,
  });

  const { data: userGrowth } = useQuery({
    queryKey: ['user-growth'],
    queryFn: async () => {
      try {
        const { data } = await api.get<ApiResponse<{
          stats: unknown;
          charts: { user_growth: { date: string; count: number }[] };
        }>>('/admin/dashboard');
        return data.data.charts.user_growth.map((r) => ({ date: r.date, users: r.count }));
      } catch {
        return mockUserGrowth;
      }
    },
    placeholderData: mockUserGrowth,
  });

  const { data: moduleUsage } = useQuery({
    queryKey: ['module-usage'],
    queryFn: async () => {
      try {
        const { data } = await api.get<ApiResponse<ModuleUsageData[]>>('/admin/dashboard/module-usage');
        return data.data;
      } catch {
        return mockModuleUsage;
      }
    },
    placeholderData: mockModuleUsage,
  });

  const { data: activities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      try {
        const { data } = await api.get<ApiResponse<RecentActivity[]>>('/admin/dashboard/activities');
        return data.data;
      } catch {
        return mockActivities;
      }
    },
    placeholderData: mockActivities,
  });

  const { data: pending } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: async () => {
      try {
        const { data } = await api.get<ApiResponse<{
          approvals: { id: string; type: 'ad' | 'death' | 'campaign'; content: { title: string; user: { id: string; username: string; phone: string } | null }; created_at: string }[];
          total: number;
        }>>('/admin/approvals');
        return data.data.approvals.slice(0, 4).map((a) => ({
          id: a.id,
          type: a.type,
          title: a.content.title,
          created_at: a.created_at,
          user: { id: a.content.user?.id ?? '', full_name: a.content.user?.username ?? 'Bilinmiyor' },
        }));
      } catch {
        return mockPending;
      }
    },
    placeholderData: mockPending,
  });

  if (statsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">KadirliApp genel bakış ve istatistikler</p>
      </div>

      {/* KPI Cards */}
      <KpiCards stats={stats!} />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UserGrowthChart data={userGrowth!} />
        <ModuleUsageChart data={moduleUsage!} />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <QuickActions />
        <PendingApprovalsList approvals={pending!} />
        <RecentActivityFeed activities={activities!} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-5 w-72" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}
