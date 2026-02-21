import { Badge } from '@/components/ui/badge';
import { format, isAfter, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { CampaignStatus } from '@/types';

export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, { label: string; className: string }> = {
  pending:  { label: 'Bekliyor',    className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  approved: { label: 'Onaylı',      className: 'bg-green-100  text-green-700  border-green-200'  },
  rejected: { label: 'Reddedildi',  className: 'bg-red-100    text-red-700    border-red-200'    },
};

export const CAMPAIGN_REJECTION_REASONS = [
  'Yanıltıcı kampanya içeriği',
  'Geçersiz işletme',
  'Uygunsuz görsel',
  'Mükerrer kampanya',
  'Diğer',
] as const;

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const cfg = CAMPAIGN_STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}

export function formatDiscountRate(rate: number): string {
  return `%${rate}`;
}

export function formatValidityRange(validFrom: string, validUntil: string): string {
  try {
    const from  = format(parseISO(validFrom),  'dd MMM yyyy', { locale: tr });
    const until = format(parseISO(validUntil), 'dd MMM yyyy', { locale: tr });
    return `${from} – ${until}`;
  } catch {
    return `${validFrom} – ${validUntil}`;
  }
}

export function isCampaignActive(validFrom: string, validUntil: string): boolean {
  const now = new Date();
  return isAfter(parseISO(validUntil), now) && !isAfter(parseISO(validFrom), now);
}
