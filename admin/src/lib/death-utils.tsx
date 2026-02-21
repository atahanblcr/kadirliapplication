import { Badge } from '@/components/ui/badge';
import { differenceInDays } from 'date-fns';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { DeathStatus } from '@/types';

export const DEATH_STATUS_CONFIG: Record<DeathStatus, { label: string; className: string }> = {
  pending:  { label: 'Bekliyor',    className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  approved: { label: 'Onaylı',      className: 'bg-green-100  text-green-700  border-green-200'  },
  rejected: { label: 'Reddedildi',  className: 'bg-red-100    text-red-700    border-red-200'    },
};

export const DEATH_REJECTION_REASONS = [
  'Hatalı bilgiler',
  'Sahte ilan',
  'Mükerrer ilan',
  'Kural ihlali',
  'Fotoğraf uygunsuz',
] as const;

export function DeathStatusBadge({ status }: { status: DeathStatus }) {
  const cfg = DEATH_STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}

export function formatFuneralDate(date: string, time: string): string {
  try {
    const d = new Date(`${date}T${time}`);
    return format(d, "dd MMM yyyy 'saat' HH:mm", { locale: tr });
  } catch {
    return `${date} ${time}`;
  }
}

export function calculateArchiveDaysLeft(autoArchiveAt: string): number {
  const archiveDate = new Date(autoArchiveAt);
  const now = new Date();
  return Math.max(0, differenceInDays(archiveDate, now));
}
