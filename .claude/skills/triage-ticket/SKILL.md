---
name: triage-ticket
description: Ingest and analyze a Linear FE ticket before implementing — fetches the issue, parses the contract delta, validates the installed contract version, greps the repo to map every affected route/component/hook/store/i18n/api-client, flags build-breaking changes, lists open questions, then hands off to writing-plans. Use when picking up a Linear ticket (DAX-###) in the admin frontend.
argument-hint: "<DAX-id | Linear URL>"
---

# Triage Ticket (frontend ingest & analysis)

Invoked as `/triage-ticket <DAX-id | Linear URL>` (the id/URL is `$ARGUMENTS`,
e.g. `DAX-204`). Produces a **triage report**, then hands off to the
`writing-plans` skill. **Read-only until the plan** — this skill does not bump the
contract, derive types, or write code.

> Pairs with `/draft-fe-task`. Tickets authored by that skill follow
> `.claude/skills/draft-fe-task/fe-task-schema.md` — read that file to know the
> ten sections you're parsing. A ticket may not follow it perfectly; extract what
> you can and record gaps as open questions (step 6).

First skim the relevant rules so the stack-map is accurate: `.claude/rules/api.md`
(oRPC + TanStack Query, `@/lib/api/client`), `.claude/rules/architecture.md`
(layer map), `.claude/rules/i18n/next-intl.md`. Recall the permissions memory
(`<Permission>` + `route-permissions.ts`).

## Steps

1. **Fetch the ticket.** Use the Linear MCP — `get_issue` for `$ARGUMENTS`
   (accepts a `DAX-###` identifier or URL) and `list_comments` for context. If the
   MCP is unavailable, ask the user to paste the ticket body.

2. **Parse against the schema** (`fe-task-schema.md`). Extract **all ten sections**:
   §1 contract `old → new` + published flag, §2 breaking flag + list, §3 endpoint
   deltas (per-procedure NEW/CHANGED/DEPRECATED/REMOVED + field changes), §4 error
   codes, §5 permissions/role, §6 behaviour rules, §7 intent, §8 acceptance criteria,
   §9 references (contract PR/tag — feeds step 3's published check), §10 the
   FE-ownership boundary.

3. **Validate the contract version.** Read the installed version from
   [packages/api/package.json](packages/api/package.json)
   (`@daxsystem/admin-api-contract`). Compare to §1's `new`:
   - installed **≥** required → OK, proceed.
   - installed **<** required → a bump is needed. Confirm the new version is
     actually published/installable (per schema §1). If unpublished, **stop and
     flag it** — implementation can't begin.
   - Never hand-write contract types — they come from `@repo/api` / `@/lib/api/types`
     (rule `typescript-strict.md` §3, `api.md` §1).

4. **Map to the stack** (the core value — read-only grep). For each affected
   procedure and field, find the blast radius:
   - **Call sites:** grep for `apiContracts.<namespace>.<procedure>` and the named
     client `<namespace>Client` (e.g. `vehiclesClient`, `apiContracts.vehicles.update`)
     across `apps/admin/src` → which pages/components/hooks call it.
   - **Changed/removed fields:** grep the field names at those call sites
     (e.g. a removed `amenities` field) → exact lines that will need editing.
   - **Layers** (per `architecture.md`): routes (`apps/admin/src/app/`), components
     (`components/pages/<slug>/`), hooks (`hooks/<slug>/`), schemas
     (`lib/schemas/<slug>/`), stores, error mappers (`lib/api/*-errors.ts`).
   - **Permissions:** for each gated endpoint (§5), check whether a
     `route-permissions.ts` entry and `<Permission>` gate already exist; flag any
     missing gate (a backend-only permission with no FE gate is a 403 leak).
   - **i18n:** identify the namespace under `packages/i18n/locales/<locale>/` that
     needs keys, and note that new §4 error codes must be added to
     `_back-errors.json` across **all four** locales (en/ro/ru/uk).

5. **Surface build-breakers.** If §2 is `YES`, list the **exact call sites that
   will fail to compile** — removed/renamed types (e.g. `VehicleAmenityValue`),
   renamed output fields, new required inputs. This is the "don't get surprised by
   a red `pnpm build`" guard. Run `pnpm check-types` only after the contract is
   bumped (a later step in the plan), not here.

6. **Collect open questions.** Anything the ticket left ambiguous, any missing
   schema section, any rule that §6/§7 didn't resolve → a numbered list. Offer to
   post it back to the ticket as a Linear comment (`save_comment`) so the loop with
   the backend closes before coding starts.

7. **Emit the triage report** (concise, structured):
   - **Contract:** installed `x` vs required `y` → bump? published?
   - **Affected files:** the grep-derived map, grouped by layer, with line refs.
   - **Build-breakers:** the §2 list, or "none — additive".
   - **Permission / i18n gaps:** missing gates, locale keys, error codes ×4.
   - **Open questions:** numbered (and whether posted to Linear).

8. **Hand off to `writing-plans`.** Pass the triage report as the input context so
   the plan is grounded in the real blast radius. Do **not** start implementing —
   the plan-review checkpoint comes first (it's caught breaking bumps before).
