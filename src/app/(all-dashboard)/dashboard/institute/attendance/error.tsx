"use client";

import { ErrorCard } from "@/components/shared/attendance/ErrorCard";

export default function InstituteAttendanceError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <ErrorCard
        title="Couldn't load attendance"
        message={
          error.message || "An unexpected error occurred. Please try again."
        }
      />
    </div>
  );
}
