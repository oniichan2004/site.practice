# Playwright Best Practices

## Selector Priority (most stable → least stable)

1. `getByRole` + name (i18n-friendly with regex)
2. `getByLabel` for form fields
3. `getByPlaceholder` as fallback
4. `data-testid` only when role is insufficient
5. CSS/XPath as last resort

## Anti-Patterns — NEVER Use

- `page.waitForTimeout()` — use `expect(locator).toBeVisible()`, `waitFor`, auto-waiting
- `nth-child` or `:has-text` for primary identification
- Tailwind-generated class selectors
- CSS selectors on dynamically generated elements
- Assertions inside Page Object Models

## Locators

- Define as **methods** (lazy evaluation), not properties
- Use `getByRole` with regex for i18n: `{ name: /sign in|conectare|войти/i }`
- Use `data-testid` for error messages and ambiguous elements

## Assertions

- Use auto-retrying assertions: `expect(locator).toBeVisible()`, `.toHaveText()`, `.toHaveURL()`
- Keep all assertions in `.spec.ts` files, never in POMs
- Check all expected states: visible, hidden, text content, URL

## API Mocking with `page.route()`

- Use the `apiMock` fixture from `fixtures/api-mock.ts`
- `mockNextApi(path)` for Next.js API routes (`/api/...`)
- `mockBackend(urlPattern)` for direct backend calls
- Always mock before navigation when the page loads data on mount

## Authentication

- `admin-auth` module: tests login itself, NO `storageState`
- Other modules: use `storageState` from `setup-admin` project
- Storage state saved to `.auth/admin.json` (gitignored)

## Tags

- `@smoke` — happy path minimal (quick gate)
- `@critical` — must-pass for release
- `@auth` — all auth module tests
- `@flaky` — known intermittent issues (use `--grep-invert "@flaky"` to exclude)

## Test Isolation

- Each test = fresh `BrowserContext` (Playwright default)
- Tests must be independent — runnable in any order
- No shared state between tests
