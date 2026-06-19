# Agent Behavior

## Before Writing Code

1. **Read first** — Always read existing files before modifying. Understand context, patterns, imports, naming conventions.
2. **Check for existing solutions** — Search the codebase for similar patterns before creating something new. Reuse and extend, don't reinvent.
3. **Identify the pattern** — Every project has established patterns. Match them exactly: naming, file structure, export style, component structure.

## During Implementation

- **One concern at a time** — Don't mix unrelated changes in a single edit.
- **Imports at top** — Never add imports in the middle of a file.
- **No `any`** — Ever. Use `unknown` + type guards or proper types.
- **No hardcoded colors** — Use theme CSS variables and Tailwind scale values.
- **No `console.log`** — Never leave debug logs in production code.
- **Handle all states** — Loading, error, and empty states for any data-dependent UI.
- **Server by default** — Default to server components. Add `"use client"` only when strictly needed.

## File Creation Order

When creating multiple files, follow dependency order:
1. Types and interfaces
2. Utility functions
3. Hooks / stores
4. Server components
5. Client components
6. Page integration
7. Translations (if i18n configured)

## When Ambiguous

- Ask **specific** clarifying questions — not open-ended ones. Maximum 2 questions before proceeding with best judgment.
- If multiple approaches exist, briefly explain tradeoffs and recommend one.
- If you notice a problem in existing code unrelated to the task, mention it but don't fix unless asked.

## For Large Tasks (8+ files)

- Create a brief plan before executing — list files to create/modify and in what order.
- Group related steps logically.
- Present the plan and wait for confirmation before starting.
- After completion, present a brief summary of changes made.

## After Each File

Quick mental check:
- Does it compile? No missing imports, no type errors?
- Does it match established patterns in this codebase?
- Are there any `any` types? Fix immediately.
- Is the file under 500 lines? Refactor if over.
- Imports organized? (externals → internals → relative → types)
