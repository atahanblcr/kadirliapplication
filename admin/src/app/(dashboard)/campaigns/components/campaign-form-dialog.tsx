'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Upload, X, ImageIcon } from 'lucide-react';
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
  useBusinesses,
  useCreateCampaign,
  useUpdateCampaign,
} from '@/hooks/use-campaigns';
import { resolveFileUrl } from '@/lib/death-utils';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';
import type { Campaign, CreateCampaignDto } from '@/types';

interface CampaignFormDialogProps {
  open: boolean;
  onClose: () => void;
  campaign?: Campaign | null;
}

interface ImageSlot {
  file_id: string;
  url: string;
}

interface FormState {
  business_id: string;
  title: string;
  description: string;
  discount_rate: string;
  code: string;
  valid_from: string;
  valid_until: string;
}

const EMPTY_FORM: FormState = {
  business_id: '',
  title: '',
  description: '',
  discount_rate: '',
  code: '',
  valid_from: '',
  valid_until: '',
};

export function CampaignFormDialog({ open, onClose, campaign }: CampaignFormDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<ImageSlot[]>([]);
  const [imagesModified, setImagesModified] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: businesses = [] } = useBusinesses();
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();

  const isEditing = !!campaign;
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open && campaign) {
      setForm({
        business_id: campaign.business_id ?? '',
        title: campaign.title ?? '',
        description: campaign.description ?? '',
        discount_rate: campaign.discount_rate != null ? String(campaign.discount_rate) : '',
        code: campaign.code ?? '',
        valid_from: campaign.valid_from ?? '',
        valid_until: campaign.valid_until ?? '',
      });
      // Mevcut resimleri file_id olmadan yükle (sadece görüntüleme için)
      setImages(
        (campaign.image_urls ?? []).map((url) => ({ file_id: '', url: resolveFileUrl(url) || url })),
      );
      setImagesModified(false);
    } else if (open && !campaign) {
      setForm(EMPTY_FORM);
      setImages([]);
      setImagesModified(false);
    }
  }, [open, campaign]);

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images.length >= 5) {
      toast({ title: 'En fazla 5 görsel eklenebilir.', variant: 'destructive' });
      return;
    }

    const slotIdx = images.length;
    setUploadingIdx(slotIdx);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('module_type', 'campaign');
      const { data } = await api.post('/files/upload', fd, {
        headers: { 'Content-Type': undefined },
      });
      const fileObj = data.data?.file;
      const fileId: string = fileObj?.id ?? '';
      const rawUrl: string = fileObj?.cdn_url ?? fileObj?.storage_path ?? '';
      const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1')
        .replace(/\/v1$/, '');
      const fileUrl = rawUrl.startsWith('/') ? `${apiOrigin}${rawUrl}` : rawUrl;

      setImages((prev) => [...prev, { file_id: fileId, url: fileUrl || URL.createObjectURL(file) }]);
      setImagesModified(true);
    } catch {
      toast({ title: 'Görsel yüklenemedi.', variant: 'destructive' });
    } finally {
      setUploadingIdx(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagesModified(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.business_id) {
      toast({ title: 'İşletme seçimi zorunludur.', variant: 'destructive' });
      return;
    }
    if (!form.title.trim()) {
      toast({ title: 'Başlık zorunludur.', variant: 'destructive' });
      return;
    }
    if (!form.description.trim()) {
      toast({ title: 'Açıklama zorunludur.', variant: 'destructive' });
      return;
    }
    if (!form.valid_from || !form.valid_until) {
      toast({ title: 'Geçerlilik tarihleri zorunludur.', variant: 'destructive' });
      return;
    }

    const dto: CreateCampaignDto = {
      business_id: form.business_id,
      title: form.title.trim(),
      description: form.description.trim(),
      discount_rate: form.discount_rate ? parseInt(form.discount_rate, 10) : 0,
      valid_from: form.valid_from,
      valid_until: form.valid_until,
    };

    if (form.code.trim()) dto.code = form.code.trim();

    // Görseller değiştirildiyse veya yeni kampanya oluşturuluyorsa image_ids gönder
    if (!isEditing || imagesModified) {
      const newIds = images.filter((img) => img.file_id).map((img) => img.file_id);
      dto.image_ids = newIds;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: campaign!.id, dto });
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
          <SheetTitle>{isEditing ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Ekle'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* İşletme */}
          <div className="space-y-1.5">
            <Label>
              İşletme <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.business_id || undefined}
              onValueChange={(v) => set('business_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="İşletme seçin..." />
              </SelectTrigger>
              <SelectContent>
                {businesses.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Başlık */}
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Başlık <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Kampanya başlığı"
              maxLength={200}
            />
          </div>

          {/* Açıklama */}
          <div className="space-y-1.5">
            <Label htmlFor="description">
              Açıklama <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Kampanya açıklaması..."
              rows={3}
              maxLength={2000}
            />
          </div>

          {/* İndirim Oranı + Kod */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="discount_rate">
                İndirim Oranı (%)
              </Label>
              <Input
                id="discount_rate"
                type="number"
                value={form.discount_rate}
                onChange={(e) => set('discount_rate', e.target.value)}
                placeholder="0-100"
                min={0}
                max={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code">Kampanya Kodu</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => set('code', e.target.value)}
                placeholder="KOD123"
                maxLength={50}
              />
            </div>
          </div>

          {/* Tarih Aralığı */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="valid_from">
                Başlangıç <span className="text-destructive">*</span>
              </Label>
              <Input
                id="valid_from"
                type="date"
                value={form.valid_from}
                onChange={(e) => set('valid_from', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="valid_until">
                Bitiş <span className="text-destructive">*</span>
              </Label>
              <Input
                id="valid_until"
                type="date"
                value={form.valid_until}
                onChange={(e) => set('valid_until', e.target.value)}
              />
            </div>
          </div>

          {/* Görseller */}
          <div className="space-y-2">
            <Label>Görseller (max 5)</Label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative h-20 w-20 rounded-lg border overflow-hidden bg-muted">
                  <img src={img.url} alt={`Görsel ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingIdx !== null}
                  className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground/60 hover:border-muted-foreground/60 transition-colors disabled:opacity-50"
                >
                  {uploadingIdx !== null ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="h-5 w-5" />
                      <Upload className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAddImage}
            />
            {isEditing && !imagesModified && images.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Görselleri değiştirmek için mevcut görselleri kaldırıp yenilerini yükleyin.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              İptal
            </Button>
            <Button type="submit" disabled={isPending || uploadingIdx !== null}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Güncelle' : 'Kampanya Ekle'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
