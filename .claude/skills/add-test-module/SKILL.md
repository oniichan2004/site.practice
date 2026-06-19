---
name: add-test-module
description: Scaffold a new E2E test module under tests/src/modules/ — spec + Page Object + Playwright project entry + CI matrix row. Use when asked to add a new E2E / Playwright test module.
argument-hint: "<module-name>"
---

# Add Test Module

Invoked as `/add-test-module <name>` (the module name is `$ARGUMENTS`, e.g.
`admin-vehicles`). First read `.claude/rules/testing/e2e-architecture.md` and
`.claude/rules/testing/playwright-best-practices.md` and follow them.

1. **Confirm the module name** if `$ARGUMENTS` is empty (e.g. `admin-vehicles`).

2. **Ask if the module needs authentication** (storageState) or is independent.

3. **Create the module folder** with a scaffold spec:
   ```
   tests/src/modules/<name>/
   └── <name>.spec.ts   # Single describe block with one placeholder test
   ```

4. **Create the Page Object folder** with a scaffold POM:
   ```
   tests/src/pages/admin/<area>/
   └── <AreaName>Page.ts   # Extends BasePage with path and basic locators
   ```
   Where `<area>` is the part after `admin-` (e.g. `vehicles` from `admin-vehicles`).

5. **Add a project entry** in `tests/playwright.config.ts`:
   ```ts
   {
     name: "<name>",
     testDir: "./src/modules/<name>",
     dependencies: ["setup-admin"],  // only if auth needed
     use: {
       ...devices["Desktop Chrome"],
       storageState: ".auth/admin.json",  // only if auth needed
     },
   },
   ```

6. **Add the module to the CI matrix** in `.github/workflows/e2e.yml`:
   add `- <name>` to the `matrix.module` array.

7. **Update `tests/README.md`** — add the module to the active modules list.

8. **Commit** with message: `chore(tests): scaffold <name> e2e module`
