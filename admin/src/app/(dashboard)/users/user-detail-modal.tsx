'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Phone, Mail, MapPin, ShieldCheck, ShieldOff,
  CheckCircle2, Loader2, BarChart2, Clock, CalendarDays,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserDetail, useBanUser, useUnbanUser, useChangeUserRole } from '@/hooks/use-users';
import {
  UserRoleBadge,
  UserStatusBadge,
  BAN_REASONS,
  BAN_DURATIONS,
  CHANGEABLE_ROLES,
  USER_ROLE_CONFIG,
  formatLastLogin,
} from '@/lib/user-utils';
import { toast } from '@/hooks/use-toast';
import type { User } from '@/types';

interface UserDetailModalProps {
  userId: string | null;
  onClose: () => void;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
  const [banOpen, setBanOpen]         = useState(false);
  const [unbanOpen, setUnbanOpen]     = useState(false);
  const [roleOpen, setRoleOpen]       = useState(false);
  const [banReason, setBanReason]     = useState('');
  const [banNote, setBanNote]         = useState('');
  const [banDuration, setBanDuration] = useState<string>('7');
  const [newRole, setNewRole]         = useState('');

  const { data: user, isLoading } = useUserDetail(userId);

  const banMutation        = useBanUser();
  const unbanMutation      = useUnbanUser();
  const changeRoleMutation = useChangeUserRole();

  const handleBan = async () => {
    if (!userId || !banReason) return;
    const duration = banDuration === 'permanent' ? undefined : Number(banDuration);
    try {
      await banMutation.mutateAsync({ id: userId, ban_reason: banNote || banReason, duration_days: duration });
      toast({ title: 'Kullanıcı banlandı.' });
      setBanOpen(false);
      setBanReason('');
      setBanNote('');
      setBanDuration('7');
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Ban işlemi başarısız.', variant: 'destructive' });
    }
  };

  const handleUnban = async () => {
    if (!userId) return;
    try {
      await unbanMutation.mutateAsync(userId);
      toast({ title: 'Ban kaldırıldı.' });
      setUnbanOpen(false);
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Ban kaldırılamadı.', variant: 'destructive' });
    }
  };

  const handleRoleChange = async () => {
    if (!userId || !newRole) return;
    try {
      await changeRoleMutation.mutateAsync({ id: userId, role: newRole });
      toast({ title: `Rol "${USER_ROLE_CONFIG[newRole as keyof typeof USER_ROLE_CONFIG]?.label ?? newRole}" olarak değiştirildi.` });
      setRoleOpen(false);
      setNewRole('');
      onClose();
    } catch {
      toast({ title: 'Hata', description: 'Rol değiştirilemedi.', variant: 'destructive' });
    }
  };

  return (
    <>
      <Dialog open={!!userId} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            {isLoading ? (
              <Skeleton className="h-7 w-40" />
            ) : user ? (
              <div className="flex items-start justify-between gap-4 pr-8">
                <div>
                  <DialogTitle className="text-xl">{user.username}</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">{user.phone}</p>
                </div>
                <UserStatusBadge is_banned={user.is_banned} is_active={user.is_active} />
              </div>
            ) : (
              <DialogTitle>Kullanıcı Detayı</DialogTitle>
            )}
          </DialogHeader>

          <div className="p-6 space-y-5">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : user ? (
              <UserDetailContent
                user={user}
                onBan={() => setBanOpen(true)}
                onUnban={() => setUnbanOpen(true)}
                onRoleChange={() => setRoleOpen(true)}
              />
            ) : (
              <p className="text-center text-muted-foreground py-8">Kullanıcı bulunamadı.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Ban Dialog ── */}
      <AlertDialog open={banOpen} onOpenChange={setBanOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Banla</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{user?.username}</strong> adlı kullanıcı banlanacak.
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

      {/* ── Unban Confirm ── */}
      <AlertDialog open={unbanOpen} onOpenChange={setUnbanOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Banı Kaldır</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{user?.username}</strong> adlı kullanıcının banı kaldırılacak.
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

      {/* ── Role Change Dialog ── */}
      <AlertDialog open={roleOpen} onOpenChange={setRoleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rol Değiştir</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{user?.username}</strong> adlı kullanıcının rolü değiştirilecek. Bu işlem kullanıcının yetkilerini etkiler.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger>
              <SelectValue placeholder="Yeni rol seçin..." />
            </SelectTrigger>
            <SelectContent>
              {CHANGEABLE_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {USER_ROLE_CONFIG[r].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNewRole('')}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRoleChange}
              disabled={!newRole || changeRoleMutation.isPending}
            >
              {changeRoleMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Rolü Değiştir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Content (when user is loaded) ───────────────────────────────────────────
function UserDetailContent({
  user,
  onBan,
  onUnban,
  onRoleChange,
}: {
  user: User;
  onBan: () => void;
  onUnban: () => void;
  onRoleChange: () => void;
}) {
  return (
    <>
      {/* Role */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Rol:</span>
        <UserRoleBadge role={user.role} />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow
          icon={<Phone className="h-4 w-4" />}
          label="Telefon"
          value={user.phone}
        />
        {user.email && (
          <InfoRow
            icon={<Mail className="h-4 w-4" />}
            label="E-posta"
            value={user.email}
          />
        )}
        <InfoRow
          icon={<MapPin className="h-4 w-4" />}
          label="Mahalle"
          value={user.primary_neighborhood?.name ?? '—'}
        />
        <InfoRow
          icon={<Clock className="h-4 w-4" />}
          label="Son Giriş"
          value={formatLastLogin(user.last_login)}
        />
        <InfoRow
          icon={<CalendarDays className="h-4 w-4" />}
          label="Kayıt Tarihi"
          value={format(new Date(user.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
        />
      </div>

      {/* Stats */}
      {user.stats && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">İstatistikler</p>
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Toplam İlan" value={user.stats.total_ads} />
            <StatCard
              label="Durum"
              value={user.is_banned ? 'Banlı' : user.is_active ? 'Aktif' : 'Pasif'}
            />
          </div>
        </div>
      )}

      {/* Ban Info */}
      {user.is_banned && user.ban_reason && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs font-semibold uppercase text-red-600 mb-1">Ban Bilgisi</p>
          <p className="text-sm text-red-700">{user.ban_reason}</p>
          {user.banned_at && (
            <p className="text-xs text-red-500 mt-1">
              {format(new Date(user.banned_at), 'dd MMM yyyy HH:mm', { locale: tr })}
            </p>
          )}
        </div>
      )}

      <Separator />

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="flex-1" onClick={onRoleChange}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Rol Değiştir
        </Button>

        {user.is_banned ? (
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={onUnban}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Banı Kaldır
          </Button>
        ) : (
          <Button variant="destructive" className="flex-1" onClick={onBan}>
            <ShieldOff className="mr-2 h-4 w-4" />
            Banla
          </Button>
        )}
      </div>
    </>
  );
}
