'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ComplaintRejectDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (adminResponse: string) => void;
  isPending: boolean;
}

export function ComplaintRejectDialog({
  open,
  onClose,
  onConfirm,
  isPending,
}: ComplaintRejectDialogProps) {
  const [response, setResponse] = useState('');

  const handleConfirm = () => {
    if (!response.trim()) return;
    onConfirm(response.trim());
  };

  const handleClose = () => {
    setResponse('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Şikayeti Reddet</DialogTitle>
          <DialogDescription>
            Ret sebebini yazın. Bu sebep kayıt altına alınacaktır.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="reject-response">
            Ret Sebebi <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="reject-response"
            rows={4}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Şikayetiniz incelendi ancak haksız bulunmuştur çünkü..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            İptal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!response.trim() || isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reddet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
