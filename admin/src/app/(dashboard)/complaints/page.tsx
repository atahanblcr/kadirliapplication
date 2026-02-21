'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PageComponent() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Şikayetler</h1>
        <p className="text-sm text-muted-foreground">Bu modül henüz yapılmadı.</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Şikayetler modülünün geliştirilmesi devam ediyor.
        </AlertDescription>
      </Alert>
    </div>
  );
}
