import { differenceInDays, format } from 'date-fns';
import { tr } from 'date-fns/locale';

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
