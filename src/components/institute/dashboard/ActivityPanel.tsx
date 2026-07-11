import {
  CalendarCheck,
  ClipboardList,
  UserRoundPlus,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui";
import { ActivityEntry } from "@/lib/dummy/instititue";


const kindStyles: Record<
  ActivityEntry["kind"],
  { icon: LucideIcon; tone: string }
> = {
  attendance: { icon: CalendarCheck, tone: "bg-quran-soft text-quran" },
  marks: { icon: ClipboardList, tone: "bg-arabic-soft text-arabic" },
  enrolment: { icon: UserRoundPlus, tone: "bg-gold-500/20 text-gold-600" },
  payment: { icon: CreditCard, tone: "bg-duas-soft text-duas" },
};

/** Recent activity across the institute. Placeholder data for now. */
export function ActivityPanel({ entries }: { entries: ActivityEntry[] }) {
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
        <h2 className="font-display font-bold text-night-900">
          Recent activity
        </h2>
        <span className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-ink-soft">
          Preview
        </span>
      </div>

      <ul className="divide-y divide-cream-200">
        {entries.map((e) => {
          const { icon: Icon, tone } = kindStyles[e.kind];
          return (
            <li key={e.id} className="flex items-start gap-3 px-5 py-3.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone}`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-night-900">{e.text}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{e.when}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
