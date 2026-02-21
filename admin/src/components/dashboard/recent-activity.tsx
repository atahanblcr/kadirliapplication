'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  UserPlus,
  FileText,
  CheckCircle2,
  XCircle,
  Megaphone,
  Heart,
  MessageSquareWarning,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { RecentActivity } from '@/types';

interface RecentActivityFeedProps {
  activities: RecentActivity[];
}

const activityConfig: Record<string, { icon: typeof UserPlus; color: string; bg: string }> = {
  user_register: { icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
  ad_created: { icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
  ad_approved: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ad_rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  announcement_created: { icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  death_notice: { icon: Heart, color: 'text-gray-600', bg: 'bg-gray-50' },
  complaint: { icon: MessageSquareWarning, color: 'text-orange-600', bg: 'bg-orange-50' },
};

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Son Aktiviteler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const config = activityConfig[activity.type] || activityConfig.ad_created;
            const Icon = config.icon;

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    config.bg,
                  )}
                >
                  <Icon className={cn('h-4 w-4', config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
