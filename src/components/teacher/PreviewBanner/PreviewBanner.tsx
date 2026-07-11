import { Hammer } from "lucide-react";
import { Card } from "@/components/ui";

/**
 * A plain notice that the data on screen isn't real yet. Better to say this
 * openly than let a teacher act on made-up numbers.
 */
export function PreviewBanner({ what }: { what: string }) {
  return (
    <Card className="mb-6 border border-warn/30 bg-warn/10">
      <div className="flex items-start gap-3">
        <Hammer className="mt-0.5 h-5 w-5 shrink-0 text-warn" aria-hidden />
        <div>
          <p className="font-semibold text-night-900">Preview only</p>
          <p className="mt-0.5 text-sm text-ink-soft">
            {what} is still being built. Everything below is example data — not
            your real students or records yet.
          </p>
        </div>
      </div>
    </Card>
  );
}
