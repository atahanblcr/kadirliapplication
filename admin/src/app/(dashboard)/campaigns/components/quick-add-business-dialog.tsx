'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useBusinessCategories, useCreateBusiness } from '@/hooks/use-campaigns';

interface QuickAddBusinessDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

interface FormState {
  business_name: string;
  category_id: string;
  phone: string;
  address: string;
}

const EMPTY: FormState = { business_name: '', category_id: '', phone: '', address: '' };

export function QuickAddBusinessDialog({ open, onClose, onCreated }: QuickAddBusinessDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const { data: categories = [] } = useBusinessCategories();
  const createMutation = useCreateBusiness();

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name.trim() || !form.phone.trim() || !form.address.trim()) return;

    try {
      const result = await createMutation.mutateAsync({
        business_name: form.business_name.trim(),
        category_id: form.category_id || undefined,
        phone: form.phone.trim(),
        address: form.address.trim(),
      });
      setForm(EMPTY);
      onCreated(result.id);
    } catch {
      // toast hook ile gösterildi
    }
  };

  const handleClose = () => {
    setForm(EMPTY);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni İşletme Ekle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="qb_name">
              İşletme Adı <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qb_name"
              value={form.business_name}
              onChange={(e) => set('business_name', e.target.value)}
              placeholder="Örn: Kadirli Eczanesi"
              maxLength={150}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Select value={form.category_id || undefined} onValueChange={(v) => set('category_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="qb_phone">
              Telefon <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qb_phone"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="05XX XXX XX XX"
              maxLength={15}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="qb_address">
              Adres <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qb_address"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Mahalle, Cadde/Sokak No"
              maxLength={500}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={handleClose} disabled={createMutation.isPending}>
              İptal
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
