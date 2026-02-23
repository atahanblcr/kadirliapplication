'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Images,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  usePlaceCategories,
  usePlaces,
  useDeletePlaceCategory,
  useDeletePlace,
} from '@/hooks/use-places';
import { PlaceCategoryForm } from './place-category-form';
import { PlaceFormDialog } from './place-form-dialog';
import { PlaceImagesDialog } from './place-images-dialog';
import type { Place, PlaceCategory } from '@/types';

export default function PlacesPage() {
  // ── Kategori State ──────────────────────────────────────────────────────────
  const [catFormOpen, setCatFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<PlaceCategory | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  // ── Mekan State ─────────────────────────────────────────────────────────────
  const [placeFormOpen, setPlaceFormOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [imagesDialogPlace, setImagesDialogPlace] = useState<Place | null>(null);
  const [deletingPlaceId, setDeletingPlaceId] = useState<string | null>(null);

  // ── Filtreler ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  // ── Query ───────────────────────────────────────────────────────────────────
  const { data: categories = [], isLoading: catLoading } = usePlaceCategories();
  const { data: placesData, isLoading: placesLoading } = usePlaces({
    search: search || undefined,
    category_id: categoryFilter || undefined,
    page,
    limit: LIMIT,
  });

  const places = placesData?.places ?? [];
  const meta = placesData?.meta;

  // ── Mutations ───────────────────────────────────────────────────────────────
  const deleteCatMutation = useDeletePlaceCategory();
  const deletePlaceMutation = useDeletePlace();

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleCategoryFilterChange = (val: string) => {
    setCategoryFilter(val === 'all' ? '' : val);
    setPage(1);
  };

  const handleDeleteCat = async () => {
    if (!deletingCatId) return;
    try {
      await deleteCatMutation.mutateAsync(deletingCatId);
    } finally {
      setDeletingCatId(null);
    }
  };

  const handleDeletePlace = async () => {
    if (!deletingPlaceId) return;
    try {
      await deletePlaceMutation.mutateAsync(deletingPlaceId);
    } finally {
      setDeletingPlaceId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mekanlar</h1>
          <p className="text-sm text-muted-foreground">
            Kategoriler ve gezilecek yerler yönetimi
          </p>
        </div>
      </div>

      <Tabs defaultValue="places">
        <TabsList>
          <TabsTrigger value="places">Mekanlar</TabsTrigger>
          <TabsTrigger value="categories">Kategoriler</TabsTrigger>
        </TabsList>

        {/* ── MEKANLAR TAB ─────────────────────────────────────────────────────── */}
        <TabsContent value="places" className="space-y-4">
          {/* Filtreler + Ekle */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="İsim veya adres ara..."
                className="pl-8"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <Select
              value={categoryFilter || 'all'}
              onValueChange={handleCategoryFilterChange}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tüm kategoriler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm kategoriler</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon ? `${cat.icon} ` : ''}
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setEditingPlace(null);
                setPlaceFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Yeni Mekan
            </Button>
          </div>

          {/* Tablo */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mekan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Giriş</TableHead>
                  <TableHead>Fotoğraflar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placesLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Yükleniyor...
                    </TableCell>
                  </TableRow>
                ) : places.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Mekan bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  places.map((place) => (
                    <PlaceRow
                      key={place.id}
                      place={place}
                      onEdit={() => {
                        setEditingPlace(place);
                        setPlaceFormOpen(true);
                      }}
                      onImages={() => setImagesDialogPlace(place)}
                      onDelete={() => setDeletingPlaceId(place.id)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Sayfalama */}
          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Toplam {meta.total} mekan
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!meta.has_prev}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {page} / {meta.total_pages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!meta.has_next}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── KATEGORİLER TAB ──────────────────────────────────────────────────── */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditingCat(null);
                setCatFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Yeni Kategori
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İkon</TableHead>
                  <TableHead>Kategori Adı</TableHead>
                  <TableHead>Sıra</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Yükleniyor...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Kategori bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="text-lg w-12">
                        {cat.icon || '—'}
                      </TableCell>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>{cat.display_order}</TableCell>
                      <TableCell>
                        <Badge variant={cat.is_active ? 'default' : 'secondary'}>
                          {cat.is_active ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingCat(cat);
                              setCatFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingCatId(cat.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── FORM DİYALOGLARI ─────────────────────────────────────────────────── */}

      <PlaceCategoryForm
        open={catFormOpen}
        onClose={() => {
          setCatFormOpen(false);
          setEditingCat(null);
        }}
        editing={editingCat}
      />

      <PlaceFormDialog
        open={placeFormOpen}
        onClose={() => {
          setPlaceFormOpen(false);
          setEditingPlace(null);
        }}
        editing={editingPlace}
      />

      {imagesDialogPlace && (
        <PlaceImagesDialog
          open={!!imagesDialogPlace}
          onClose={() => setImagesDialogPlace(null)}
          place={imagesDialogPlace}
        />
      )}

      {/* ── ONAY DİYALOGLARI ─────────────────────────────────────────────────── */}

      <AlertDialog
        open={!!deletingCatId}
        onOpenChange={(v) => !v && setDeletingCatId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu kategori kalıcı olarak silinecek. Mekan bulunan kategoriler silinemez.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCat}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deletingPlaceId}
        onOpenChange={(v) => !v && setDeletingPlaceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mekanı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu mekan ve tüm fotoğrafları kalıcı olarak silinecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlace}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Alt Bileşen: Mekan Satırı ─────────────────────────────────────────────────

function PlaceRow({
  place,
  onEdit,
  onImages,
  onDelete,
}: {
  place: Place;
  onEdit: () => void;
  onImages: () => void;
  onDelete: () => void;
}) {
  const mapsUrl = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;

  return (
    <TableRow>
      {/* Mekan adı + kapak */}
      <TableCell>
        <div className="flex items-center gap-2">
          {place.cover_image_url ? (
            <img
              src={place.cover_image_url}
              alt=""
              className="w-10 h-10 rounded object-cover flex-shrink-0 border"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium text-sm">{place.name}</p>
            {place.address && (
              <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                {place.address}
              </p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Kategori */}
      <TableCell>
        {place.category ? (
          <Badge variant="outline" className="text-xs">
            {place.category.icon ? `${place.category.icon} ` : ''}
            {place.category.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </TableCell>

      {/* Konum */}
      <TableCell>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Haritada gör
        </a>
      </TableCell>

      {/* Giriş ücreti */}
      <TableCell>
        {place.is_free ? (
          <Badge variant="secondary" className="text-xs">Ücretsiz</Badge>
        ) : (
          <span className="text-sm">
            {place.entrance_fee != null ? `₺${place.entrance_fee}` : 'Ücretli'}
          </span>
        )}
      </TableCell>

      {/* Fotoğraf sayısı */}
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={onImages}
          className="h-8 gap-1.5 text-xs"
        >
          <Images className="h-3.5 w-3.5" />
          {place.images.length} foto
        </Button>
      </TableCell>

      {/* Durum */}
      <TableCell>
        <Badge variant={place.is_active ? 'default' : 'secondary'}>
          {place.is_active ? 'Aktif' : 'Pasif'}
        </Badge>
      </TableCell>

      {/* İşlemler */}
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
