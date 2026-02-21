'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { IntracityRoute } from '@/types';
import { useCreateIntracityRoute, useUpdateIntracityRoute } from '@/hooks/use-intracity';

interface FormState {
  line_number: string;
  name: string;
  color: string;
  first_departure: string;
  last_departure: string;
  frequency_minutes: string;
  fare: string;
  is_active: boolean;
}

const COLOR_PRESETS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4',
];

interface IntracityFormProps {
  open: boolean;
  onClose: () => void;
  editRoute?: IntracityRoute | null;
}

export function IntracityForm({ open, onClose, editRoute }: IntracityFormProps) {
  const [form, setForm] = useState<FormState>({
    line_number: '',
    name: '',
    color: '',
    first_departure: '',
    last_departure: '',
    frequency_minutes: '',
    fare: '',
    is_active: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const createRoute = useCreateIntracityRoute();
  const updateRoute = useUpdateIntracityRoute();

  useEffect(() => {
    if (editRoute) {
      setForm({
        line_number: editRoute.line_number ?? '',
        name: editRoute.name ?? '',
        color: editRoute.color ?? '',
        first_departure: editRoute.first_departure?.slice(0, 5) ?? '',
        last_departure: editRoute.last_departure?.slice(0, 5) ?? '',
        frequency_minutes: String(editRoute.frequency_minutes ?? ''),
        fare: String(editRoute.fare ?? ''),
        is_active: editRoute.is_active,
      });
    } else {
      setForm({
        line_number: '',
        name: '',
        color: '',
        first_departure: '',
        last_departure: '',
        frequency_minutes: '',
        fare: '',
        is_active: true,
      });
    }
    setErrors({});
  }, [editRoute, open]);

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};

    if (!form.line_number.trim()) errs.line_number = 'Hat numarası gerekli';
    if (!form.name.trim()) errs.name = 'Hat adı gerekli';

    if (form.color && !/^#[0-9A-Fa-f]{6}$/.test(form.color)) {
      errs.color = 'Geçerli bir hex renk kodu girin (ör: #FF5733)';
    }

    if (!form.first_departure) errs.first_departure = 'İlk sefer saati gerekli';
    if (!form.last_departure) errs.last_departure = 'Son sefer saati gerekli';

    const freq = parseInt(form.frequency_minutes);
    if (!form.frequency_minutes || isNaN(freq) || freq < 1 || freq > 120) {
      errs.frequency_minutes = 'Sıklık 1–120 dakika arasında olmalı';
    }

    const fare = parseFloat(form.fare);
    if (!form.fare || isNaN(fare) || fare < 0) {
      errs.fare = 'Geçerli bir ücret girin';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const payload = {
      line_number: form.line_number.trim(),
      name: form.name.trim(),
      color: form.color.trim() || undefined,
      first_departure: form.first_departure,
      last_departure: form.last_departure,
      frequency_minutes: parseInt(form.frequency_minutes),
      fare: parseFloat(form.fare),
      is_active: form.is_active,
    };

    try {
      if (editRoute) {
        await updateRoute.mutateAsync({ id: editRoute.id, ...payload });
        toast.success('Hat güncellendi');
      } else {
        await createRoute.mutateAsync(payload as any);
        toast.success('Hat oluşturuldu');
      }
      onClose();
    } catch {
      toast.error('İşlem başarısız');
    }
  }

  const isLoading = createRoute.isPending || updateRoute.isPending;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[440px] sm:max-w-[440px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editRoute ? 'Hat Düzenle' : 'Yeni Hat Ekle'}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Hat No / Hat Adı */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="line_number">Hat No *</Label>
              <Input
                id="line_number"
                placeholder="14"
                value={form.line_number}
                onChange={(e) => setForm((p) => ({ ...p, line_number: e.target.value }))}
              />
              {errors.line_number && (
                <p className="text-xs text-destructive">{errors.line_number}</p>
              )}
            </div>
            <div className="col-span-2 space-y-1">
              <Label htmlFor="name">Hat Adı *</Label>
              <Input
                id="name"
                placeholder="Merkez - Havaalanı"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
          </div>

          {/* Renk */}
          <div className="space-y-2">
            <Label htmlFor="color">Renk (Harita için)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="color"
                placeholder="#3B82F6"
                value={form.color}
                onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                className="w-32"
              />
              {form.color && /^#[0-9A-Fa-f]{6}$/.test(form.color) && (
                <div
                  className="h-8 w-8 rounded border"
                  style={{ backgroundColor: form.color }}
                />
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    form.color === c ? 'border-foreground scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setForm((p) => ({ ...p, color: c }))}
                />
              ))}
            </div>
            {errors.color && <p className="text-xs text-destructive">{errors.color}</p>}
          </div>

          {/* İlk Sefer / Son Sefer */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="first_departure">İlk Sefer *</Label>
              <Input
                id="first_departure"
                type="time"
                value={form.first_departure}
                onChange={(e) => setForm((p) => ({ ...p, first_departure: e.target.value }))}
              />
              {errors.first_departure && (
                <p className="text-xs text-destructive">{errors.first_departure}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="last_departure">Son Sefer *</Label>
              <Input
                id="last_departure"
                type="time"
                value={form.last_departure}
                onChange={(e) => setForm((p) => ({ ...p, last_departure: e.target.value }))}
              />
              {errors.last_departure && (
                <p className="text-xs text-destructive">{errors.last_departure}</p>
              )}
            </div>
          </div>

          {/* Sıklık / Ücret */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="frequency_minutes">Sıklık (dakika) *</Label>
              <Input
                id="frequency_minutes"
                type="number"
                placeholder="15"
                min={1}
                max={120}
                value={form.frequency_minutes}
                onChange={(e) => setForm((p) => ({ ...p, frequency_minutes: e.target.value }))}
              />
              {errors.frequency_minutes && (
                <p className="text-xs text-destructive">{errors.frequency_minutes}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="fare">Ücret (₺) *</Label>
              <Input
                id="fare"
                type="number"
                placeholder="7.50"
                step="0.5"
                min={0}
                value={form.fare}
                onChange={(e) => setForm((p) => ({ ...p, fare: e.target.value }))}
              />
              {errors.fare && <p className="text-xs text-destructive">{errors.fare}</p>}
            </div>
          </div>

          {/* Durum */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Label>Durum</Label>
              <p className="text-xs text-muted-foreground">Aktif/Pasif</p>
            </div>
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
            />
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editRoute ? 'Güncelle' : 'Oluştur'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
