'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Upload, X, User as UserIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCemeteries,
  useMosques,
  useDeathNeighborhoods,
  useCreateDeath,
  useUpdateDeath,
} from '@/hooks/use-deaths';
import { resolveFileUrl } from '@/lib/death-utils';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';
import type { DeathNotice, CreateDeathDto } from '@/types';

interface DeathFormDialogProps {
  open: boolean;
  onClose: () => void;
  death?: DeathNotice | null;
}

interface FormState {
  deceased_name: string;
  age: string;
  funeral_date: string;
  funeral_time: string;
  cemetery_id: string;
  mosque_id: string;
  condolence_address: string;
  neighborhood_id: string;
  photo_file_id: string;
}

const EMPTY_FORM: FormState = {
  deceased_name: '',
  age: '',
  funeral_date: '',
  funeral_time: '12:00',
  cemetery_id: '',
  mosque_id: '',
  condolence_address: '',
  neighborhood_id: '',
  photo_file_id: '',
};

export function DeathFormDialog({ open, onClose, death }: DeathFormDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: cemeteries = [] } = useCemeteries();
  const { data: mosques = [] } = useMosques();
  const { data: neighborhoods = [] } = useDeathNeighborhoods();

  const createMutation = useCreateDeath();
  const updateMutation = useUpdateDeath();

  const isEditing = !!death;
  const isPending = createMutation.isPending || updateMutation.isPending;

  // Fill form when editing
  useEffect(() => {
    if (open && death) {
      setForm({
        deceased_name: death.deceased_name ?? '',
        age: death.age != null ? String(death.age) : '',
        funeral_date: death.funeral_date ?? '',
        funeral_time: death.funeral_time?.slice(0, 5) ?? '12:00',
        cemetery_id: death.cemetery_id ?? '',
        mosque_id: death.mosque_id ?? '',
        condolence_address: death.condolence_address ?? '',
        neighborhood_id: death.neighborhood_id ?? '',
        photo_file_id: death.photo_file_id ?? '',
      });
      setPhotoPreview(resolveFileUrl(death.photo_file?.cdn_url ?? death.photo_file?.url) || null);
    } else if (open && !death) {
      setForm(EMPTY_FORM);
      setPhotoPreview(null);
    }
  }, [open, death]);

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('module_type', 'death');

      // axios FormData ile kullanıldığında Content-Type header'ı kaldır;
      // boundary otomatik eklenir, manuel set edilirse bozulur
      const { data } = await api.post('/files/upload', fd, {
        headers: { 'Content-Type': undefined },
      });

      // Backend { success: true, data: { file: { id, cdn_url, ... } } } döndürür
      const fileObj = data.data?.file;
      const fileId: string = fileObj?.id ?? '';
      // cdn_url = "/uploads/..." → tam URL'e çevir
      const rawUrl: string = fileObj?.cdn_url ?? fileObj?.storage_path ?? '';
      const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1')
        .replace(/\/v1$/, '');
      const fileUrl: string = rawUrl.startsWith('/') ? `${apiOrigin}${rawUrl}` : rawUrl;

      set('photo_file_id', fileId);
      setPhotoPreview(fileUrl || URL.createObjectURL(file));
    } catch {
      toast({ title: 'Fotoğraf yüklenemedi', variant: 'destructive' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.deceased_name.trim()) {
      toast({ title: 'Ad Soyad zorunludur.', variant: 'destructive' });
      return;
    }
    if (!form.funeral_date) {
      toast({ title: 'Cenaze tarihi zorunludur.', variant: 'destructive' });
      return;
    }
    if (!form.funeral_time) {
      toast({ title: 'Cenaze saati zorunludur.', variant: 'destructive' });
      return;
    }

    const dto: CreateDeathDto = {
      deceased_name: form.deceased_name.trim(),
      funeral_date: form.funeral_date,
      funeral_time: form.funeral_time,
    };
    if (form.age) dto.age = parseInt(form.age, 10);
    if (form.cemetery_id) dto.cemetery_id = form.cemetery_id;
    if (form.mosque_id) dto.mosque_id = form.mosque_id;
    if (form.condolence_address.trim()) dto.condolence_address = form.condolence_address.trim();
    if (form.photo_file_id) dto.photo_file_id = form.photo_file_id;
    if (form.neighborhood_id) dto.neighborhood_id = form.neighborhood_id;

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: death!.id, dto });
      } else {
        await createMutation.mutateAsync(dto);
      }
      onClose();
    } catch {
      // toast is handled in hook
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{isEditing ? 'Vefat İlanını Düzenle' : 'Yeni Vefat İlanı Ekle'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Fotoğraf</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden shrink-0 bg-muted">
                {photoPreview ? (
                  <img src={photoPreview} alt="Önizleme" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-8 w-8 text-muted-foreground/40" />
                )}
              </div>
              <div className="space-y-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {uploadingPhoto ? 'Yükleniyor...' : 'Fotoğraf Seç'}
                </Button>
                {photoPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => {
                      setPhotoPreview(null);
                      set('photo_file_id', '');
                    }}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Kaldır
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Ad Soyad */}
          <div className="space-y-1.5">
            <Label htmlFor="deceased_name">
              Ad Soyad <span className="text-destructive">*</span>
            </Label>
            <Input
              id="deceased_name"
              value={form.deceased_name}
              onChange={(e) => set('deceased_name', e.target.value)}
              placeholder="Vefat edenin adı soyadı"
              maxLength={150}
            />
          </div>

          {/* Yaş */}
          <div className="space-y-1.5">
            <Label htmlFor="age">Yaş</Label>
            <Input
              id="age"
              type="number"
              value={form.age}
              onChange={(e) => set('age', e.target.value)}
              placeholder="Yaş"
              min={1}
              max={150}
            />
          </div>

          {/* Cenaze Tarihi + Saati */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="funeral_date">
                Cenaze Tarihi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="funeral_date"
                type="date"
                value={form.funeral_date}
                onChange={(e) => set('funeral_date', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="funeral_time">
                Saat <span className="text-destructive">*</span>
              </Label>
              <Input
                id="funeral_time"
                type="time"
                value={form.funeral_time}
                onChange={(e) => set('funeral_time', e.target.value)}
              />
            </div>
          </div>

          {/* Mezarlık */}
          <div className="space-y-1.5">
            <Label>Mezarlık</Label>
            {/* value undefined → placeholder görünür; '' geçersiz (shadcn Select sorunu) */}
            <Select
              value={form.cemetery_id || undefined}
              onValueChange={(v) => set('cemetery_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mezarlık seçin..." />
              </SelectTrigger>
              <SelectContent>
                {cemeteries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cami */}
          <div className="space-y-1.5">
            <Label>Namaz Kılınacak Cami</Label>
            <Select
              value={form.mosque_id || undefined}
              onValueChange={(v) => set('mosque_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cami seçin..." />
              </SelectTrigger>
              <SelectContent>
                {mosques.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mahalle */}
          <div className="space-y-1.5">
            <Label>Mahalle</Label>
            <Select
              value={form.neighborhood_id || undefined}
              onValueChange={(v) => set('neighborhood_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mahalle seçin..." />
              </SelectTrigger>
              <SelectContent>
                {neighborhoods.map((n) => (
                  <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Taziye Adresi */}
          <div className="space-y-1.5">
            <Label htmlFor="condolence_address">Taziye Adresi</Label>
            <Textarea
              id="condolence_address"
              value={form.condolence_address}
              onChange={(e) => set('condolence_address', e.target.value)}
              placeholder="Taziye kabul adresi..."
              rows={2}
              maxLength={500}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              İptal
            </Button>
            <Button type="submit" disabled={isPending || uploadingPhoto}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Güncelle' : 'İlan Ekle'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
