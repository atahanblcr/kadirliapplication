import { Badge } from '@/components/ui/badge';
import type { AnnouncementPriority, AnnouncementStatus, AnnouncementSource } from '@/types';

export const PRIORITY_CONFIG: Record<
  AnnouncementPriority,
  { label: string; className: string }
> = {
  emergency: { label: 'Acil', className: 'bg-red-100 text-red-700 border-red-200' },
  high: { label: 'Yüksek', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  normal: { label: 'Normal', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  low: { label: 'Düşük', className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export const STATUS_CONFIG: Record<
  AnnouncementStatus,
  { label: string; className: string }
> = {
  published: { label: 'Yayında', className: 'bg-green-100 text-green-700 border-green-200' },
  draft: { label: 'Taslak', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  scheduled: { label: 'Zamanlandı', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  archived: { label: 'Arşiv', className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export const SOURCE_CONFIG: Record<
  AnnouncementSource,
  { label: string; className: string }
> = {
  manual: { label: 'Manuel', className: 'bg-blue-50 text-blue-600 border-blue-200' },
  scraping: { label: 'Scraper', className: 'bg-purple-50 text-purple-600 border-purple-200' },
  api: { label: 'API', className: 'bg-gray-50 text-gray-600 border-gray-200' },
};

export function PriorityBadge({ priority }: { priority: AnnouncementPriority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: AnnouncementStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export function SourceBadge({ source }: { source: AnnouncementSource }) {
  const config = SOURCE_CONFIG[source];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
