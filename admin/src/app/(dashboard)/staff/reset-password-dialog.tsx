'use client';

import { useState } from 'react';
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
import { useResetStaffPassword } from '@/hooks/use-staff';
import { toast } from '@/hooks/use-toast';
import type { AdminStaff } from '@/types';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: AdminStaff | null;
  onSuccess: () => void;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: ResetPasswordDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const mutation = useResetStaffPassword(staff?.id ?? '');

  const handleSubmit = async () => {
    try {
      if (!newPassword || newPassword.length < 8) {
        toast({
          title: 'Hata',
          description: 'Şifre en az 8 karakter olmalıdır',
          variant: 'destructive',
        });
        return;
      }

      await mutation.mutateAsync({ new_password: newPassword });

      toast({
        title: 'Başarılı',
        description: 'Şifre başarıyla sıfırlandı',
      });

      onOpenChange(false);
      setNewPassword('');
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.response?.data?.message || 'Şifre sıfırlama başarısız',
        variant: 'destructive',
      });
    }
  };

  const isLoading = mutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Şifre Sıfırla</DialogTitle>
          <DialogDescription>
            {staff?.email} için yeni şifre belirleyin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Yeni Şifre (min 8 karakter)</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setNewPassword('');
              }}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sıfırla
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
