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

  const isPast = event.event_date < new Date().toISOString().slice(0, 10);
  const mapsUrl =
    event.latitude && event.longitude
      ? `https://www.google.com/maps?q=${event.latitude},${event.longitude}`
      : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
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

        <div className="space-y-4">
          {/* Kategori */}
          {event.category && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{event.category.name}</span>
              {event.category.icon && <span>{event.category.icon}</span>}
            </div>
          )}

          {/* Tarih & Saat */}
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{formatDate(event.event_date)}</p>
              <p className="text-sm text-muted-foreground">
                {formatTime(event.event_time)}
                {event.duration_minutes && ` · ${event.duration_minutes} dk`}
              </p>
            </div>
          </div>

          {/* Mekan */}
          {(event.venue_name || event.venue_address) && (
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                {event.venue_name && (
                  <p className="text-sm font-medium">{event.venue_name}</p>
                )}
                {event.venue_address && (
                  <p className="text-sm text-muted-foreground">{event.venue_address}</p>
                )}
              </div>
            </div>
          )}

          {/* Koordinat / Harita */}
          {mapsUrl && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Google Haritalar'da Gör
              </a>
            </div>
          )}

          {/* Organizatör */}
          {event.organizer && (
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm">{event.organizer}</p>
            </div>
          )}

          {/* Kapasite */}
          {event.capacity && (
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm">{event.capacity} kişi kapasiteli</p>
            </div>
          )}

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
            <>
              <Separator />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {event.description}
              </p>
            </>
          )}

          {/* Linkler */}
          {(event.website_url || event.ticket_url) && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {event.website_url && (
                  <a href={event.website_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Globe className="mr-1.5 h-3.5 w-3.5" />
                      Web Sitesi
                    </Button>
                  </a>
                )}
                {event.ticket_url && (
                  <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Ticket className="mr-1.5 h-3.5 w-3.5" />
                      Bilet Al
                    </Button>
                  </a>
                )}
              </div>
            </>
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
            <Button onClick={() => { onClose(); onEdit(event); }}>
              Düzenle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
