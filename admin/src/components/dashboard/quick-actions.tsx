'use client';

import Link from 'next/link';
import { Plus, FileText, Megaphone, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const actions = [
  {
    label: 'Duyuru Oluştur',
    href: '/announcements/create',
    icon: Megaphone,
    color: 'text-purple-600',
  },
  {
    label: 'İlan Onayla',
    href: '/ads',
    icon: FileText,
    color: 'text-green-600',
  },
  {
    label: 'Kullanıcı Yönet',
    href: '/users',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    label: 'Etkinlik Ekle',
    href: '/events/create',
    icon: Plus,
    color: 'text-orange-600',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="outline"
              className="justify-start gap-3 h-11"
              asChild
            >
              <Link href={action.href}>
                <Icon className={`h-4 w-4 ${action.color}`} />
                {action.label}
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
