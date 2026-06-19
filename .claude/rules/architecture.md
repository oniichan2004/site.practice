# Architecture Rule — File Layering Inside `apps/admin/src/`

> Loaded every session via the `@.claude/rules/architecture.md` import in `CLAUDE.md`.
> This rule is **mandatory** and **always-on**. Read it before creating any new file
> under `apps/admin/src/`.

The `apps/admin` codebase enforces a strict layered structure. Each kind of code
lives in exactly one place. The rule below is non-negotiable for new code.

---

## 1. Top-level layout (single source of truth)

```
apps/admin/src/
├── components/              ← React components ONLY (.tsx files)
│   ├── pages/<page>/        ← page-scoped components (e.g. routes/, companies/)
│   ├── ui/                  ← shadcn primitives
│   ├── layout/              ← app shell
│   ├── autocompletes/       ← shared interactive widgets
│   └── dialogs/             ← shared dialogs
├── data/
│   ├── mock-data/<page>/    ← all mock/placeholder data
│   └── <other static>.ts    ← curated static datasets (e.g. currencies.ts)
├── hooks/
│   ├── use-*.ts             ← shared, generic hooks
│   └── <page>/use-*.ts      ← page-specific hooks
├── lib/
│   ├── api/                 ← oRPC clients and contract types
│   ├── auth/                ← auth glue
│   ├── constants/           ← shared constants
│   ├── registries/          ← lookup tables that contain JSX (e.g. icon maps)
│   ├── schemas/<page>/      ← Zod schemas (validation, not UI types)
│   └── utils/
│       ├── <generic>.ts     ← shared utilities (format-date, format-price, …)
│       └── <page>/          ← page-specific utilities
├── stores/                  ← Zustand stores
└── types/
    ├── <shared>.ts          ← cross-cutting domain types (e.g. seat-plan.ts)
    └── <page>/              ← page-specific types
```

---

## 2. Decision tree — "Where does this file belong?"

Before creating a new file, answer **one** question:

| What is the file? | Where it goes |
|---|---|
| React component (returns JSX) | `components/pages/<page>/<Name>.tsx` (or `components/ui|layout|…/`) |
| Custom hook (`use*`) used by one page | `hooks/<page>/use-<name>.ts` |
| Custom hook used by many pages | `hooks/use-<name>.ts` |
| TypeScript types/interfaces for one page | `types/<page>/<area>.ts` |
| Cross-cutting domain types | `types/<area>.ts` |
| Mock/placeholder data | `data/mock-data/<page>/<area>.ts` |
| Pure utility function (no JSX) for one page | `lib/utils/<page>/<area>.ts` |
| Pure utility function shared | `lib/utils/<name>.ts` |
| Zod schema (form validation, payload shape) | `lib/schemas/<page>/index.ts` |
| Lookup table containing JSX (icons, styled badges, …) | `lib/registries/<name>.tsx` |
| Constants (no logic) | `lib/constants/<name>.ts` |
| Zustand store | `stores/<name>.ts` |

If you can't pick one, **stop and ask**. Do not invent a fourth location.

---

## 3. Absolute prohibitions inside `components/pages/`

`apps/admin/src/components/pages/**` accepts **only** files that match these
patterns:

- `*.tsx` — React component files (one component per file is preferred; small,
  tightly-coupled sub-components < 30 lines may share a file).
- Subdirectories that contain more `.tsx` files (e.g. `routes/marketplace/`,
  `agents/agency/`, `buy-tickets/_shared/`).

The following are **forbidden** under `components/pages/**`:

- `*.ts` non-component files (types, utils, schemas, mock data, hooks, constants).
- Inline `const MOCK_*`, `const DEFAULT_<bigDataset>` blocks longer than a small
  default-value object — extract to `data/mock-data/<page>/`.
- Inline `function use<Hook>` definitions that aren't trivially short and
  page-scoped — extract to `hooks/<page>/`.
- Re-export barrel files that mix layers.

Default UI state (e.g. `const DEFAULT_FILTERS = { … }` used as the seed for
`useState`) is **allowed** because it is a UI seed, not data.

---

## 4. Per-page slug discipline

If a page has its own folder under `components/pages/<slug>/`, then the **same
slug** is reused everywhere:

- `components/pages/agents/` ↔ `hooks/agents/` ↔ `types/agents/` ↔ `data/mock-data/agents/` ↔ `lib/utils/agents/` ↔ `lib/schemas/agents/`

Never split a page across multiple slugs (no `agents/` and `agent/` and
`sales-agents/` at the same time). Pick one when the page is created.

---

## 5. Naming conventions

| File kind | Convention | Examples |
|---|---|---|
| React component | PascalCase | `RouteListClient.tsx`, `SeatMapGrid.tsx` |
| Hook | kebab-case, `use-` prefix | `use-stops-map-builder.ts` |
| Types / utils / schemas / data | kebab-case | `seat-map.ts`, `stops-map.ts`, `support.ts` |
| Registry (contains JSX) | kebab-case `.tsx` | `seat-plan-elements.tsx` |
| Barrel | `index.ts` | `types/agents/index.ts` |

Do not change the convention of an existing file purely for style — match what
the surrounding folder uses.

---

## 6. Import paths — always use `@/` alias

`tsconfig.json` maps `@/*` → `./src/*`. Always use absolute aliased imports:

```ts
// ✅ Correct
import { useStopsMapBuilder } from "@/hooks/routes/use-stops-map-builder";
import type { StopDraft } from "@/types/routes/stops";
import { MOCK_AGENCIES } from "@/data/mock-data/agents";
import { isSeatElement } from "@/lib/utils/buy-tickets/seat-map";
import { supportFormSchema } from "@/lib/schemas/support";
import { ELEMENT_REGISTRY } from "@/lib/registries/seat-plan-elements";

// ❌ Wrong — deep relative paths cross layer boundaries opaquely
import { useStopsMapBuilder } from "../../../hooks/routes/use-stops-map-builder";

// ❌ Wrong — page-specific code imported from a sibling page folder by relative path
import { StopDraft } from "../routes/stops-types";
```

Relative imports (`./Foo`) are allowed **only** inside the same folder.

---

## 7. Dependency direction

Layers may import in this direction only — never the reverse:

```
types → (imported by all)
↓
data/mock-data, lib/schemas → types
↓
lib/utils, lib/registries → types (+ lib/api/types for contract)
↓
hooks → types, lib/utils, lib/api
↓
stores → types, lib/utils
↓
components → everything above
```

Concrete rules:

- `types/` never imports from `components/`, `hooks/`, `data/`, `stores/`.
- `data/mock-data/` imports types only.
- `lib/utils/` imports types only (+ `lib/api/types` for contract derivations).
- `lib/schemas/` imports `zod` + types only.
- Component files import freely from any layer below.

---

## 8. Pre-file-creation checklist

Before creating any new file under `apps/admin/src/`, confirm in order:

1. **Read this rule** end-to-end (or remember it; do not skip).
2. **Identify the file kind** from §2.
3. **Pick the location** strictly from §1.
4. **Check the slug** in §4 — reuse existing page slug if it exists.
5. **Verify dependency direction** in §7 — if a `data/` file would need to import
   from `components/`, you are creating the file in the wrong layer.
6. **Use `@/` aliases** for all cross-layer imports (§6).

If two locations seem plausible, prefer the layer **closest to data** (types over
utils, utils over hooks, hooks over components). When in doubt, ask the user.

---

## 9. Exceptions

There are **no** exceptions for new code. Existing legacy files that violate this
rule are tracked in `.windsurf/plans/architecture-refactor-c06a1b.md` and are
migrated incrementally. Do not add new violations on the grounds that "old code
does it".

The single permitted variation is for files that are genuinely cross-cutting and
not page-specific (e.g. `types/seat-plan.ts` is used by `seat-plans/`,
`vehicles/`, `trips/`, `buy-tickets/`). Such files live at the top of their layer
(`types/seat-plan.ts`), not under any `<page>/` subfolder.
