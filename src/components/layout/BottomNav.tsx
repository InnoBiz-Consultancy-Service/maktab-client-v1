"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { NavItem } from "./nav-item";
import { navIcons } from "./nav-icons";

function isActive(pathname: string, href: string, index: string): boolean {
  if (href === index) return pathname === index;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Bottom tab bar — the thing that makes the phone experience feel like an app
 * rather than a website. Fixed to the bottom, safe-area aware, big tap targets.
 */
export function BottomNav({
  items,
  indexHref,
}: {
  items: NavItem[];
  indexHref: string;
}) {
  const pathname = usePathname();
  const tabs = items.filter((i) => i.mobile);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-cream-200 bg-cream-50/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch">
        {tabs.map((item) => {
          const Icon = navIcons[item.icon];
          const active = isActive(pathname, item.href, indexHref);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14.5 flex-col items-center justify-center gap-1 transition-colors",
                  active ? "text-gold-600" : "text-ink-soft",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                    active && "bg-gold-500/20",
                  )}
                >
                  <Icon className="h-4.75 w-4.75" aria-hidden />
                </span>
                <span className="text-[11px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
