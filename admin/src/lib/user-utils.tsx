import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { UserRole } from '@/types';

// ─── Role Config ──────────────────────────────────────────────────────────────
export const USER_ROLE_CONFIG: Record<
  UserRole,
  { label: string; className: string }
> = {
  user:        { label: 'Kullanıcı',    className: 'bg-gray-100   text-gray-700   border-gray-200'   },
  taxi_driver: { label: 'Taksi Şoförü', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  business:    { label: 'İşletme',      className: 'bg-blue-100   text-blue-700   border-blue-200'   },
  moderator:   { label: 'Moderatör',    className: 'bg-purple-100 text-purple-700 border-purple-200' },
  admin:       { label: 'Admin',        className: 'bg-orange-100 text-orange-700 border-orange-200' },
  super_admin: { label: 'Süper Admin',  className: 'bg-red-100    text-red-700    border-red-200'    },
};

export function UserRoleBadge({ role }: { role: UserRole }) {
  const cfg = USER_ROLE_CONFIG[role] ?? USER_ROLE_CONFIG.user;
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function UserStatusBadge({
  is_banned,
  is_active,
}: {
  is_banned: boolean;
  is_active: boolean;
}) {
  if (is_banned) {
    return (
      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
        Banlı
      </Badge>
    );
  }
  if (!is_active) {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
        Pasif
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
      Aktif
    </Badge>
  );
}

// ─── Role options for dropdown (excludes super_admin) ─────────────────────────
export const CHANGEABLE_ROLES: UserRole[] = [
  'user',
  'taxi_driver',
  'business',
  'moderator',
  'admin',
];

// ─── Ban reasons ──────────────────────────────────────────────────────────────
export const BAN_REASONS = [
  'Spam',
  'Uygunsuz içerik',
  'Sahte hesap',
  'Sistem kötüye kullanımı',
  'Hakaret ve taciz',
  'Diğer',
] as const;

// ─── Ban duration options ─────────────────────────────────────────────────────
export const BAN_DURATIONS: { label: string; value?: number }[] = [
  { label: '1 gün',     value: 1   },
  { label: '7 gün',     value: 7   },
  { label: '30 gün',    value: 30  },
  { label: 'Kalıcı',   value: undefined },
];

// ─── Date helpers ─────────────────────────────────────────────────────────────
export function formatLastLogin(date?: string): string {
  if (!date) return '—';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr });
  } catch {
    return date;
  }
}

export function formatCreatedAt(date: string): string {
  try {
    return format(new Date(date), 'dd MMM yyyy', { locale: tr });
  } catch {
    return date;
  }
}
