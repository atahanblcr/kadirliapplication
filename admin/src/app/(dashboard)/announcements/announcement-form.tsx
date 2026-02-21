'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { MultiSelect } from '@/components/ui/multi-select';
import { useAnnouncementTypes, useCreateAnnouncement, useUpdateAnnouncement } from '@/hooks/use-announcements';
import { NEIGHBORHOODS } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import type { AnnouncementListItem, CreateAnnouncementDto } from '@/types';

// ─── Validation Schema ────────────────────────────────────────────────────────
const schema = z
  .object({
    type_id: z.string().min(1, 'Tip seçin'),
    title: z.string().min(5, 'En az 5 karakter').max(200, 'En fazla 200 karakter'),
    body: z
      .string()
      .min(10, 'En az 10 karakter')
      .max(2000, 'En fazla 2000 karakter')
      .regex(/^[^<>]*$/, 'HTML içeremez'),
    priority: z.enum(['low', 'normal', 'high', 'emergency']),
    target_type: z.enum(['all', 'neighborhoods', 'users']),
    target_neighborhoods: z.array(z.string()).optional(),
    scheduled_for: z.string().optional(),
    visible_until: z.string().optional(),
    send_push_notification: z.boolean(),
    external_link: z.string().url('Geçerli URL girin').optional().or(z.literal('')),
    is_recurring: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.target_type === 'neighborhoods') {
        return (data.target_neighborhoods ?? []).length > 0;
      }
      return true;
    },
    { message: 'En az bir mahalle seçin', path: ['target_neighborhoods'] },
  );

type FormValues = z.infer<typeof schema>;

// ─── Neighborhood Options ─────────────────────────────────────────────────────
const NEIGHBORHOOD_OPTIONS = NEIGHBORHOODS.map((n) => ({
  value: n.toLowerCase(),
  label: n,
}));

// ─── Component ────────────────────────────────────────────────────────────────
interface AnnouncementFormProps {
  open: boolean;
  onClose: () => void;
  editItem?: AnnouncementListItem | null;
}

export function AnnouncementForm({ open, onClose, editItem }: AnnouncementFormProps) {
  const isEdit = !!editItem;
  const { data: types = [], isLoading: typesLoading } = useAnnouncementTypes();
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'normal',
      target_type: 'all',
      send_push_notification: true,
      is_recurring: false,
      target_neighborhoods: [],
    },
  });

  const targetType = watch('target_type');
  const bodyValue = watch('body') ?? '';

  // Populate form when editing
  useEffect(() => {
    if (editItem) {
      reset({
        type_id: editItem.type?.id ?? '',
        title: editItem.title,
        body: '',
        priority: editItem.priority,
        target_type: editItem.target_type,
        target_neighborhoods: editItem.target_neighborhoods ?? [],
        scheduled_for: editItem.scheduled_for
          ? new Date(editItem.scheduled_for).toISOString().slice(0, 16)
          : '',
        send_push_notification: true,
        is_recurring: false,
        external_link: '',
      });
    } else {
      reset({
        priority: 'normal',
        target_type: 'all',
        send_push_notification: true,
        is_recurring: false,
        target_neighborhoods: [],
      });
    }
  }, [editItem, reset, open]);

  const onSubmit = async (values: FormValues) => {
    const dto: CreateAnnouncementDto = {
      type_id: values.type_id,
      title: values.title,
      body: values.body,
      priority: values.priority,
      target_type: values.target_type,
      target_neighborhoods:
        values.target_type === 'neighborhoods' ? (values.target_neighborhoods ?? []) : undefined,
      scheduled_for: values.scheduled_for || undefined,
      visible_until: values.visible_until || undefined,
      send_push_notification: values.send_push_notification,
      external_link: values.external_link || undefined,
      is_recurring: values.is_recurring,
    };

    try {
      if (isEdit && editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, dto });
        toast({ title: 'Duyuru güncellendi' });
      } else {
        await createMutation.mutateAsync(dto);
        toast({ title: 'Duyuru oluşturuldu' });
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast({
        title: 'Hata',
        description: msg ?? 'İşlem başarısız oldu.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Oluştur'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Duyuru bilgilerini güncelleyin.'
              : 'Manuel duyurular yayınlandıktan hemen sonra aktif olur.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5 pb-6">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type_id">
              Duyuru Tipi <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="type_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={typesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tip seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="flex items-center gap-2">
                          {t.color && (
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: t.color }}
                            />
                          )}
                          {t.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type_id && (
              <p className="text-sm text-destructive">{errors.type_id.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Başlık <span className="text-destructive">*</span>
            </Label>
            <Input id="title" placeholder="Duyuru başlığı..." {...register('title')} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Body */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="body">
                İçerik <span className="text-destructive">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {bodyValue.length}/2000
              </span>
            </div>
            <Textarea
              id="body"
              rows={6}
              placeholder="Düz metin içerik (HTML kullanmayın)..."
              className="resize-none"
              {...register('body')}
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Öncelik</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Düşük</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Yüksek</SelectItem>
                    <SelectItem value="emergency">Acil</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Separator />

          {/* Target Type */}
          <div className="space-y-2">
            <Label>
              Hedef Kitle <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="target_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                    <SelectItem value="neighborhoods">Mahallelere Göre</SelectItem>
                    <SelectItem value="users">Belirli Kullanıcılar</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Neighborhoods Multi-Select — conditional */}
          {targetType === 'neighborhoods' && (
            <div className="space-y-2">
              <Label>
                Mahalleler <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="target_neighborhoods"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={NEIGHBORHOOD_OPTIONS}
                    selected={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Mahalle seçin..."
                    searchPlaceholder="Mahalle ara..."
                    emptyText="Mahalle bulunamadı."
                  />
                )}
              />
              {errors.target_neighborhoods && (
                <p className="text-sm text-destructive">
                  {errors.target_neighborhoods.message}
                </p>
              )}
            </div>
          )}

          <Separator />

          {/* Scheduled For */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_for">Zamanlanmış Gönderim (opsiyonel)</Label>
            <Input
              id="scheduled_for"
              type="datetime-local"
              {...register('scheduled_for')}
            />
          </div>

          {/* Visible Until */}
          <div className="space-y-2">
            <Label htmlFor="visible_until">Görünürlük Bitiş (opsiyonel)</Label>
            <Input
              id="visible_until"
              type="datetime-local"
              {...register('visible_until')}
            />
          </div>

          {/* External Link */}
          <div className="space-y-2">
            <Label htmlFor="external_link">Dış Bağlantı (opsiyonel)</Label>
            <Input
              id="external_link"
              type="url"
              placeholder="https://..."
              {...register('external_link')}
            />
            {errors.external_link && (
              <p className="text-sm text-destructive">{errors.external_link.message}</p>
            )}
          </div>

          <Separator />

          {/* Toggles */}
          <div className="space-y-4">
            <Controller
              name="send_push_notification"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Push Bildirim Gönder</p>
                    <p className="text-xs text-muted-foreground">
                      Kullanıcıların cihazlarına bildirim gönderir
                    </p>
                  </div>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              İptal
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : isEdit ? (
                'Güncelle'
              ) : (
                'Oluştur'
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
