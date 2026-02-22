'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Building2, Calendar, Tag, BarChart2,
  Trash2, Loader2, ChevronLeft, ChevronRight, Pencil,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDeleteCampaign } from '@/hooks/use-campaigns';
import {
  formatDiscountRate,
  formatValidityRange,
} from '@/lib/campaign-utils';
import { resolveFileUrl } from '@/lib/death-utils';
import { toast } from '@/hooks/use-toast';
import type { Campaign } from '@/types';

interface CampaignDetailModalProps {
  item: Campaign | null;
  onClose: () => void;
  onEdit: (c: Campaign) => void;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function CampaignDetailModal({ item, onClose, onEdit }: CampaignDetailModalProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imgIndex, setImgIndex]     = useState(0);

  const deleteMutation = useDeleteCampaign();

  if (!item) return null;

  const rawImages = item.image_urls ?? [];
  const images = rawImages.map((url) => resolveFileUrl(url) || url);
  const hasImages = images.length > 0;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(item.id);
      toast({ title: `"${item.title}" silindi.` });
      setDeleteOpen(false);
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Silinemedi.', variant: 'destructive' });
    }
  };

  return (
    <>
      <Dialog open={!!item} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex items-start justify-between gap-4 pr-8">
              <div>
                <DialogTitle className="text-xl">{item.title}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">{item.business_name}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-5">
            {/* Image Gallery */}
            {hasImages && (
              <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                <img
                  src={images[imgIndex]}
                  alt={`${item.title} görseli ${imgIndex + 1}`}
                  className="h-full w-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setImgIndex(i)}
                          className={`h-1.5 w-1.5 rounded-full transition-colors ${
                            i === imgIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                label="İşletme"
                value={item.business_name}
              />
              <InfoRow
                icon={<Tag className="h-4 w-4 text-muted-foreground" />}
                label="İndirim Oranı"
                value={formatDiscountRate(item.discount_rate)}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                label="Geçerlilik"
                value={formatValidityRange(item.valid_from, item.valid_until)}
              />
              <InfoRow
                icon={<BarChart2 className="h-4 w-4 text-muted-foreground" />}
                label="Kod Görüntülenme"
                value={`${item.code_views.toLocaleString('tr-TR')} kez`}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                label="Oluşturulma Tarihi"
                value={format(new Date(item.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
              />
            </div>

            {/* Description */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Kampanya Açıklaması</p>
              <p className="text-sm rounded-lg border bg-muted/30 p-3">{item.description}</p>
            </div>

            {/* Discount Code */}
            {item.code && (
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                <Tag className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Kampanya Kodu</p>
                  <p className="text-base font-bold tracking-widest text-primary">{item.code}</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => onEdit(item)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Düzenle
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kampanyayı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{item.title}</strong> kampanyası silinecek. Bu işlem geri alınamaz.
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
    </>
  );
}
