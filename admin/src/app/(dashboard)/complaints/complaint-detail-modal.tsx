'use client';

import { useState } from 'react';
import { ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useComplaintDetail, useReviewComplaint } from '@/hooks/use-complaints';
import { ComplaintResolveDialog } from './complaint-resolve-dialog';
import { ComplaintRejectDialog } from './complaint-reject-dialog';
import type { Complaint, ComplaintPriority, ComplaintTargetType } from '@/types';

// ── Label maps ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor',
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
  inappropriate: 'Uygunsuz İçerik',
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

function getTargetLink(targetType: string | null, targetId: string | null): string | null {
  if (!targetType || !targetId) return null;
  const routes: Record<string, string> = {
    ad: `/ads/${targetId}`,
    announcement: `/announcements/${targetId}`,
    campaign: `/campaigns/${targetId}`,
    user: `/users/${targetId}`,
    death: `/deaths/${targetId}`,
  };
  return routes[targetType] ?? null;
}

function PriorityBadge({ priority }: { priority: string }) {
  const classes: Record<string, string> = {
    urgent: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-gray-100 text-gray-700 border-gray-300',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${classes[priority] ?? classes.low}`}
    >
      {priority === 'urgent' && <AlertTriangle className="mr-1 h-3 w-3" />}
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}

// ── Detail Sections ───────────────────────────────────────────────────────────

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <span className="min-w-[140px] text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  complaintId: string | null;
  open: boolean;
  onClose: () => void;
  onResolveSuccess?: (updated: Complaint) => void;
  onRejectSuccess?: (updated: Complaint) => void;
  onPriorityChange?: (id: string, priority: string) => void;
  resolveMutation: ReturnType<typeof import('@/hooks/use-complaints').useResolveComplaint>;
  rejectMutation: ReturnType<typeof import('@/hooks/use-complaints').useRejectComplaint>;
  priorityMutation: ReturnType<typeof import('@/hooks/use-complaints').useUpdateComplaintPriority>;
}

export function ComplaintDetailModal({
  complaintId,
  open,
  onClose,
  resolveMutation,
  rejectMutation,
  priorityMutation,
}: Props) {
  const { data: complaint, isLoading } = useComplaintDetail(complaintId);
  const reviewMutation = useReviewComplaint();

  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleReview = () => {
    if (!complaintId) return;
    reviewMutation.mutate(complaintId);
  };

  const handleResolve = (adminResponse: string) => {
    if (!complaintId) return;
    resolveMutation.mutate(
      { id: complaintId, admin_response: adminResponse },
      { onSuccess: () => setShowResolveDialog(false) },
    );
  };

  const handleReject = (adminResponse: string) => {
    if (!complaintId) return;
    rejectMutation.mutate(
      { id: complaintId, admin_response: adminResponse },
      { onSuccess: () => setShowRejectDialog(false) },
    );
  };

  const handlePriorityChange = (priority: string) => {
    if (!complaintId) return;
    priorityMutation.mutate({ id: complaintId, priority });
  };

  const targetLink = complaint ? getTargetLink(complaint.target_type, complaint.target_id) : null;

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Şikayet Detayı</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !complaint ? (
            <p className="text-sm text-muted-foreground">Şikayet bulunamadı.</p>
          ) : (
            <div className="space-y-6">
              {/* SECTION 1: Şikayet Bilgisi */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Şikayet Bilgisi
                </h3>
                <div className="space-y-2.5 rounded-lg border p-4">
                  <InfoRow label="Şikayetçi">
                    {complaint.reporter ? (
                      <span>
                        {complaint.reporter.full_name}
                        {complaint.reporter.phone && (
                          <span className="ml-2 text-muted-foreground">
                            ({complaint.reporter.phone})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Anonim</span>
                    )}
                  </InfoRow>

                  <InfoRow label="Şikayet Tipi">
                    {complaint.target_type ? (
                      <Badge variant="outline">{TARGET_LABELS[complaint.target_type] ?? complaint.target_type}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </InfoRow>

                  <InfoRow label="Hakkında">
                    {targetLink ? (
                      <a
                        href={targetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        İçeriği Gör
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : complaint.target_id ? (
                      <span className="font-mono text-xs text-muted-foreground">
                        {complaint.target_id}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </InfoRow>

                  <InfoRow label="Sebep">
                    {complaint.reason ? (
                      <Badge variant="outline">{REASON_LABELS[complaint.reason] ?? complaint.reason}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </InfoRow>

                  <InfoRow label="Öncelik">
                    <PriorityBadge priority={complaint.priority} />
                  </InfoRow>

                  <InfoRow label="Tarih">
                    {new Date(complaint.created_at).toLocaleString('tr-TR')}
                  </InfoRow>

                  {complaint.subject && (
                    <InfoRow label="Konu">{complaint.subject}</InfoRow>
                  )}

                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Açıklama</span>
                    <p className="rounded border bg-muted/30 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {complaint.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: İnceleme Bilgisi */}
              {(complaint.reviewer || complaint.resolver || complaint.admin_notes) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    İnceleme Bilgisi
                  </h3>
                  <div className="space-y-2.5 rounded-lg border p-4">
                    <InfoRow label="Durum">
                      <Badge variant={STATUS_VARIANTS[complaint.status]}>
                        {STATUS_LABELS[complaint.status]}
                      </Badge>
                    </InfoRow>

                    {complaint.reviewer && (
                      <InfoRow label="İnceleyen Admin">
                        {complaint.reviewer.full_name}
                      </InfoRow>
                    )}

                    {complaint.reviewed_at && (
                      <InfoRow label="İnceleme Tarihi">
                        {new Date(complaint.reviewed_at).toLocaleString('tr-TR')}
                      </InfoRow>
                    )}

                    {complaint.resolver && (
                      <InfoRow label="Sonuçlandıran Admin">
                        {complaint.resolver.full_name}
                      </InfoRow>
                    )}

                    {complaint.resolved_at && (
                      <InfoRow label="Sonuçlanma Tarihi">
                        {new Date(complaint.resolved_at).toLocaleString('tr-TR')}
                      </InfoRow>
                    )}

                    {complaint.admin_notes && (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Admin Yanıtı</span>
                        <p className="rounded border bg-muted/30 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                          {complaint.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 3: Aksiyonlar */}
              {(complaint.status === 'pending' || complaint.status === 'reviewing') && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Aksiyonlar
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {complaint.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReview}
                          disabled={reviewMutation.isPending}
                        >
                          {reviewMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          İncelemeye Al
                        </Button>
                      )}

                      {complaint.status === 'reviewing' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => setShowResolveDialog(true)}
                          >
                            Çöz
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowRejectDialog(true)}
                          >
                            Reddet
                          </Button>
                        </>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Öncelik:</span>
                        <Select
                          value={complaint.priority}
                          onValueChange={handlePriorityChange}
                          disabled={priorityMutation.isPending}
                        >
                          <SelectTrigger className="h-8 w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Acil</SelectItem>
                            <SelectItem value="high">Yüksek</SelectItem>
                            <SelectItem value="medium">Orta</SelectItem>
                            <SelectItem value="low">Düşük</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ComplaintResolveDialog
        open={showResolveDialog}
        onClose={() => setShowResolveDialog(false)}
        onConfirm={handleResolve}
        isPending={resolveMutation.isPending}
      />

      <ComplaintRejectDialog
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleReject}
        isPending={rejectMutation.isPending}
      />
    </>
  );
}
