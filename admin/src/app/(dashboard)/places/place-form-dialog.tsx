'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, MapPin, ExternalLink, Upload, X, Image as ImageIcon } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreatePlace, useUpdatePlace, usePlaceCategories } from '@/hooks/use-places';
import api from '@/lib/api';
import type { Place, PlaceCategory } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  editing: Place | null;
}

interface ImageSlot {
  file_id: string;
  url: string;
}

const EMPTY_FORM = {
  category_id: '',
  name: '',
  description: '',
  address: '',
  latitude: '',
  longitude: '',
  entrance_fee: '',
  is_free: true,
  opening_hours: '',
  best_season: '',
  how_to_get_there: '',
  distance_from_center: '',
  is_active: true,
};

export function PlaceFormDialog({ open, onClose, editing }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [coverImage, setCoverImage] = useState<ImageSlot | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = usePlaceCategories();
  const createMutation = useCreatePlace();
  const updateMutation = useUpdatePlace();
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          category_id: editing.category_id ?? '',
          name: editing.name,
          description: editing.description ?? '',
          address: editing.address ?? '',
          latitude: editing.latitude != null ? String(editing.latitude) : '',
          longitude: editing.longitude != null ? String(editing.longitude) : '',
          entrance_fee: editing.entrance_fee != null ? String(editing.entrance_fee) : '',
          is_free: editing.is_free,
          opening_hours: editing.opening_hours ?? '',
          best_season: editing.best_season ?? '',
          how_to_get_there: editing.how_to_get_there ?? '',
          distance_from_center:
            editing.distance_from_center != null
              ? String(editing.distance_from_center)
              : '',
          is_active: editing.is_active,
        });
        setCoverImage(
          editing.cover_image_id && editing.cover_image_url
            ? { file_id: editing.cover_image_id, url: editing.cover_image_url }
            : null,
        );
      } else {
        setForm(EMPTY_FORM);
        setCoverImage(null);
      }
    }
  }, [open, editing]);

  const handleCoverUpload = async (file: File) => {
    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('module_type', 'place');
      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': undefined },
      });
      const { file_id, url } = res.data.data;
      setCoverImage({ file_id, url });
    } catch {
      // Hata toast olarak gösterilir
    } finally {
      setCoverUploading(false);
    }
  };

  const validate = () => {
    if (!form.name.trim()) return 'İsim zorunludur';
    if (!form.latitude.trim()) return 'Enlem zorunludur';
    if (!form.longitude.trim()) return 'Boylam zorunludur';
    if (isNaN(parseFloat(form.latitude))) return 'Geçersiz enlem değeri';
    if (isNaN(parseFloat(form.longitude))) return 'Geçersiz boylam değeri';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return;

    const payload = {
      category_id: form.category_id || undefined,
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      address: form.address.trim() || undefined,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      entrance_fee: form.entrance_fee ? parseFloat(form.entrance_fee) : undefined,
      is_free: form.is_free,
      opening_hours: form.opening_hours.trim() || undefined,
      best_season: form.best_season.trim() || undefined,
      how_to_get_there: form.how_to_get_there.trim() || undefined,
      distance_from_center: form.distance_from_center
        ? parseFloat(form.distance_from_center)
        : undefined,
      cover_image_id: coverImage?.file_id || undefined,
      is_active: form.is_active,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch {
      // Hook içinde toast gösterildi
    }
  };

  const mapsPreviewUrl =
    form.latitude && form.longitude
      ? `https://www.google.com/maps?q=${form.latitude},${form.longitude}`
      : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? 'Mekanı Düzenle' : 'Yeni Mekan'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Temel Bilgiler */}
          <div className="space-y-1.5">
            <Label htmlFor="place-name">
              İsim <span className="text-destructive">*</span>
            </Label>
            <Input
              id="place-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="örn. Kadirli Kalesi"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Select
              value={form.category_id || 'none'}
              onValueChange={(v) =>
                setForm({ ...form, category_id: v === 'none' ? '' : v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seç..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Kategorisiz —</SelectItem>
                {categories.map((cat: PlaceCategory) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon ? `${cat.icon} ` : ''}
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Konum (zorunlu) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Konum <span className="text-destructive">*</span>
              </Label>
              {mapsPreviewUrl && (
                <a
                  href={mapsPreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Haritada gör
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="latitude" className="text-xs text-muted-foreground">
                  Enlem (Latitude)
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  placeholder="37.3783"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="longitude" className="text-xs text-muted-foreground">
                  Boylam (Longitude)
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  placeholder="36.2156"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Google Maps'te yeri bul → sağ tıkla → koordinatları kopyala
            </p>
          </div>

          <Separator />

          {/* Kapak Fotoğrafı */}
          <div className="space-y-2">
            <Label>Kapak Fotoğrafı</Label>
            {coverImage ? (
              <div className="relative w-full h-40 rounded-md overflow-hidden border">
                <img
                  src={coverImage.url}
                  alt="Kapak"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => setCoverImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent transition-colors"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">
                      Kapak fotoğrafı yükle
                    </span>
                  </>
                )}
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverUpload(file);
                e.target.value = '';
              }}
            />
          </div>

          <Separator />

          {/* Açıklama */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mekan hakkında kısa açıklama..."
              rows={3}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.description.length}/2000
            </p>
          </div>

          {/* Adres */}
          <div className="space-y-1.5">
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="örn. Kadirli Merkez, Osmaniye"
            />
          </div>

          <Separator />

          {/* Giriş Ücreti */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ücretsiz Giriş</Label>
              <Switch
                checked={form.is_free}
                onCheckedChange={(v) => setForm({ ...form, is_free: v })}
              />
            </div>

            {!form.is_free && (
              <div className="space-y-1.5">
                <Label htmlFor="entrance_fee">Giriş Ücreti (₺)</Label>
                <Input
                  id="entrance_fee"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.entrance_fee}
                  onChange={(e) => setForm({ ...form, entrance_fee: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          {/* Çalışma Saati & Sezon */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="opening_hours">Açılış Saatleri</Label>
              <Input
                id="opening_hours"
                value={form.opening_hours}
                onChange={(e) => setForm({ ...form, opening_hours: e.target.value })}
                placeholder="08:00 - 18:00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="best_season">En İyi Sezon</Label>
              <Input
                id="best_season"
                value={form.best_season}
                onChange={(e) => setForm({ ...form, best_season: e.target.value })}
                placeholder="İlkbahar - Yaz"
              />
            </div>
          </div>

          {/* Merkeze Uzaklık */}
          <div className="space-y-1.5">
            <Label htmlFor="distance_from_center">Merkeze Uzaklık (km)</Label>
            <Input
              id="distance_from_center"
              type="number"
              min={0}
              step="0.1"
              value={form.distance_from_center}
              onChange={(e) =>
                setForm({ ...form, distance_from_center: e.target.value })
              }
              placeholder="2.5"
            />
          </div>

          {/* Nasıl Gidilir */}
          <div className="space-y-1.5">
            <Label htmlFor="how_to_get_there">Nasıl Gidilir</Label>
            <Textarea
              id="how_to_get_there"
              value={form.how_to_get_there}
              onChange={(e) => setForm({ ...form, how_to_get_there: e.target.value })}
              placeholder="Ulaşım bilgisi..."
              rows={2}
              maxLength={500}
            />
          </div>

          {/* Aktif */}
          <div className="flex items-center justify-between">
            <Label>Aktif</Label>
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => setForm({ ...form, is_active: v })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={isPending || coverUploading}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? 'Güncelle' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
