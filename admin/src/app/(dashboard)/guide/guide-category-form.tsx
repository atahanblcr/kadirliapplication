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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateGuideCategory,
  useUpdateGuideCategory,
  useGuideCategories,
} from '@/hooks/use-guide';
import type { GuideCategory } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  editing: (GuideCategory & { parent_id?: string | null }) | null;
  /** Alt kategori eklerken varsayılan parent_id */
  defaultParentId?: string | null;
}

const EMPTY_FORM = {
  name: '',
  parent_id: '',
  icon: '',
  color: '',
  display_order: '0',
  is_active: true,
};

export function GuideCategoryForm({
  open,
  onClose,
  editing,
  defaultParentId,
}: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const { data: categories = [] } = useGuideCategories();

  const createMutation = useCreateGuideCategory();
  const updateMutation = useUpdateGuideCategory();

  const isPending =
    createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          name: editing.name,
          parent_id: editing.parent_id ?? '',
          icon: editing.icon ?? '',
          color: editing.color ?? '',
          display_order: String(editing.display_order),
          is_active: editing.is_active,
        });
      } else {
        setForm({
          ...EMPTY_FORM,
          parent_id: defaultParentId ?? '',
        });
      }
    }
  }, [open, editing, defaultParentId]);

  // Sadece kök kategorileri üst kategori seçeneği olarak sun
  const rootCategories = categories.filter((c) => !c.parent_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      parent_id: form.parent_id || undefined,
      icon: form.icon.trim() || undefined,
      color: form.color.trim() || undefined,
      display_order: parseInt(form.display_order, 10) || 0,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kategori Adı */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Kategori Adı <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="örn. Resmi Kurumlar"
              required
            />
          </div>

          {/* Üst Kategori */}
          <div className="space-y-1.5">
            <Label>Üst Kategori</Label>
            <Select
              value={form.parent_id || 'none'}
              onValueChange={(v) =>
                setForm({ ...form, parent_id: v === 'none' ? '' : v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Ana kategori (üst yok)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Ana Kategori —</SelectItem>
                {rootCategories
                  .filter((c) => c.id !== editing?.id)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.icon ? `${c.icon} ` : ''}{c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Boş bırakırsan ana kategori olarak oluşturulur
            </p>
          </div>

          {/* İkon + Renk (yan yana) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="icon">İkon (emoji)</Label>
              <Input
                id="icon"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="🏛️"
                maxLength={10}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color">Renk</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="color"
                  type="color"
                  value={form.color || '#6366f1'}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-12 h-9 p-1 cursor-pointer"
                />
                <Input
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  placeholder="#6366f1"
                  maxLength={7}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Sıra */}
          <div className="space-y-1.5">
            <Label htmlFor="display_order">Sıra</Label>
            <Input
              id="display_order"
              type="number"
              min={0}
              value={form.display_order}
              onChange={(e) =>
                setForm({ ...form, display_order: e.target.value })
              }
            />
          </div>

          {/* Aktif */}
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
