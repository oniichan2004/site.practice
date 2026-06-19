# FE Task — Canonical Ticket Schema

> **Single source of truth** for what a backend-authored *Frontend task* must
> contain. Both skills read this file:
> - `/draft-fe-task` (backend side) **emits** a ticket in this shape.
> - `/triage-ticket` (frontend side) **parses** a ticket in this shape.
>
> Keep them in lockstep — if you change a section here, both skills follow.
> This file is carried **inside** the `draft-fe-task/` skill folder so the backend
> can copy the whole folder into the contract/backend repo and stay self-contained.

---

## The one rule

**Backend supplies contract-truth + business intent. Frontend owns the stack.**

- Backend's job: say *what the contract now is* (versions, endpoints, fields,
  errors, permissions) and *why the change exists* (intent, rules, acceptance).
- Frontend's job: decide *how* it's built — routes, components, hooks, stores,
  i18n keys, layout, visual design. The backend MUST NOT prescribe these (see §10).

The single most important section is **§1 + §2 (contract version + breaking?)** —
a silent breaking bump is what turns the FE build red with no warning. Make it loud.

---

## Required sections (in this order)

A complete FE task has all ten. A section with nothing to report is written
`_None._` — never omitted (an omitted section is indistinguishable from "forgot").

### §1 — Contract version
- Package: `@daxsystem/admin-api-contract`
- Bump: `<old> → <new>` (e.g. `0.6.13 → 0.6.15`)
- Published? `yes / no` + dist-tag. **FE cannot start until the new version is
  published to the registry** — if `no`, say when it will be.

### §2 — Breaking? `YES / NO`
If **YES**, a loud bullet list of what breaks at **compile time** in a consumer:
- exported types removed/renamed (`VehicleAmenityValue` removed)
- a field removed/renamed on an input/output (`vehicle.amenities` → `vehicle.amenityIds`)
- a previously-optional input field made required, or a new required input field
- a shape change (array → paginated object, enum value → id reference)

If **NO**, write `NO — additive only.`

### §3 — Endpoint changes
One row per affected procedure. `Status` ∈ NEW / CHANGED / DEPRECATED / REMOVED.
Use the contract path `namespace.procedure` (e.g. `vehicleAmenities.list`).

| Status | Procedure | Input delta | Output delta | Notes |
|---|---|---|---|---|
| CHANGED | `vehicles.update` | `amenities: VehicleAmenityValue[]` **removed** → `amenityIds: string[]` **added (required)** | `amenities` field shape changed to `amenityIds` | breaking |
| NEW | `vehicleAmenities.list` | `{ orgId, search?, page?, pageSize? }` | `{ items: VehicleAmenity[], total, page, pageSize }` | server-paginated |

For each CHANGED/NEW field give: **name, type, required?, default**. For REMOVED
give the old name so FE can grep for it.

### §4 — Error codes
New or changed **business error `code`s** the endpoint can throw, with the EN message.
FE localizes them across all locales. Write `_None._` if no new codes.

| Code | EN message | Thrown when |
|---|---|---|
| `AMENITY_CODE_IMMUTABLE` | "Amenity code cannot be changed." | editing `code` after create |

### §5 — Permissions / role
Which permission(s) gate each new/changed endpoint, and any role restriction
(e.g. `system_admin` only). FE wires the UI gate from this.
- `vehicleAmenities.*` → `vehicle_amenity:manage` (system_admin only)

### §6 — Behaviour / business rules
The rules that **types cannot express** — the ones FE will get wrong by guessing:
- `code` is immutable after create
- soft-delete keeps existing assignments intact
- amounts are **never summed across currencies**
- rates are integers ×100 (basis points)

### §7 — Business intent / why
The user-facing goal in 1–3 sentences. What problem this solves, who it's for.
This is what lets FE design the right UX instead of a literal field dump.

### §8 — Acceptance criteria
Checkable **request → result** statements. Behaviour, not implementation.
- When a system_admin opens the amenities catalog, the global catalog lists paginated.
- When creating an amenity with a duplicate `code`, the `AMENITY_CODE_IMMUTABLE`-class
  error shows as a localized message.
- A non-system_admin gets no nav entry and a blocked route.

### §9 — References
Links: contract PR / commit / tag, related backend ticket, API docs, Figma (if any).

### §10 — Out of scope for backend (FE owns the stack)
A standing reminder, kept in every ticket verbatim:

> Backend does not specify FE routes, components, file layout, i18n keys, state
> shape, or visual design. UX preferences are suggestions in §7, not specs.

---

## Fill-in template (paste-ready)

```markdown
# [FE] <imperative summary>

## §1 Contract version
- `@daxsystem/admin-api-contract`: `<old> → <new>`
- Published: <yes/no> (<dist-tag / ETA>)

## §2 Breaking? <YES/NO>
- <what breaks at compile time, or "NO — additive only.">

## §3 Endpoint changes
| Status | Procedure | Input delta | Output delta | Notes |
|---|---|---|---|---|
| <NEW/CHANGED/DEPRECATED/REMOVED> | `<ns>.<proc>` | <fields ±> | <fields ±> | <breaking? paging?> |

## §4 Error codes
| Code | EN message | Thrown when |
|---|---|---|
| `<CODE>` | "<message>" | <condition> |
<!-- or: _None._ -->

## §5 Permissions / role
- `<ns>.*` → `<permission>` (<role restriction>)

## §6 Behaviour / business rules
- <rule types can't express>

## §7 Business intent / why
<1–3 sentences>

## §8 Acceptance criteria
- When <request>, then <result>.

## §9 References
- Contract: <PR/tag/commit>
- Backend ticket: <link>

## §10 Out of scope for backend (FE owns the stack)
> Backend does not specify FE routes, components, file layout, i18n keys, state
> shape, or visual design. UX preferences are suggestions in §7, not specs.
```

---

## Worked example (cautionary — a real breaking bump)

```markdown
# [FE] Migrate vehicle amenities to the global catalog (0.6.13 → 0.6.15)

## §1 Contract version
- `@daxsystem/admin-api-contract`: `0.6.13 → 0.6.15`
- Published: yes (latest)

## §2 Breaking? YES
- `VehicleAmenityValue` type **removed** from the contract.
- `vehicle.amenities: VehicleAmenityValue[]` **removed** → `vehicle.amenityIds: string[]`.
- `apiKeys.create` input changed to required `{ orgId, name }` (scopes auto-assigned).

## §3 Endpoint changes
| Status | Procedure | Input delta | Output delta | Notes |
|---|---|---|---|---|
| CHANGED | `vehicles.update` | `amenities[]` removed → `amenityIds: string[]` (required) | output `amenities` → `amenityIds` | breaking |
| NEW | `vehicleAmenities.list` | `{ orgId, search?, page?, pageSize? }` | `{ items, total, page, pageSize }` | server-paginated, was array |
| CHANGED | `apiKeys.create` | now `{ orgId, name }` only | unchanged | breaking; scopes/rate-limit/expiry auto-assigned |

## §4 Error codes
| Code | EN message | Thrown when |
|---|---|---|
| `AMENITY_CODE_IMMUTABLE` | "Amenity code cannot be changed." | editing `code` after create |

## §5 Permissions / role
- `vehicleAmenities.*` → `vehicle_amenity:manage` (system_admin only)

## §6 Behaviour / business rules
- Amenity `code` is immutable after create; only labels are editable.
- Soft-deleting a catalog amenity keeps existing vehicle assignments intact.

## §7 Business intent / why
Amenities were free-form per vehicle; we now want one governed global catalog so
reporting and filtering are consistent. System admins manage the catalog; vehicle
forms pick from it by id.

## §8 Acceptance criteria
- When a system_admin opens the amenities catalog, it lists paginated with search.
- When a vehicle is saved, its amenities persist as `amenityIds`.
- When a non-system_admin loads the catalog route, access is blocked and no nav shows.

## §9 References
- Contract: daxsystem/admin-api-contract#<pr> (tag v0.6.15)
- Backend ticket: <link>

## §10 Out of scope for backend (FE owns the stack)
> Backend does not specify FE routes, components, file layout, i18n keys, state
> shape, or visual design. UX preferences are suggestions in §7, not specs.
```
