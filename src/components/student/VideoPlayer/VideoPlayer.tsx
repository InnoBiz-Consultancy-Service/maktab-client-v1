"use client";

import { useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Lesson video with custom controls.
 *
 * `src` is empty in preview mode — we show a calm placeholder instead of a
 * broken player, but every control is wired so dropping in a real URL just works.
 */
export function VideoPlayer({
  src,
  title,
  onEnded,
}: {
  src: string;
  title: string;
  onEnded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.pause();
    else void v.play();
    setPlaying(!playing);
  }

  function restart() {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play();
    setPlaying(true);
  }

  function onTimeUpdate() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = Number(e.target.value);
    v.currentTime = (pct / 100) * v.duration;
    setProgress(pct);
  }

  return (
    <div className="overflow-hidden rounded-lg bg-night-900">
      {/* Stage */}
      <div className="relative aspect-video w-full">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            className="h-full w-full"
            muted={muted}
            onTimeUpdate={onTimeUpdate}
            onEnded={() => {
              setPlaying(false);
              onEnded?.();
            }}
            playsInline
          />
        ) : (
          // Preview placeholder — no real video yet
          <button
            type="button"
            onClick={() => onEnded?.()}
            className="flex h-full w-full flex-col items-center justify-center gap-3 text-cream-100/70 transition-colors hover:text-cream-50"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-night-900 shadow-[0_0_32px_rgba(245,184,51,0.45)]">
              <Play className="ml-1 h-7 w-7 fill-current" aria-hidden />
            </span>
            <span className="text-sm font-medium">Tap to continue</span>
            <span className="text-xs text-cream-100/50">
              Video coming soon — this is a preview
            </span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={toggle}
          disabled={!src}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-night-900 transition-transform active:scale-90 disabled:opacity-40"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="h-4 w-4 fill-current" aria-hidden />
          ) : (
            <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden />
          )}
        </button>

        <button
          type="button"
          onClick={restart}
          disabled={!src}
          className="shrink-0 text-cream-100/70 transition-colors hover:text-cream-50 disabled:opacity-40"
          aria-label="Start again"
        >
          <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
        </button>

        {/* Scrubber */}
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={seek}
          disabled={!src}
          aria-label="Seek"
          className={cn(
            "h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-night-600 accent-gold-500",
            "disabled:opacity-40",
          )}
        />

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          disabled={!src}
          className="shrink-0 text-cream-100/70 transition-colors hover:text-cream-50 disabled:opacity-40"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <VolumeX className="h-[18px] w-[18px]" aria-hidden />
          ) : (
            <Volume2 className="h-[18px] w-[18px]" aria-hidden />
          )}
        </button>

        <button
          type="button"
          onClick={() => videoRef.current?.requestFullscreen()}
          disabled={!src}
          className="hidden shrink-0 text-cream-100/70 transition-colors hover:text-cream-50 disabled:opacity-40 sm:block"
          aria-label="Fullscreen"
        >
          <Maximize className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </div>

      <p className="sr-only">{title}</p>
    </div>
  );
}
