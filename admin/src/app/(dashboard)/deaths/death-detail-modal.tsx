'use client';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  CalendarDays, Clock, MapPin, Church, Archive,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  formatFuneralDate,
  calculateArchiveDaysLeft,
} from '@/lib/death-utils';
import type { DeathNotice } from '@/types';

interface DeathDetailModalProps {
  item: DeathNotice | null;
  onClose: () => void;
}

function InfoRow({
  icon,
  label,
  value,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline truncate block"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

export function DeathDetailModal({ item, onClose }: DeathDetailModalProps) {
  if (!item) return null;

  const daysLeft = calculateArchiveDaysLeft(item.auto_archive_at);

  return (
    <Dialog open={!!item} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-start gap-4 pr-8">
            <div>
              <DialogTitle className="text-xl">{item.deceased_name}</DialogTitle>
              {item.age && (
                <p className="text-sm text-muted-foreground mt-0.5">{item.age} yaşında</p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Photo */}
          {(item.photo_file?.cdn_url || item.photo_file?.url) && (
            <div className="flex justify-center">
              <img
                src={item.photo_file.cdn_url ?? item.photo_file.url}
                alt={item.deceased_name}
                className="h-40 w-40 rounded-full object-cover border-4 border-muted"
              />
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
              label="Defin Tarihi ve Saati"
              value={formatFuneralDate(item.funeral_date, item.funeral_time)}
            />

            {item.cemetery && (
              <InfoRow
                icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                label="Mezarlık"
                value={item.cemetery.name}
                link={
                  item.cemetery.latitude
                    ? `https://maps.google.com/?q=${item.cemetery.latitude},${item.cemetery.longitude}`
                    : undefined
                }
              />
            )}

            {item.mosque && (
              <InfoRow
                icon={<Church className="h-4 w-4 text-muted-foreground" />}
                label="Namaz Kılınacak Cami"
                value={item.mosque.name}
                link={
                  item.mosque.latitude
                    ? `https://maps.google.com/?q=${item.mosque.latitude},${item.mosque.longitude}`
                    : undefined
                }
              />
            )}

            {item.condolence_address && (
              <InfoRow
                icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                label="Taziye Adresi"
                value={item.condolence_address}
              />
            )}

            {item.neighborhood && (
              <InfoRow
                icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                label="Mahalle"
                value={item.neighborhood.name}
              />
            )}

            <InfoRow
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              label="Eklenme Tarihi"
              value={format(new Date(item.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
            />

            <InfoRow
              icon={<Archive className="h-4 w-4 text-muted-foreground" />}
              label="Otomatik Arşivleme"
              value={
                daysLeft > 0
                  ? `${daysLeft} gün sonra (${format(new Date(item.auto_archive_at), 'dd MMM', { locale: tr })})`
                  : format(new Date(item.auto_archive_at), 'dd MMM yyyy', { locale: tr })
              }
            />
          </div>

          <Separator />
        </div>
      </DialogContent>
    </Dialog>
  );
}
