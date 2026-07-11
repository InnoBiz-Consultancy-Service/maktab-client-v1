import { Hammer, Building2, Mail, Phone } from "lucide-react";
import { getSession } from "@/lib/api/cookies";
import { Card } from "@/components/ui";

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-night-900">Settings</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Your institute&rsquo;s details.
        </p>
      </header>

      <Card className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-arabic-soft text-arabic">
            <Building2 className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-night-900">
              {session?.label ?? "Your institute"}
            </p>
            <p className="text-sm capitalize text-ink-soft">
              {session?.role.toLowerCase() ?? "institute"} account
            </p>
          </div>
        </div>

        <dl className="mt-5 divide-y divide-cream-200 border-t border-cream-200">
          <div className="flex items-center gap-3 py-3">
            <Mail className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden />
            <dt className="sr-only">Email</dt>
            <dd className="truncate text-sm text-night-900">
              {session?.label ?? "—"}
            </dd>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Phone className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden />
            <dt className="sr-only">Phone</dt>
            <dd className="text-sm text-ink-soft">Not set</dd>
          </div>
        </dl>
      </Card>

      <Card className="border border-warn/30 bg-warn/10">
        <div className="flex items-start gap-3">
          <Hammer className="mt-0.5 h-5 w-5 shrink-0 text-warn" aria-hidden />
          <div>
            <p className="font-semibold text-night-900">Editing coming soon</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              Updating your institute&rsquo;s name, logo and contact details
              will be available once the backend is ready.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
