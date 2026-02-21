'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Plus, Search, Filter, Eye, Pencil, Trash2, Send,
  Loader2, Globe, MapPin, Users, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useAnnouncements,
  useAnnouncementTypes,
  useDeleteAnnouncement,
  useSendAnnouncement,
} from '@/hooks/use-announcements';
import { PriorityBadge, StatusBadge } from '@/lib/announcement-utils';
import { AnnouncementDetailModal } from './detail-modal';
import { AnnouncementForm } from './announcement-form';
import { toast } from '@/hooks/use-toast';
import type { AnnouncementFilters, AnnouncementListItem } from '@/types';

const TARGET_ICONS = {
  all: Globe,
  neighborhoods: MapPin,
  users: Users,
};

const TARGET_LABELS = {
  all: 'Herkes',
  neighborhoods: 'Mahalleler',
  users: 'Kullanıcılar',
};

const PAGE_SIZE = 20;

export default function AnnouncementsPage() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<AnnouncementFilters>({ page: 1, limit: PAGE_SIZE });
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState<AnnouncementListItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<AnnouncementListItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AnnouncementListItem | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  // ─── Queries ─────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching, refetch } = useAnnouncements(filters);
  const { data: types = [] } = useAnnouncementTypes();
  const deleteMutation = useDeleteAnnouncement();
  const sendMutation = useSendAnnouncement();

  const announcements = data?.items ?? [];
  const meta = data?.meta;

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleFilterChange = (key: keyof AnnouncementFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [key]: value === 'all' ? undefined : value || undefined,
    }));
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await deleteMutation.mutateAsync(deleteItem.id);
      toast({ title: 'Duyuru silindi' });
      setDeleteItem(null);
    } catch {
      toast({ title: 'Hata', description: 'Silinemedi.', variant: 'destructive' });
    }
  };

  const handleSend = async (item: AnnouncementListItem) => {
    setSendingId(item.id);
    try {
      const result = await sendMutation.mutateAsync(item.id);
      toast({
        title: 'Gönderiliyor',
        description: `Tahmini alıcı: ${result.estimated_recipients?.toLocaleString('tr-TR') ?? 0} kişi`,
      });
    } catch {
      toast({ title: 'Hata', description: 'Gönderilemedi.', variant: 'destructive' });
    } finally {
      setSendingId(null);
    }
  };

  const handleEdit = (item: AnnouncementListItem) => {
    setDetailItem(null);
    setEditItem(item);
    setFormOpen(true);
  };

  const handleOpenCreate = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Duyurular</h1>
          <p className="text-sm text-muted-foreground">
            {meta ? `${meta.total.toLocaleString('tr-TR')} duyuru` : 'Yükleniyor...'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Duyuru
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Başlıkta ara..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type filter */}
        <Select
          value={filters.type_id ?? 'all'}
          onValueChange={(v) => handleFilterChange('type_id', v)}
        >
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Tip" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Tipler</SelectItem>
            {types.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority filter */}
        <Select
          value={filters.priority ?? 'all'}
          onValueChange={(v) => handleFilterChange('priority', v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Öncelik" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Öncelikler</SelectItem>
            <SelectItem value="emergency">Acil</SelectItem>
            <SelectItem value="high">Yüksek</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Düşük</SelectItem>
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={filters.status ?? 'all'}
          onValueChange={(v) => handleFilterChange('status', v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="published">Yayında</SelectItem>
            <SelectItem value="draft">Taslak</SelectItem>
            <SelectItem value="scheduled">Zamanlandı</SelectItem>
            <SelectItem value="archived">Arşiv</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Başlık</TableHead>
              <TableHead className="w-[120px]">Tip</TableHead>
              <TableHead className="w-[100px]">Öncelik</TableHead>
              <TableHead className="w-[110px]">Durum</TableHead>
              <TableHead className="w-[120px]">Hedef</TableHead>
              <TableHead className="w-[60px] text-center">Görüntü</TableHead>
              <TableHead className="w-[130px]">Tarih</TableHead>
              <TableHead className="w-[130px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-16 text-center text-muted-foreground">
                  Duyuru bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              announcements
                .filter((a) =>
                  search
                    ? a.title.toLowerCase().includes(search.toLowerCase())
                    : true,
                )
                .map((item) => {
                  const TargetIcon = TARGET_ICONS[item.target_type];
                  const isSending = sendingId === item.id;

                  return (
                    <TableRow key={item.id} className="group">
                      {/* Title */}
                      <TableCell>
                        <button
                          type="button"
                          className="text-left text-sm font-medium hover:text-primary hover:underline line-clamp-2"
                          onClick={() => setDetailItem(item)}
                        >
                          {item.title}
                        </button>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        {item.type ? (
                          <div className="flex items-center gap-1.5">
                            {item.type.color && (
                              <span
                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: item.type.color }}
                              />
                            )}
                            <span className="text-sm truncate">{item.type.name}</span>
                          </div>
                        ) : '—'}
                      </TableCell>

                      {/* Priority */}
                      <TableCell>
                        <PriorityBadge priority={item.priority} />
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>

                      {/* Target */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <TargetIcon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{TARGET_LABELS[item.target_type]}</span>
                        </div>
                      </TableCell>

                      {/* Views */}
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {item.view_count.toLocaleString('tr-TR')}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(item.created_at), 'dd MMM yy', { locale: tr })}
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
                                onClick={() => setDetailItem(item)}
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
                                onClick={() => handleEdit(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Düzenle</TooltipContent>
                          </Tooltip>

                          {item.status !== 'published' && item.status !== 'archived' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-primary"
                                  onClick={() => handleSend(item)}
                                  disabled={isSending}
                                >
                                  {isSending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Send className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Şimdi Gönder</TooltipContent>
                            </Tooltip>
                          )}

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => setDeleteItem(item)}
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
            {((meta.page - 1) * PAGE_SIZE + 1)}–
            {Math.min(meta.page * PAGE_SIZE, meta.total)} / {meta.total}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_prev}
              onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_next}
              onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnnouncementDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={handleEdit}
        onDelete={(item) => { setDetailItem(null); setDeleteItem(item); }}
      />

      {/* Create / Edit Form */}
      <AnnouncementForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditItem(null); }}
        editItem={editItem}
      />

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duyuruyu sil?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteItem?.title}</strong> duyurusu silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
