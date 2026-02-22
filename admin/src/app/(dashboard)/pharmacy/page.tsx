'use client';

import { useState, useMemo } from 'react';
import {
  startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, format, addMonths, subMonths, isToday,
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, RefreshCw, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from '@/components/ui/tooltip';
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
import { usePharmacies, usePharmacySchedule, useDeletePharmacy } from '@/hooks/use-pharmacy';
import { PharmacyForm } from './pharmacy-form';
import { ScheduleDialog } from './schedule-dialog';
import { toast } from '@/hooks/use-toast';
import type { Pharmacy, PharmacySchedule } from '@/types';

const WEEK_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

// ─── Month Calendar ───────────────────────────────────────────────────────────
function MonthCalendar({
  month,
  scheduleMap,
  onDayClick,
  isLoading,
}: {
  month: Date;
  scheduleMap: Map<string, PharmacySchedule>;
  onDayClick: (day: Date, existing: PharmacySchedule | null) => void;
  isLoading: boolean;
}) {
  const days = useMemo(() => {
    const start = startOfMonth(month);
    const end   = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  }, [month]);

  // getDay() returns 0=Sun..6=Sat → convert to Mon=0..Sun=6
  const firstDayOffset = useMemo(() => {
    const d = getDay(startOfMonth(month));
    return d === 0 ? 6 : d - 1;
  }, [month]);

  const cells: (Date | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...days,
  ];
  const remainder = cells.length % 7;
  if (remainder !== 0) cells.push(...Array(7 - remainder).fill(null));

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="grid grid-cols-7 border-b">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) {
            return (
              <div
                key={`empty-${i}`}
                className="min-h-[72px] border-r border-b last:border-r-0 bg-muted/20"
              />
            );
          }

          const dateStr  = format(day, 'yyyy-MM-dd');
          const schedule = scheduleMap.get(dateStr) ?? null;
          const today    = isToday(day);

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onDayClick(day, schedule)}
              className={[
                'min-h-[72px] p-1.5 border-r border-b last:border-r-0 text-left',
                'transition-colors hover:bg-muted/50 focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
                today ? 'bg-primary/5' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                  today ? 'bg-primary text-primary-foreground' : 'text-foreground',
                ].join(' ')}
              >
                {format(day, 'd')}
              </span>

              {isLoading ? (
                <Skeleton className="mt-1 h-3 w-full" />
              ) : schedule ? (
                <p className="mt-1 text-[10px] leading-tight font-medium text-green-700 bg-green-100 rounded px-1 py-0.5 truncate">
                  {schedule.pharmacy_name}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Pharmacies Tab ───────────────────────────────────────────────────────────
function PharmaciesTab({
  onAdd,
  onEdit,
}: {
  onAdd: () => void;
  onEdit: (p: Pharmacy) => void;
}) {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Pharmacy | null>(null);
  const deleteMutation = useDeletePharmacy();
  const { data: pharmacies = [], isLoading, isFetching, refetch } = usePharmacies(search || undefined);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast({ title: `"${deleteTarget.name}" silindi.` });
      setDeleteTarget(null);
    } catch {
      toast({ title: 'Hata', description: 'Silinemedi.', variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Eczane adı veya adres ara..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {pharmacies.length} eczane
          </p>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
            <Button size="sm" onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Eczane
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Adres</TableHead>
                <TableHead>Çalışma Saatleri</TableHead>
                <TableHead>Eczacı</TableHead>
                <TableHead className="w-[90px]">Durum</TableHead>
                <TableHead className="w-[80px] text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : pharmacies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
                    Henüz eczane eklenmemiş.
                  </TableCell>
                </TableRow>
              ) : (
                pharmacies.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {p.phone ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {p.address}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.working_hours ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.pharmacist_name ?? '—'}
                    </TableCell>
                    <TableCell>
                      {p.is_active ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                          Pasif
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(p)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Düzenle</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => setDeleteTarget(p)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Sil</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eczaneyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Schedule Tab ─────────────────────────────────────────────────────────────
function ScheduleTab({ pharmacies }: { pharmacies: Pharmacy[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay]   = useState<Date | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<PharmacySchedule | null>(null);

  const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
  const endDate   = format(endOfMonth(currentMonth),   'yyyy-MM-dd');

  const { data: schedule = [], isLoading } = usePharmacySchedule(startDate, endDate);

  const scheduleMap = useMemo(() => {
    const map = new Map<string, PharmacySchedule>();
    schedule.forEach((s) => map.set(s.duty_date, s));
    return map;
  }, [schedule]);

  const assignedCount = scheduleMap.size;
  const daysInMonth   = endOfMonth(currentMonth).getDate();

  const handleDayClick = (day: Date, existing: PharmacySchedule | null) => {
    setSelectedDay(day);
    setSelectedSchedule(existing);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold min-w-[180px] text-center capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: tr })}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {assignedCount} / {daysInMonth} gün nöbetçi atandı
        </p>
      </div>

      <MonthCalendar
        month={currentMonth}
        scheduleMap={scheduleMap}
        onDayClick={handleDayClick}
        isLoading={isLoading}
      />

      <p className="text-xs text-muted-foreground">
        Güne tıklayarak nöbet atayabilir veya mevcut nöbeti değiştirebilirsiniz.
      </p>

      <ScheduleDialog
        date={selectedDay}
        existing={selectedSchedule}
        pharmacies={pharmacies}
        onClose={() => { setSelectedDay(null); setSelectedSchedule(null); }}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PharmacyPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing]   = useState<Pharmacy | null>(null);

  const { data: pharmacies = [] } = usePharmacies();

  const openAdd  = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (p: Pharmacy) => { setEditing(p); setFormOpen(true); };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nöbetçi Eczane</h1>
        <p className="text-sm text-muted-foreground">
          Eczane yönetimi ve nöbet takvimi
        </p>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Eczaneler</TabsTrigger>
          <TabsTrigger value="schedule">Nöbet Takvimi</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <PharmaciesTab onAdd={openAdd} onEdit={openEdit} />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleTab pharmacies={pharmacies} />
        </TabsContent>
      </Tabs>

      <PharmacyForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        editing={editing}
      />
    </div>
  );
}
