# TDD Discipline

## Red-Green-Refactor

1. **Write the test first** — before modifying UI or API
2. **Run the test → must fail** (red) — proves it tests something real
3. **Implement the minimum** to make it pass (green)
4. **Refactor** with tests green

## For Existing Code

When adding tests for existing features (like we did with auth):
- Write the test to verify existing behavior
- If the test fails → fix selectors or add `data-testid` (not the code)
- This is "verify-existing-behavior" mode

## Rules

- **DO NOT** write the test after manual testing — you lose fail-first feedback
- **DO NOT** skip the fail step — a test that never failed might not test anything
- **DO** commit failing tests separately if the implementation is complex
- **DO** keep tests green before pushing — no red tests in CI
