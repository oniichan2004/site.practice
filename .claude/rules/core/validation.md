# Post-Generation Validation

After generating or modifying code, run this mental checklist before presenting to the user. If any check fails — fix it immediately.

---

## TypeScript

- [ ] No `any` types — use `unknown` + type guards or proper types
- [ ] All exported functions and components have explicit return types
- [ ] Props defined with explicit interfaces (not inline)
- [ ] Zod schemas at API/form boundaries for runtime validation
- [ ] No type assertions (`as`) without a justifying comment

## React

- [ ] Server component by default — `"use client"` only where strictly needed
- [ ] Client components are small and focused on interactivity
- [ ] No `useEffect` for derived state — compute during render
- [ ] No `useEffect` for data fetching — use TanStack Query or server fetch
- [ ] Proper dependency arrays in all hooks

## Styling

- [ ] Theme CSS variables only — no hardcoded hex/rgb values
- [ ] Tailwind scale values — minimal arbitrary values (`[...]`)
- [ ] `cn()` for all conditional className logic
- [ ] Mobile-first responsive — base styles for mobile, `md:` / `lg:` for larger

## Design Quality

- [ ] Loading, error, and empty states handled for data-dependent UI
- [ ] Responsive — works at 320px, 768px, 1024px, 1440px
- [ ] Interactive elements have hover/focus states
- [ ] Images use `next/image` with proper `alt`, `width`, `height`
- [ ] Accessibility basics — `<button>` not `<div onClick>`, labels on forms

## Code Quality

- [ ] File under 500 lines — refactor if over
- [ ] No `console.log` left in production code
- [ ] No dead code or commented-out blocks
- [ ] Imports organized: externals → internals → relative → types
- [ ] No missing imports — file should compile cleanly

## Memory

- [ ] New component created? → saved a Claude Code memory file (metadata.type: project or reference) with a pointer line added in MEMORY.md
- [ ] New shadcn component installed? → saved a Claude Code memory file (metadata.type: reference) with a pointer line added in MEMORY.md
- [ ] Recurring pattern detected? → saved a Claude Code memory (recurring patterns) (agent mode only)
- [ ] Architectural decision made? → saved a Claude Code memory (metadata.type: project)
