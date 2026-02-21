import { Badge } from '@/components/ui/badge';
import type { AdStatus } from '@/types';

export const AD_STATUS_CONFIG: Record<AdStatus, { label: string; className: string }> = {
  pending:  { label: 'Bekliyor',     className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  approved: { label: 'Onaylı',       className: 'bg-green-100  text-green-700  border-green-200'  },
  rejected: { label: 'Reddedildi',   className: 'bg-red-100    text-red-700    border-red-200'    },
  expired:  { label: 'Süresi Doldu', className: 'bg-gray-100   text-gray-600   border-gray-200'   },
  sold:     { label: 'Satıldı',      className: 'bg-blue-100   text-blue-700   border-blue-200'   },
};

export const REJECTION_REASONS = [
  'Müstehcen içerik',
  'Hatalı bilgiler',
  'Kural dışı',
  'Spam',
] as const;

export function AdStatusBadge({ status }: { status: AdStatus }) {
  const cfg = AD_STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}

export function formatPrice(price?: number): string {
  if (price == null) return 'Fiyat yok';
  return price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
}

export function formatCategoryPath(category: { name: string; parent?: { name: string } }): string {
  return category.parent ? `${category.parent.name} › ${category.name}` : category.name;
}
