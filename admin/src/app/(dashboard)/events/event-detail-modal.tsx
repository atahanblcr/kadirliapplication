'use client';

import { MapPin, Clock, Users, Ticket, Globe, ExternalLink, CalendarDays, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { AdminEvent } from '@/types';

interface Props {
  event: AdminEvent | null;
  open: boolean;
  onClose: () => void;
  onEdit: (event: AdminEvent) => void;
}

const STATUS_LABELS: Record<string, string> = {
  published: 'Yayında',
  draft: 'Taslak',
  cancelled: 'İptal',
  archived: 'Arşiv',
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  published: 'default',
  draft: 'secondary',
  cancelled: 'destructive',
  archived: 'outline',
};

function formatDate(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

export function EventDetailModal({ event, open, onClose, onEdit }: Props) {
  if (!event) return null;

  const eventDate = new Date(event.event_date);
  const isPast = eventDate < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <DialogTitle className="leading-snug">{event.title}</DialogTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant={STATUS_VARIANTS[event.status]}>
                  {STATUS_LABELS[event.status]}
                </Badge>
                <Badge variant={event.is_local ? 'secondary' : 'outline'}>
                  {event.is_local ? 'Şehir İçi' : `Şehir Dışı${event.city ? ` · ${event.city}` : ''}`}
                </Badge>
                {isPast && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Geçmiş
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Tarih ve Saat */}
          <div className="flex items-start gap-3">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">{formatDate(event.event_date)}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTime(event.event_time)}</span>
                {event.duration_minutes && (
                  <span>({event.duration_minutes} dk)</span>
                )}
              </div>
            </div>
          </div>

          {/* Konum */}
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">{event.venue_name || 'Mekan belirtilmemiş'}</p>
              {event.venue_address && (
                <p className="text-xs text-muted-foreground">{event.venue_address}</p>
              )}
              {event.latitude && event.longitude && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Google Haritalar&apos;da Gör
                </a>
              )}
            </div>
          </div>

          {/* Organizatör */}
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm">
              <span className="text-muted-foreground mr-1">Organizatör:</span>
              {event.organizer || 'Belirtilmemiş'}
            </p>
          </div>

          {/* Bilet */}
          <div className="flex items-center gap-3">
            <Ticket className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm">
              {event.is_free
                ? 'Ücretsiz'
                : event.ticket_price
                  ? `₺${Number(event.ticket_price).toLocaleString('tr-TR')}`
                  : 'Ücretli (fiyat belirtilmemiş)'}
            </p>
          </div>

          {/* Açıklama */}
          {event.description && (
            <div className="space-y-2">
              <Separator />
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {event.website_url && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={event.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline truncate"
              >
                Etkinlik Web Sitesi
              </a>
            </div>
          )}

          <Separator />

          {/* Meta */}
          <p className="text-xs text-muted-foreground">
            Eklenme:{' '}
            {new Date(event.created_at).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Kapat
            </Button>
            <Button onClick={() => onEdit(event)}>Düzenle</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
