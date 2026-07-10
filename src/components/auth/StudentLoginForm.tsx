"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DarkInput } from "@/components/ui";
import { loginStudentAction } from "@/actions/auth/login";

export function StudentLoginForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await loginStudentAction({ studentCode: code.trim() });
      if (res.ok) {
        toast.success("Welcome");
        router.push("/dashboard");
      } else {
        setError(res.error);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        toast.error(res.error);
      }
    });
  }

  return (
    <div className={shake ? "animate-shake" : ""}>
      <DarkInput
        label="Student code"
        name="studentCode"
        placeholder="STU-ABCD2345"
        autoCapitalize="characters"
        className="font-display uppercase tracking-wide"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        error={error ?? undefined}
      />

      {error && (
        <p
          role="alert"
          className="mt-1 rounded-[var(--radius-md)] bg-[var(--color-error)]/15 px-3 py-2 text-sm text-error"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="mt-6 min-h-[52px] w-full rounded-full bg-gold-500 py-3.5 font-display text-lg font-semibold text-night-900 transition-transform enabled:hover:scale-[1.02] enabled:active:scale-95 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="mt-6 text-center text-sm text-cream-100/50">
        Forgot your code? Ask your teacher or parent.
      </p>
    </div>
  );
}
