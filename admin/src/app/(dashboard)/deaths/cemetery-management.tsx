'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '@/components/ui/sheet';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import {
  useCemeteries, useCreateCemetery, useUpdateCemetery, useDeleteCemetery,
} from '@/hooks/use-deaths';
import type { Cemetery } from '@/types';

// ─── Form ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  is_active: boolean;
}

const EMPTY: FormState = {
  name: '', address: '', latitude: '', longitude: '', is_active: true,
};

function CemeteryForm({
  open, onClose, editing,
}: {
  open: boolean;
  onClose: () => void;
  editing?: Cemetery | null;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const createMutation = useCreateCemetery();
  const updateMutation = useUpdateCemetery();

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(
        editing
          ? {
              name: editing.name,
              address: editing.address ?? '',
              latitude: editing.latitude != null ? String(editing.latitude) : '',
              longitude: editing.longitude != null ? String(editing.longitude) : '',
              is_active: editing.is_active ?? true,
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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      address: form.address.trim() || undefined,
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
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
          <SheetTitle>{editing ? 'Mezarlık Düzenle' : 'Yeni Mezarlık Ekle'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-1.5">
            <Label htmlFor="cem-name">Mezarlık Adı *</Label>
            <Input
              id="cem-name"
              placeholder="Şehir Mezarlığı"
              value={form.name}
              onChange={set('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cem-address">Adres</Label>
            <Input
              id="cem-address"
              placeholder="Kadirli Merkez"
              value={form.address}
              onChange={set('address')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cem-lat">Enlem</Label>
              <Input
                id="cem-lat"
                placeholder="37.3667"
                type="number"
                step="any"
                value={form.latitude}
                onChange={set('latitude')}
              />
              {errors.latitude && <p className="text-xs text-destructive">{errors.latitude}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cem-lon">Boylam</Label>
              <Input
                id="cem-lon"
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
            <Label htmlFor="cem-active" className="cursor-pointer">Aktif</Label>
            <Switch
              id="cem-active"
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

// ─── Management Table ────────────────────────────────────────────────────────

export function CemeteryManagement() {
  const { data: cemeteries, isLoading } = useCemeteries();
  const deleteMutation = useDeleteCemetery();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Cemetery | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Cemetery | null>(null);

  const handleEdit = (item: Cemetery) => {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Vefat ilanlarında kullanılan mezarlıkları yönetin.
        </p>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Mezarlık
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Adres</TableHead>
              <TableHead>Konum</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-[90px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : !cemeteries?.length ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  Henüz mezarlık eklenmemiş.
                </TableCell>
              </TableRow>
            ) : (
              cemeteries.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-sm">{item.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.address ?? '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.latitude && item.longitude
                      ? `${Number(item.latitude).toFixed(4)}, ${Number(item.longitude).toFixed(4)}`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_active !== false ? 'default' : 'secondary'}>
                      {item.is_active !== false ? 'Aktif' : 'Pasif'}
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

      <CemeteryForm open={formOpen} onClose={handleCloseForm} editing={editing} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mezarlığı Sil</AlertDialogTitle>
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
