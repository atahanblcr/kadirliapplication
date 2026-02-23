'use client';

import { useState } from 'react';
import { AlertTriangle, Eye, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  useComplaints,
  useResolveComplaint,
  useRejectComplaint,
  useUpdateComplaintPriority,
} from '@/hooks/use-complaints';
import { ComplaintDetailModal } from './complaint-detail-modal';
import type { ComplaintFilters, ComplaintStatus, ComplaintPriority, ComplaintTargetType } from '@/types';

// ── Label maps ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  all: 'Tümü',
  pending: 'Bekleyen',
  reviewing: 'İnceleniyor',
  resolved: 'Çözüldü',
  rejected: 'Reddedildi',
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline',
  reviewing: 'secondary',
  resolved: 'default',
  rejected: 'destructive',
};

const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Acil',
  high: 'Yüksek',
  medium: 'Orta',
  low: 'Düşük',
};

const REASON_LABELS: Record<string, string> = {
  spam: 'Spam',
  inappropriate: 'Uygunsuz',
  false_info: 'Yanlış Bilgi',
  harassment: 'Taciz',
  other: 'Diğer',
};

const TARGET_LABELS: Record<string, string> = {
  ad: 'İlan',
  announcement: 'Duyuru',
  campaign: 'Kampanya',
  user: 'Kullanıcı',
  death: 'Vefat',
  other: 'Diğer',
};

function PriorityBadge({ priority }: { priority: string }) {
  const classes: Record<string, string> = {
    urgent: 'bg-red-100 text-red-800 border border-red-300',
    high: 'bg-orange-100 text-orange-800 border border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    low: 'bg-gray-100 text-gray-600 border border-gray-300',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${classes[priority] ?? classes.low}`}
    >
      {priority === 'urgent' && <AlertTriangle className="h-3 w-3" />}
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState<'all' | ComplaintStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | 'all'>('all');
  const [targetFilter, setTargetFilter] = useState<ComplaintTargetType | 'all'>('all');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filters: ComplaintFilters = {
    ...(activeTab !== 'all' ? { status: activeTab as ComplaintStatus } : {}),
    ...(priorityFilter !== 'all' ? { priority: priorityFilter as ComplaintPriority } : {}),
    ...(targetFilter !== 'all' ? { target_type: targetFilter as ComplaintTargetType } : {}),
    page,
    limit: 20,
  };

  const { data, isLoading } = useComplaints(filters);
  const resolveMutation = useResolveComplaint();
  const rejectMutation = useRejectComplaint();
  const priorityMutation = useUpdateComplaintPriority();

  const complaints = data?.complaints ?? [];
  const meta = data?.meta;

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | ComplaintStatus);
    setPage(1);
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Şikayetler</h1>
        <p className="text-sm text-muted-foreground">
          Kullanıcı şikayetlerini inceleyin ve yanıtlayın.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="pending">Bekleyen</TabsTrigger>
          <TabsTrigger value="reviewing">İnceleniyor</TabsTrigger>
          <TabsTrigger value="resolved">Çözüldü</TabsTrigger>
          <TabsTrigger value="rejected">Reddedildi</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select
          value={priorityFilter}
          onValueChange={(v) => {
            setPriorityFilter(v as ComplaintPriority | 'all');
            handleFilterChange();
          }}
        >
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="Öncelik" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Öncelikler</SelectItem>
            <SelectItem value="urgent">Acil</SelectItem>
            <SelectItem value="high">Yüksek</SelectItem>
            <SelectItem value="medium">Orta</SelectItem>
            <SelectItem value="low">Düşük</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={targetFilter}
          onValueChange={(v) => {
            setTargetFilter(v as ComplaintTargetType | 'all');
            handleFilterChange();
          }}
        >
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="Tip" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Tipler</SelectItem>
            <SelectItem value="ad">İlan</SelectItem>
            <SelectItem value="announcement">Duyuru</SelectItem>
            <SelectItem value="campaign">Kampanya</SelectItem>
            <SelectItem value="user">Kullanıcı</SelectItem>
            <SelectItem value="death">Vefat</SelectItem>
            <SelectItem value="other">Diğer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Öncelik</TableHead>
              <TableHead>Şikayetçi</TableHead>
              <TableHead className="w-24">Tip</TableHead>
              <TableHead className="w-28">Sebep</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead className="w-36">Tarih</TableHead>
              <TableHead className="w-28">Durum</TableHead>
              <TableHead className="w-20 text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : complaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  Şikayet bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              complaints.map((complaint) => (
                <TableRow
                  key={complaint.id}
                  className={cn(complaint.priority === 'urgent' && 'bg-red-50/50')}
                >
                  <TableCell>
                    <PriorityBadge priority={complaint.priority} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {complaint.reporter?.full_name ?? 'Anonim'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {complaint.target_type ? (
                      <Badge variant="outline" className="text-xs">
                        {TARGET_LABELS[complaint.target_type] ?? complaint.target_type}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {complaint.reason ? (
                      <span className="text-sm">{REASON_LABELS[complaint.reason] ?? complaint.reason}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-1 max-w-xs text-sm text-muted-foreground">
                      {complaint.message}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(complaint.created_at).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[complaint.status]}>
                      {STATUS_LABELS[complaint.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedId(complaint.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Toplam {meta.total} şikayet, sayfa {page}/{meta.total_pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_prev}
              onClick={() => setPage((p) => p - 1)}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_next}
              onClick={() => setPage((p) => p + 1)}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <ComplaintDetailModal
        complaintId={selectedId}
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        resolveMutation={resolveMutation}
        rejectMutation={rejectMutation}
        priorityMutation={priorityMutation}
      />
    </div>
  );
}
