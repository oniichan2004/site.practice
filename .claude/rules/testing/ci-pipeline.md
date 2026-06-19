# CI Pipeline Rules

## Triggers

- All tests run on `pull_request` and `push` to `main`
- Do NOT run tests on feature branch pushes (PRs are sufficient)

## Matrix Strategy

- **One job per module** — each module runs independently
- `fail-fast: false` — see ALL failures, not just the first
- New modules: add to `matrix.module` in `.github/workflows/e2e.yml`

## Caching

- **pnpm store** — cached by `actions/setup-node` via `cache: pnpm`
- **Playwright browsers** — cached by `actions/cache` with key from `tests/package.json`
- **Next.js build** — runs fresh each time (build artifacts not cached between jobs)

## Artifacts

- **HTML report** — always uploaded, 30-day retention
- **Traces** — uploaded only on failure, 7-day retention
- **Screenshots/videos** — included in traces

## Secrets

- `E2E_USER_PASSWORD` — stored in GitHub Secrets, never in code or YAML
- `DAX_API_URL` — can be hardcoded (public endpoint)

## Branch Protection

- Required checks on `main`:
  - `CI / lint-and-typecheck`
  - `CI / build`
  - `E2E Tests / e2e (admin-auth)` (add per module)
- Require branches to be up to date before merging

## Adding a New Module to CI

1. Add module name to `matrix.module` array in `e2e.yml`
2. Add the corresponding check to branch protection required list
3. That's it — the matrix handles everything else
