'use client';

import { useState } from 'react';
import {
  Search, Plus, Pencil, Trash2, Eye, Loader2, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
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
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeaths, useDeleteDeath } from '@/hooks/use-deaths';
import { formatFuneralDate, calculateArchiveDaysLeft, resolveFileUrl } from '@/lib/death-utils';
import { DeathFormDialog } from './components/death-form-dialog';
import { DeathDetailModal } from './death-detail-modal';
import { CemeteryManagement } from './cemetery-management';
import { MosqueManagement } from './mosque-management';
import type { DeathNotice } from '@/types';

const PAGE_SIZE = 20;

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

// ─── Deaths Tab Content ──────────────────────────────────────────────────────

function DeathsTabContent() {
  const [search, setSearch]             = useState('');
  const [page, setPage]                 = useState(1);
  const [detailItem, setDetailItem]     = useState<DeathNotice | null>(null);
  const [formOpen, setFormOpen]         = useState(false);
  const [editingDeath, setEditingDeath] = useState<DeathNotice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeathNotice | null>(null);

  const { data, isLoading, isFetching, refetch } = useDeaths({
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const deleteMutation = useDeleteDeath();

  const notices = data?.items ?? [];
  const meta = data?.meta;

  const handleEdit = (death: DeathNotice) => {
    setEditingDeath(death);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingDeath(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search + Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Vefat eden adında ara..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
        <Button onClick={() => { setEditingDeath(null); setFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni İlan Ekle
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Yaş</TableHead>
              <TableHead>Cenaze Tarihi</TableHead>
              <TableHead>Mezarlık</TableHead>
              <TableHead>Cami</TableHead>
              <TableHead>Mahalle</TableHead>
              <TableHead>Arşiv</TableHead>
              <TableHead className="w-[110px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-16 text-center text-muted-foreground">
                  {search ? 'Arama sonucu bulunamadı.' : 'Henüz vefat ilanı yok.'}
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => {
                const daysLeft = calculateArchiveDaysLeft(notice.auto_archive_at);
                return (
                  <TableRow key={notice.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {notice.photo_file && (
                          <img
                            src={resolveFileUrl(notice.photo_file.cdn_url ?? notice.photo_file.url)}
                            alt={notice.deceased_name}
                            className="h-8 w-8 rounded-full object-cover border shrink-0"
                          />
                        )}
                        <span className="font-medium text-sm">{notice.deceased_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {notice.age ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatFuneralDate(notice.funeral_date, notice.funeral_time)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {notice.cemetery?.name ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {notice.mosque?.name ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {notice.neighborhood?.name ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {daysLeft > 0 ? `${daysLeft} gün` : (
                        <span className="text-xs text-muted-foreground/60">Arşivlendi</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setDetailItem(notice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Detay</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(notice)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Düzenle</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => setDeleteTarget(notice)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Sil</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {((page - 1) * PAGE_SIZE + 1)}–{Math.min(page * PAGE_SIZE, meta.total)} / {meta.total.toLocaleString('tr-TR')} ilan
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

      {/* Form Dialog (Add / Edit) */}
      <DeathFormDialog
        open={formOpen}
        onClose={handleCloseForm}
        death={editingDeath}
      />

      {/* Detail Modal */}
      <DeathDetailModal item={detailItem} onClose={() => setDetailItem(null)} />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vefat İlanını Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.deceased_name}</strong> adına oluşturulan ilan silinecek. Bu işlem geri alınamaz.
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

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DeathsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vefat İlanları</h1>
        <p className="text-sm text-muted-foreground">
          Vefat ilanları, mezarlıklar ve camileri yönetin
        </p>
      </div>

      <Tabs defaultValue="deaths">
        <TabsList>
          <TabsTrigger value="deaths">İlanlar</TabsTrigger>
          <TabsTrigger value="cemeteries">Mezarlıklar</TabsTrigger>
          <TabsTrigger value="mosques">Camiler</TabsTrigger>
        </TabsList>
        <TabsContent value="deaths" className="mt-4">
          <DeathsTabContent />
        </TabsContent>
        <TabsContent value="cemeteries" className="mt-4">
          <CemeteryManagement />
        </TabsContent>
        <TabsContent value="mosques" className="mt-4">
          <MosqueManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
