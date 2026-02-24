'use client';

import { useEffect, useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateStaff, useUpdateStaff, useUpdateStaffPermissions } from '@/hooks/use-staff';
import { ADMIN_MODULES } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import type { AdminStaff, CreateStaffDto, UpdateStaffDto, PermissionItemDto } from '@/types';

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: AdminStaff | null;
  onSuccess: () => void;
}

export function StaffFormDialog({
  open,
  onOpenChange,
  editing,
  onSuccess,
}: StaffFormDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateStaffDto & UpdateStaffDto>>({
    email: '',
    password: '',
    username: '',
    phone: '',
    role: 'moderator',
  });
  const [permissions, setPermissions] = useState<PermissionItemDto[]>([]);

  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff(editing?.id ?? '');
  const updatePermissionsMutation = useUpdateStaffPermissions(editing?.id ?? '');

  // Initialize form with editing data
  useEffect(() => {
    if (editing) {
      setFormData({
        email: editing.email,
        username: editing.username,
        phone: editing.phone,
        role: (editing.role === 'super_admin' ? 'admin' : editing.role) as 'admin' | 'moderator',
      });
      if (editing.permissions) {
        setPermissions(
          editing.permissions.map((p) => ({
            module: p.module,
            can_read: p.can_read,
            can_create: p.can_create,
            can_update: p.can_update,
            can_delete: p.can_delete,
            can_approve: p.can_approve,
          })),
        );
      }
    } else {
      setFormData({ email: '', password: '', username: '', phone: '', role: 'moderator' });
      setPermissions(
        ADMIN_MODULES.map((m) => ({
          module: m.key,
          can_read: false,
          can_create: false,
          can_update: false,
          can_delete: false,
          can_approve: false,
        })),
      );
    }
  }, [editing, open]);

  const handlePermissionChange = (
    module: string,
    field: keyof PermissionItemDto,
    value: boolean,
  ) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.module === module ? { ...p, [field]: value } : p,
      ),
    );
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.email || !formData.username || !formData.phone) {
        toast({
          title: 'Hata',
          description: 'Lütfen tüm alanları doldurunuz',
          variant: 'destructive',
        });
        return;
      }

      if (!editing && !formData.password) {
        toast({
          title: 'Hata',
          description: 'Şifre gereklidir',
          variant: 'destructive',
        });
        return;
      }

      if (editing) {
        // Update mode
        await updateMutation.mutateAsync({
          username: formData.username,
          role: formData.role as any,
        });

        // Update permissions if moderator
        if (formData.role === 'moderator') {
          await updatePermissionsMutation.mutateAsync({
            permissions: permissions.filter((p) => p),
          });
        }
      } else {
        // Create mode
        await createMutation.mutateAsync({
          email: formData.email as string,
          password: formData.password as string,
          username: formData.username as string,
          phone: formData.phone as string,
          role: formData.role as any,
          permissions:
            formData.role === 'moderator'
              ? permissions.filter((p) => p)
              : undefined,
        });
      }

      toast({
        title: 'Başarılı',
        description: editing
          ? 'Personel başarıyla güncellendi'
          : 'Personel başarıyla oluşturuldu',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Hata',
        description:
          error.response?.data?.message ||
          (editing ? 'Güncelleme başarısız' : 'Oluşturma başarısız'),
        variant: 'destructive',
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || updatePermissionsMutation.isPending;
  const isModerator = formData.role === 'moderator';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? 'Personeli Düzenle' : 'Yeni Personel Ekle'}</DialogTitle>
          <DialogDescription>
            {editing
              ? 'Personel bilgilerini ve izinlerini düzenleyin'
              : 'Yeni admin personel oluşturun ve izinlerini ayarlayın'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Temel Bilgiler</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={!!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+90 555 000 0000"
                  value={formData.phone || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  placeholder="admin_user"
                  value={formData.username || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, username: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value as any }))
                  }
                  disabled={!!editing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moderator">Moderatör</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!editing && (
              <div className="space-y-2">
                <Label htmlFor="password">Şifre (min 8 karakter)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Permissions (only for moderator) */}
          {isModerator ? (
            <div className="space-y-4">
              <h3 className="font-semibold">İzinler</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Modül</TableHead>
                      <TableHead className="text-center w-16">Okuma</TableHead>
                      <TableHead className="text-center w-16">Oluşturma</TableHead>
                      <TableHead className="text-center w-16">Güncelleme</TableHead>
                      <TableHead className="text-center w-16">Silme</TableHead>
                      <TableHead className="text-center w-16">Onay</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ADMIN_MODULES.map((module) => {
                      const perm = permissions.find((p) => p.module === module.key);
                      return (
                        <TableRow key={module.key}>
                          <TableCell className="font-medium text-sm">{module.label}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={perm?.can_read || false}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  module.key,
                                  'can_read',
                                  checked as boolean,
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={perm?.can_create || false}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  module.key,
                                  'can_create',
                                  checked as boolean,
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={perm?.can_update || false}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  module.key,
                                  'can_update',
                                  checked as boolean,
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={perm?.can_delete || false}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  module.key,
                                  'can_delete',
                                  checked as boolean,
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {module.hasApprove ? (
                              <Checkbox
                                checked={perm?.can_approve || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    module.key,
                                    'can_approve',
                                    checked as boolean,
                                  )
                                }
                              />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              Admin tüm modüllere tam erişime sahiptir. İzinler ayarlanmaz.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
