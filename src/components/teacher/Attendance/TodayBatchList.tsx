"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarCheck } from "lucide-react";
import { BatchCard } from "./BatchCard";
import { OffDayModal } from "./OffDayModal";
import { startDayAction } from "@/actions/attendance/start-day";
import { markOffDayAction } from "@/actions/attendance/mark-off-day";
import type { TodayBatch } from "@/types/attendance";
import { EmptyState } from "@/components/shared/attendance/EmptyState";
import { ConfirmModal } from "@/components/shared/attendance/ConfirmModal";

interface TodayBatchListProps {
  batches: TodayBatch[];
}

export function TodayBatchList({ batches }: TodayBatchListProps) {
  const router = useRouter();
  const [offDayTarget, setOffDayTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [starting, setStarting] = useState<string | null>(null);
  const [confirmStart, setConfirmStart] = useState<{
    id: string;
    name: string;
  } | null>(null);

  if (batches.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No batches assigned"
        description="You don't have any batches assigned to you yet. Contact your institute admin."
      />
    );
  }

  function handleStartClick(batchId: string) {
    const b = batches.find((x) => x.batch.id === batchId);
    if (b) setConfirmStart({ id: batchId, name: b.batch.name });
  }

  async function handleStartConfirm() {
    if (!confirmStart) return;
    const batchId = confirmStart.id;
    setConfirmStart(null);
    setStarting(batchId);

    const res = await startDayAction({ batchId });
    setStarting(null);

    if (!res.ok) {
      toast.error(res.error);
      router.refresh();
      return;
    }

    router.push(`/dashboard/teacher/attendance/${res.data.id}`);
  }

  function handleOffDay(batchId: string) {
    const b = batches.find((x) => x.batch.id === batchId);
    if (b) setOffDayTarget({ id: batchId, name: b.batch.name });
  }

  async function handleOffDaySubmit(data: {
    batchId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) {
    const res = await markOffDayAction(data);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }

    const msg =
      res.data.skipped.length > 0
        ? `${res.data.created} day(s) marked as off. ${res.data.skipped.length} skipped (attendance already taken).`
        : `${res.data.created} day(s) marked as off.`;

    toast.success(msg);
    router.refresh();
  }

  function handleContinue(dayId: string) {
    router.push(`/dashboard/teacher/attendance/${dayId}`);
  }

  function handleView(dayId: string) {
    router.push(`/dashboard/teacher/attendance/${dayId}`);
  }

  return (
    <>
      <div className="space-y-3">
        {batches.map((b) => (
          <div
            key={b.batch.id}
            className={
              starting === b.batch.id
                ? "pointer-events-none opacity-60 transition-opacity"
                : "transition-opacity"
            }
          >
            <BatchCard
              batch={b}
              onStart={handleStartClick}
              onOffDay={handleOffDay}
              onContinue={handleContinue}
              onView={handleView}
            />
          </div>
        ))}
      </div>

      <OffDayModal
        batchId={offDayTarget?.id ?? ""}
        batchName={offDayTarget?.name ?? ""}
        open={offDayTarget !== null}
        onClose={() => setOffDayTarget(null)}
        onSubmit={handleOffDaySubmit}
      />

      <ConfirmModal
        open={confirmStart !== null}
        title="Start attendance?"
        description={`You'll be the owner for today's attendance of ${confirmStart?.name ?? ""}. Other teachers will only be able to view.`}
        confirmLabel="Start"
        onConfirm={handleStartConfirm}
        onCancel={() => setConfirmStart(null)}
      />
    </>
  );
}
