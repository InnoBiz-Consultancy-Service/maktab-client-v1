"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanternMark } from "@/components/shared/LanternMark";
import { SignOutButton } from "@/components/layout/SignOutButton";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { cn } from "@/lib/utils/cn";
import type { Session } from "@/types/auth";
import { NavItem } from "./nav-item";
import { navIcons } from "./nav-icons";

/** Is this nav item the current page? Exact for the index, prefix otherwise. */
function isActive(pathname: string, href: string, index: string): boolean {
  if (href === index) return pathname === index;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({
  session,
  items,
  indexHref,
}: {
  session: Session;
  items: NavItem[];
  indexHref: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-night-800 bg-night-900 lg:flex">
      {/* Brand */}
      <div className="flex items-center justify-between px-6 py-6 text-cream-50">
        <div className="flex items-center gap-2">
          <LanternMark className="animate-float text-gold-400" />
          <span className="font-display text-xl font-bold">Maktab</span>
        </div>
        <NotificationBell
          role={session.role}
          className="text-cream-100/70 hover:text-cream-50 hover:bg-night-800"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3" aria-label="Main">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = navIcons[item.icon];
            const active = isActive(pathname, item.href, indexHref);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors",
                    active
                      ? "bg-gold-500 text-night-900"
                      : "text-cream-100/70 hover:bg-night-800 hover:text-cream-50",
                  )}
                >
                  <Icon className="h-4.5 w-4.5" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Account */}
      <div className="border-t border-night-800 px-4 py-4">
        <p className="mb-3 truncate px-2 text-sm text-cream-100/60">
          <span className="capitalize">{session.role.toLowerCase()}</span>
          {" · "}
          {session.label}
        </p>
        <SignOutButton />
      </div>
    </aside>
  );
}
