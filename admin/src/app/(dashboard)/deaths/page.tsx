'use client';

import { useState } from 'react';
import {
  Search, RefreshCw, Eye, CheckCircle2, XCircle,
  Loader2, Clock, AlertTriangle,
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
import { useDeaths, useApproveDeath } from '@/hooks/use-deaths';
import {
  DeathStatusBadge, formatFuneralDate, calculateArchiveDaysLeft,
} from '@/lib/death-utils';
import { DeathDetailModal } from './death-detail-modal';
import { toast } from '@/hooks/use-toast';
import type { DeathNotice, DeathFilters } from '@/types';

const PAGE_SIZE = 20;

// ─── Table Skeleton ───────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 7 }).map((__, j) => (
            <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Table Header ─────────────────────────────────────────────────────────────
function DeathsTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Vefat Eden</TableHead>
        <TableHead>Defin Tarihi</TableHead>
        <TableHead>Mekan</TableHead>
        <TableHead className="w-[110px]">Durum</TableHead>
        <TableHead>Ekleyen</TableHead>
        <TableHead className="w-[80px]">Arşiv</TableHead>
        <TableHead className="w-[100px] text-right">İşlemler</TableHead>
      </TableRow>
    </TableHeader>
  );
}

// ─── Death Row ────────────────────────────────────────────────────────────────
function DeathRow({
  notice,
  showActions,
  onView,
  onApprove,
  approving,
}: {
  notice: DeathNotice;
  showActions: boolean;
  onView: (n: DeathNotice) => void;
  onApprove: (n: DeathNotice) => void;
  approving: boolean;
}) {
  const daysLeft = calculateArchiveDaysLeft(notice.auto_archive_at);
  const isUrgent = notice.status === 'pending' && daysLeft <= 1;

  return (
    <TableRow className={isUrgent ? 'bg-orange-50' : undefined}>
      {/* Name */}
      <TableCell>
        <button
          type="button"
          className="text-left text-sm font-medium hover:text-primary hover:underline"
          onClick={() => onView(notice)}
        >
          {notice.deceased_name}
          {isUrgent && (
            <AlertTriangle className="inline ml-1 h-3.5 w-3.5 text-orange-500" />
          )}
        </button>
        {notice.age && (
          <p className="text-xs text-muted-foreground">{notice.age} yaşında</p>
        )}
      </TableCell>

      {/* Funeral date */}
      <TableCell className="text-sm text-muted-foreground">
        {formatFuneralDate(notice.funeral_date, notice.funeral_time)}
      </TableCell>

      {/* Location */}
      <TableCell className="text-sm text-muted-foreground">
        {notice.cemetery?.name ?? notice.mosque?.name ?? '—'}
      </TableCell>

      {/* Status */}
      <TableCell>
        <DeathStatusBadge status={notice.status} />
      </TableCell>

      {/* Submitter */}
      <TableCell className="text-sm text-muted-foreground">
        {notice.adder?.full_name ?? notice.adder?.username ?? '—'}
      </TableCell>

      {/* Archive countdown */}
      <TableCell className="text-sm text-muted-foreground">
        {daysLeft > 0 ? `${daysLeft} gün` : '—'}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(notice)}>
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
                    onClick={() => onApprove(notice)}
                    disabled={approving}
                  >
                    {approving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
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
                    onClick={() => onView(notice)}
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
function DeathsTabContent({
  filters,
  showActions,
  onView,
  onApprove,
  approvingId,
}: {
  filters: DeathFilters;
  showActions: boolean;
  onView: (n: DeathNotice) => void;
  onApprove: (n: DeathNotice) => void;
  approvingId: string | null;
}) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, refetch } = useDeaths({ ...filters, page });

  const notices = data?.items ?? [];
  const meta = data?.meta;

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
          <DeathsTableHeader />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
                  {showActions ? '🎉 Bekleyen vefat ilanı yok!' : 'Vefat ilanı bulunamadı.'}
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <DeathRow
                  key={notice.id}
                  notice={notice}
                  showActions={showActions}
                  onView={onView}
                  onApprove={onApprove}
                  approving={approvingId === notice.id}
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
              variant="outline" size="sm"
              disabled={!meta.has_prev}
              onClick={() => setPage((p) => p - 1)}
            >
              Önceki
            </Button>
            <Button
              variant="outline" size="sm"
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
export default function DeathsPage() {
  const [detailItem, setDetailItem]   = useState<DeathNotice | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [search, setSearch]           = useState('');

  const approveMutation = useApproveDeath();

  // Pending count for badge
  const { data: pendingData } = useDeaths({ status: 'pending', limit: 1 });
  const pendingTotal = pendingData?.meta?.total ?? 0;

  const handleApprove = async (notice: DeathNotice) => {
    setApprovingId(notice.id);
    try {
      await approveMutation.mutateAsync(notice.id);
      toast({ title: `"${notice.deceased_name}" ilanı onaylandı.` });
    } catch {
      toast({ title: 'Hata', description: 'Onaylanamadı.', variant: 'destructive' });
    } finally {
      setApprovingId(null);
    }
  };

  const baseFilters: Omit<DeathFilters, 'status'> = {
    limit: PAGE_SIZE,
    search: search || undefined,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vefat İlanları</h1>
        <p className="text-sm text-muted-foreground">
          Vefat ilanı moderasyonu ve onay yönetimi
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Vefat eden adında ara..."
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
          <DeathsTabContent
            filters={{ ...baseFilters, status: 'pending' }}
            showActions
            onView={setDetailItem}
            onApprove={handleApprove}
            approvingId={approvingId}
          />
        </TabsContent>

        <TabsContent value="approved">
          <DeathsTabContent
            filters={{ ...baseFilters, status: 'approved' }}
            showActions={false}
            onView={setDetailItem}
            onApprove={handleApprove}
            approvingId={approvingId}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <DeathsTabContent
            filters={{ ...baseFilters, status: 'rejected' }}
            showActions={false}
            onView={setDetailItem}
            onApprove={handleApprove}
            approvingId={approvingId}
          />
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <DeathDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
    </div>
  );
}
