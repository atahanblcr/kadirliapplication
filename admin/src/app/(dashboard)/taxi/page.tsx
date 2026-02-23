'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Phone,
  MessageCircle,
  Pencil,
  Trash2,
  Loader2,
  Car,
  RefreshCw,
  CheckCircle,
  XCircle,
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
import { toast } from '@/hooks/use-toast';
import { useTaxiDrivers, useDeleteTaxiDriver } from '@/hooks/use-taxi';
import { TaxiFormDialog } from './taxi-form-dialog';
import type { TaxiDriver, TaxiFilters } from '@/types';

export default function TaxiPage() {
  const [filters, setFilters] = useState<TaxiFilters>({
    page: 1,
    limit: 20,
  });
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TaxiDriver | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaxiDriver | null>(null);

  const { data, isLoading, isFetching, refetch } = useTaxiDrivers(filters);
  const deleteMutation = useDeleteTaxiDriver();

  const drivers = data?.drivers ?? [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
  };

  const handleFilterChange = (key: keyof TaxiFilters, value: unknown) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast({ title: `"${deleteTarget.name}" silindi.` });
      setDeleteTarget(null);
    } catch {
      toast({
        title: 'Hata',
        description: 'Sürücü silinemedi.',
        variant: 'destructive',
      });
    }
  };

  const openEdit = (driver: TaxiDriver) => {
    setEditing(driver);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Taksi Sürücüleri</h1>
          <p className="text-sm text-muted-foreground">
            Liste her yenilemede rastgele sıralanır — adil dağılım sağlar
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Sürücü
        </Button>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ad, telefon veya plaka ara..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <Select
          value={
            filters.is_active === undefined
              ? 'all'
              : filters.is_active
                ? 'active'
                : 'inactive'
          }
          onValueChange={(v) =>
            handleFilterChange(
              'is_active',
              v === 'all' ? undefined : v === 'active',
            )
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Pasif</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            filters.is_verified === undefined
              ? 'all'
              : filters.is_verified
                ? 'verified'
                : 'unverified'
          }
          onValueChange={(v) =>
            handleFilterChange(
              'is_verified',
              v === 'all' ? undefined : v === 'verified',
            )
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Doğrulama" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Sürücüler</SelectItem>
            <SelectItem value="verified">Doğrulanmış</SelectItem>
            <SelectItem value="unverified">Doğrulanmamış</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          <span className="ml-2 hidden sm:inline">Yenile</span>
        </Button>
      </div>

      {/* Tablo */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Plaka</TableHead>
              <TableHead>Araç</TableHead>
              <TableHead>Aramalar</TableHead>
              <TableHead className="w-[110px]">Durum</TableHead>
              <TableHead className="w-[100px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : drivers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-16 text-center text-muted-foreground"
                >
                  <Car className="mx-auto mb-3 h-10 w-10 opacity-30" />
                  <p>Henüz taksi sürücüsü eklenmemiş.</p>
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver) => (
                <TableRow key={driver.id}>
                  {/* Ad */}
                  <TableCell className="font-medium">{driver.name}</TableCell>

                  {/* Telefon */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{driver.phone}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={`tel:${driver.phone}`}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>Ara</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={`https://wa.me/90${driver.phone.replace(/^0/, '').replace(/\s/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-green-600"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>WhatsApp</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>

                  {/* Plaka */}
                  <TableCell>
                    {driver.plaka ? (
                      <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold uppercase">
                        {driver.plaka}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Araç */}
                  <TableCell className="text-sm text-muted-foreground">
                    {driver.vehicle_info ?? '—'}
                  </TableCell>

                  {/* Aramalar */}
                  <TableCell className="text-sm">
                    <span className="font-medium">{driver.total_calls}</span>
                    <span className="ml-1 text-xs text-muted-foreground">arama</span>
                  </TableCell>

                  {/* Durum */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {driver.is_verified ? (
                        <Badge
                          variant="default"
                          className="w-fit bg-green-600 text-xs"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Doğrulandı
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="w-fit text-xs">
                          <XCircle className="mr-1 h-3 w-3" />
                          Bekliyor
                        </Badge>
                      )}
                      {!driver.is_active && (
                        <Badge
                          variant="outline"
                          className="w-fit text-xs text-muted-foreground"
                        >
                          Pasif
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* İşlemler */}
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(driver)}
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
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(driver)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sil</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Toplam {meta.total} sürücü · Sayfa {meta.page}/{meta.total_pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))
              }
              disabled={meta.page <= 1 || isFetching}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))
              }
              disabled={meta.page >= meta.total_pages || isFetching}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}

      {/* Form Dialog */}
      <TaxiFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        editing={editing}
      />

      {/* Silme Onay Dialogu */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sürücüyü Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> adlı sürücü silinecek. Bu
              işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
