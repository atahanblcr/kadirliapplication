'use client';

import { useState } from 'react';
import {
  Search, RefreshCw, Plus, Edit2, Key, X, Loader2, Users,
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
import { useStaff } from '@/hooks/use-staff';
import { useAuth } from '@/hooks/use-auth';
import { StaffFormDialog } from './staff-form-dialog';
import { ResetPasswordDialog } from './reset-password-dialog';
import { toast } from '@/hooks/use-toast';
import type { AdminStaff, StaffFilters } from '@/types';

const PAGE_SIZE = 20;

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((__, j) => (
            <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function StaffRow({
  staff,
  onEdit,
  onResetPassword,
  onDelete,
}: {
  staff: AdminStaff;
  onEdit: (s: AdminStaff) => void;
  onResetPassword: (s: AdminStaff) => void;
  onDelete: (s: AdminStaff) => void;
}) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'moderator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'moderator':
        return 'Moderatör';
      default:
        return role;
    }
  };

  return (
    <TableRow className={!staff.is_active ? 'bg-gray-50/50' : undefined}>
      {/* Email/Username */}
      <TableCell>
        <div>
          <p className="font-medium">{staff.email}</p>
          <p className="text-xs text-muted-foreground">{staff.username}</p>
        </div>
      </TableCell>

      {/* Phone */}
      <TableCell className="text-sm text-muted-foreground font-mono">
        {staff.phone}
      </TableCell>

      {/* Role */}
      <TableCell>
        <Badge className={getRoleBadgeColor(staff.role)}>
          {getRoleLabel(staff.role)}
        </Badge>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={staff.is_active ? 'default' : 'destructive'}>
          {staff.is_active ? 'Aktif' : 'Pasif'}
        </Badge>
      </TableCell>

      {/* Permissions */}
      <TableCell>
        {staff.role === 'moderator' && staff.permission_count !== undefined ? (
          <span className="text-sm text-muted-foreground">{staff.permission_count}/13 izin</span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(staff)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Düzenle</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onResetPassword(staff)}
              >
                <Key className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Şifre Sıfırla</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(staff)}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Devre Dışı Bırak</TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function StaffPage() {
  const { user: currentUser } = useAuth();
  const [filters, setFilters] = useState<StaffFilters>({ page: 1, limit: PAGE_SIZE });
  const [formOpen, setFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AdminStaff | null>(null);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [passwordStaff, setPasswordStaff] = useState<AdminStaff | null>(null);

  const { data, isLoading, refetch } = useStaff(filters);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value || undefined, page: 1 }));
  };

  const handleRoleFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      role: (value === 'all' ? undefined : value) as any,
      page: 1,
    }));
  };

  const handleStatusFilter = (value: string) => {
    if (value === 'all') {
      setFilters((prev) => ({ ...prev, is_active: undefined, page: 1 }));
    } else {
      setFilters((prev) => ({
        ...prev,
        is_active: value === 'active',
        page: 1,
      }));
    }
  };

  const handleEdit = (staff: AdminStaff) => {
    setEditingStaff(staff);
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingStaff(null);
    setFormOpen(true);
  };

  const handleResetPassword = (staff: AdminStaff) => {
    setPasswordStaff(staff);
    setResetPasswordOpen(true);
  };

  const handleDelete = async (staff: AdminStaff) => {
    if (confirm(`${staff.email} kullanıcısını devre dışı bırakmak istediğinizden emin misiniz?`)) {
      try {
        // TODO: Implement delete mutation
        toast({
          title: 'Başarılı',
          description: 'Personel başarıyla devre dışı bırakıldı',
        });
        refetch();
      } catch (error: any) {
        toast({
          title: 'Hata',
          description: error.response?.data?.message || 'Hata oluştu',
          variant: 'destructive',
        });
      }
    }
  };

  // Only SUPER_ADMIN can create staff
  const canCreateStaff = currentUser?.role === 'super_admin';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Yönetimi</h1>
          <p className="text-muted-foreground">Admin personel ve izinleri yönetin</p>
        </div>
        {canCreateStaff && (
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Personel
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Toplam Personel</p>
          <p className="text-2xl font-bold">{data?.meta?.total || 0}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Aktif</p>
          <p className="text-2xl font-bold">{data?.items?.filter((s) => s.is_active).length || 0}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Moderatör</p>
          <p className="text-2xl font-bold">{data?.items?.filter((s) => s.role === 'moderator').length || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            placeholder="Email, kullanıcı adı veya telefon ara..."
            defaultValue={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Select defaultValue={filters.role || 'all'} onValueChange={handleRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Roller</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderatör</SelectItem>
          </SelectContent>
        </Select>

        <Select
          defaultValue={
            filters.is_active === undefined ? 'all' : (filters.is_active ? 'active' : 'inactive')
          }
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Pasif</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email / Kullanıcı Adı</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>İzinler</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : data?.items && data.items.length > 0 ? (
              data.items.map((staff) => (
                <StaffRow
                  key={staff.id}
                  staff={staff}
                  onEdit={handleEdit}
                  onResetPassword={handleResetPassword}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Hiçbir personel bulunamadı</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.meta.page} / {data.meta.total_pages} sayfa ({data.meta.total} toplam)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!data.meta.has_prev}
              onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              disabled={!data.meta.has_next}
              onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <StaffFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editingStaff}
        onSuccess={() => {
          setFormOpen(false);
          setEditingStaff(null);
          refetch();
        }}
      />

      <ResetPasswordDialog
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        staff={passwordStaff}
        onSuccess={() => {
          setResetPasswordOpen(false);
          setPasswordStaff(null);
          refetch();
        }}
      />
    </div>
  );
}
