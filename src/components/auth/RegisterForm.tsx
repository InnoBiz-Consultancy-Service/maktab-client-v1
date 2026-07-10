"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DarkInput } from "@/components/ui";
import { registerParentAction } from "@/actions/auth/login";
import type { RegisterParentInput } from "@/lib/utils/validation";

const fields: Array<{
  key: keyof RegisterParentInput;
  label: string;
  type?: string;
  autoComplete?: string;
}> = [
  { key: "name", label: "Full name", autoComplete: "name" },
  { key: "email", label: "Email", type: "email", autoComplete: "email" },
  { key: "password", label: "Password", type: "password", autoComplete: "new-password" },
  { key: "phone", label: "Phone", autoComplete: "tel" },
  { key: "profession", label: "Profession" },
  { key: "address", label: "Address", autoComplete: "street-address" },
  { key: "emergencyContact", label: "Emergency contact" },
];

const empty: RegisterParentInput = {
  name: "", email: "", password: "", phone: "",
  profession: "", address: "", emergencyContact: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterParentInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [pending, startTransition] = useTransition();

  function update(key: keyof RegisterParentInput, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await registerParentAction(form);
      if (res.ok) {
        toast.success("Account created — please sign in");
        router.push("/login/parent");
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
      {fields.map((f) => (
        <DarkInput
          key={f.key}
          label={f.label}
          name={f.key}
          type={f.type ?? "text"}
          autoComplete={f.autoComplete}
          value={form[f.key]}
          onChange={(e) => update(f.key, e.target.value)}
        />
      ))}

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
        {pending ? "Creating…" : "Create account"}
      </button>
    </div>
  );
}
