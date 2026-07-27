"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui";
import { youTubeEmbedUrl } from "@/lib/utils/youtube";
import { completeVideoAction } from "@/actions/student/lesson/complete-video";

interface Props {
  lessonId: string;
  videoId: string;
  completed: boolean;
  canComplete: boolean;
  onCompleted: () => void | Promise<void>;
}

export function LessonVideo({
  lessonId,
  videoId,
  completed,
  canComplete,
  onCompleted,
}: Props) {
  const [pending, setPending] = useState(false);

  async function markComplete() {
    setPending(true);
    const res = await completeVideoAction(lessonId);
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Video marked complete");
    await onCompleted();
  }

  return (
    <section className="space-y-3">
      <div className="aspect-video overflow-hidden rounded-lg bg-night-900 shadow-soft">
        <iframe
          className="h-full w-full"
          src={youTubeEmbedUrl(videoId)}
          title="Lesson video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {completed ? (
        <p className="inline-flex items-center gap-2 rounded-full bg-success/12 px-3.5 py-2 text-sm font-semibold text-success">
          <CircleCheckBig className="h-4 w-4" aria-hidden />
          You've watched this video
        </p>
      ) : canComplete ? (
        <Button onClick={markComplete} loading={pending}>
          <Check className="h-4 w-4" aria-hidden />
          Mark video as complete
        </Button>
      ) : null}
    </section>
  );
}
