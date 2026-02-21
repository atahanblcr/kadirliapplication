'use client';

import { useState } from 'react';
import {
  Search, RefreshCw, Eye, CheckCircle2, XCircle,
  Loader2, Clock, Tag, BarChart2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCampaigns, useApproveCampaign } from '@/hooks/use-campaigns';
import {
  CampaignStatusBadge,
  formatDiscountRate,
  formatValidityRange,
} from '@/lib/campaign-utils';
import { CampaignDetailModal } from './campaign-detail-modal';
import { toast } from '@/hooks/use-toast';
import type { Campaign, CampaignFilters } from '@/types';

const PAGE_SIZE = 20;

// ─── Table Skeleton ───────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 8 }).map((__, j) => (
            <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Table Header ─────────────────────────────────────────────────────────────
function CampaignsTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>İşletme</TableHead>
        <TableHead>Kampanya</TableHead>
        <TableHead className="w-[80px]">İndirim</TableHead>
        <TableHead>Geçerlilik</TableHead>
        <TableHead className="w-[90px]">Görünt.</TableHead>
        <TableHead className="w-[90px]">Kod Görünt.</TableHead>
        <TableHead className="w-[110px]">Durum</TableHead>
        <TableHead className="w-[100px] text-right">İşlemler</TableHead>
      </TableRow>
    </TableHeader>
  );
}

// ─── Campaign Row ─────────────────────────────────────────────────────────────
function CampaignRow({
  campaign,
  showActions,
  onView,
  onApprove,
  approving,
}: {
  campaign: Campaign;
  showActions: boolean;
  onView: (c: Campaign) => void;
  onApprove: (c: Campaign) => void;
  approving: boolean;
}) {
  return (
    <TableRow>
      {/* Business */}
      <TableCell className="text-sm text-muted-foreground">
        {campaign.business_name}
      </TableCell>

      {/* Title */}
      <TableCell>
        <button
          type="button"
          className="text-left text-sm font-medium hover:text-primary hover:underline"
          onClick={() => onView(campaign)}
        >
          {campaign.title}
          {campaign.code && (
            <Badge variant="outline" className="ml-2 text-xs font-mono">
              {campaign.code}
            </Badge>
          )}
        </button>
      </TableCell>

      {/* Discount */}
      <TableCell>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          <Tag className="h-3 w-3" />
          {formatDiscountRate(campaign.discount_rate)}
        </span>
      </TableCell>

      {/* Validity */}
      <TableCell className="text-sm text-muted-foreground">
        {formatValidityRange(campaign.valid_from, campaign.valid_until)}
      </TableCell>

      {/* Views */}
      <TableCell className="text-sm text-muted-foreground">
        {campaign.views.toLocaleString('tr-TR')}
      </TableCell>

      {/* Code views */}
      <TableCell className="text-sm text-muted-foreground">
        {campaign.code_views.toLocaleString('tr-TR')}
      </TableCell>

      {/* Status */}
      <TableCell>
        <CampaignStatusBadge status={campaign.status} />
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onView(campaign)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Detay</TooltipContent>
          </Tooltip>

          {showActions && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600"
                    onClick={() => onApprove(campaign)}
                    disabled={approving}
                  >
                    {approving
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <CheckCircle2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Onayla</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onView(campaign)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reddet</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Tab Content ──────────────────────────────────────────────────────────────
function CampaignsTabContent({
  filters,
  showActions,
  onView,
  onApprove,
  approvingId,
}: {
  filters: CampaignFilters;
  showActions: boolean;
  onView: (c: Campaign) => void;
  onApprove: (c: Campaign) => void;
  approvingId: string | null;
}) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, refetch } = useCampaigns({ ...filters, page });

  const campaigns = data?.items ?? [];
  const meta      = data?.meta;

  return (
    <div className="mt-4">
      <div className="flex justify-end mb-3">
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <CampaignsTableHeader />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-16 text-center text-muted-foreground">
                  {showActions ? '🎉 Bekleyen kampanya yok!' : 'Kampanya bulunamadı.'}
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => (
                <CampaignRow
                  key={campaign.id}
                  campaign={campaign}
                  showActions={showActions}
                  onView={onView}
                  onApprove={onApprove}
                  approving={approvingId === campaign.id}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {((page - 1) * PAGE_SIZE + 1)}–{Math.min(page * PAGE_SIZE, meta.total)} / {meta.total.toLocaleString('tr-TR')}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_prev}
              onClick={() => setPage((p) => p - 1)}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_next}
              onClick={() => setPage((p) => p + 1)}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CampaignsPage() {
  const [detailItem, setDetailItem]   = useState<Campaign | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [search, setSearch]           = useState('');

  const approveMutation = useApproveCampaign();

  // Pending count for tab badge
  const { data: pendingData } = useCampaigns({ status: 'pending', limit: 1 });
  const pendingTotal = pendingData?.meta?.total ?? 0;

  const handleApprove = async (campaign: Campaign) => {
    setApprovingId(campaign.id);
    try {
      await approveMutation.mutateAsync(campaign.id);
      toast({ title: `"${campaign.title}" kampanyası onaylandı.` });
    } catch {
      toast({ title: 'Hata', description: 'Onaylanamadı.', variant: 'destructive' });
    } finally {
      setApprovingId(null);
    }
  };

  const baseFilters: Omit<CampaignFilters, 'status'> = {
    limit: PAGE_SIZE,
    search: search || undefined,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kampanyalar</h1>
        <p className="text-sm text-muted-foreground">
          Kampanya moderasyonu ve onay yönetimi
        </p>
      </div>

      {/* Stats cards */}
      <CampaignStatsBar />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Kampanya veya işletme ara..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Bekleyenler
            {pendingTotal > 0 && (
              <Badge className="h-5 min-w-5 rounded-full px-1 text-xs">
                {pendingTotal}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Onaylılar</TabsTrigger>
          <TabsTrigger value="rejected">Reddedilenler</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <CampaignsTabContent
            filters={{ ...baseFilters, status: 'pending' }}
            showActions
            onView={setDetailItem}
            onApprove={handleApprove}
            approvingId={approvingId}
          />
        </TabsContent>

        <TabsContent value="approved">
          <CampaignsTabContent
            filters={{ ...baseFilters, status: 'approved' }}
            showActions={false}
            onView={setDetailItem}
            onApprove={handleApprove}
            approvingId={approvingId}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <CampaignsTabContent
            filters={{ ...baseFilters, status: 'rejected' }}
            showActions={false}
            onView={setDetailItem}
            onApprove={handleApprove}
            approvingId={approvingId}
          />
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <CampaignDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function CampaignStatsBar() {
  const { data: allData }      = useCampaigns({ limit: 1 });
  const { data: approvedData } = useCampaigns({ status: 'approved', limit: 1 });
  const { data: pendingData }  = useCampaigns({ status: 'pending',  limit: 1 });

  const total    = allData?.meta?.total     ?? 0;
  const approved = approvedData?.meta?.total ?? 0;
  const pending  = pendingData?.meta?.total  ?? 0;

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
      <StatCard
        icon={<BarChart2 className="h-5 w-5 text-muted-foreground" />}
        label="Toplam Kampanya"
        value={total.toLocaleString('tr-TR')}
      />
      <StatCard
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        label="Aktif Kampanya"
        value={approved.toLocaleString('tr-TR')}
        className="text-green-600"
      />
      <StatCard
        icon={<Clock className="h-5 w-5 text-yellow-600" />}
        label="Bekleyen"
        value={pending.toLocaleString('tr-TR')}
        className="text-yellow-600"
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-lg font-bold ${className}`}>{value}</p>
      </div>
    </div>
  );
}
