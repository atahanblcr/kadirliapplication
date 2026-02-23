'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  useCreatePlaceCategory,
  useUpdatePlaceCategory,
} from '@/hooks/use-places';
import type { PlaceCategory } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  editing: PlaceCategory | null;
}

const EMPTY_FORM = {
  name: '',
  icon: '',
  display_order: 0,
  is_active: true,
};

export function PlaceCategoryForm({ open, onClose, editing }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);

  const createMutation = useCreatePlaceCategory();
  const updateMutation = useUpdatePlaceCategory();
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          name: editing.name,
          icon: editing.icon ?? '',
          display_order: editing.display_order,
          is_active: editing.is_active,
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [open, editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      icon: form.icon.trim() || undefined,
      display_order: form.display_order,
      is_active: form.is_active,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch {
      // Hook içinde toast gösterildi
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Kategori Düzenle' : 'Yeni Kategori'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">
              Kategori Adı <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cat-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="örn. Tarihi Yerler"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-icon">İkon (emoji)</Label>
            <Input
              id="cat-icon"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="🏛️"
              maxLength={10}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-order">Sıra</Label>
            <Input
              id="cat-order"
              type="number"
              min={0}
              value={form.display_order}
              onChange={(e) =>
                setForm({ ...form, display_order: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Aktif</Label>
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => setForm({ ...form, is_active: v })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? 'Güncelle' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
