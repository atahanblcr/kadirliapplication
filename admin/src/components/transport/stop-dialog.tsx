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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { IntracityStop } from '@/types';
import { useAddStop, useUpdateStop } from '@/hooks/use-intracity';
import { useDeathNeighborhoods } from '@/hooks/use-deaths';

interface StopDialogProps {
  open: boolean;
  onClose: () => void;
  routeId: string;
  editStop?: IntracityStop | null;
}

export function StopDialog({ open, onClose, routeId, editStop }: StopDialogProps) {
  const [name, setName]                   = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState<string>('');
  const [latitude, setLatitude]           = useState('');
  const [longitude, setLongitude]         = useState('');
  const [timeFromStart, setTimeFromStart] = useState('0');
  const [errors, setErrors]               = useState<{
    name?: string;
    lat?: string;
    lng?: string;
    time?: string;
  }>({});

  const addStop    = useAddStop();
  const updateStop = useUpdateStop();
  const { data: neighborhoods } = useDeathNeighborhoods();

  useEffect(() => {
    if (editStop) {
      setName(editStop.name ?? '');
      setNeighborhoodId(editStop.neighborhood_id ?? '');
      setLatitude(editStop.latitude !== undefined ? String(editStop.latitude) : '');
      setLongitude(editStop.longitude !== undefined ? String(editStop.longitude) : '');
      setTimeFromStart(editStop.time_from_start !== undefined ? String(editStop.time_from_start) : '0');
    } else {
      setName('');
      setNeighborhoodId('');
      setLatitude('');
      setLongitude('');
      setTimeFromStart('0');
    }
    setErrors({});
  }, [editStop, open]);

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Durak adı gerekli';
    if (latitude && isNaN(parseFloat(latitude))) errs.lat = 'Geçerli enlem girin';
    if (longitude && isNaN(parseFloat(longitude))) errs.lng = 'Geçerli boylam girin';

    const t = parseInt(timeFromStart, 10);
    if (isNaN(t) || t < 0 || t > 500) errs.time = '0 ile 500 arasında bir değer girin';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const dto = {
      name: name.trim(),
      neighborhood_id: neighborhoodId || undefined,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      time_from_start: parseInt(timeFromStart, 10),
    };

    try {
      if (editStop) {
        await updateStop.mutateAsync({ stopId: editStop.id, routeId, ...dto });
        toast.success('Durak güncellendi');
      } else {
        await addStop.mutateAsync({ routeId, ...dto });
        toast.success('Durak eklendi');
      }
      onClose();
    } catch {
      toast.error('İşlem başarısız');
    }
  }

  const isLoading = addStop.isPending || updateStop.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{editStop ? 'Durak Düzenle' : 'Durak Ekle'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Durak Adı */}
          <div className="space-y-1">
            <Label htmlFor="stop_name">Durak Adı *</Label>
            <Input
              id="stop_name"
              placeholder="Otogar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Mahalle */}
          <div className="space-y-1">
            <Label>Mahalle</Label>
            <Select
              value={neighborhoodId || '_none'}
              onValueChange={(v) => setNeighborhoodId(v === '_none' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mahalle seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Seçilmedi</SelectItem>
                {(neighborhoods ?? []).map((n) => (
                  <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Başlangıçtan Süre */}
          <div className="space-y-1">
            <Label htmlFor="time_from_start">Başlangıçtan İtibaren Süre (Dakika) *</Label>
            <Input
              id="time_from_start"
              type="number"
              min={0}
              max={500}
              placeholder="örn: 15"
              value={timeFromStart}
              onChange={(e) => setTimeFromStart(e.target.value)}
            />
            {errors.time
              ? <p className="text-xs text-destructive">{errors.time}</p>
              : <p className="text-xs text-muted-foreground">İlk durak 0, ikinci durak 5, üçüncü durak 12 gibi...</p>
            }
          </div>

          {/* Konum */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="latitude">Enlem</Label>
              <Input
                id="latitude"
                placeholder="37.3825"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
              {errors.lat && <p className="text-xs text-destructive">{errors.lat}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="longitude">Boylam</Label>
              <Input
                id="longitude"
                placeholder="36.2215"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
              {errors.lng && <p className="text-xs text-destructive">{errors.lng}</p>}
            </div>
          </div>

          {latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude)) && (
            <a
              href={`https://maps.google.com/?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Haritada goruntule
            </a>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editStop ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
