# Project rules for Claude Code

This project keeps its AI agent rules in `.claude/rules/`. These files are the
**single source of truth** for how to write code here — Claude Code must follow them.

> `.windsurf/rules/` and `.cursor/rules/` are **legacy** copies kept for the Windsurf
> and Cursor IDEs. They are no longer the source of truth and are not kept in sync with
> `.claude/rules/` — edit rules in `.claude/rules/` only. (Claude Code has no native
> rule auto-loader, so the rules below take effect only because they are imported here.)

---

## Always-on rules (load every session)

These are imported into context every session and apply to every task, always.

### Core

@.claude/rules/core/agent-behavior.md
@.claude/rules/core/coding-style.md
@.claude/rules/core/typescript-strict.md
@.claude/rules/core/validation.md
@.claude/rules/core/security.md
@.claude/rules/core/git-workflow.md
@.claude/rules/core/env.md
@.claude/rules/core/modes.md
@.claude/rules/core/orchestrator.md
@.claude/rules/architecture.md

> **Working under `apps/mobile/`?** That app diverges from these web rules — read
> `.claude/rules/mobile/` first (see the **Mobile** block under _Context rules_ below).
> The web rules in this Core/Next.js/React/Styling set target `apps/admin` (Next.js).

### Next.js (App Router)

@.claude/rules/nextjs/app-router.md
@.claude/rules/nextjs/data-fetching.md
@.claude/rules/nextjs/ssr-patterns.md
@.claude/rules/nextjs/performance.md

### React

@.claude/rules/react/component-patterns.md
@.claude/rules/react/hooks-rules.md
@.claude/rules/react/server-client-split.md

### Styling & theming

@.claude/rules/styling/tailwind.md
@.claude/rules/styling/shadcn-ui.md
@.claude/rules/theming.md

### API & data layer (oRPC + TanStack Query)

@.claude/rules/api.md

---

## Context rules (read on demand)

**Before working on a matching area, read the relevant file(s)** and follow them. Do
not skip this — they contain the project-specific patterns. (These are deliberately
_not_ imported above, to keep the always-on context small.)

**Mobile (`apps/mobile/`)** — when working **anywhere** under `apps/mobile/`, read
**all** of these FIRST. The mobile app deliberately diverges from the web rules above:
no `src/` (so `@/*` → `./*`), **expo-router** not Next.js (no RSC / `"use client"`),
**gluestack-ui** not shadcn, **react-i18next** not next-intl, **SecureStore** not
`localStorage`, and the API goes through the admin app's **`/api/dax` proxy** (so the
backend host is never shipped — base URL in `apps/mobile/lib/api/base-url.ts`). **When
a web rule conflicts with a mobile rule, the mobile rule wins for `apps/mobile/`.**

- `.claude/rules/mobile/project-structure.md` — file layering (the mobile `architecture.md`)
- `.claude/rules/mobile/expo-router-navigation.md` — route groups, declarative auth gate, splash, route integrity
- `.claude/rules/mobile/state-zustand.md` — Zustand stack adapted, SecureStore exception, hydration
- `.claude/rules/mobile/api-data-layer.md` — oRPC client, validated env URL, `x-locale`, typed token refresh
- `.claude/rules/mobile/theming.md` — semantic tokens vs gluestack scales; every color class must be a declared token
- `.claude/rules/mobile/components-design-system.md` — gluestack-ui v3 + rn-primitives (not shadcn)
- `.claude/rules/mobile/i18n.md` — react-i18next, namespace registration, locale persistence
- `.claude/rules/mobile/startup-health.md` — anti-white-screen startup checklist
- `apps/mobile/docs/architecture.md` — narrative long-term architecture + migration roadmap (background, not a rule)

**Forms** — when building/editing forms, validation, or `react-hook-form`/Zod code:

- `.claude/rules/forms/react-hook-form-zod.md` — RHF + Zod, FormField, multi-step forms
- `.claude/rules/skills/form-patterns.md` — multi-step, dynamic fields, file upload, arrays

**i18n** — when touching translations, locale routing, or `next-intl`:

- `.claude/rules/i18n/next-intl.md` — locale-aware navigation, server vs client usage
- `.claude/rules/skills/i18n-patterns.md` — plurals, dates, numbers, RTL, language switcher

**State** — when adding/editing stores, queries, or mutations:

- `.claude/rules/state/zustand.md` — middleware stack, store structure, selectors, hydration
- `.claude/rules/state/tanstack-query.md` — queryOptions, mutations, cache, skipToken
- `.claude/rules/skills/zustand-patterns.md` — logger middleware, slices, immer, testing
- `.claude/rules/skills/tanstack-query-patterns.md` — dependent/infinite queries, optimistic updates, prefetch

**UI / design** — when building or reviewing UI components:

- `.claude/rules/skills/design-engineering.md` — typography, spacing, motion, color, anti-patterns
- `.claude/rules/skills/shadcn-components.md` — shadcn/ui discovery, customization, registry, theming
- `.claude/rules/skills/tailwind-patterns.md` — responsive grids, flex, animations, dark mode, container queries
- `.claude/rules/skills/react-performance.md` — memoization, virtualization, Suspense, re-render prevention

**Next.js deep dives** — for routing/caching/SEO heavy work:

- `.claude/rules/skills/nextjs-app-router.md` — layouts, caching, middleware, streaming, parallel routes
- `.claude/rules/skills/seo-patterns.md` — Metadata API, JSON-LD, Open Graph, sitemap, robots, CWV

**Testing (E2E)** — when working in the `tests/` workspace or CI for tests:

- `.claude/rules/testing/tdd-discipline.md` — failing test first, then minimal implementation
- `.claude/rules/testing/e2e-architecture.md` — when to add a module, POMs, fixtures, naming
- `.claude/rules/testing/playwright-best-practices.md` — selectors, locators, no waitForTimeout, route mocking
- `.claude/rules/testing/ci-pipeline.md` — GitHub Actions matrix per module, artifacts, secrets

---

## Skills

Project skills live in `.claude/skills/<name>/SKILL.md` and are invoked as `/<name>`:

- `/add-test-module <name>` — scaffold a new E2E test module (spec, POM, Playwright
  project entry, CI matrix row). Use when asked to add a new test module under
  `tests/src/modules/`.
- `/draft-fe-task <old> <new> [intent…]` — **backend side.** Auto-diff the API
  contract between two versions, prompt for business intent, and emit a Linear FE
  task in the canonical schema (`draft-fe-task/fe-task-schema.md`). Run in the
  contract/backend repo. Backend supplies contract-truth + intent; never prescribes
  the FE stack.
- `/triage-ticket <DAX-id>` — **frontend side.** Fetch a Linear ticket, parse the
  contract delta, validate the installed contract version, grep the repo to map
  every affected route/component/hook/i18n/api-client, flag build-breakers, list
  open questions, then hand off to `writing-plans`. Read-only until the plan.

> The two skills share one canonical ticket structure — `fe-task-schema.md` inside
> the `draft-fe-task/` folder — so what the backend writes is exactly what the
> frontend parses. The schema lives inside the BE skill folder so the backend can
> copy that folder into their repo self-contained.

---

## Claude Code configuration (`.claude/`)

Layout of the Claude Code config in this repo:

```
front-repo/
├── CLAUDE.md                  # this file — context loaded every session
├── .mcp.json                  # team-shared MCP servers (context7, playwright, …)
└── .claude/
    ├── settings.json          # shared permissions (allow/deny) — committed
    ├── settings.local.json    # personal overrides — gitignored
    ├── rules/                 # SOURCE OF TRUTH for code rules
    │   ├── core/              # agent-behavior, coding-style, typescript-strict, …
    │   ├── nextjs/  react/  styling/  state/  forms/  i18n/  testing/
    │   ├── skills/            # deep-dive pattern guides (NOT invokable skills)
    │   ├── theming.md
    │   └── api.md             # oRPC + TanStack Query data-layer patterns
    └── skills/                # invokable skills, run as /<name>
        ├── add-test-module/   # /add-test-module — scaffold an E2E module
        ├── draft-fe-task/     # /draft-fe-task — BE emits an FE Linear task (+ fe-task-schema.md)
        └── triage-ticket/     # /triage-ticket — FE ingests & analyses a Linear ticket
```

Claude-Code-specific notes:

- **Rules do not auto-load.** Unlike Cursor/Windsurf, Claude Code has no
  `trigger:` / `globs:` system. A file under `.claude/rules/` takes effect **only**
  when imported with `@.claude/rules/<file>.md` (always-on rules, above) or read on
  demand because this file says so (context rules, above).
- **`.claude/rules/skills/`** holds extended _pattern guides_ (a Windsurf naming
  carry-over). They are reference docs, not invokable skills — invokable skills live
  in `.claude/skills/`.
- **MCP servers** live in `.mcp.json` and need per-developer approval on first use
  (run `/mcp` to authenticate Linear/Figma). `git` and `fetch` run via `uvx`
  (requires `uv`); the others run via `npx`. Figma needs the Figma desktop app with
  the Dev Mode MCP server enabled at `127.0.0.1:3845` (switch the URL to `/mcp` +
  `"type": "http"` if your Figma version uses the newer endpoint).
- **Personal settings** belong in `.claude/settings.local.json` (gitignored) — put
  machine-specific permissions or `enableAllProjectMcpServers` there, not in the
  shared `settings.json`.
- **Legacy IDE rules:** `.windsurf/rules/` and `.cursor/rules/` are kept for those
  IDEs but are no longer synced. Make rule changes in `.claude/rules/`.
