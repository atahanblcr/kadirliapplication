'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAssignSchedule, useDeleteSchedule } from '@/hooks/use-pharmacy';
import { toast } from '@/hooks/use-toast';
import type { Pharmacy, PharmacySchedule } from '@/types';

interface ScheduleDialogProps {
  date: Date | null;
  existing: PharmacySchedule | null;
  pharmacies: Pharmacy[];
  onClose: () => void;
}

export function ScheduleDialog({ date, existing, pharmacies, onClose }: ScheduleDialogProps) {
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('09:00');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const assignMutation = useAssignSchedule();
  const deleteMutation = useDeleteSchedule();

  if (!date) return null;

  const dateStr   = format(date, 'yyyy-MM-dd');
  const dateLabel = format(date, 'dd MMMM yyyy, EEEE', { locale: tr });

  const handleAssign = async () => {
    if (!selectedPharmacyId) return;
    try {
      await assignMutation.mutateAsync({
        pharmacy_id: selectedPharmacyId,
        date: dateStr,
        start_time: startTime,
        end_time: endTime,
      });
      toast({ title: `${dateLabel} için nöbet atandı.` });
      setSelectedPharmacyId('');
      setStartTime('19:00');
      setEndTime('09:00');
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Nöbet atanamadı.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!existing) return;
    try {
      await deleteMutation.mutateAsync(existing.id);
      toast({ title: `${dateLabel} nöbeti silindi.` });
      setDeleteOpen(false);
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Nöbet silinemedi.', variant: 'destructive' });
    }
  };

  return (
    <>
      <Dialog open={!!date} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">{dateLabel}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {existing ? (
              /* Existing assignment */
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-xs text-green-700 font-medium mb-0.5">Nöbetçi Eczane</p>
                <p className="text-sm font-bold text-green-800">{existing.pharmacy_name}</p>
                <p className="text-xs text-green-600 mt-0.5">
                  {existing.start_time} – {existing.end_time}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Bu güne nöbet atanmamış.</p>
            )}

            {/* Assign / re-assign form */}
            <div className="space-y-3">
              <p className="text-sm font-medium">
                {existing ? 'Nöbeti Değiştir' : 'Nöbet Ata'}
              </p>
              <Select value={selectedPharmacyId} onValueChange={setSelectedPharmacyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Eczane seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {pharmacies
                    .filter((p) => p.is_active)
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Time inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="sch-start">Başlangıç Saati</Label>
                  <Input
                    id="sch-start"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="sch-end">Bitiş Saati</Label>
                  <Input
                    id="sch-end"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            {existing && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>İptal</Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedPharmacyId || assignMutation.isPending}
            >
              {assignMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {existing ? 'Değiştir' : 'Ata'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nöbeti Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{dateLabel}</strong> için {existing?.pharmacy_name} nöbeti silinecek.
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
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
