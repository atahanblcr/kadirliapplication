'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  Phone,
  Globe,
  MapPin,
  Clock,
  Loader2,
  Search,
  FolderOpen,
  BookOpen,
  FolderPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  useGuideCategories,
  useDeleteGuideCategory,
  useGuideItems,
  useDeleteGuideItem,
} from '@/hooks/use-guide';
import { GuideCategoryForm } from './guide-category-form';
import { GuideItemForm } from './guide-item-form';
import type { GuideCategory, GuideItem } from '@/types';

export default function GuidePage() {
  // ── Kategori State ───────────────────────────────────────────────────────
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GuideCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<GuideCategory | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);

  // ── İçerik State ────────────────────────────────────────────────────────
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GuideItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GuideItem | null>(null);
  const [itemFilters, setItemFilters] = useState({
    search: '',
    category_id: '',
    page: 1,
    limit: 20,
  });
  const [searchInput, setSearchInput] = useState('');

  // ── Data ─────────────────────────────────────────────────────────────────
  const { data: categories = [], isLoading: catLoading } = useGuideCategories();
  const { data: itemsData, isLoading: itemsLoading } = useGuideItems(itemFilters);

  const deleteCategoryMutation = useDeleteGuideCategory();
  const deleteItemMutation = useDeleteGuideItem();

  // ── Handlers ─────────────────────────────────────────────────────────────

  const openNewCategory = (parentId?: string) => {
    setEditingCategory(null);
    setDefaultParentId(parentId ?? null);
    setCategoryFormOpen(true);
  };

  const openEditCategory = (cat: GuideCategory) => {
    setEditingCategory(cat);
    setDefaultParentId(null);
    setCategoryFormOpen(true);
  };

  const openNewItem = (categoryId?: string) => {
    setEditingItem(null);
    setItemFormOpen(true);
    if (categoryId) setItemFilters((f) => ({ ...f, category_id: categoryId }));
  };

  const openEditItem = (item: GuideItem) => {
    setEditingItem(item);
    setItemFormOpen(true);
  };

  const handleCategoryDelete = async () => {
    if (!deletingCategory) return;
    await deleteCategoryMutation.mutateAsync(deletingCategory.id);
    setDeletingCategory(null);
  };

  const handleItemDelete = async () => {
    if (!deletingItem) return;
    await deleteItemMutation.mutateAsync(deletingItem.id);
    setDeletingItem(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setItemFilters((f) => ({ ...f, search: searchInput, page: 1 }));
  };

  // ── Tüm kategoriler (kök + alt) düz liste (item filter dropdown için) ──
  const allCategoriesFlat = categories.flatMap((c: GuideCategory) => [
    c,
    ...c.children,
  ]);

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rehber</h1>
        <p className="text-sm text-muted-foreground">
          Kategoriler ve içerikler yönetimi
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Kategoriler
          </TabsTrigger>
          <TabsTrigger value="items" className="gap-2">
            <BookOpen className="h-4 w-4" />
            İçerikler
            {itemsData?.meta?.total ? (
              <Badge variant="secondary" className="ml-1">
                {itemsData.meta.total}
              </Badge>
            ) : null}
          </TabsTrigger>
        </TabsList>

        {/* ─── KATEGORİLER TAB ─────────────────────────────────────────── */}
        <TabsContent value="categories" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={() => openNewCategory()}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Kategori
            </Button>
          </div>

          {catLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="border rounded-lg p-12 text-center text-muted-foreground">
              <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Henüz kategori yok.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => openNewCategory()}
              >
                <Plus className="mr-2 h-4 w-4" />
                İlk Kategoriyi Ekle
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg divide-y">
              {categories.map((cat: GuideCategory) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  onEdit={openEditCategory}
                  onDelete={setDeletingCategory}
                  onAddChild={(id) => openNewCategory(id)}
                  onAddItem={(id) => openNewItem(id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ─── İÇERİKLER TAB ───────────────────────────────────────────── */}
        <TabsContent value="items" className="space-y-4 mt-4">
          {/* Filtreler */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="İsim, telefon, adres..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary">
                Ara
              </Button>
            </form>

            <Select
              value={itemFilters.category_id || 'all'}
              onValueChange={(v) =>
                setItemFilters((f) => ({
                  ...f,
                  category_id: v === 'all' ? '' : v,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tüm kategoriler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm kategoriler</SelectItem>
                {categories.map((cat: GuideCategory) => (
                  <div key={cat.id}>
                    <SelectItem value={cat.id} className="font-semibold">
                      {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                    </SelectItem>
                    {cat.children.map((child) => (
                      <SelectItem key={child.id} value={child.id} className="pl-6">
                        └ {child.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={() => openNewItem()}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni İçerik
            </Button>
          </div>

          {/* Tablo */}
          {itemsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !itemsData?.items?.length ? (
            <div className="border rounded-lg p-12 text-center text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>İçerik bulunamadı.</p>
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>İsim</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Çalışma Saati
                      </TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemsData.items.map((item: GuideItem) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        onEdit={openEditItem}
                        onDelete={setDeletingItem}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {itemsData.meta && itemsData.meta.total_pages > 1 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {itemsData.meta.total} sonuçtan{' '}
                    {(itemFilters.page - 1) * itemFilters.limit + 1}–
                    {Math.min(
                      itemFilters.page * itemFilters.limit,
                      itemsData.meta.total,
                    )}{' '}
                    arası
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!itemsData.meta.has_prev}
                      onClick={() =>
                        setItemFilters((f) => ({ ...f, page: f.page - 1 }))
                      }
                    >
                      Önceki
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!itemsData.meta.has_next}
                      onClick={() =>
                        setItemFilters((f) => ({ ...f, page: f.page + 1 }))
                      }
                    >
                      Sonraki
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* ─── FORMLAR ─────────────────────────────────────────────────────── */}
      <GuideCategoryForm
        open={categoryFormOpen}
        onClose={() => {
          setCategoryFormOpen(false);
          setEditingCategory(null);
          setDefaultParentId(null);
        }}
        editing={editingCategory}
        defaultParentId={defaultParentId}
      />

      <GuideItemForm
        open={itemFormOpen}
        onClose={() => {
          setItemFormOpen(false);
          setEditingItem(null);
        }}
        editing={editingItem}
        defaultCategoryId={itemFilters.category_id || undefined}
      />

      {/* ─── SİLME ONAY (KATEGORİ) ───────────────────────────────────────── */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(v) => !v && setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deletingCategory?.name}</strong> kategorisi silinecek. Bu
              işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCategoryDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategoryMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sil'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── SİLME ONAY (İÇERİK) ─────────────────────────────────────────── */}
      <AlertDialog
        open={!!deletingItem}
        onOpenChange={(v) => !v && setDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İçeriği Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deletingItem?.name}</strong> silinecek. Bu işlem geri
              alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleItemDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteItemMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sil'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── KATEGORİ SATIRI ────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: GuideCategory;
  onEdit: (cat: GuideCategory) => void;
  onDelete: (cat: GuideCategory) => void;
  onAddChild: (id: string) => void;
  onAddItem: (id: string) => void;
}

function CategoryRow({
  category,
  onEdit,
  onDelete,
  onAddChild,
  onAddItem,
}: CategoryRowProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category.children.length > 0;

  return (
    <div>
      {/* Ana kategori satırı */}
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 group">
        {/* Genişlet/Daralt */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'text-muted-foreground transition-transform',
            !hasChildren && 'invisible',
          )}
        >
          <ChevronRight
            className={cn('h-4 w-4', expanded && 'rotate-90')}
          />
        </button>

        {/* İkon */}
        {category.icon && (
          <span className="text-lg">{category.icon}</span>
        )}
        {category.color && !category.icon && (
          <div
            className="h-4 w-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
        )}

        {/* İsim */}
        <div className="flex-1 min-w-0">
          <span className="font-semibold truncate">{category.name}</span>
          {hasChildren && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({category.children.length} alt kategori)
            </span>
          )}
        </div>

        {/* Aktif badge */}
        <Badge variant={category.is_active ? 'default' : 'secondary'}>
          {category.is_active ? 'Aktif' : 'Pasif'}
        </Badge>

        {/* Aksiyonlar */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            title="Alt Kategori Ekle"
            onClick={() => onAddChild(category.id)}
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            title="Düzenle"
            onClick={() => onEdit(category)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Sil"
            onClick={() => onDelete(category)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Alt kategoriler */}
      {expanded && hasChildren && (
        <div className="border-t">
          {category.children.map((child) => (
            <div
              key={child.id}
              className="flex items-center gap-3 px-4 py-2.5 pl-12 hover:bg-muted/30 group border-b last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm truncate">{child.name}</span>
              </div>
              <Badge
                variant={child.is_active ? 'outline' : 'secondary'}
                className="text-xs"
              >
                {child.is_active ? 'Aktif' : 'Pasif'}
              </Badge>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  title="Düzenle"
                  onClick={() =>
                    onEdit({ ...child, parent_id: category.id, parent: { id: category.id, name: category.name }, children: [] } as any)
                  }
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  title="Sil"
                  onClick={() =>
                    onDelete({ ...child, parent_id: category.id, parent: { id: category.id, name: category.name }, children: [] } as any)
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── İÇERİK SATIRI ─────────────────────────────────────────────────────────

interface ItemRowProps {
  item: GuideItem;
  onEdit: (item: GuideItem) => void;
  onDelete: (item: GuideItem) => void;
}

function ItemRow({ item, onEdit, onDelete }: ItemRowProps) {
  const categoryLabel = item.category
    ? item.category.parent
      ? `${item.category.parent.name} › ${item.category.name}`
      : item.category.name
    : '—';

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{item.name}</div>
        {item.latitude != null && item.longitude != null && (
          <a
            href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin className="h-3 w-3" />
            Konumu gör
          </a>
        )}
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{categoryLabel}</span>
      </TableCell>
      <TableCell>
        <a
          href={`tel:${item.phone}`}
          className="flex items-center gap-1 text-sm hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          {item.phone}
        </a>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {item.working_hours ? (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {item.working_hours}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={item.is_active ? 'default' : 'secondary'}>
          {item.is_active ? 'Aktif' : 'Pasif'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          {item.website_url && (
            <a
              href={item.website_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
              title="Web Sitesi"
            >
              <Globe className="h-4 w-4 text-muted-foreground" />
            </a>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(item)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
