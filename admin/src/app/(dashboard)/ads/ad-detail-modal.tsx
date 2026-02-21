'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Eye, Phone, MessageCircle, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Loader2, Trash2, Calendar, Tag,
  User, Clock,
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAd, useApproveAd, useRejectAd, useDeleteAd } from '@/hooks/use-ads';
import { AdStatusBadge, REJECTION_REASONS, formatPrice, formatCategoryPath } from '@/lib/ad-utils';
import { toast } from '@/hooks/use-toast';
import type { AdListItem } from '@/types';

interface AdDetailModalProps {
  item: AdListItem | null;
  onClose: () => void;
}

export function AdDetailModal({ item, onClose }: AdDetailModalProps) {
  const [imgIndex, setImgIndex]   = useState(0);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteOpen, setDeleteOpen]   = useState(false);

  const { data: ad, isLoading } = useAd(item?.id ?? null);
  const approveMutation = useApproveAd();
  const rejectMutation  = useRejectAd();
  const deleteMutation  = useDeleteAd();

  const images = ad?.images ?? [];
  const coverImg = images.find((i) => i.is_cover) ?? images[0];
  const currentImg = images[imgIndex] ?? coverImg;

  if (!item) return null;

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(item.id);
      toast({ title: 'İlan onaylandı ve yayınlandı.' });
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Onaylanamadı.', variant: 'destructive' });
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return;
    try {
      await rejectMutation.mutateAsync({ id: item.id, reason: rejectReason });
      toast({ title: 'İlan reddedildi.', description: rejectReason });
      setRejectOpen(false);
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Reddedilemedi.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(item.id);
      toast({ title: 'İlan silindi.' });
      setDeleteOpen(false);
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Silinemedi.', variant: 'destructive' });
    }
  };

  return (
    <>
      <Dialog open={!!item} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex items-start justify-between gap-4 pr-8">
              <DialogTitle className="text-lg leading-snug">{item.title}</DialogTitle>
              <AdStatusBadge status={item.status} />
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </div>
          ) : ad ? (
            <div className="grid md:grid-cols-2 gap-0">
              {/* ── Left: Image Gallery ── */}
              <div className="p-6 border-r border-border">
                {/* Main Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  {currentImg ? (
                    <img
                      src={currentImg.url}
                      alt={ad.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                      Fotoğraf yok
                    </div>
                  )}
                  {/* Gallery nav arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        type="button"
                        key={img.id}
                        onClick={() => setImgIndex(idx)}
                        className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                          idx === imgIndex
                            ? 'border-primary'
                            : 'border-transparent hover:border-muted-foreground/40'
                        }`}
                      >
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { icon: Eye, label: 'Görüntü', value: ad.view_count },
                    { icon: Phone, label: 'Telefon', value: ad.phone_click_count },
                    { icon: MessageCircle, label: 'WhatsApp', value: ad.whatsapp_click_count },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-lg border p-2">
                      <Icon className="mx-auto mb-0.5 h-4 w-4 text-muted-foreground" />
                      <p className="text-lg font-bold">{value.toLocaleString('tr-TR')}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: Details ── */}
              <div className="flex flex-col p-6 gap-4">
                {/* Price */}
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(ad.price)}
                  </p>
                </div>

                {/* Category */}
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    {formatCategoryPath(ad.category)}
                  </span>
                </div>

                {/* Seller */}
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>
                    {ad.seller_name ?? ad.user?.full_name ?? ad.user?.username ?? '—'}
                    {ad.user?.primary_neighborhood && (
                      <span className="ml-1 text-muted-foreground">
                        · {ad.user.primary_neighborhood.name}
                      </span>
                    )}
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{ad.contact_phone}</span>
                </div>

                {/* Expiry */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    Son: {format(new Date(ad.expires_at), 'dd MMM yyyy', { locale: tr })}
                  </span>
                  {ad.extension_count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      +{ad.extension_count} uzatma
                    </Badge>
                  )}
                </div>

                {/* Created */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    {format(new Date(ad.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                  </span>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                    Açıklama
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {ad.description}
                  </p>
                </div>

                {/* Properties */}
                {ad.property_values && ad.property_values.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                        Özellikler
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {ad.property_values.map((pv) => (
                          <div key={pv.property_id} className="rounded-md bg-muted px-3 py-1.5">
                            <p className="text-xs text-muted-foreground">{pv.property_name}</p>
                            <p className="text-sm font-medium">{pv.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Rejection reason (if rejected) */}
                {ad.rejected_reason && (
                  <>
                    <Separator />
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="text-xs font-semibold uppercase text-red-600 mb-1">
                        Red Nedeni
                      </p>
                      <p className="text-sm text-red-700">{ad.rejected_reason}</p>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <Separator />
                <div className="flex flex-wrap gap-2 mt-auto">
                  {item.status === 'pending' && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={handleApprove}
                        disabled={approveMutation.isPending}
                      >
                        {approveMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
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
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* ── Reject Dialog ── */}
      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İlanı Reddet</AlertDialogTitle>
            <AlertDialogDescription>
              Lütfen red nedenini seçin. Kullanıcıya bildirim gönderilecek.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Select value={rejectReason} onValueChange={setRejectReason}>
            <SelectTrigger>
              <SelectValue placeholder="Red nedenini seçin..." />
            </SelectTrigger>
            <SelectContent>
              {REJECTION_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectReason || rejectMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reddet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Confirm ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İlanı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{item.title}</strong> ilanı silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
