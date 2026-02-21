'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Building2, Calendar, Tag, Eye, BarChart2,
  CheckCircle2, XCircle, Trash2, Loader2, ChevronLeft, ChevronRight,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useApproveCampaign, useRejectCampaign, useDeleteCampaign } from '@/hooks/use-campaigns';
import {
  CampaignStatusBadge,
  CAMPAIGN_REJECTION_REASONS,
  formatDiscountRate,
  formatValidityRange,
} from '@/lib/campaign-utils';
import { toast } from '@/hooks/use-toast';
import type { Campaign } from '@/types';

interface CampaignDetailModalProps {
  item: Campaign | null;
  onClose: () => void;
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

export function CampaignDetailModal({ item, onClose }: CampaignDetailModalProps) {
  const [rejectOpen, setRejectOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen]     = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote]     = useState('');
  const [imgIndex, setImgIndex]         = useState(0);

  const approveMutation = useApproveCampaign();
  const rejectMutation  = useRejectCampaign();
  const deleteMutation  = useDeleteCampaign();

  if (!item) return null;

  const images = item.image_urls ?? [];
  const hasImages = images.length > 0;

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(item.id);
      toast({ title: `"${item.title}" kampanyası onaylandı.` });
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Onaylanamadı.', variant: 'destructive' });
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return;
    try {
      await rejectMutation.mutateAsync({ id: item.id, reason: rejectReason, note: rejectNote || undefined });
      toast({ title: `"${item.title}" kampanyası reddedildi.` });
      setRejectOpen(false);
      setRejectReason('');
      setRejectNote('');
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Reddedilemedi.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(item.id);
      toast({ title: `"${item.title}" kampanyası silindi.` });
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
              <CampaignStatusBadge status={item.status} />
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
                icon={<Eye className="h-4 w-4 text-muted-foreground" />}
                label="Görüntülenme"
                value={`${item.views.toLocaleString('tr-TR')} görüntülenme`}
              />
              <InfoRow
                icon={<BarChart2 className="h-4 w-4 text-muted-foreground" />}
                label="Kod Görüntülenme"
                value={`${item.code_views.toLocaleString('tr-TR')} kez kod gösterildi`}
              />
              <InfoRow
                icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                label="Ekleyen"
                value={item.created_by?.business_name ?? item.created_by?.username ?? '—'}
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

            {/* Rejection Reason */}
            {item.status === 'rejected' && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-xs font-semibold uppercase text-red-600 mb-1">Red Nedeni</p>
                <p className="text-sm text-red-700">—</p>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {item.status === 'pending' && (
                <>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleApprove}
                    disabled={approveMutation.isPending}
                  >
                    {approveMutation.isPending
                      ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Onayla
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setRejectOpen(true)}
                    disabled={rejectMutation.isPending}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reddet
                  </Button>
                </>
              )}
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

      {/* ── Reject Dialog ── */}
      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kampanyayı Reddet</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{item.title}</strong> kampanyası reddedilecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <Select value={rejectReason} onValueChange={setRejectReason}>
              <SelectTrigger>
                <SelectValue placeholder="Red nedenini seçin..." />
              </SelectTrigger>
              <SelectContent>
                {CAMPAIGN_REJECTION_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Ek not (isteğe bağlı, max 500 karakter)..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setRejectReason(''); setRejectNote(''); }}>
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectReason || rejectMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reddet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Confirm ── */}
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
