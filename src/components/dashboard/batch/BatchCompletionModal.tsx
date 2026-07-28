"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { completeBatchAction } from "@/actions/dashboard/leaderboard";
import { toast } from "sonner";

interface BatchCompletionModalProps {
  batchId: string;
  batchName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BatchCompletionModal({
  batchId,
  batchName,
  isOpen,
  onClose,
  onSuccess,
}: BatchCompletionModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleComplete() {
    setLoading(true);
    try {
      const res = await completeBatchAction(batchId);
      if (res.ok) {
        toast.success(`Batch "${batchName}" completed and leaderboard frozen!`);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res.error || "Failed to complete batch");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
          <Lock className="h-6 w-6" />
        </div>

        <h2 className="font-display text-xl font-bold text-night-900">
          Complete Batch & Freeze Leaderboard
        </h2>

        <p className="mt-2 text-sm text-ink-soft">
          Are you sure you want to mark <strong className="text-night-900">{batchName}</strong> as completed?
        </p>

        <div className="my-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <strong>Important:</strong> Completing a batch is standard, manual, and one-way.
            The current all-time standings will be frozen into a permanent final leaderboard snapshot.
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={loading}
            className="bg-gold-500 text-night-900 hover:bg-gold-600"
          >
            {loading ? (
              "Completing..."
            ) : (
              <>
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Confirm Completion
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
