'use client';

import { useState } from 'react';
import { Loader2, Plus, Check, X } from 'lucide-react';
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
import {
  useBusinessCategories,
  useCreateBusiness,
  useCreateBusinessCategory,
} from '@/hooks/use-campaigns';

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
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const { data: categories = [] } = useBusinessCategories();
  const createBusiness = useCreateBusiness();
  const createCategory = useCreateBusinessCategory();

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const result = await createCategory.mutateAsync(newCategoryName.trim());
      set('category_id', result.id);
      setNewCategoryName('');
      setAddingCategory(false);
    } catch {
      // toast hook ile gösterildi
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name.trim() || !form.phone.trim() || !form.address.trim()) return;
    try {
      const result = await createBusiness.mutateAsync({
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
    setAddingCategory(false);
    setNewCategoryName('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni İşletme Ekle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* İşletme Adı */}
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

          {/* Kategori */}
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <div className="flex gap-2">
              <Select
                value={form.category_id || undefined}
                onValueChange={(v) => set('category_id', v)}
              >
                <SelectTrigger className="flex-1">
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
              {!addingCategory && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Yeni Kategori Ekle"
                  onClick={() => setAddingCategory(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Inline kategori ekleme satırı */}
            {addingCategory && (
              <div className="flex gap-2">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Kategori adı..."
                  maxLength={100}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); handleSaveCategory(); }
                    if (e.key === 'Escape') { setAddingCategory(false); setNewCategoryName(''); }
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  disabled={!newCategoryName.trim() || createCategory.isPending}
                  onClick={handleSaveCategory}
                >
                  {createCategory.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => { setAddingCategory(false); setNewCategoryName(''); }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Telefon */}
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

          {/* Adres */}
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
            <Button type="button" variant="outline" onClick={handleClose} disabled={createBusiness.isPending}>
              İptal
            </Button>
            <Button type="submit" disabled={createBusiness.isPending}>
              {createBusiness.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
