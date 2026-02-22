'use client';

import { useState, useEffect } from 'react';
import {
  Search, Plus, Pencil, Trash2, Loader2, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useNeighborhoods, useCreateNeighborhood, useUpdateNeighborhood, useDeleteNeighborhood,
  type Neighborhood, type CreateNeighborhoodDto,
} from '@/hooks/use-neighborhoods';

const PAGE_SIZE = 50;

// ─── Form ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  type: 'neighborhood' | 'village';
  population: string;
  latitude: string;
  longitude: string;
  display_order: string;
  is_active: boolean;
}

const EMPTY: FormState = {
  name: '', type: 'neighborhood', population: '',
  latitude: '', longitude: '', display_order: '0', is_active: true,
};

function NeighborhoodForm({
  open, onClose, editing,
}: {
  open: boolean;
  onClose: () => void;
  editing?: Neighborhood | null;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const createMutation = useCreateNeighborhood();
  const updateMutation = useUpdateNeighborhood();

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(
        editing
          ? {
              name: editing.name,
              type: editing.type,
              population: editing.population != null ? String(editing.population) : '',
              latitude: editing.latitude != null ? String(editing.latitude) : '',
              longitude: editing.longitude != null ? String(editing.longitude) : '',
              display_order: String(editing.display_order ?? 0),
              is_active: editing.is_active,
            }
          : EMPTY,
      );
    }
  }, [open, editing]);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errs.name = 'Ad zorunlu';
    if (form.latitude && isNaN(Number(form.latitude))) errs.latitude = 'Geçerli sayı girin';
    if (form.longitude && isNaN(Number(form.longitude))) errs.longitude = 'Geçerli sayı girin';
    if (form.population && isNaN(Number(form.population))) errs.population = 'Geçerli sayı girin';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateNeighborhoodDto = {
      name: form.name.trim(),
      type: form.type,
      population: form.population ? Number(form.population) : undefined,
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
      display_order: form.display_order ? Number(form.display_order) : 0,
      is_active: form.is_active,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, dto: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch {
      // toast handled by hook
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editing ? 'Mahalle Düzenle' : 'Yeni Mahalle Ekle'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-1.5">
            <Label htmlFor="nb-name">Mahalle Adı *</Label>
            <Input
              id="nb-name"
              placeholder="Merkez"
              value={form.name}
              onChange={set('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Tür *</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm((f) => ({ ...f, type: v as 'neighborhood' | 'village' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neighborhood">Mahalle</SelectItem>
                <SelectItem value="village">Köy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nb-pop">Nüfus</Label>
              <Input
                id="nb-pop"
                placeholder="5000"
                type="number"
                value={form.population}
                onChange={set('population')}
              />
              {errors.population && <p className="text-xs text-destructive">{errors.population}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nb-order">Sıra No</Label>
              <Input
                id="nb-order"
                placeholder="0"
                type="number"
                value={form.display_order}
                onChange={set('display_order')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nb-lat">Enlem</Label>
              <Input
                id="nb-lat"
                placeholder="37.3667"
                type="number"
                step="any"
                value={form.latitude}
                onChange={set('latitude')}
              />
              {errors.latitude && <p className="text-xs text-destructive">{errors.latitude}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nb-lon">Boylam</Label>
              <Input
                id="nb-lon"
                placeholder="36.1000"
                type="number"
                step="any"
                value={form.longitude}
                onChange={set('longitude')}
              />
              {errors.longitude && <p className="text-xs text-destructive">{errors.longitude}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="nb-active" className="cursor-pointer">Aktif</Label>
            <Switch
              id="nb-active"
              checked={form.is_active}
              onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
            />
          </div>

          <SheetFooter className="pt-4 gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? 'Kaydet' : 'Ekle'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function NeighborhoodsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Neighborhood | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Neighborhood | null>(null);

  const { data, isLoading, isFetching, refetch } = useNeighborhoods({
    search: search || undefined,
    type: typeFilter !== 'all' ? (typeFilter as 'neighborhood' | 'village') : undefined,
    page,
    limit: PAGE_SIZE,
  });

  const deleteMutation = useDeleteNeighborhood();

  const items = data?.items ?? [];
  const meta = data?.meta;

  const handleEdit = (item: Neighborhood) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditing(null);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mahalleler</h1>
          <p className="text-sm text-muted-foreground">
            Kadirli mahalle ve köylerini yönetin
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Mahalle
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Mahalle adı ara..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tür" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="neighborhood">Mahalle</SelectItem>
            <SelectItem value="village">Köy</SelectItem>
          </SelectContent>
        </Select>
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
              <TableHead>Ad</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead>Nüfus</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-[90px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-muted-foreground">
                  {search ? 'Arama sonucu bulunamadı.' : 'Henüz mahalle eklenmemiş.'}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-sm">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant={item.type === 'neighborhood' ? 'default' : 'outline'}>
                      {item.type === 'neighborhood' ? 'Mahalle' : 'Köy'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.population != null ? item.population.toLocaleString('tr-TR') : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.display_order}</TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Düzenle</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(item)}>
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
            {((page - 1) * PAGE_SIZE + 1)}–{Math.min(page * PAGE_SIZE, meta.total)} / {meta.total.toLocaleString('tr-TR')} kayıt
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

      {/* Form */}
      <NeighborhoodForm open={formOpen} onClose={handleCloseForm} editing={editing} />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mahalleyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> silinecek. Bu işlem geri alınamaz.
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
