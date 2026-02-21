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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { IntracityStop } from '@/types';
import { useAddStop, useUpdateStop } from '@/hooks/use-intracity';

interface StopDialogProps {
  open: boolean;
  onClose: () => void;
  routeId: string;
  editStop?: IntracityStop | null;
}

export function StopDialog({ open, onClose, routeId, editStop }: StopDialogProps) {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errors, setErrors] = useState<{ name?: string; lat?: string; lng?: string }>({});

  const addStop = useAddStop();
  const updateStop = useUpdateStop();

  useEffect(() => {
    if (editStop) {
      setName(editStop.name ?? '');
      setLatitude(editStop.latitude !== undefined ? String(editStop.latitude) : '');
      setLongitude(editStop.longitude !== undefined ? String(editStop.longitude) : '');
    } else {
      setName('');
      setLatitude('');
      setLongitude('');
    }
    setErrors({});
  }, [editStop, open]);

  function validate(): boolean {
    const errs: { name?: string; lat?: string; lng?: string } = {};
    if (!name.trim()) errs.name = 'Durak adı gerekli';

    if (latitude && isNaN(parseFloat(latitude))) errs.lat = 'Geçerli enlem girin';
    if (longitude && isNaN(parseFloat(longitude))) errs.lng = 'Geçerli boylam girin';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const dto = {
      name: name.trim(),
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
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
              📍 Haritada görüntüle
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
