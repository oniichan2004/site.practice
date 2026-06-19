---
name: draft-fe-task
description: Draft a Frontend task in Linear from a backend contract change — auto-diffs the API contract between two versions, then prompts for business intent, and emits a ticket in the canonical FE-task schema. Use when the backend changed the API contract and needs to hand work to the frontend.
argument-hint: "<oldVersion> <newVersion> [intent…]"
---

# Draft FE Task (backend → frontend)

Invoked as `/draft-fe-task <oldVersion> <newVersion> [intent…]` (args are
`$ARGUMENTS`, e.g. `0.6.13 0.6.15 migrate amenities to a global catalog`).

This skill produces a **Linear FE task** that the frontend can act on without
guessing. It does the **machine half** (diff the contract → endpoint/field/error
deltas) and then asks the human for the **meaning half** (intent, rules,
permissions, acceptance) that types can't express.

> **Read `fe-task-schema.md` (sibling file) first.** It is the canonical ticket
> structure both this skill and the FE `/triage-ticket` skill agree on. Emit
> exactly those ten sections. **The one rule:** backend supplies contract-truth +
> intent; backend does **not** prescribe FE routes/components/i18n/state/layout
> (schema §10).

Run this **in the contract/backend repo** (where the contract source + git tags
live), not the frontend repo.

## Steps

1. **Resolve the two versions.** Parse `<old>` and `<new>` from `$ARGUMENTS`.
   - If missing: `<new>` = the current `version` in the contract package's
     `package.json` (the package named `@daxsystem/admin-api-contract`) or the
     latest git tag; `<old>` = the previous tag. **Confirm both with the dev**
     before diffing — never guess silently.

2. **Auto-diff the contract** between the two versions. Goal: a structured delta,
   not a raw dump.
   - **Primary (git):** locate the contract definition source — the oRPC
     router/contract, the Zod input/output schemas, and the error-code catalogs.
     Diff it between the tags:
     `git diff <tagOld> <tagNew> -- <contract-src-path>`
   - **Fallback (npm pack):** if tags aren't available, pull both published
     versions and diff their type declarations:
     `npm pack @daxsystem/admin-api-contract@<old>` and `@<new>`, extract each
     tarball, diff the `.d.ts` (the public surface).
   - From the diff, derive:
     - **Procedures** classified `NEW / CHANGED / DEPRECATED / REMOVED`
       (a procedure is the `namespace.procedure` path in the router).
     - For **CHANGED/NEW**: input + output **field deltas** — name, type,
       required?, default; mark fields **added / removed / type-changed /
       required-changed**.
     - **Error codes** added/changed in the error catalogs (+ their EN message).
     - **Breaking flags** — any exported type removed/renamed, a field
       removed/renamed, a new/now-required input field, or a shape change
       (array → paginated, enum value → id). These populate schema §2 and MUST
       be made loud.

3. **Ask for the meaning half** — what the diff cannot tell you. Ask **one
   question at a time**, and don't fabricate answers:
   - §7 **business intent / why** (the user-facing goal)
   - §6 **behaviour / rules** types can't express (immutability, soft-delete
     semantics, cross-currency rules, scaling like ×100, ordering)
   - §5 **permissions / role** gating each new/changed endpoint
   - §8 **acceptance criteria** as request → result
   - §9 **references** (contract PR/tag, related backend ticket, Figma)
   Use any `[intent…]` passed in `$ARGUMENTS` to seed §7.

4. **Assemble the ticket** using the `fe-task-schema.md` template — all ten
   sections, in order. Sections with nothing to report are written `_None._`,
   never dropped. If step 2 found any breaking change, §2 is `YES` with the loud
   bullet list; otherwise `NO — additive only.`

5. **Self-check before emitting** (fix inline, don't ship gaps):
   - §1 has the `old → new` bump **and** the published yes/no.
   - §2 is explicitly `YES`/`NO` — never blank.
   - Every CHANGED/REMOVED row names the **old** field (so FE can grep for it).
   - §5 permissions present for every NEW/CHANGED endpoint.
   - §8 acceptance criteria are request→result, not implementation steps.
   - No FE-stack prescriptions leaked in (schema §10) — strip any concrete FE route
     path, component name, file name, i18n key, or state-shape detail from **every**
     section (acceptance criteria included); describe behaviour + the contract
     surface only.

6. **Create or draft the Linear issue.**
   - If the Linear MCP is available: create the issue (the `save_issue` tool with no
     `id` creates) on the **Daxsystem** team with title `[FE] <summary>`, label it
     `FE Task`, and set the body to the assembled markdown — **show the dev the full
     body for confirmation first**, then create it. Return the issue URL.
   - If no MCP: output the assembled markdown for the dev to paste into Linear.

7. **Remind** the dev to link the contract PR/tag in §9, and confirm the new
   version is (or will be) **published** — the FE cannot start against an
   unpublished bump (schema §1).
