'use client';

import { useState } from 'react';
import {
  Search, RefreshCw, Eye, ShieldOff, CheckCircle2,
  Loader2, Users, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUsers, useBanUser, useUnbanUser } from '@/hooks/use-users';
import {
  UserRoleBadge,
  UserStatusBadge,
  USER_ROLE_CONFIG,
  BAN_REASONS,
  BAN_DURATIONS,
  formatLastLogin,
  formatCreatedAt,
} from '@/lib/user-utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { UserDetailModal } from './user-detail-modal';
import { toast } from '@/hooks/use-toast';
import type { User, UserFilters, UserRole } from '@/types';

const PAGE_SIZE = 50;

// ─── Table Skeleton ───────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 8 }).map((__, j) => (
            <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── User Row ─────────────────────────────────────────────────────────────────
function UserRow({
  user,
  onView,
  onBan,
  onUnban,
}: {
  user: User;
  onView: (u: User) => void;
  onBan: (u: User) => void;
  onUnban: (u: User) => void;
}) {
  return (
    <TableRow className={user.is_banned ? 'bg-red-50/50' : undefined}>
      {/* User */}
      <TableCell>
        <button
          type="button"
          className="text-left font-medium hover:text-primary hover:underline"
          onClick={() => onView(user)}
        >
          {user.username}
        </button>
        {user.email && (
          <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</p>
        )}
      </TableCell>

      {/* Phone */}
      <TableCell className="text-sm text-muted-foreground font-mono">
        {user.phone}
      </TableCell>

      {/* Neighborhood */}
      <TableCell className="text-sm text-muted-foreground">
        {user.primary_neighborhood?.name ?? '—'}
      </TableCell>

      {/* Role */}
      <TableCell>
        <UserRoleBadge role={user.role} />
      </TableCell>

      {/* Status */}
      <TableCell>
        <UserStatusBadge is_banned={user.is_banned} is_active={user.is_active} />
      </TableCell>

      {/* Last Login */}
      <TableCell className="text-sm text-muted-foreground">
        {formatLastLogin(user.last_login)}
      </TableCell>

      {/* Created At */}
      <TableCell className="text-sm text-muted-foreground">
        {formatCreatedAt(user.created_at)}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(user)}>
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Detay</TooltipContent>
          </Tooltip>

          {user.is_banned ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600"
                  onClick={() => onUnban(user)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Banı Kaldır</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onBan(user)}
                >
                  <ShieldOff className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Banla</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState<UserRole | 'all'>('all');
  const [bannedFilter, setBannedFilter] = useState<'all' | 'banned' | 'active'>('all');

  const [detailUserId, setDetailUserId] = useState<string | null>(null);

  // Quick-ban from table row
  const [banTarget, setBanTarget]     = useState<User | null>(null);
  const [unbanTarget, setUnbanTarget] = useState<User | null>(null);
  const [banReason, setBanReason]     = useState('');
  const [banNote, setBanNote]         = useState('');
  const [banDuration, setBanDuration] = useState<string>('7');

  const banMutation   = useBanUser();
  const unbanMutation = useUnbanUser();

  const filters: UserFilters = {
    limit: PAGE_SIZE,
    page,
    search: search || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    is_banned: bannedFilter === 'banned' ? true : bannedFilter === 'active' ? false : undefined,
  };

  const { data, isLoading, isFetching, refetch } = useUsers(filters);

  // Stats
  const { data: totalData }  = useUsers({ limit: 1 });
  const { data: bannedData } = useUsers({ limit: 1, is_banned: true });

  const users = data?.items ?? [];
  const meta  = data?.meta;
  const totalUsers  = totalData?.meta?.total ?? 0;
  const totalBanned = bannedData?.meta?.total ?? 0;

  const handleBan = async () => {
    if (!banTarget || !banReason) return;
    const duration = banDuration === 'permanent' ? undefined : Number(banDuration);
    try {
      await banMutation.mutateAsync({
        id: banTarget.id,
        ban_reason: banNote || banReason,
        duration_days: duration,
      });
      toast({ title: `"${banTarget.username}" banlandı.` });
      setBanTarget(null);
      setBanReason('');
      setBanNote('');
      setBanDuration('7');
    } catch {
      toast({ title: 'Hata', description: 'Ban işlemi başarısız.', variant: 'destructive' });
    }
  };

  const handleUnban = async () => {
    if (!unbanTarget) return;
    try {
      await unbanMutation.mutateAsync(unbanTarget.id);
      toast({ title: `"${unbanTarget.username}" banı kaldırıldı.` });
      setUnbanTarget(null);
    } catch {
      toast({ title: 'Hata', description: 'Ban kaldırılamadı.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kullanıcılar</h1>
        <p className="text-sm text-muted-foreground">Kullanıcı yönetimi, ban ve rol işlemleri</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Toplam Kullanıcı</p>
            <p className="text-lg font-bold">{totalUsers.toLocaleString('tr-TR')}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <ShieldOff className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-xs text-muted-foreground">Banlı</p>
            <p className="text-lg font-bold text-red-600">{totalBanned.toLocaleString('tr-TR')}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-xs text-muted-foreground">Aktif</p>
            <p className="text-lg font-bold text-green-600">
              {(totalUsers - totalBanned).toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Telefon veya kullanıcı adı ara..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <Select
          value={roleFilter}
          onValueChange={(v) => { setRoleFilter(v as UserRole | 'all'); setPage(1); }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tüm Roller" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Roller</SelectItem>
            {(Object.keys(USER_ROLE_CONFIG) as UserRole[]).map((r) => (
              <SelectItem key={r} value={r}>{USER_ROLE_CONFIG[r].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={bannedFilter}
          onValueChange={(v) => { setBannedFilter(v as 'all' | 'banned' | 'active'); setPage(1); }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="banned">Banlı</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Mahalle</TableHead>
              <TableHead className="w-[110px]">Rol</TableHead>
              <TableHead className="w-[90px]">Durum</TableHead>
              <TableHead>Son Giriş</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead className="w-[80px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-16 text-center text-muted-foreground">
                  Kullanıcı bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onView={(u) => setDetailUserId(u.id)}
                  onBan={(u) => setBanTarget(u)}
                  onUnban={(u) => setUnbanTarget(u)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {((page - 1) * PAGE_SIZE + 1)}–{Math.min(page * PAGE_SIZE, meta.total)} / {meta.total.toLocaleString('tr-TR')}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={!meta.has_prev} onClick={() => setPage((p) => p - 1)}>
              Önceki
            </Button>
            <Button variant="outline" size="sm" disabled={!meta.has_next} onClick={() => setPage((p) => p + 1)}>
              Sonraki
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <UserDetailModal
        userId={detailUserId}
        onClose={() => setDetailUserId(null)}
      />

      {/* ── Quick Ban Dialog ── */}
      <AlertDialog open={!!banTarget} onOpenChange={(o) => !o && setBanTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Banla</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{banTarget?.username}</strong> adlı kullanıcı banlanacak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <Select value={banReason} onValueChange={setBanReason}>
              <SelectTrigger>
                <SelectValue placeholder="Ban nedenini seçin..." />
              </SelectTrigger>
              <SelectContent>
                {BAN_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Ek not (isteğe bağlı)..."
              value={banNote}
              onChange={(e) => setBanNote(e.target.value)}
              rows={2}
              maxLength={500}
            />
            <Select value={banDuration} onValueChange={setBanDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Ban süresi..." />
              </SelectTrigger>
              <SelectContent>
                {BAN_DURATIONS.map((d) => (
                  <SelectItem key={d.label} value={d.value ? String(d.value) : 'permanent'}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setBanReason(''); setBanNote(''); setBanDuration('7'); }}>
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBan}
              disabled={!banReason || banMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {banMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Banla
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Quick Unban Confirm ── */}
      <AlertDialog open={!!unbanTarget} onOpenChange={(o) => !o && setUnbanTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Banı Kaldır</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{unbanTarget?.username}</strong> adlı kullanıcının banı kaldırılacak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnban}
              disabled={unbanMutation.isPending}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {unbanMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Banı Kaldır
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
