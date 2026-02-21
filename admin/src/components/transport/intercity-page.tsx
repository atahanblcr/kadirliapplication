'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { IntercityRoute, IntercityFilters } from '@/types';
import { useIntercityRoutes, useDeleteIntercityRoute } from '@/hooks/use-intercity';
import { IntercityForm, formatDuration } from './intercity-form';
import { IntercityDetailModal } from './intercity-detail-modal';

export function IntercityPage() {
  const [filters, setFilters] = useState<IntercityFilters>({ page: 1, limit: 20 });
  const [searchInput, setSearchInput] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<IntercityRoute | null>(null);
  const [detailRouteId, setDetailRouteId] = useState<string | null>(null);
  const [deletingRoute, setDeletingRoute] = useState<IntercityRoute | null>(null);

  const { data, isLoading, isError } = useIntercityRoutes(filters);
  const deleteRoute = useDeleteIntercityRoute();

  const routes = data?.routes ?? [];
  const meta = data?.meta;

  function handleSearch() {
    setFilters((prev) => ({ ...prev, company_name: searchInput || undefined, page: 1 }));
  }

  function handleFilterChange(key: keyof IntercityFilters, value: any) {
    setFilters((prev) => ({ ...prev, [key]: value === 'all' ? undefined : value, page: 1 }));
  }

  function openCreate() {
    setEditingRoute(null);
    setFormOpen(true);
  }

  function openEdit(route: IntercityRoute) {
    setEditingRoute(route);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deletingRoute) return;
    try {
      await deleteRoute.mutateAsync(deletingRoute.id);
      toast.success('Hat silindi');
    } catch {
      toast.error('Hat silinemedi');
    } finally {
      setDeletingRoute(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Şehirlerarası Otobüsler</h2>
          <p className="text-sm text-muted-foreground">
            {meta ? `${meta.total} hat` : ''}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Hat Ekle
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="Firma ara..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="max-w-64"
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={filters.is_active === undefined ? 'all' : String(filters.is_active)}
          onValueChange={(v) =>
            handleFilterChange('is_active', v === 'all' ? undefined : v === 'true')
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="true">Aktif</SelectItem>
            <SelectItem value="false">Pasif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Firma</TableHead>
              <TableHead>Güzergah</TableHead>
              <TableHead>Süre</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Sefer Sayısı</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Yükleniyor...
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-destructive">
                  Yüklenirken hata oluştu
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && routes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Kayıt bulunamadı
                </TableCell>
              </TableRow>
            )}
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">{route.company_name}</TableCell>
                <TableCell>
                  <span className="text-sm">
                    {route.from_city}{' '}
                    <span className="text-muted-foreground">→</span>{' '}
                    {route.to_city}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDuration(route.duration_minutes)}
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  ₺{Number(route.price).toFixed(0)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{route.schedules?.length ?? 0} sefer</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={route.is_active ? 'default' : 'secondary'}>
                    {route.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setDetailRouteId(route.id)}
                      title="Detay"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => openEdit(route)}
                      title="Düzenle"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeletingRoute(route)}
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {(filters.page! - 1) * filters.limit! + 1}–
            {Math.min(filters.page! * filters.limit!, meta.total)} / {meta.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={!meta.has_prev}
              onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-3 text-sm">
              {filters.page} / {meta.total_pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={!meta.has_next}
              onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Form Sheet */}
      <IntercityForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editRoute={editingRoute}
      />

      {/* Detail Modal */}
      {detailRouteId && (
        <IntercityDetailModal
          open={!!detailRouteId}
          onClose={() => setDetailRouteId(null)}
          routeId={detailRouteId}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingRoute} onOpenChange={(v) => !v && setDeletingRoute(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hattı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deletingRoute?.company_name}</strong> firmasının{' '}
              {deletingRoute?.from_city} → {deletingRoute?.to_city} hattı ve tüm seferleri
              kalıcı olarak silinecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
