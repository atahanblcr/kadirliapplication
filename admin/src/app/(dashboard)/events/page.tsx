'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CalendarDays,
  MapPin,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useEvents, useDeleteEvent, useEventCategories } from '@/hooks/use-events';
import { EventFormDialog } from './event-form-dialog';
import { EventDetailModal } from './event-detail-modal';
import type { AdminEvent, EventFilters } from '@/types';

const STATUS_LABELS: Record<string, string> = {
  published: 'Yayında',
  draft: 'Taslak',
  cancelled: 'İptal',
  archived: 'Arşiv',
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  published: 'default',
  draft: 'secondary',
  cancelled: 'destructive',
  archived: 'outline',
};

function formatDate(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFilters>({ page: 1, limit: 20 });
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminEvent | null>(null);
  const [viewing, setViewing] = useState<AdminEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminEvent | null>(null);

  const { data, isLoading, isFetching } = useEvents(filters);
  const { data: categories = [] } = useEventCategories();
  const deleteMutation = useDeleteEvent();

  const today = new Date().toISOString().slice(0, 10);
  const events = data?.events ?? [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
  };

  const handleFilterChange = (key: keyof EventFilters, value: unknown) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast({ title: `"${deleteTarget.title}" silindi.` });
      setDeleteTarget(null);
    } catch {
      toast({ title: 'Hata', description: 'Etkinlik silinemedi.', variant: 'destructive' });
    }
  };

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (event: AdminEvent) => { setEditing(event); setFormOpen(true); };

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Etkinlikler</h1>
          <p className="text-sm text-muted-foreground">
            Etkinlik yönetimi · şehir içi ve şehir dışı
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Etkinlik
        </Button>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Başlık, mekan veya organizatör..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* Kategori */}
        <Select
          value={filters.category_id ?? 'all'}
          onValueChange={(v) => handleFilterChange('category_id', v === 'all' ? undefined : v)}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Şehir İçi / Dışı */}
        <Select
          value={
            filters.is_local === undefined ? 'all' : filters.is_local ? 'local' : 'external'
          }
          onValueChange={(v) =>
            handleFilterChange(
              'is_local',
              v === 'all' ? undefined : v === 'local',
            )
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Kapsam" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Etkinlikler</SelectItem>
            <SelectItem value="local">Şehir İçi</SelectItem>
            <SelectItem value="external">Şehir Dışı</SelectItem>
          </SelectContent>
        </Select>

        {/* Durum */}
        <Select
          value={filters.status ?? 'all'}
          onValueChange={(v) => handleFilterChange('status', v === 'all' ? undefined : v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="published">Yayında</SelectItem>
            <SelectItem value="draft">Taslak</SelectItem>
            <SelectItem value="cancelled">İptal</SelectItem>
            <SelectItem value="archived">Arşiv</SelectItem>
          </SelectContent>
        </Select>

        {/* Tarih aralığı */}
        <Input
          type="date"
          className="w-[150px]"
          value={filters.start_date ?? ''}
          onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
          title="Başlangıç tarihi"
        />
        <Input
          type="date"
          className="w-[150px]"
          value={filters.end_date ?? ''}
          onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
          title="Bitiş tarihi"
        />
      </div>

      {/* Tablo */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tarih & Saat</TableHead>
              <TableHead>Konum</TableHead>
              <TableHead>Kapasite</TableHead>
              <TableHead className="w-[110px]">Durum</TableHead>
              <TableHead className="w-[110px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
                  <CalendarDays className="mx-auto mb-3 h-10 w-10 opacity-30" />
                  <p>Etkinlik bulunamadı.</p>
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => {
                const isPast = event.event_date < today;
                return (
                  <TableRow
                    key={event.id}
                    className={cn(isPast && 'opacity-50')}
                  >
                    {/* Başlık */}
                    <TableCell>
                      <div>
                        <p className="font-medium leading-snug">{event.title}</p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <Badge
                            variant={event.is_local ? 'secondary' : 'outline'}
                            className="h-4 px-1.5 text-[10px]"
                          >
                            {event.is_local ? 'Şehir İçi' : `Şehir Dışı${event.city ? ` · ${event.city}` : ''}`}
                          </Badge>
                          {isPast && (
                            <span className="text-[10px] text-muted-foreground">geçmiş</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Kategori */}
                    <TableCell className="text-sm text-muted-foreground">
                      {event.category?.name ?? '—'}
                    </TableCell>

                    {/* Tarih & Saat */}
                    <TableCell>
                      <div className="flex items-start gap-1.5">
                        <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{formatDate(event.event_date)}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.event_time.slice(0, 5)}
                            {event.duration_minutes
                              ? ` · ${event.duration_minutes}dk`
                              : ''}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Konum */}
                    <TableCell>
                      {event.venue_name || event.venue_address ? (
                        <div className="flex items-start gap-1.5">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <p className="text-sm leading-snug">
                            {event.venue_name ?? event.venue_address}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Kapasite */}
                    <TableCell className="text-sm">
                      {event.capacity ? (
                        <span>{event.capacity.toLocaleString('tr-TR')}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Durum */}
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[event.status]}>
                        {STATUS_LABELS[event.status]}
                      </Badge>
                    </TableCell>

                    {/* İşlemler */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewing(event)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Detay</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => openEdit(event)}>
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
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(event)}
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
            Toplam {meta.total} etkinlik · Sayfa {meta.page}/{meta.total_pages}
            {isFetching && <span className="ml-2 text-xs">yükleniyor...</span>}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              disabled={meta.page <= 1 || isFetching}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              disabled={meta.page >= meta.total_pages || isFetching}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}

      {/* Form Dialog */}
      <EventFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        editing={editing}
      />

      {/* Detail Modal */}
      <EventDetailModal
        event={viewing}
        open={!!viewing}
        onClose={() => setViewing(null)}
        onEdit={openEdit}
      />

      {/* Silme Onayı */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etkinliği Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.title}</strong> etkinliği silinecek. Bu işlem geri alınamaz.
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
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
