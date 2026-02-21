'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { PendingApproval } from '@/types';

interface PendingApprovalsListProps {
  approvals: PendingApproval[];
}

const typeLabels: Record<string, string> = {
  ad: 'İlan',
  death: 'Vefat',
  campaign: 'Kampanya',
};

const typeColors: Record<string, string> = {
  ad: 'bg-blue-100 text-blue-700',
  death: 'bg-gray-100 text-gray-700',
  campaign: 'bg-purple-100 text-purple-700',
};

export function PendingApprovalsList({ approvals }: PendingApprovalsListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Bekleyen Onaylar</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ads" className="gap-1">
            Tümü <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {approvals.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-lg border p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={typeColors[item.type]}>
                    {typeLabels[item.type]}
                  </Badge>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.user.full_name} &middot;{' '}
                  {formatDistanceToNow(new Date(item.created_at), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
