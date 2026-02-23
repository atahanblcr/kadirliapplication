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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCreateGuideItem, useUpdateGuideItem, useGuideCategories } from '@/hooks/use-guide';
import type { GuideItem, GuideCategory } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  editing: GuideItem | null;
  defaultCategoryId?: string;
}

const EMPTY_FORM = {
  category_id: '',
  name: '',
  phone: '',
  address: '',
  email: '',
  website_url: '',
  working_hours: '',
  description: '',
  is_active: true,
};

export function GuideItemForm({ open, onClose, editing, defaultCategoryId }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const { data: categories = [] } = useGuideCategories();

  const createMutation = useCreateGuideItem();
  const updateMutation = useUpdateGuideItem();
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          category_id: editing.category_id,
          name: editing.name,
          phone: editing.phone,
          address: editing.address ?? '',
          email: editing.email ?? '',
          website_url: editing.website_url ?? '',
          working_hours: editing.working_hours ?? '',
          description: editing.description ?? '',
          is_active: editing.is_active,
        });
      } else {
        setForm({ ...EMPTY_FORM, category_id: defaultCategoryId ?? '' });
      }
    }
  }, [open, editing, defaultCategoryId]);

  // Düz kategori listesi (kök + alt)
  const flatCategories = categories.flatMap((cat: GuideCategory) => [
    cat,
    ...cat.children,
  ]);

  const validate = () => {
    if (!form.category_id) return 'Kategori seçiniz';
    if (!form.name.trim()) return 'İsim zorunludur';
    if (!form.phone.trim()) return 'Telefon zorunludur';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return;

    const payload = {
      category_id: form.category_id,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || undefined,
      email: form.email.trim() || undefined,
      website_url: form.website_url.trim() || undefined,
      working_hours: form.working_hours.trim() || undefined,
      description: form.description.trim() || undefined,
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'İçeriği Düzenle' : 'Yeni İçerik'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kategori */}
          <div className="space-y-1.5">
            <Label>
              Kategori <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.category_id || ''}
              onValueChange={(v) => setForm({ ...form, category_id: v })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: GuideCategory) => (
                  <div key={cat.id}>
                    {/* Kök kategori (grup başlığı görevi) */}
                    {cat.children.length > 0 ? (
                      <>
                        <SelectItem
                          value={cat.id}
                          className="font-semibold"
                        >
                          {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                        </SelectItem>
                        {cat.children.map((child) => (
                          <SelectItem
                            key={child.id}
                            value={child.id}
                            className="pl-6"
                          >
                            └ {child.name}
                          </SelectItem>
                        ))}
                      </>
                    ) : (
                      <SelectItem value={cat.id}>
                        {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                      </SelectItem>
                    )}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* İsim */}
          <div className="space-y-1.5">
            <Label htmlFor="item-name">
              İsim <span className="text-destructive">*</span>
            </Label>
            <Input
              id="item-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="örn. Kadirli Belediyesi"
              required
            />
          </div>

          {/* Telefon */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              Telefon <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0328 714 00 00"
              required
            />
          </div>

          <Separator />

          {/* Adres */}
          <div className="space-y-1.5">
            <Label htmlFor="address">Adres</Label>
            <Textarea
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Cadde, mahalle, ilçe..."
              rows={2}
            />
          </div>

          {/* E-posta + Çalışma Saati (yan yana) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="info@ornek.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="working_hours">Çalışma Saatleri</Label>
              <Input
                id="working_hours"
                value={form.working_hours}
                onChange={(e) =>
                  setForm({ ...form, working_hours: e.target.value })
                }
                placeholder="08:00 - 17:00"
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <Label htmlFor="website_url">Web Sitesi</Label>
            <Input
              id="website_url"
              type="url"
              value={form.website_url}
              onChange={(e) =>
                setForm({ ...form, website_url: e.target.value })
              }
              placeholder="https://www.ornek.com"
            />
          </div>

          {/* Açıklama (plain text) */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Kısa açıklama..."
              rows={3}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.description.length}/2000
            </p>
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
