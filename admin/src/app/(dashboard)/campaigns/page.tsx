'use client';

import { useState } from 'react';
import {
  Search, RefreshCw, Eye, Pencil, Trash2,
  Plus, Tag, BarChart2, CheckCircle2, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from '@/components/ui/tooltip';
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
import { useCampaigns, useDeleteCampaign } from '@/hooks/use-campaigns';
import { formatDiscountRate, formatValidityRange } from '@/lib/campaign-utils';
import { CampaignDetailModal } from './campaign-detail-modal';
import { CampaignFormDialog } from './components/campaign-form-dialog';
import type { Campaign, CampaignFilters } from '@/types';

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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CampaignsPage() {
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(1);
  const [detailItem, setDetailItem]   = useState<Campaign | null>(null);
  const [formOpen, setFormOpen]       = useState(false);
  const [editItem, setEditItem]       = useState<Campaign | null>(null);
  const [deleteItem, setDeleteItem]   = useState<Campaign | null>(null);

  const deleteMutation = useDeleteCampaign();

  const filters: CampaignFilters = {
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  };

  const { data, isLoading, isFetching, refetch } = useCampaigns(filters);

  const campaigns = data?.items ?? [];
  const meta      = data?.meta;

  // Stats
  const { data: allData }      = useCampaigns({ limit: 1 });
  const { data: approvedData } = useCampaigns({ status: 'approved', limit: 1 });
  const total    = allData?.meta?.total     ?? 0;
  const approved = approvedData?.meta?.total ?? 0;

  const handleEdit = (c: Campaign) => {
    setEditItem(c);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await deleteMutation.mutateAsync(deleteItem.id);
      setDeleteItem(null);
    } catch {
      // toast handled in hook
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kampanyalar</h1>
          <p className="text-sm text-muted-foreground">Kampanya yönetimi</p>
        </div>
        <Button onClick={() => { setEditItem(null); setFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kampanya
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
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
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Kampanya veya işletme ara..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İşletme</TableHead>
              <TableHead>Kampanya</TableHead>
              <TableHead className="w-[80px]">İndirim</TableHead>
              <TableHead>Geçerlilik</TableHead>
              <TableHead className="w-[90px]">Kod Görünt.</TableHead>
              <TableHead className="w-[110px]">Oluşturulma</TableHead>
              <TableHead className="w-[110px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
                  Kampanya bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <CampaignRow
                  key={c.id}
                  campaign={c}
                  onView={() => setDetailItem(c)}
                  onEdit={() => handleEdit(c)}
                  onDelete={() => setDeleteItem(c)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {((page - 1) * PAGE_SIZE + 1)}–{Math.min(page * PAGE_SIZE, meta.total)} / {meta.total.toLocaleString('tr-TR')}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={!meta.has_prev} onClick={() => setPage((p) => p - 1)}>
              Önceki
            </Button>
            <Button variant="outline" size="sm" disabled={!meta.has_next} onClick={() => setPage((p) => p + 1)}>
              Sonraki
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CampaignDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={(c) => { setDetailItem(null); handleEdit(c); }}
      />
      <CampaignFormDialog open={formOpen} onClose={handleFormClose} campaign={editItem} />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteItem} onOpenChange={(v) => !v && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kampanyayı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteItem?.title}</strong> kampanyası silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Campaign Row ─────────────────────────────────────────────────────────────
function CampaignRow({
  campaign,
  onView,
  onEdit,
  onDelete,
}: {
  campaign: Campaign;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <TableRow>
      <TableCell className="text-sm text-muted-foreground">{campaign.business_name}</TableCell>
      <TableCell>
        <button
          type="button"
          className="text-left text-sm font-medium hover:text-primary hover:underline"
          onClick={onView}
        >
          {campaign.title}
          {campaign.code && (
            <Badge variant="outline" className="ml-2 text-xs font-mono">
              {campaign.code}
            </Badge>
          )}
        </button>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          <Tag className="h-3 w-3" />
          {formatDiscountRate(campaign.discount_rate)}
        </span>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatValidityRange(campaign.valid_from, campaign.valid_until)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {campaign.code_views.toLocaleString('tr-TR')}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {new Date(campaign.created_at).toLocaleDateString('tr-TR')}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onView}>
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Detay</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Düzenle</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sil</TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
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
