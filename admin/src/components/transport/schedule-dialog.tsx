'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { IntercitySchedule } from '@/types';
import { useAddSchedule, useUpdateSchedule } from '@/hooks/use-intercity';

const DAYS = [
  { value: 1, label: 'Pzt' },
  { value: 2, label: 'Sal' },
  { value: 3, label: 'Çar' },
  { value: 4, label: 'Per' },
  { value: 5, label: 'Cum' },
  { value: 6, label: 'Cmt' },
  { value: 7, label: 'Paz' },
];

const WEEKDAYS = [1, 2, 3, 4, 5];
const WEEKEND = [6, 7];
const ALL_DAYS = [1, 2, 3, 4, 5, 6, 7];

interface ScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  routeId: string;
  editSchedule?: IntercitySchedule | null;
}

export function ScheduleDialog({ open, onClose, routeId, editSchedule }: ScheduleDialogProps) {
  const [departure_time, setDepartureTime] = useState('');
  const [days_of_week, setDaysOfWeek] = useState<number[]>([]);
  const [is_active, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ time?: string; days?: string }>({});

  const addSchedule = useAddSchedule();
  const updateSchedule = useUpdateSchedule();

  useEffect(() => {
    if (editSchedule) {
      setDepartureTime(editSchedule.departure_time.slice(0, 5));
      setDaysOfWeek(editSchedule.days_of_week ?? []);
      setIsActive(editSchedule.is_active);
    } else {
      setDepartureTime('');
      setDaysOfWeek([]);
      setIsActive(true);
    }
    setErrors({});
  }, [editSchedule, open]);

  function toggleDay(day: number) {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    );
  }

  function setPreset(preset: number[]) {
    setDaysOfWeek(preset);
  }

  function validate(): boolean {
    const errs: { time?: string; days?: string } = {};
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(departure_time)) {
      errs.time = 'Geçerli bir saat girin (HH:mm)';
    }
    if (days_of_week.length === 0) {
      errs.days = 'En az bir gün seçin';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      if (editSchedule) {
        await updateSchedule.mutateAsync({
          scheduleId: editSchedule.id,
          routeId,
          departure_time,
          days_of_week,
          is_active,
        });
        toast.success('Sefer güncellendi');
      } else {
        await addSchedule.mutateAsync({
          routeId,
          departure_time,
          days_of_week,
          is_active,
        });
        toast.success('Sefer eklendi');
      }
      onClose();
    } catch {
      toast.error('İşlem başarısız');
    }
  }

  const isLoading = addSchedule.isPending || updateSchedule.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editSchedule ? 'Sefer Düzenle' : 'Sefer Ekle'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Kalkış Saati */}
          <div className="space-y-1">
            <Label htmlFor="departure_time">Kalkış Saati *</Label>
            <Input
              id="departure_time"
              type="time"
              value={departure_time}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-32"
            />
            {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
          </div>

          {/* Günler */}
          <div className="space-y-2">
            <Label>Günler *</Label>

            {/* Hızlı seçim */}
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreset(WEEKDAYS)}
              >
                Hafta İçi
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreset(WEEKEND)}
              >
                Hafta Sonu
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreset(ALL_DAYS)}
              >
                Her Gün
              </Button>
            </div>

            <div className="flex gap-2">
              {DAYS.map((day) => {
                const selected = days_of_week.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`flex-1 py-2 rounded text-xs font-medium border transition-colors ${
                      selected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            {errors.days && <p className="text-xs text-destructive">{errors.days}</p>}
          </div>

          {/* Durum */}
          <div className="flex items-center justify-between">
            <Label>Aktif</Label>
            <Switch checked={is_active} onCheckedChange={setIsActive} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editSchedule ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper to display days nicely
export function formatDays(days: number[]): string {
  if (!days || days.length === 0) return '—';
  const sorted = [...days].sort();
  if (sorted.join(',') === '1,2,3,4,5,6,7') return 'Her Gün';
  if (sorted.join(',') === '1,2,3,4,5') return 'Hafta İçi';
  if (sorted.join(',') === '6,7') return 'Hafta Sonu';

  const names = ['', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  return sorted.map((d) => names[d]).join(', ');
}
