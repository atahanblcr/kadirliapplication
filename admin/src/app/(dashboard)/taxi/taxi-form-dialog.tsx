'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useCreateTaxiDriver, useUpdateTaxiDriver } from '@/hooks/use-taxi';
import type { TaxiDriver } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  editing: TaxiDriver | null;
}

export function TaxiFormDialog({ open, onClose, editing }: Props) {
  const { toast } = useToast();
  const createMutation = useCreateTaxiDriver();
  const updateMutation = useUpdateTaxiDriver();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    plaka: '',
    vehicle_info: '',
    is_active: true,
    is_verified: true,
  });

  // Form'u düzenleme verisine göre doldur
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        phone: editing.phone,
        plaka: editing.plaka ?? '',
        vehicle_info: editing.vehicle_info ?? '',
        is_active: editing.is_active,
        is_verified: editing.is_verified,
      });
    } else {
      setForm({
        name: '',
        phone: '',
        plaka: '',
        vehicle_info: '',
        is_active: true,
        is_verified: true,
      });
    }
  }, [editing, open]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      toast({
        title: 'Hata',
        description: 'Ad Soyad ve Telefon zorunludur.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          name: form.name.trim(),
          phone: form.phone.trim(),
          plaka: form.plaka.trim().toUpperCase() || undefined,
          vehicle_info: form.vehicle_info.trim() || undefined,
          is_active: form.is_active,
          is_verified: form.is_verified,
        });
        toast({ title: `"${form.name}" güncellendi.` });
      } else {
        await createMutation.mutateAsync({
          name: form.name.trim(),
          phone: form.phone.trim(),
          plaka: form.plaka.trim().toUpperCase() || undefined,
          vehicle_info: form.vehicle_info.trim() || undefined,
          is_active: form.is_active,
          is_verified: form.is_verified,
        });
        toast({ title: `"${form.name}" eklendi.` });
      }
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'İşlem başarısız.';
      toast({ title: 'Hata', description: message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Sürücüyü Düzenle' : 'Yeni Taksi Sürücüsü'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ad Soyad */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Ad Soyad <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ahmet Yılmaz"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              disabled={isPending}
            />
          </div>

          {/* Telefon */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              Telefon <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="05XX XXX XX XX"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              disabled={isPending}
            />
          </div>

          {/* Plaka */}
          <div className="space-y-1.5">
            <Label htmlFor="plaka">Plaka</Label>
            <Input
              id="plaka"
              placeholder="01 ABC 123"
              value={form.plaka}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  plaka: e.target.value.toUpperCase(),
                }))
              }
              disabled={isPending}
              className="uppercase"
            />
          </div>

          {/* Araç Bilgisi */}
          <div className="space-y-1.5">
            <Label htmlFor="vehicle_info">Araç Bilgisi</Label>
            <Input
              id="vehicle_info"
              placeholder="Beyaz Fiat Egea"
              value={form.vehicle_info}
              onChange={(e) =>
                setForm((f) => ({ ...f, vehicle_info: e.target.value }))
              }
              disabled={isPending}
            />
          </div>

          {/* Doğrulanmış */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Doğrulanmış</p>
              <p className="text-xs text-muted-foreground">
                Uygulamada görünür olması için doğrulanmış olmalı
              </p>
            </div>
            <Switch
              checked={form.is_verified}
              onCheckedChange={(v) =>
                setForm((f) => ({ ...f, is_verified: v }))
              }
              disabled={isPending}
            />
          </div>

          {/* Aktif */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Aktif</p>
              <p className="text-xs text-muted-foreground">
                Pasif sürücüler aramada görünmez
              </p>
            </div>
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) =>
                setForm((f) => ({ ...f, is_active: v }))
              }
              disabled={isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editing ? 'Kaydet' : 'Ekle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
