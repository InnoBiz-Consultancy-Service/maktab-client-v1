"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui";
import { logoutAction } from "@/actions/auth/login";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      loading={pending}
      onClick={() => startTransition(() => logoutAction())}
      className="border-cream-100/20 text-cream-50 hover:bg-night-800"
    >
      <LogOut className="h-4 w-4 text-white" aria-hidden />
      <span className="hidden text-white sm:inline">Sign out</span>
    </Button>
  );
}
