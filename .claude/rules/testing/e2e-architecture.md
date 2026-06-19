# E2E Architecture

## Location

All E2E test code lives in `tests/` (pnpm workspace `@dax/e2e`). Never place E2E tests inside `apps/` or `packages/`.

## Module Structure

- **One folder per domain/feature** under `tests/src/modules/`
- Naming: `<app>-<area>` (e.g. `admin-auth`, `admin-vehicles`, `mobile-auth`)
- Each module folder contains only `.spec.ts` files
- Each spec file covers one sub-flow (e.g. `signin.spec.ts`, `logout.spec.ts`)

## Page Objects

- Located in `tests/src/pages/<app>/<area>/`
- One POM per page, extending `BasePage`
- Locators as methods (lazy evaluation), NOT as properties
- No assertions in POMs — assertions belong in spec files
- Multi-step pages use sub-objects (e.g. `ResetPasswordPage.emailStep`)

## Fixtures

- Located in `tests/src/fixtures/`
- `base.ts` — re-exports `test` and `expect`
- `api-mock.ts` — `ApiMock` fixture for `page.route()` interception
- `auth.ts` — pre-authenticated page via `storageState`

## Data

- `tests/src/data/users.ts` — test user constants
- `tests/src/data/routes.ts` — path constants

## Adding a New Module

Use the `/add-test-module` workflow. It scaffolds the folder, POM, config entry, and CI matrix entry.

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Module folder | `kebab-case` | `admin-vehicles` |
| Spec file | `kebab-case.spec.ts` | `vehicle-crud.spec.ts` |
| Page Object | `PascalCase.ts` | `VehicleListPage.ts` |
| Fixture | `kebab-case.ts` | `api-mock.ts` |
| Test data | `kebab-case.ts` | `vehicles.ts` |
