# Maktab

A warm, calm learning app under a lantern-lit night sky.
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · server actions · httpOnly-cookie auth · Jest + RTL · pnpm.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # set API_URL to your backend
pnpm dev                     # http://localhost:3000
```

Scripts: `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm test`, `pnpm test:watch`, `pnpm test:coverage`.

> Requires Node 20+ and pnpm 9+.

## Architecture

API calls happen **inside server actions**, never in components. Every call goes
through one universal client:

```
Client component ──▶ Server action ("use server") ──▶ api.{get,post,patch,del} ──▶ backend
                                                            │
                                             reads/writes JWT in httpOnly cookies
```

The token never reaches the browser. To call the backend from a new action:

```ts
import { api } from "@/lib/api";
const list = await api.get<Institute[]>("/institutes");
const one  = await api.post<Institute>("/institutes", { body });
```

## Folder structure

```
src/
├─ actions/          # server actions (grouped by domain) — API calls live here
│  └─ auth/
├─ lib/
│  ├─ api/           # universal api client, cookies, errors
│  └─ utils/         # cn, validation (zod), session guard, + __tests__
├─ types/            # grouped by role
│  ├─ shared/  auth/  student/  teacher/  parent/  institute/
├─ components/
│  ├─ ui/            # Button, Input, Card, Spinner, Skeleton (+ __tests__)
│  ├─ auth/          # LoginForm, StudentLoginForm, RegisterForm, AuthScreen
│  ├─ layout/        # AppShell, AppHeader, SignOutButton
│  ├─ shared/        # LanternMark
│  └─ student/ teacher/ parent/ institute/   # role UI (fill in later days)
└─ app/
   ├─ (auth)/        # login/[role], login/student, register  (no URL prefix)
   └─ (app)/         # protected: layout guards session, + dashboard
```

Tests sit in a `__tests__/` folder **next to the code they test**.

## Design system — "Lantern-lit Night Garden"

All tokens live in `src/app/globals.css` (`@theme`), available as utilities:
`bg-night-900`, `text-gold-500`, `bg-quran-soft`, `shadow-soft`, `rounded-lg`, etc.
Fonts: Fredoka (display), Plus Jakarta Sans (body), Amiri (`.text-arabic`, RTL).
Motion (`animate-float`/`twinkle`/`shimmer`) respects `prefers-reduced-motion`.

## UX notes

- Mobile-first, ≥44px touch targets, sticky app-like header, edge-to-edge on phones.
- Toasts via `sonner`; loading states on every button and action.
- Server-side route protection — protected pages redirect before rendering.
