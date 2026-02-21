'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { Edit, Trash2, Plus, MapPin, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { IntracityRoute, IntracityStop } from '@/types';
import {
  useIntracityDetail,
  useDeleteStop,
  useReorderStop,
} from '@/hooks/use-intracity';
import { StopDialog } from './stop-dialog';

// ─── Sortable Stop Row ─────────────────────────────────────────────────────────

interface SortableStopProps {
  stop: IntracityStop;
  order: number;
  onEdit: (stop: IntracityStop) => void;
  onDelete: (id: string) => void;
}

function SortableStop({ stop, order, onEdit, onDelete }: SortableStopProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded-lg border bg-background"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
        type="button"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="text-xs font-bold w-6 text-center text-muted-foreground">{order}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{stop.name}</p>
        {stop.neighborhood_name && (
          <p className="text-xs text-muted-foreground">{stop.neighborhood_name}</p>
        )}
      </div>

      {stop.latitude && stop.longitude && (
        <a
          href={`https://maps.google.com/?q=${stop.latitude},${stop.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
          title="Haritada görüntüle"
        >
          <MapPin className="h-4 w-4" />
        </a>
      )}

      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        onClick={() => onEdit(stop)}
      >
        <Edit className="h-3 w-3" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-destructive hover:text-destructive"
        onClick={() => onDelete(stop.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface IntracityDetailModalProps {
  open: boolean;
  onClose: () => void;
  routeId: string;
}

export function IntracityDetailModal({ open, onClose, routeId }: IntracityDetailModalProps) {
  const { data: route, isLoading } = useIntracityDetail(routeId);
  const deleteStop = useDeleteStop();
  const reorderStop = useReorderStop();

  const [stopDialogOpen, setStopDialogOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<IntracityStop | null>(null);
  const [deletingStopId, setDeletingStopId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const stops = route?.stops ?? [];

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !route) return;

    const oldIndex = stops.findIndex((s) => s.id === active.id);
    const newIndex = stops.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Call API to reorder
    try {
      await reorderStop.mutateAsync({
        stopId: String(active.id),
        routeId: route.id,
        new_order: newIndex + 1,
      });
    } catch {
      toast.error('Sıralama güncellenemedi');
    }
  }

  async function handleDeleteStop() {
    if (!deletingStopId || !route) return;
    try {
      await deleteStop.mutateAsync({ stopId: deletingStopId, routeId: route.id });
      toast.success('Durak silindi');
    } catch {
      toast.error('Durak silinemedi');
    } finally {
      setDeletingStopId(null);
    }
  }

  function openAddStop() {
    setEditingStop(null);
    setStopDialogOpen(true);
  }

  function openEditStop(stop: IntracityStop) {
    setEditingStop(stop);
    setStopDialogOpen(true);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hat Detayı</DialogTitle>
          </DialogHeader>

          {isLoading && (
            <div className="py-8 text-center text-muted-foreground">Yükleniyor...</div>
          )}

          {route && (
            <div className="space-y-6">
              {/* Hat Bilgileri */}
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">HAT BİLGİLERİ</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: route.color ?? '#3B82F6' }}
                    >
                      {route.line_number}
                    </div>
                    <div>
                      <p className="font-medium">{route.name}</p>
                      <p className="text-xs text-muted-foreground">Hat No: {route.line_number}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Durum</p>
                    <Badge variant={route.is_active ? 'default' : 'secondary'}>
                      {route.is_active ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sefer Saatleri</p>
                    <p className="font-medium">
                      {route.first_departure?.slice(0, 5)} – {route.last_departure?.slice(0, 5)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sıklık</p>
                    <p className="font-medium">{route.frequency_minutes} dakikada bir</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ücret</p>
                    <p className="font-medium text-green-600">₺{Number(route.fare).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Durak Sayısı</p>
                    <p className="font-medium">{stops.length}</p>
                  </div>
                </div>
              </div>

              {/* Duraklar */}
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    DURAKLAR ({stops.length})
                  </h3>
                  <Button size="sm" variant="outline" onClick={openAddStop}>
                    <Plus className="h-3 w-3 mr-1" />
                    Durak Ekle
                  </Button>
                </div>

                {stops.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Henüz durak eklenmemiş
                  </p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={stops.map((s) => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {stops.map((stop, index) => (
                          <SortableStop
                            key={stop.id}
                            stop={stop}
                            order={index + 1}
                            onEdit={openEditStop}
                            onDelete={(id) => setDeletingStopId(id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stop Add/Edit Dialog */}
      {route && (
        <StopDialog
          open={stopDialogOpen}
          onClose={() => setStopDialogOpen(false)}
          routeId={route.id}
          editStop={editingStop}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingStopId}
        onOpenChange={(v) => !v && setDeletingStopId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Durağı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu durak kalıcı olarak silinecek ve sonraki duraklar yeniden numaralandırılacak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStop}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
