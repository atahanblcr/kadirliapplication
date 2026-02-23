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

interface ComplaintResolveDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (adminResponse: string) => void;
  isPending: boolean;
}

export function ComplaintResolveDialog({
  open,
  onClose,
  onConfirm,
  isPending,
}: ComplaintResolveDialogProps) {
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
          <DialogTitle>Şikayeti Çöz</DialogTitle>
          <DialogDescription>
            Şikayete yanıt yazın. Bu yanıt kayıt altına alınacaktır.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="resolve-response">
            Admin Yanıtı <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="resolve-response"
            rows={4}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Şikayetiniz incelendi ve gerekli işlem yapıldı..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            İptal
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleConfirm}
            disabled={!response.trim() || isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Çöz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
