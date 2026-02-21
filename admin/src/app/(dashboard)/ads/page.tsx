'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Search, RefreshCw, Eye, CheckCircle2, XCircle,
  Loader2, Clock, ImageOff,
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  usePendingAds, useAds, useApproveAd, useRejectAd, useAdCategories,
} from '@/hooks/use-ads';
import {
  AdStatusBadge, REJECTION_REASONS, formatPrice, formatCategoryPath,
} from '@/lib/ad-utils';
import { AdDetailModal } from './ad-detail-modal';
import { toast } from '@/hooks/use-toast';
import type { AdListItem, AdFilters } from '@/types';

const PAGE_SIZE = 20;

// ─── Small inline reject dialog ───────────────────────────────────────────────
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function QuickRejectDialog({
  item,
  onClose,
}: {
  item: AdListItem | null;
  onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  const rejectMutation = useRejectAd();

  const handle = async () => {
    if (!item || !reason) return;
    try {
      await rejectMutation.mutateAsync({ id: item.id, reason });
      toast({ title: 'İlan reddedildi.' });
      setReason('');
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'İşlem başarısız.', variant: 'destructive' });
    }
  };

  return (
    <AlertDialog open={!!item} onOpenChange={() => { setReason(''); onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>İlanı Reddet</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{item?.title}</strong> — Red nedenini seçin.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Select value={reason} onValueChange={setReason}>
          <SelectTrigger><SelectValue placeholder="Neden seçin..." /></SelectTrigger>
          <SelectContent>
            {REJECTION_REASONS.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            disabled={!reason || rejectMutation.isPending}
            onClick={handle}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {rejectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reddet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Ad Row ───────────────────────────────────────────────────────────────────
function AdRow({
  ad,
  showActions,
  onView,
  onApprove,
  onReject,
  approving,
}: {
  ad: AdListItem;
  showActions: boolean;
  onView: (ad: AdListItem) => void;
  onApprove: (ad: AdListItem) => void;
  onReject: (ad: AdListItem) => void;
  approving: boolean;
}) {
  const thumb = ad.images?.find((i) => i.is_cover) ?? ad.images?.[0];

  return (
    <TableRow>
      {/* Thumbnail */}
      <TableCell className="w-16">
        <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
          {thumb ? (
            <img src={thumb.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageOff className="h-5 w-5 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </TableCell>

      {/* Title + category */}
      <TableCell className="w-[28%]">
        <button
          type="button"
          className="text-left text-sm font-medium hover:text-primary hover:underline line-clamp-2"
          onClick={() => onView(ad)}
        >
          {ad.title}
        </button>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatCategoryPath(ad.category)}
        </p>
      </TableCell>

      {/* Price */}
      <TableCell className="w-[110px] font-medium text-sm">
        {formatPrice(ad.price)}
      </TableCell>

      {/* Status */}
      <TableCell className="w-[110px]">
        <AdStatusBadge status={ad.status} />
      </TableCell>

      {/* Seller */}
      <TableCell className="w-[130px] text-sm text-muted-foreground">
        {ad.seller_name ?? ad.user?.full_name ?? ad.user?.username ?? '—'}
      </TableCell>

      {/* Views */}
      <TableCell className="w-[60px] text-center text-sm text-muted-foreground">
        {ad.view_count.toLocaleString('tr-TR')}
      </TableCell>

      {/* Expiry */}
      <TableCell className="w-[110px] text-sm text-muted-foreground">
        {format(new Date(ad.expires_at), 'dd MMM yy', { locale: tr })}
      </TableCell>

      {/* Actions */}
      <TableCell className="w-[120px]">
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(ad)}>
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
                    onClick={() => onApprove(ad)}
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
                    onClick={() => onReject(ad)}
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

// ─── Table Skeleton ───────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 8 }).map((__, j) => (
            <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Shared Table Header ──────────────────────────────────────────────────────
function AdsTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-16" />
        <TableHead>Başlık / Kategori</TableHead>
        <TableHead className="w-[110px]">Fiyat</TableHead>
        <TableHead className="w-[110px]">Durum</TableHead>
        <TableHead className="w-[130px]">Satıcı</TableHead>
        <TableHead className="w-[60px] text-center">Görüntü</TableHead>
        <TableHead className="w-[110px]">Bitiş</TableHead>
        <TableHead className="w-[120px] text-right">İşlemler</TableHead>
      </TableRow>
    </TableHeader>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdsPage() {
  const [detailItem, setDetailItem]   = useState<AdListItem | null>(null);
  const [rejectItem, setRejectItem]   = useState<AdListItem | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [search, setSearch]           = useState('');
  const [approvedFilters, setApprovedFilters] = useState<AdFilters>({
    page: 1, limit: PAGE_SIZE,
  });

  const { data: pendingAds = [], isLoading: pendingLoading, refetch: refetchPending, isFetching: pendingFetching } =
    usePendingAds();
  const { data: approvedData, isLoading: approvedLoading, isFetching: approvedFetching, refetch: refetchApproved } =
    useAds(approvedFilters);
  const { data: categories = [] } = useAdCategories();
  const approveMutation = useApproveAd();

  const approvedAds  = approvedData?.items ?? [];
  const approvedMeta = approvedData?.meta;

  // Build category flat list for filter
  const flatCategories = categories.flatMap((c) => [
    c,
    ...(c.children ?? []),
  ]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleQuickApprove = async (ad: AdListItem) => {
    setApprovingId(ad.id);
    try {
      await approveMutation.mutateAsync(ad.id);
      toast({ title: `"${ad.title}" onaylandı.` });
    } catch {
      toast({ title: 'Hata', description: 'Onaylanamadı.', variant: 'destructive' });
    } finally {
      setApprovingId(null);
    }
  };

  const filteredPending = pendingAds.filter((ad) =>
    search ? ad.title.toLowerCase().includes(search.toLowerCase()) : true,
  );
  const filteredApproved = approvedAds.filter((ad) =>
    search ? ad.title.toLowerCase().includes(search.toLowerCase()) : true,
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">İlanlar</h1>
          <p className="text-sm text-muted-foreground">
            İlan moderasyonu ve onay yönetimi
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Başlıkta ara..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={approvedFilters.category_id ?? 'all'}
          onValueChange={(v) =>
            setApprovedFilters((p) => ({ ...p, page: 1, category_id: v === 'all' ? undefined : v }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {flatCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.parent_id ? `  └ ${c.name}` : c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={approvedFilters.sort ?? '-created_at'}
          onValueChange={(v) => setApprovedFilters((p) => ({ ...p, sort: v }))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-created_at">En Yeni</SelectItem>
            <SelectItem value="price">Fiyat (Artan)</SelectItem>
            <SelectItem value="-price">Fiyat (Azalan)</SelectItem>
            <SelectItem value="view_count">Çok Görüntülenen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Bekleyenler
            {pendingAds.length > 0 && (
              <Badge className="h-5 min-w-5 rounded-full px-1 text-xs">
                {pendingAds.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Onaylılar
            {approvedMeta && (
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 rounded-full px-1 text-xs">
                {approvedMeta.total}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── PENDING TAB ── */}
        <TabsContent value="pending" className="mt-4">
          <div className="flex justify-end mb-3">
            <Button variant="outline" size="sm" onClick={() => refetchPending()} disabled={pendingFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${pendingFetching ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <AdsTableHeader />
              <TableBody>
                {pendingLoading ? (
                  <TableSkeleton />
                ) : filteredPending.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-16 text-center text-muted-foreground">
                      {search ? 'Arama sonucu bulunamadı.' : '🎉 Bekleyen ilan yok!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPending.map((ad) => (
                    <AdRow
                      key={ad.id}
                      ad={ad}
                      showActions
                      onView={setDetailItem}
                      onApprove={handleQuickApprove}
                      onReject={setRejectItem}
                      approving={approvingId === ad.id}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ── APPROVED TAB ── */}
        <TabsContent value="approved" className="mt-4">
          <div className="flex justify-end mb-3">
            <Button variant="outline" size="sm" onClick={() => refetchApproved()} disabled={approvedFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${approvedFetching ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <AdsTableHeader />
              <TableBody>
                {approvedLoading ? (
                  <TableSkeleton />
                ) : filteredApproved.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-16 text-center text-muted-foreground">
                      İlan bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApproved.map((ad) => (
                    <AdRow
                      key={ad.id}
                      ad={ad}
                      showActions={false}
                      onView={setDetailItem}
                      onApprove={handleQuickApprove}
                      onReject={setRejectItem}
                      approving={false}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {approvedMeta && approvedMeta.total_pages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {((approvedMeta.page - 1) * PAGE_SIZE + 1)}–
                {Math.min(approvedMeta.page * PAGE_SIZE, approvedMeta.total)} / {approvedMeta.total}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline" size="sm"
                  disabled={!approvedMeta.has_prev}
                  onClick={() => setApprovedFilters((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                >
                  Önceki
                </Button>
                <Button
                  variant="outline" size="sm"
                  disabled={!approvedMeta.has_next}
                  onClick={() => setApprovedFilters((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <AdDetailModal item={detailItem} onClose={() => setDetailItem(null)} />

      {/* Quick Reject Dialog */}
      <QuickRejectDialog item={rejectItem} onClose={() => setRejectItem(null)} />
    </div>
  );
}
