'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Check, X } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  useCreateEvent,
  useUpdateEvent,
  useEventCategories,
  useCreateEventCategory,
} from '@/hooks/use-events';
import type { AdminEvent } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  editing: AdminEvent | null;
}

const EMPTY_FORM = {
  title: '',
  description: '',
  category_id: '',
  event_date: '',
  event_time: '',
  duration_minutes: '',
  venue_name: '',
  venue_address: '',
  is_local: true,
  city: '',
  latitude: '',
  longitude: '',
  organizer: '',
  is_free: true,
  ticket_price: '',
  capacity: '',
  website_url: '',
  ticket_url: '',
  status: 'published' as string,
};

export function EventFormDialog({ open, onClose, editing }: Props) {
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const { data: categories = [] } = useEventCategories();
  const createCategoryMutation = useCreateEventCategory();

  const [form, setForm] = useState(EMPTY_FORM);
  const [newCatName, setNewCatName] = useState('');
  const [showCatInput, setShowCatInput] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        description: editing.description ?? '',
        category_id: editing.category_id ?? '',
        event_date: editing.event_date,
        event_time: editing.event_time,
        duration_minutes: editing.duration_minutes?.toString() ?? '',
        venue_name: editing.venue_name ?? '',
        venue_address: editing.venue_address ?? '',
        is_local: editing.is_local,
        city: editing.city ?? '',
        latitude: editing.latitude?.toString() ?? '',
        longitude: editing.longitude?.toString() ?? '',
        organizer: editing.organizer ?? '',
        is_free: editing.is_free,
        ticket_price: editing.ticket_price?.toString() ?? '',
        capacity: editing.capacity?.toString() ?? '',
        website_url: editing.website_url ?? '',
        ticket_url: editing.ticket_url ?? '',
        status: editing.status,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setShowCatInput(false);
    setNewCatName('');
  }, [editing, open]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const cat = await createCategoryMutation.mutateAsync({ name: newCatName.trim() });
      setForm((f) => ({ ...f, category_id: cat.id }));
      setNewCatName('');
      setShowCatInput(false);
      toast({ title: `"${cat.name}" kategorisi eklendi.` });
    } catch {
      toast({ title: 'Hata', description: 'Kategori eklenemedi.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.event_date || !form.event_time) {
      toast({
        title: 'Eksik alan',
        description: 'Başlık, tarih ve saat zorunludur.',
        variant: 'destructive',
      });
      return;
    }

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category_id: form.category_id || undefined,
      event_date: form.event_date,
      event_time: form.event_time,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : undefined,
      venue_name: form.venue_name.trim() || undefined,
      venue_address: form.venue_address.trim() || undefined,
      is_local: form.is_local,
      city: !form.is_local && form.city.trim() ? form.city.trim() : undefined,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      organizer: form.organizer.trim() || undefined,
      is_free: form.is_free,
      ticket_price: !form.is_free && form.ticket_price ? parseFloat(form.ticket_price) : undefined,
      capacity: form.capacity ? parseInt(form.capacity) : undefined,
      website_url: form.website_url.trim() || undefined,
      ticket_url: form.ticket_url.trim() || undefined,
      status: form.status,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, ...payload } as any);
        toast({ title: `"${form.title}" güncellendi.` });
      } else {
        await createMutation.mutateAsync(payload as any);
        toast({ title: `"${form.title}" etkinliği eklendi.` });
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Başlık */}
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Başlık <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Etkinlik başlığı"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              disabled={isPending}
            />
          </div>

          {/* Kategori */}
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <div className="flex gap-2">
              <Select
                value={form.category_id}
                onValueChange={(v) => setForm((f) => ({ ...f, category_id: v }))}
                disabled={isPending}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Kategori seç..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowCatInput((v) => !v)}
                disabled={isPending}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {showCatInput && (
              <div className="flex gap-2">
                <Input
                  placeholder="Yeni kategori adı"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  autoFocus
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleAddCategory}
                  disabled={createCategoryMutation.isPending}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => { setShowCatInput(false); setNewCatName(''); }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Açıklama */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              placeholder="Etkinlik hakkında bilgi..."
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              disabled={isPending}
            />
          </div>

          <Separator />

          {/* Tarih & Saat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="event_date">
                Tarih <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event_date"
                type="date"
                value={form.event_date}
                onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="event_time">
                Saat <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event_time"
                type="time"
                value={form.event_time}
                onChange={(e) => setForm((f) => ({ ...f, event_time: e.target.value }))}
                disabled={isPending}
              />
            </div>
          </div>

          {/* Süre */}
          <div className="space-y-1.5">
            <Label htmlFor="duration">Süre (dakika)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="örn. 120"
              min={0}
              value={form.duration_minutes}
              onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))}
              disabled={isPending}
            />
          </div>

          <Separator />

          {/* Şehir İçi / Dışı */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Şehir İçi Etkinlik</p>
              <p className="text-xs text-muted-foreground">
                Kapalıysa etkinlik Şehir Dışı olarak listelenir ve şehir alanı gerekir
              </p>
            </div>
            <Switch
              checked={form.is_local}
              onCheckedChange={(v) => setForm((f) => ({ ...f, is_local: v }))}
              disabled={isPending}
            />
          </div>

          {/* Şehir (sadece şehir dışı için) */}
          {!form.is_local && (
            <div className="space-y-1.5">
              <Label htmlFor="city">
                Şehir <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="örn. Adana, İstanbul, Ankara"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                disabled={isPending}
              />
            </div>
          )}

          {/* Mekan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="venue_name">Mekan Adı</Label>
              <Input
                id="venue_name"
                placeholder="örn. Atatürk Kültür Merkezi"
                value={form.venue_name}
                onChange={(e) => setForm((f) => ({ ...f, venue_name: e.target.value }))}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="organizer">Organizatör</Label>
              <Input
                id="organizer"
                placeholder="Düzenleyen kurum/kişi"
                value={form.organizer}
                onChange={(e) => setForm((f) => ({ ...f, organizer: e.target.value }))}
                disabled={isPending}
              />
            </div>
          </div>

          {/* Mekan Adresi */}
          <div className="space-y-1.5">
            <Label htmlFor="venue_address">Mekan Adresi</Label>
            <Input
              id="venue_address"
              placeholder="Tam adres"
              value={form.venue_address}
              onChange={(e) => setForm((f) => ({ ...f, venue_address: e.target.value }))}
              disabled={isPending}
            />
          </div>

          {/* Koordinat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="latitude">Enlem (Latitude)</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="örn. 37.3747"
                value={form.latitude}
                onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="longitude">Boylam (Longitude)</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="örn. 36.2175"
                value={form.longitude}
                onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
                disabled={isPending}
              />
            </div>
          </div>

          <Separator />

          {/* Ücretsiz / Ücretli */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Ücretsiz Etkinlik</p>
              <p className="text-xs text-muted-foreground">
                Kapalıysa bilet fiyatı girebilirsiniz
              </p>
            </div>
            <Switch
              checked={form.is_free}
              onCheckedChange={(v) => setForm((f) => ({ ...f, is_free: v, ticket_price: v ? '' : f.ticket_price }))}
              disabled={isPending}
            />
          </div>

          {!form.is_free && (
            <div className="space-y-1.5">
              <Label htmlFor="ticket_price">Bilet Fiyatı (₺)</Label>
              <Input
                id="ticket_price"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={form.ticket_price}
                onChange={(e) => setForm((f) => ({ ...f, ticket_price: e.target.value }))}
                disabled={isPending}
              />
            </div>
          )}

          {/* Kapasite */}
          <div className="space-y-1.5">
            <Label htmlFor="capacity">Kapasite (kişi)</Label>
            <Input
              id="capacity"
              type="number"
              min={0}
              placeholder="Boş bırakılabilir"
              value={form.capacity}
              onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
              disabled={isPending}
            />
          </div>

          {/* URL'ler */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="website_url">Web Sitesi</Label>
              <Input
                id="website_url"
                type="url"
                placeholder="https://..."
                value={form.website_url}
                onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ticket_url">Bilet Satış Linki</Label>
              <Input
                id="ticket_url"
                type="url"
                placeholder="https://..."
                value={form.ticket_url}
                onChange={(e) => setForm((f) => ({ ...f, ticket_url: e.target.value }))}
                disabled={isPending}
              />
            </div>
          </div>

          {/* Durum */}
          <div className="space-y-1.5">
            <Label>Yayın Durumu</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Yayınlandı</SelectItem>
                <SelectItem value="draft">Taslak</SelectItem>
                <SelectItem value="cancelled">İptal Edildi</SelectItem>
                <SelectItem value="archived">Arşivlendi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              İptal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? 'Kaydet' : 'Ekle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
