'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCreatePharmacy, useUpdatePharmacy } from '@/hooks/use-pharmacy';
import { toast } from '@/hooks/use-toast';
import type { Pharmacy } from '@/types';

interface FormState {
  name: string;
  phone: string;
  address: string;
  working_hours: string;
  pharmacist_name: string;
  latitude: string;
  longitude: string;
  is_active: boolean;
}

const EMPTY: FormState = {
  name: '', phone: '', address: '', working_hours: '',
  pharmacist_name: '', latitude: '', longitude: '', is_active: true,
};

interface PharmacyFormProps {
  open: boolean;
  onClose: () => void;
  editing?: Pharmacy | null;
}

export function PharmacyForm({ open, onClose, editing }: PharmacyFormProps) {
  const [form, setForm]     = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const createMutation = useCreatePharmacy();
  const updateMutation = useUpdatePharmacy();

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(
        editing
          ? {
              name:            editing.name,
              phone:           editing.phone ?? '',
              address:         editing.address,
              working_hours:   editing.working_hours ?? '',
              pharmacist_name: editing.pharmacist_name ?? '',
              latitude:        editing.latitude != null ? String(editing.latitude) : '',
              longitude:       editing.longitude != null ? String(editing.longitude) : '',
              is_active:       editing.is_active,
            }
          : EMPTY,
      );
    }
  }, [open, editing]);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim())    errs.name    = 'Ad zorunlu';
    if (!form.address.trim()) errs.address = 'Adres zorunlu';
    if (form.latitude  && isNaN(Number(form.latitude)))  errs.latitude  = 'Geçerli sayı girin';
    if (form.longitude && isNaN(Number(form.longitude))) errs.longitude = 'Geçerli sayı girin';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name:            form.name.trim(),
      address:         form.address.trim(),
      phone:           form.phone.trim()            || undefined,
      working_hours:   form.working_hours.trim()    || undefined,
      pharmacist_name: form.pharmacist_name.trim()  || undefined,
      latitude:        form.latitude  ? Number(form.latitude)  : undefined,
      longitude:       form.longitude ? Number(form.longitude) : undefined,
      is_active:       form.is_active,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, ...payload });
        toast({ title: `"${form.name}" güncellendi.` });
      } else {
        await createMutation.mutateAsync(payload as Omit<Pharmacy, 'id' | 'created_at'>);
        toast({ title: `"${form.name}" eklendi.` });
      }
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'İşlem başarısız.', variant: 'destructive' });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editing ? 'Eczane Düzenle' : 'Yeni Eczane Ekle'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="ph-name">Eczane Adı *</Label>
            <Input
              id="ph-name"
              placeholder="Merkez Eczanesi"
              value={form.name}
              onChange={set('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="ph-phone">Telefon</Label>
            <Input
              id="ph-phone"
              placeholder="03283211234"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="ph-address">Adres *</Label>
            <Input
              id="ph-address"
              placeholder="Atatürk Cad. No:45, Merkez"
              value={form.address}
              onChange={set('address')}
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          {/* Working hours */}
          <div className="space-y-1.5">
            <Label htmlFor="ph-hours">Çalışma Saatleri</Label>
            <Input
              id="ph-hours"
              placeholder="08:30-19:00"
              value={form.working_hours}
              onChange={set('working_hours')}
            />
          </div>

          {/* Pharmacist */}
          <div className="space-y-1.5">
            <Label htmlFor="ph-pharmacist">Eczacı Adı</Label>
            <Input
              id="ph-pharmacist"
              placeholder="Ecz. Ali YILMAZ"
              value={form.pharmacist_name}
              onChange={set('pharmacist_name')}
            />
          </div>

          {/* Lat / Lon */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ph-lat">Enlem</Label>
              <Input
                id="ph-lat"
                placeholder="37.3667"
                type="number"
                step="any"
                value={form.latitude}
                onChange={set('latitude')}
              />
              {errors.latitude && <p className="text-xs text-destructive">{errors.latitude}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ph-lon">Boylam</Label>
              <Input
                id="ph-lon"
                placeholder="36.1000"
                type="number"
                step="any"
                value={form.longitude}
                onChange={set('longitude')}
              />
              {errors.longitude && <p className="text-xs text-destructive">{errors.longitude}</p>}
            </div>
          </div>

          {/* Active switch */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="ph-active" className="cursor-pointer">Aktif</Label>
            <Switch
              id="ph-active"
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
