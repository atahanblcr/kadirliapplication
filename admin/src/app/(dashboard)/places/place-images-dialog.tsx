'use client';

import { useState, useRef } from 'react';
import { Loader2, GripVertical, Trash2, Star, Upload, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  useAddPlaceImages,
  useDeletePlaceImage,
  useSetPlaceCoverImage,
  useReorderPlaceImages,
} from '@/hooks/use-places';
import api from '@/lib/api';
import type { Place, PlaceImage } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  place: Place;
}

interface SortableImageProps {
  image: PlaceImage;
  isCover: boolean;
  onDelete: () => void;
  onSetCover: () => void;
  deleting: boolean;
  settingCover: boolean;
}

function SortableImage({
  image,
  isCover,
  onDelete,
  onSetCover,
  deleting,
  settingCover,
}: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-2 border rounded-lg bg-card"
    >
      {/* Sürükleme tutacağı */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Thumbnail */}
      <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden border">
        {image.url ? (
          <img src={image.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
            ?
          </div>
        )}
        {isCover && (
          <div className="absolute inset-0 bg-yellow-500/20 flex items-end justify-center pb-0.5">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          </div>
        )}
      </div>

      {/* Bilgi */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{image.file_id}</p>
        {isCover && (
          <span className="text-xs font-medium text-yellow-600">Kapak fotoğrafı</span>
        )}
      </div>

      {/* Aksiyonlar */}
      <div className="flex items-center gap-1">
        {!isCover && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSetCover}
            disabled={settingCover}
            title="Kapak yap"
            className="h-8 px-2"
          >
            {settingCover ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Star className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={deleting}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

export function PlaceImagesDialog({ open, onClose, place }: Props) {
  const [images, setImages] = useState<PlaceImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingCoverId, setSettingCoverId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImagesMutation = useAddPlaceImages();
  const deleteImageMutation = useDeletePlaceImage();
  const setCoverMutation = useSetPlaceCoverImage();
  const reorderMutation = useReorderPlaceImages();

  // place prop değişince images'ı senkronize et
  const sortedImages = place.images
    .slice()
    .sort((a, b) => a.display_order - b.display_order);

  // images state başlangıç
  const displayImages =
    images.length > 0 && images.some((img) => place.images.find((pi) => pi.id === img.id))
      ? images
      : sortedImages;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayImages.findIndex((img) => img.id === active.id);
    const newIndex = displayImages.findIndex((img) => img.id === over.id);
    const reordered = arrayMove(displayImages, oldIndex, newIndex);

    setImages(reordered);

    await reorderMutation.mutateAsync({
      id: place.id,
      ordered_ids: reordered.map((img) => img.id),
    });
  };

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const fileIds: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('module_type', 'place');
        const res = await api.post('/files/upload', formData, {
          headers: { 'Content-Type': undefined },
        });
        fileIds.push(res.data.data.file_id);
      }
      if (fileIds.length > 0) {
        await addImagesMutation.mutateAsync({ id: place.id, file_ids: fileIds });
        setImages([]);
      }
    } catch {
      // Hook içinde toast gösterildi
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId);
    try {
      await deleteImageMutation.mutateAsync({ imageId, placeId: place.id });
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetCover = async (imageId: string) => {
    setSettingCoverId(imageId);
    try {
      await setCoverMutation.mutateAsync({ imageId, placeId: place.id });
    } finally {
      setSettingCoverId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fotoğraf Yönetimi</DialogTitle>
          <DialogDescription>{place.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Yükleme alanı */}
          <div
            className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">
                  Fotoğraf yükle (çoklu seçim desteklenir)
                </span>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleUpload(e.target.files);
              e.target.value = '';
            }}
          />

          {/* Fotoğraf listesi */}
          {displayImages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Henüz fotoğraf yok. Yukarıdan yükleyin.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={displayImages.map((img) => img.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {displayImages.map((img) => (
                    <SortableImage
                      key={img.id}
                      image={img}
                      isCover={img.file_id === place.cover_image_id}
                      onDelete={() => handleDelete(img.id)}
                      onSetCover={() => handleSetCover(img.id)}
                      deleting={deletingId === img.id}
                      settingCover={settingCoverId === img.id}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <p className="text-xs text-muted-foreground">
            Sıralamayı değiştirmek için sürükleyip bırakın. Yıldız butonuyla kapak fotoğrafı seçin.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
