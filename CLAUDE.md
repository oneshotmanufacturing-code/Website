# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site + customer portal + admin back-office for **OneShot Manufacturing** (wire/cable prep, PCB assembly, CNC — Bengaluru, India). Next.js 14 App Router, TypeScript, Tailwind 3, Supabase (auth + Postgres + storage). Deployed on Vercel at `oneshotmanufacturing.com`.

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # production build
npm start        # serve the build
npm run lint     # next lint
npx tsc --noEmit # typecheck
```

There is no test framework in this repo — don't invent test commands.

**`next.config.mjs` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`.** A green `npm run build` proves nothing about lint or types; run `npm run lint` and `npx tsc --noEmit` explicitly after changes.

Path alias: `@/*` → `./src/*`.

## Environment

Only two vars are used anywhere: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `.env.production` is committed with the live project's values; create `.env.local` for local work (gitignored).

**Local auth bypass:** [middleware.ts](middleware.ts) checks whether `NEXT_PUBLIC_SUPABASE_URL` contains the string `dummy-project`, and if so short-circuits *all* auth and role checks. That is the intended way to click through `/portal` and `/admin` without a real Supabase project — but note the page-level checks below still run, so pages will render empty rather than redirect.

## Three surfaces, one app

- **Public marketing** — `/`, `/about`, `/services`, `/contact`. Server components composing `src/components/sections/*`. `Navbar`/`Footer`/`ScrollReveal` are imported **per page**, not in the root layout, so a new public page must include them itself.
- **`/portal/*`** — logged-in customer: orders, quotes, invoices, profile.
- **`/admin/*`** — staff: messages, quotes, orders, customers.

Auth pages live in two places: `src/app/(auth)/` (route group — login, signup, forgot-password) and `src/app/auth/` (real route segments — `callback`, `signout`, `set-password`).

## Auth & authorization

Two layers, both required:

1. [middleware.ts](middleware.ts) — matcher is `/portal/*`, `/admin/*`, `/login`, `/signup`. Redirects anonymous users to `/login`, non-admins away from `/admin` (reads `profiles.role`), and logged-in users off `/login`/`/signup` to `/portal`.
2. Each server page re-checks `auth.getUser()` and the profile role itself (e.g. [src/app/portal/page.tsx](src/app/portal/page.tsx), [src/app/admin/customers/page.tsx](src/app/admin/customers/page.tsx)). Keep doing this in new protected pages — middleware alone is not the boundary.

Roles are a `role` column on `profiles` (`"admin"` vs everything else). Signup creates the auth user then updates its `profiles` row.

**Most portal/admin mutations go straight from the browser to Supabase with the anon key** (`createClient()` from `@/lib/supabase/client` inside `"use client"` components — see [QuoteActions.tsx](src/components/admin/QuoteActions.tsx), [OrderStatusUpdater.tsx](src/components/admin/OrderStatusUpdater.tsx), [QuoteBuilder.tsx](src/components/QuoteBuilder.tsx)). There is no service-role key and no server-side validation on those paths, so **RLS policies in Supabase are the only real authorization check** on writes. When adding a table or column, the policy work matters as much as the UI.

## Supabase clients

- `@/lib/supabase/server` — `await createClient()`, cookie-backed, for server components/route handlers.
- `@/lib/supabase/client` — browser singleton.
- [src/app/api/contact/route.ts](src/app/api/contact/route.ts) builds its own `createServerClient` inline instead of using the shared helper. Its `GET` (used by the admin dashboard) only checks *that* a user is logged in, not that they're an admin.

## Data model (inferred from queries — no migrations in repo)

| table | notes |
|---|---|
| `profiles` | `id` = auth user id, `role`, company/contact fields |
| `messages` | contact form → written by `/api/contact`, read by `/admin` |
| `contact_submissions` | written directly by [ContactForm.tsx](src/components/ContactForm.tsx) — **separate table from `messages`**, and nothing reads it |
| `quote_requests` | from `QuoteBuilder`; `status`, `admin_notes`, optional `customer_id` |
| `orders` | `order_number` (`MP-<year>-<rand>`), `customer_id`, `status`, amount, delivery fields |
| `order_events` | append-only status history; every status change writes one |
| `documents` | `order_id`, `type`, `filename`, `storage_path` |
| `quote_documents` | quote attachments |

Storage bucket: `documents` (upload + `createSignedUrl` for customer download).

Status vocabularies are hardcoded in the components, not in a shared module — keep them in sync if you touch either:
- quotes: `new → contacted → converted → closed` ([QuoteActions.tsx](src/components/admin/QuoteActions.tsx))
- orders: `confirmed → material_ready → in_production → quality_check → dispatched → delivered` ([OrderStatusUpdater.tsx](src/components/admin/OrderStatusUpdater.tsx))
- document types: `invoice | challan | test_report | other`

Quote → order conversion is a URL handoff, not a DB operation: `QuoteActions` builds query params and links to `/admin/orders/new`, which prefills the form.

## Design system — two generations coexist

The **current** public-site design is light/white ("CableLeader-inspired"), defined in [tailwind.config.ts](tailwind.config.ts) + `@layer components` in [src/app/globals.css](src/app/globals.css): `.site-container`, `.section-pad`, `.eyebrow`, `.section-heading`, `.btn-amber`, `.btn-outline-white`, `.cl-card`, `.card-title`, `.section-reveal`.

Two naming traps in the Tailwind palette — the legacy names were repointed rather than removed:
- `amber` / `red` are both **red** `#DC2626`
- `black` is **white** `#FFFFFF`, `dark-1/2/3` are light greys

The **older dark** design's vocabulary is still used throughout `/admin`, `/portal`, `(auth)`, [ui/Button.tsx](src/components/ui/Button.tsx), [ProcessFlow.tsx](src/components/ProcessFlow.tsx): `btn-glow`, `glass-card`, `accent-primary`, `bg-bg-tertiary`, `border-border-subtle`, `text-text-primary/secondary/muted`. **None of those are defined any more** — they compile to nothing, which is why those screens look unstyled. Fixing one of those pages means translating it to the current tokens, not adding the old ones back. `/admin/page.tsx` sidesteps this with inline `style={{}}` objects.

`font-display` / `font-body` map to CSS vars that nothing sets ([src/lib/fonts.ts](src/lib/fonts.ts) is never imported), so they fall back to Inter, which the root layout loads.

`ScrollReveal` observes `.section-reveal` elements **present at mount only** — content revealed later won't animate.

## Stale files — do not treat as spec

[01_design_spec.md](01_design_spec.md), [02_component_library.md](02_component_library.md), and [03_qwen_prompts.md](03_qwen_prompts.md) describe the abandoned dark theme (`#080808`, Bebas Neue + DM Sans, single-page layout) and a folder structure that no longer matches. They're historical prompt scaffolding. Same for [local-db.json](local-db.json) and [scratch_db.js](scratch_db.js) (throwaway scripts) and the top-level [images/](images/) directory — only [public/images/](public/images/) is actually served.

## graphify — use this to navigate the codebase instead of raw grep/read

This project has a `graphify` knowledge graph in `graphify-out/` (AST-extracted call/import graph, no LLM step, so it stays cheap to rebuild). **Prefer it over Grep/Glob/Read for "where is X" / "how does X connect to Y" questions** — it costs a fraction of the tokens of sweeping the raw source.

- `graphify-out/GRAPH_REPORT.md` — god nodes, community structure, surprising connections. Read this first for any architecture question.
- `graphify query "<question>"` — BFS/DFS traversal of `graphify-out/graph.json`, returns cited file paths + line numbers within a token budget (`--budget N`, default 2000). Use this before opening files by hand to explore.
- `graphify path "<NodeA>" "<NodeB>"` / `graphify explain "<Node>"` — shortest path between two symbols, or a plain-language explanation of one.
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files.

**Keeping the graph current:**
- A `PostToolUse` hook (`.claude/settings.json`) already re-runs the AST rebuild after every Edit/Write in a Claude Code session — this is automatic, no need to trigger it by hand.
- Git `post-commit`/`post-checkout` hooks (installed via `graphify hook install`) rebuild it outside the session too.
- Manual rebuild if ever needed: `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"`.
- The rebuild above only refreshes `graph.json`/`GRAPH_REPORT.md`. To regenerate the two *viewable* graphs (below), run `python3 scripts/graphify-render.py`.

**Viewing the graph:** `scripts/graphify-launch.sh` renders both graph views and opens them:
1. `graphify-out/graph.html` — interactive force-directed graph, any browser.
2. `graphify-out/obsidian/` — Obsidian vault (one note per community + `graph.canvas`); opened via the `obsidian://` URI if the app is installed, otherwise the path is printed to open manually.

Use `--no-render` to just reopen the existing outputs without regenerating them.
