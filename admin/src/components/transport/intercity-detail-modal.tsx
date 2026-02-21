'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
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
import { Edit, Trash2, Plus, Phone, Globe, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { IntercityRoute, IntercitySchedule } from '@/types';
import { useIntercityDetail, useDeleteSchedule, useUpdateSchedule } from '@/hooks/use-intercity';
import { ScheduleDialog, formatDays } from './schedule-dialog';
import { formatDuration } from './intercity-form';

interface IntercityDetailModalProps {
  open: boolean;
  onClose: () => void;
  routeId: string;
}

export function IntercityDetailModal({ open, onClose, routeId }: IntercityDetailModalProps) {
  const { data: route, isLoading } = useIntercityDetail(routeId);
  const deleteSchedule = useDeleteSchedule();
  const updateSchedule = useUpdateSchedule();

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<IntercitySchedule | null>(null);
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(null);

  async function handleDeleteSchedule() {
    if (!deletingScheduleId || !route) return;
    try {
      await deleteSchedule.mutateAsync({ scheduleId: deletingScheduleId, routeId: route.id });
      toast.success('Sefer silindi');
    } catch {
      toast.error('Sefer silinemedi');
    } finally {
      setDeletingScheduleId(null);
    }
  }

  async function handleToggleSchedule(schedule: IntercitySchedule) {
    if (!route) return;
    try {
      await updateSchedule.mutateAsync({
        scheduleId: schedule.id,
        routeId: route.id,
        is_active: !schedule.is_active,
      });
      toast.success(schedule.is_active ? 'Sefer pasife alındı' : 'Sefer aktifleştirildi');
    } catch {
      toast.error('İşlem başarısız');
    }
  }

  function openAddSchedule() {
    setEditingSchedule(null);
    setScheduleDialogOpen(true);
  }

  function openEditSchedule(schedule: IntercitySchedule) {
    setEditingSchedule(schedule);
    setScheduleDialogOpen(true);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  <div>
                    <p className="text-xs text-muted-foreground">Firma</p>
                    <p className="font-medium">{route.company_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Güzergah</p>
                    <p className="font-medium">
                      {route.from_city} → {route.to_city}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Yolculuk Süresi</p>
                    <p className="font-medium">{formatDuration(route.duration_minutes)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bilet Fiyatı</p>
                    <p className="font-medium text-green-600">₺{route.price.toFixed(2)}</p>
                  </div>
                  {route.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{route.contact_phone}</span>
                    </div>
                  )}
                  {route.contact_website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <a
                        href={route.contact_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate"
                      >
                        {route.contact_website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Özellikler */}
              {route.amenities && route.amenities.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">ÖZELLİKLER</h3>
                    <div className="flex flex-wrap gap-2">
                      {route.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Sefer Saatleri */}
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    SEFER SAATLERİ ({route.schedules?.length ?? 0} sefer)
                  </h3>
                  <Button size="sm" variant="outline" onClick={openAddSchedule}>
                    <Plus className="h-3 w-3 mr-1" />
                    Sefer Ekle
                  </Button>
                </div>

                {!route.schedules || route.schedules.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Henüz sefer eklenmemiş
                  </p>
                ) : (
                  <div className="space-y-2">
                    {[...(route.schedules ?? [])]
                      .sort((a, b) => a.departure_time.localeCompare(b.departure_time))
                      .map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex items-center gap-3 p-2 rounded-lg border"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-mono font-semibold w-12">
                              {schedule.departure_time.slice(0, 5)}
                            </span>
                            <span className="text-sm text-muted-foreground truncate">
                              {formatDays(schedule.days_of_week)}
                            </span>
                          </div>
                          <Switch
                            checked={schedule.is_active}
                            onCheckedChange={() => handleToggleSchedule(schedule)}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => openEditSchedule(schedule)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setDeletingScheduleId(schedule.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Add/Edit Dialog */}
      {route && (
        <ScheduleDialog
          open={scheduleDialogOpen}
          onClose={() => setScheduleDialogOpen(false)}
          routeId={route.id}
          editSchedule={editingSchedule}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingScheduleId}
        onOpenChange={(v) => !v && setDeletingScheduleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Seferi Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu sefer kalıcı olarak silinecek.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSchedule}
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
