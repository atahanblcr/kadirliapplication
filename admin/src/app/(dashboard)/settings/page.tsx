'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminProfile, useUpdateAdminProfile, useChangePassword } from '@/hooks/use-settings';
import { useAuth } from '@/hooks/use-auth';

// ── Helpers ───────────────────────────────────────────────────────────────────

function maskKey(key: string): string {
  if (!key || key.length <= 4) return '••••••••••••';
  return '••••••••••••' + key.slice(-4);
}

function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ── Tab 1: Genel ──────────────────────────────────────────────────────────────

function GeneralTab() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1';
  const env = process.env.NODE_ENV || 'development';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uygulama Bilgileri</CardTitle>
        <CardDescription>KadirliApp hakkında genel bilgiler (salt okunur).</CardDescription>
      </CardHeader>
      <CardContent className="divide-y">
        <SettingsRow label="Uygulama Adı">
          <span className="text-sm font-mono">KadirliApp</span>
        </SettingsRow>
        <SettingsRow label="Versiyon">
          <Badge variant="outline">v1.0.0</Badge>
        </SettingsRow>
        <SettingsRow label="Backend URL">
          <span className="text-sm font-mono text-muted-foreground">{apiUrl}</span>
        </SettingsRow>
        <SettingsRow label="Ortam">
          <Badge variant={env === 'production' ? 'default' : 'secondary'}>
            {env === 'production' ? 'Production' : 'Development'}
          </Badge>
        </SettingsRow>
        <SettingsRow label="Admin Panel">
          <Badge variant="outline">Next.js 14</Badge>
        </SettingsRow>
        <SettingsRow label="Backend">
          <Badge variant="outline">NestJS + PostgreSQL</Badge>
        </SettingsRow>
      </CardContent>
    </Card>
  );
}

// ── Tab 2: Bildirimler ────────────────────────────────────────────────────────

function NotificationsTab() {
  const [fcmEnabled, setFcmEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('setting_fcm_enabled') !== 'false';
  });
  const [notifyNewUser, setNotifyNewUser] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('setting_notify_new_user') !== 'false';
  });
  const [notifyNewContent, setNotifyNewContent] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('setting_notify_new_content') !== 'false';
  });

  const toggle = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    localStorage.setItem(key, String(value));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>FCM Push Bildirimleri</CardTitle>
          <CardDescription>Firebase Cloud Messaging ayarları.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingsRow label="FCM Aktif" description="Mobil uygulama push bildirimlerini etkinleştir">
            <Switch
              checked={fcmEnabled}
              onCheckedChange={(v) => toggle('setting_fcm_enabled', v, setFcmEnabled)}
            />
          </SettingsRow>
          <SettingsRow label="FCM Server Key" description="Firebase proje ayarlarından alınır">
            <span className="font-mono text-xs text-muted-foreground">
              {maskKey(process.env.NEXT_PUBLIC_FCM_KEY || '')}
            </span>
          </SettingsRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>E-posta Bildirimleri</CardTitle>
          <CardDescription>Admin paneli e-posta bildirim tercihleri.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingsRow label="Yeni Kullanıcı" description="Yeni kullanıcı kaydında bildirim gönder">
            <Switch
              checked={notifyNewUser}
              onCheckedChange={(v) => toggle('setting_notify_new_user', v, setNotifyNewUser)}
            />
          </SettingsRow>
          <SettingsRow label="Yeni İçerik" description="Onay bekleyen içerik eklendiğinde bildirim gönder">
            <Switch
              checked={notifyNewContent}
              onCheckedChange={(v) => toggle('setting_notify_new_content', v, setNotifyNewContent)}
            />
          </SettingsRow>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab 3: API Anahtarları ────────────────────────────────────────────────────

function ApiKeysTab() {
  const apiKeys = [
    {
      provider: 'SMS (Netgsm)',
      key: process.env.NEXT_PUBLIC_SMS_KEY || 'XXXXXXXXXXX1234',
      status: true,
      label: 'API Key',
    },
    {
      provider: 'Firebase',
      key: process.env.NEXT_PUBLIC_FIREBASE_PROJECT || 'kadirliapp',
      status: true,
      label: 'Project ID',
    },
    {
      provider: 'Google Maps',
      key: process.env.NEXT_PUBLIC_MAPS_KEY || 'XXXXXXXXXXX5678',
      status: true,
      label: 'API Key',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Anahtarları</CardTitle>
        <CardDescription>
          Güvenlik nedeniyle anahtarlar maskelenmiştir. Değiştirmek için .env dosyasını düzenleyin.
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-y">
        {apiKeys.map((item) => (
          <SettingsRow
            key={item.provider}
            label={item.provider}
            description={item.label}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {maskKey(item.key)}
              </span>
              {item.status ? (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Bağlı
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <XCircle className="h-3.5 w-3.5" />
                  Yapılandırılmamış
                </span>
              )}
            </div>
          </SettingsRow>
        ))}
      </CardContent>
    </Card>
  );
}

// ── Tab 4: Görünüm ────────────────────────────────────────────────────────────

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { value: 'light', label: 'Açık', icon: Sun },
    { value: 'dark', label: 'Koyu', icon: Moon },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <CardDescription>
            Tercih ettiğiniz renk temasını seçin. Ayar tarayıcıda saklanır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mounted ? (
            <div className="flex gap-3">
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-accent ${
                    theme === value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-medium">{label}</span>
                  {theme === value && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="h-24 animate-pulse rounded-lg bg-muted" />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dil</CardTitle>
          <CardDescription>Arayüz dili tercihi.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsRow label="Aktif Dil" description="Şu an yalnızca Türkçe desteklenmektedir">
            <Badge>Türkçe</Badge>
          </SettingsRow>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab 5: Profil ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const { data: profile, isLoading } = useAdminProfile();
  const updateProfileMutation = useUpdateAdminProfile();
  const changePasswordMutation = useChangePassword();

  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile]);

  const handleProfileSave = () => {
    if (!username.trim()) return;
    updateProfileMutation.mutate({ username: username.trim() });
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;
    if (newPassword.length < 8) return;
    changePasswordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
    });
  };

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const passwordTooShort = newPassword.length > 0 && newPassword.length < 8;

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profil Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Bilgileri</CardTitle>
          <CardDescription>Hesap bilgilerinizi güncelleyin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta (Salt Okunur)</Label>
            <Input
              id="email"
              value={profile?.email ?? ''}
              readOnly
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin_kullanici"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol (Salt Okunur)</Label>
            <Input
              id="role"
              value={profile?.role ?? ''}
              readOnly
              className="bg-muted/50"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleProfileSave}
              disabled={!username.trim() || updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Şifre Değiştir */}
      <Card>
        <CardHeader>
          <CardTitle>Şifre Değiştir</CardTitle>
          <CardDescription>
            Şifrenizi değiştirdikten sonra tekrar giriş yapmanız gerekecektir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mevcut Şifre</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="new-password">Yeni Şifre</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="En az 8 karakter"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordTooShort && (
              <p className="text-xs text-destructive">Şifre en az 8 karakter olmalıdır.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Yeni Şifre Tekrar</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordMismatch && (
              <p className="text-xs text-destructive">Şifreler eşleşmiyor.</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={handlePasswordChange}
              disabled={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                passwordMismatch ||
                passwordTooShort ||
                changePasswordMutation.isPending
              }
            >
              {changePasswordMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Şifre Değiştir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Ana Sayfa ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">
          Uygulama ve hesap ayarlarınızı yönetin.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          <TabsTrigger value="api-keys">API Anahtarları</TabsTrigger>
          <TabsTrigger value="appearance">Görünüm</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeysTab />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
