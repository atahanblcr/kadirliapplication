'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { IntercityRoute } from '@/types';
import { useCreateIntercityRoute, useUpdateIntercityRoute } from '@/hooks/use-intercity';

const TURKISH_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis',
  'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize',
  'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Şırnak', 'Sivas', 'Tekirdağ',
  'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
];

const AMENITY_OPTIONS = ['WiFi', 'Klima', 'TV', 'Tuvalet', 'İkram', 'Müzik Sistemi'];

interface FormState {
  company_name: string;
  from_city: string;
  to_city: string;
  duration_minutes: string;
  price: string;
  contact_phone: string;
  contact_website: string;
  amenities: string[];
  is_active: boolean;
}

interface IntercityFormProps {
  open: boolean;
  onClose: () => void;
  editRoute?: IntercityRoute | null;
}

export function IntercityForm({ open, onClose, editRoute }: IntercityFormProps) {
  const [form, setForm] = useState<FormState>({
    company_name: '',
    from_city: 'Kadirli',
    to_city: '',
    duration_minutes: '',
    price: '',
    contact_phone: '',
    contact_website: '',
    amenities: [],
    is_active: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const createRoute = useCreateIntercityRoute();
  const updateRoute = useUpdateIntercityRoute();

  useEffect(() => {
    if (editRoute) {
      setForm({
        company_name: editRoute.company_name ?? '',
        from_city: editRoute.from_city ?? 'Kadirli',
        to_city: editRoute.to_city ?? '',
        duration_minutes: String(editRoute.duration_minutes ?? ''),
        price: String(editRoute.price ?? ''),
        contact_phone: editRoute.contact_phone ?? '',
        contact_website: editRoute.contact_website ?? '',
        amenities: editRoute.amenities ?? [],
        is_active: editRoute.is_active,
      });
    } else {
      setForm({
        company_name: '',
        from_city: 'Kadirli',
        to_city: '',
        duration_minutes: '',
        price: '',
        contact_phone: '',
        contact_website: '',
        amenities: [],
        is_active: true,
      });
    }
    setErrors({});
  }, [editRoute, open]);

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};

    if (!form.company_name.trim() || form.company_name.trim().length < 2) {
      errs.company_name = 'Firma adı en az 2 karakter olmalı';
    }
    if (!form.from_city) errs.from_city = 'Nereden şehri seçin';
    if (!form.to_city) errs.to_city = 'Nereye şehri seçin';
    if (form.from_city && form.to_city && form.from_city === form.to_city) {
      errs.to_city = 'Nereden ve Nereye aynı olamaz';
    }

    const dur = parseInt(form.duration_minutes);
    if (!form.duration_minutes || isNaN(dur) || dur < 30 || dur > 1440) {
      errs.duration_minutes = 'Süre 30–1440 dakika arasında olmalı';
    }

    const price = parseFloat(form.price);
    if (!form.price || isNaN(price) || price < 0) {
      errs.price = 'Geçerli bir fiyat girin';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const payload = {
      company_name: form.company_name.trim(),
      from_city: form.from_city,
      to_city: form.to_city,
      duration_minutes: parseInt(form.duration_minutes),
      price: parseFloat(form.price),
      contact_phone: form.contact_phone.trim() || undefined,
      contact_website: form.contact_website.trim() || undefined,
      amenities: form.amenities,
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

  function toggleAmenity(amenity: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  const isLoading = createRoute.isPending || updateRoute.isPending;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editRoute ? 'Hat Düzenle' : 'Yeni Hat Ekle'}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Firma Adı */}
          <div className="space-y-1">
            <Label htmlFor="company_name">Firma Adı *</Label>
            <Input
              id="company_name"
              placeholder="Metro Turizm"
              value={form.company_name}
              onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))}
            />
            {errors.company_name && (
              <p className="text-xs text-destructive">{errors.company_name}</p>
            )}
          </div>

          {/* Nereden / Nereye */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Nereden *</Label>
              <Select
                value={form.from_city}
                onValueChange={(v) => setForm((p) => ({ ...p, from_city: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Şehir seç" />
                </SelectTrigger>
                <SelectContent>
                  {TURKISH_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.from_city && (
                <p className="text-xs text-destructive">{errors.from_city}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Nereye *</Label>
              <Select
                value={form.to_city}
                onValueChange={(v) => setForm((p) => ({ ...p, to_city: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Şehir seç" />
                </SelectTrigger>
                <SelectContent>
                  {TURKISH_CITIES.filter((c) => c !== form.from_city).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.to_city && (
                <p className="text-xs text-destructive">{errors.to_city}</p>
              )}
            </div>
          </div>

          {/* Süre / Fiyat */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="duration_minutes">Süre (dakika) *</Label>
              <Input
                id="duration_minutes"
                type="number"
                placeholder="390"
                min={30}
                max={1440}
                value={form.duration_minutes}
                onChange={(e) => setForm((p) => ({ ...p, duration_minutes: e.target.value }))}
              />
              {form.duration_minutes && !isNaN(parseInt(form.duration_minutes)) && (
                <p className="text-xs text-muted-foreground">
                  {formatDuration(parseInt(form.duration_minutes))}
                </p>
              )}
              {errors.duration_minutes && (
                <p className="text-xs text-destructive">{errors.duration_minutes}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="price">Fiyat (₺) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="450"
                min={0}
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price}</p>
              )}
            </div>
          </div>

          {/* İletişim */}
          <div className="space-y-1">
            <Label htmlFor="contact_phone">İletişim Telefonu</Label>
            <Input
              id="contact_phone"
              placeholder="0212 XXX XX XX"
              value={form.contact_phone}
              onChange={(e) => setForm((p) => ({ ...p, contact_phone: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="contact_website">Web Sitesi</Label>
            <Input
              id="contact_website"
              placeholder="https://..."
              value={form.contact_website}
              onChange={(e) => setForm((p) => ({ ...p, contact_website: e.target.value }))}
            />
          </div>

          {/* Özellikler */}
          <div className="space-y-2">
            <Label>Özellikler</Label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const selected = form.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
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

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} dakika`;
  if (m === 0) return `${h} saat`;
  return `${h} saat ${m} dakika`;
}
