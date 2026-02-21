'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bus } from 'lucide-react';
import { IntercityPage } from '@/components/transport/intercity-page';
import { IntracityPage } from '@/components/transport/intracity-page';

export default function TransportPage() {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
          <Bus className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ulaşım</h1>
          <p className="text-sm text-muted-foreground">
            Şehirlerarası ve şehir içi otobüs hatları yönetimi
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="intercity">
        <TabsList>
          <TabsTrigger value="intercity">Şehirlerarası</TabsTrigger>
          <TabsTrigger value="intracity">Şehir İçi</TabsTrigger>
        </TabsList>

        <TabsContent value="intercity" className="mt-4">
          <IntercityPage />
        </TabsContent>

        <TabsContent value="intracity" className="mt-4">
          <IntracityPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
