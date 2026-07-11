"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DarkInput } from "@/components/ui";
import { loginAction } from "@/actions/auth/login";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await loginAction({ email, password });
      if (res.ok) {
        toast.success("Welcome back");
        router.push(`/dashboard`);
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
        label="Email"
        name="email"
        type="email"
        autoComplete="username"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <DarkInput
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        error={error ?? undefined}
      />

      {error && (
        <p
          role="alert"
          className="mt-1 rounded-(--radius-md) bg-error/15 px-3 py-2 text-sm text-error"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="mt-6 min-h-3 w-full rounded-full bg-gold-500 py-3.5 font-display text-lg font-semibold text-night-900 transition-transform enabled:hover:scale-[1.02] enabled:active:scale-95 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </div>
  );
}
