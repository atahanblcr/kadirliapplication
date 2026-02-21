'use client';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Eye, MousePointer, Link2, FileText,
  Send, Pencil, Trash2, Loader2, RefreshCw, MapPin, Users, Globe,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnnouncement, useSendAnnouncement } from '@/hooks/use-announcements';
import { PriorityBadge, StatusBadge, SourceBadge } from '@/lib/announcement-utils';
import type { AnnouncementListItem } from '@/types';
import { toast } from '@/hooks/use-toast';

interface DetailModalProps {
  item: AnnouncementListItem | null;
  onClose: () => void;
  onEdit: (item: AnnouncementListItem) => void;
  onDelete: (item: AnnouncementListItem) => void;
}

const TARGET_LABELS = {
  all: { icon: Globe, label: 'Tüm Kullanıcılar' },
  neighborhoods: { icon: MapPin, label: 'Mahalleler' },
  users: { icon: Users, label: 'Belirli Kullanıcılar' },
};

export function AnnouncementDetailModal({ item, onClose, onEdit, onDelete }: DetailModalProps) {
  const { data: announcement, isLoading } = useAnnouncement(item?.id ?? null);
  const sendMutation = useSendAnnouncement();

  if (!item) return null;

  const handleSend = async () => {
    try {
      const result = await sendMutation.mutateAsync(item.id);
      toast({
        title: 'Duyuru gönderiliyor',
        description: `Tahmini alıcı: ${result.estimated_recipients?.toLocaleString('tr-TR') ?? 0} kişi`,
      });
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Gönderilemedi.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-8 text-lg leading-snug">{item.title}</DialogTitle>
        </DialogHeader>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={item.status} />
          <PriorityBadge priority={item.priority} />
          <SourceBadge source={item.source} />
        </div>

        <Separator />

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : announcement ? (
          <div className="space-y-5">
            {/* Body */}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">İçerik</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{announcement.body}</p>
            </div>

            <Separator />

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Type */}
              <div>
                <p className="text-xs text-muted-foreground">Tip</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {announcement.type?.color && (
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: announcement.type.color }}
                    />
                  )}
                  <span className="font-medium">{announcement.type?.name ?? '—'}</span>
                </div>
              </div>

              {/* Target */}
              <div>
                <p className="text-xs text-muted-foreground">Hedef</p>
                {(() => {
                  const cfg = TARGET_LABELS[announcement.target_type];
                  const Icon = cfg.icon;
                  return (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{cfg.label}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Neighborhoods */}
              {announcement.target_neighborhoods && announcement.target_neighborhoods.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Hedef Mahalleler</p>
                  <p className="mt-0.5 font-medium">
                    {announcement.target_neighborhoods.join(', ')}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div>
                <p className="text-xs text-muted-foreground">Görüntülenme</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{announcement.view_count.toLocaleString('tr-TR')}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tıklanma</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{announcement.click_count.toLocaleString('tr-TR')}</span>
                </div>
              </div>

              {/* Dates */}
              <div>
                <p className="text-xs text-muted-foreground">Oluşturulma</p>
                <p className="mt-0.5 font-medium">
                  {format(new Date(announcement.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                </p>
              </div>
              {announcement.sent_at && (
                <div>
                  <p className="text-xs text-muted-foreground">Gönderilme</p>
                  <p className="mt-0.5 font-medium">
                    {format(new Date(announcement.sent_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                  </p>
                </div>
              )}
              {announcement.scheduled_for && (
                <div>
                  <p className="text-xs text-muted-foreground">Zamanlandı</p>
                  <p className="mt-0.5 font-medium">
                    {format(new Date(announcement.scheduled_for), 'dd MMM yyyy HH:mm', { locale: tr })}
                  </p>
                </div>
              )}

              {/* PDF */}
              {announcement.pdf_file && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">PDF Dosyası</p>
                  <a
                    href={announcement.pdf_file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 mt-0.5 text-primary hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{announcement.pdf_file.name}</span>
                  </a>
                </div>
              )}

              {/* External Link */}
              {announcement.external_link && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Dış Bağlantı</p>
                  <a
                    href={announcement.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 mt-0.5 text-primary hover:underline break-all"
                  >
                    <Link2 className="h-4 w-4 shrink-0" />
                    <span>{announcement.external_link}</span>
                  </a>
                </div>
              )}

              {/* Creator */}
              {announcement.creator && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Oluşturan</p>
                  <p className="mt-0.5 font-medium">
                    {announcement.creator.full_name ?? announcement.creator.username}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({announcement.creator.role})
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <Separator />
        <div className="flex flex-wrap gap-2 justify-end">
          {item.status !== 'published' && item.status !== 'archived' && (
            <Button
              size="sm"
              onClick={handleSend}
              disabled={sendMutation.isPending}
            >
              {sendMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Şimdi Gönder
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
            <Pencil className="mr-2 h-4 w-4" />
            Düzenle
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(item)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Sil
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
