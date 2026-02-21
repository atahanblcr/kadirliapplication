'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  CalendarDays, Clock, MapPin, Church, User, Trash2,
  CheckCircle2, XCircle, Loader2, Archive,
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
import { useApproveDeath, useRejectDeath, useDeleteDeath } from '@/hooks/use-deaths';
import {
  DeathStatusBadge,
  DEATH_REJECTION_REASONS,
  formatFuneralDate,
  calculateArchiveDaysLeft,
} from '@/lib/death-utils';
import { toast } from '@/hooks/use-toast';
import type { DeathNotice } from '@/types';

interface DeathDetailModalProps {
  item: DeathNotice | null;
  onClose: () => void;
}

function InfoRow({
  icon,
  label,
  value,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline truncate block"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

export function DeathDetailModal({ item, onClose }: DeathDetailModalProps) {
  const [rejectOpen, setRejectOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen]   = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote]   = useState('');

  const approveMutation = useApproveDeath();
  const rejectMutation  = useRejectDeath();
  const deleteMutation  = useDeleteDeath();

  if (!item) return null;

  const daysLeft = calculateArchiveDaysLeft(item.auto_archive_at);

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(item.id);
      toast({ title: 'Vefat ilanı onaylandı.' });
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Onaylanamadı.', variant: 'destructive' });
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return;
    try {
      await rejectMutation.mutateAsync({
        id: item.id,
        reason: rejectReason,
        note: rejectNote || undefined,
      });
      toast({ title: 'Vefat ilanı reddedildi.' });
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
      toast({ title: 'Vefat ilanı silindi.' });
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
                <DialogTitle className="text-xl">{item.deceased_name}</DialogTitle>
                {item.age && (
                  <p className="text-sm text-muted-foreground mt-0.5">{item.age} yaşında</p>
                )}
              </div>
              <DeathStatusBadge status={item.status} />
            </div>
          </DialogHeader>

          <div className="p-6 space-y-5">
            {/* Photo */}
            {item.photo_file?.url && (
              <div className="flex justify-center">
                <img
                  src={item.photo_file.url}
                  alt={item.deceased_name}
                  className="h-40 w-40 rounded-full object-cover border-4 border-muted"
                />
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
                label="Defin Tarihi ve Saati"
                value={formatFuneralDate(item.funeral_date, item.funeral_time)}
              />

              {item.cemetery && (
                <InfoRow
                  icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                  label="Mezarlık"
                  value={item.cemetery.name}
                  link={
                    item.cemetery.latitude
                      ? `https://maps.google.com/?q=${item.cemetery.latitude},${item.cemetery.longitude}`
                      : undefined
                  }
                />
              )}

              {item.mosque && (
                <InfoRow
                  icon={<Church className="h-4 w-4 text-muted-foreground" />}
                  label="Namaz Kılınacak Cami"
                  value={item.mosque.name}
                  link={
                    item.mosque.latitude
                      ? `https://maps.google.com/?q=${item.mosque.latitude},${item.mosque.longitude}`
                      : undefined
                  }
                />
              )}

              {item.condolence_address && (
                <InfoRow
                  icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                  label="Taziye Adresi"
                  value={item.condolence_address}
                />
              )}

              <InfoRow
                icon={<User className="h-4 w-4 text-muted-foreground" />}
                label="Ekleyen"
                value={item.adder?.full_name ?? item.adder?.username ?? '—'}
              />

              <InfoRow
                icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                label="Eklenme Tarihi"
                value={format(new Date(item.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
              />

              <InfoRow
                icon={<Archive className="h-4 w-4 text-muted-foreground" />}
                label="Otomatik Arşivleme"
                value={
                  daysLeft > 0
                    ? `${daysLeft} gün sonra (${format(new Date(item.auto_archive_at), 'dd MMM', { locale: tr })})`
                    : format(new Date(item.auto_archive_at), 'dd MMM yyyy', { locale: tr })
                }
              />
            </div>

            {/* Rejection Reason */}
            {item.rejected_reason && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-xs font-semibold uppercase text-red-600 mb-1">Red Nedeni</p>
                <p className="text-sm text-red-700">{item.rejected_reason}</p>
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
        </DialogContent>
      </Dialog>

      {/* ── Reject Dialog ── */}
      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vefat İlanını Reddet</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{item.deceased_name}</strong> adına oluşturulan ilan reddedilecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <Select value={rejectReason} onValueChange={setRejectReason}>
              <SelectTrigger>
                <SelectValue placeholder="Red nedenini seçin..." />
              </SelectTrigger>
              <SelectContent>
                {DEATH_REJECTION_REASONS.map((r) => (
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
            <AlertDialogTitle>Vefat İlanını Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{item.deceased_name}</strong> adına oluşturulan ilan silinecek. Bu işlem geri alınamaz.
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
