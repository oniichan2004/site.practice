# Design Engineering Patterns

## Metadata

- **triggers**: design, polish, animation, shadow, typography, spacing, hover, UI quality
- **priority**: 1
- **context**: always
- **conflicts**: none

## When to Activate

- Building new UI components or pages
- Implementing a design from Figma or any visual reference
- Reviewing or polishing existing UI
- Working with animations, hover states, shadows, borders
- Any task involving visual quality or "make it look better"

---

## 1. Typography

### Text Wrapping

- Use `text-wrap: balance` on headings and short text blocks — prevents orphan words
- Use `text-wrap: pretty` on paragraphs — optimizes line breaks for readability
- Apply via Tailwind: `text-balance` / `text-pretty`

### Font Smoothing

- Always apply antialiased rendering on macOS: `antialiased` (Tailwind class)
- This makes text look sharper and more consistent across platforms

### Tabular Numbers

- Use `font-variant-numeric: tabular-nums` for any dynamic numeric content (prices, timers, counters, tables)
- Tailwind: `tabular-nums`
- Prevents layout shift when numbers change

### Hierarchy

- Establish clear visual hierarchy: one dominant element per section
- Heading sizes should have meaningful contrast (don't use `text-lg` → `text-xl` — use `text-base` → `text-2xl` for real contrast)
- Use `text-muted-foreground` for secondary text — never reduce font size alone for hierarchy

### Anti-patterns

- NEVER use generic fonts (Inter, Roboto, Arial) as the sole choice when building a distinctive design
- NEVER use the same font weight for everything — vary between regular (400), medium (500), semibold (600)

---

## 2. Spacing & Layout

### Rhythm

- Maintain consistent spacing rhythm — pick a base unit and stick to it
- Use Tailwind spacing scale (4, 6, 8, 12, 16) — avoid arbitrary values when a scale value exists
- Vertical rhythm between sections: use `space-y-{n}` or `gap-{n}` — not margins on individual items

### Optical Alignment

- Geometric center ≠ optical center. Text and icons often need 1-2px manual adjustment to look centered
- Left-align icons in buttons with consistent `gap-2`, not padding hacks
- When an icon appears heavier than text, reduce its size by one step (h-4 → h-3.5)

### Container & Padding

- Responsive page padding: `px-4 md:px-6 lg:px-8`
- Max-width containers: `max-w-7xl mx-auto` for content, `max-w-lg` for forms
- Don't center everything — left-aligned content is easier to scan

### Anti-patterns

- NEVER use arbitrary spacing (`mt-[13px]`) when a scale value exists (`mt-3`)
- NEVER mix margin and gap in the same container — pick one strategy
- NEVER center hero sections when the design has asymmetric content

---

## 3. Borders, Shadows & Depth

### Shadows Over Borders

- Prefer subtle shadows over borders for elevation — shadows feel more natural
- Use `shadow-sm` for cards, `shadow-md` for dropdowns/popovers, `shadow-lg` for modals
- Exception: use borders (`border border-border`) for inline elements, inputs, and table cells

### Concentric Border Radius

- When nesting rounded elements, the inner element's border-radius must be smaller
- Formula: `inner-radius = outer-radius - gap`
- Example: outer `rounded-2xl` (16px) with `p-2` (8px) gap → inner should be `rounded-lg` (8px)
- This prevents the "pillow effect" where inner corners appear to bulge

### Image Outlines

- Add a subtle inset shadow on images to prevent them from blending into backgrounds:
  `shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]` or a `ring-1 ring-black/5`
- This gives images subtle depth without visible borders

### Anti-patterns

- NEVER use `border` and `shadow` together on the same card — pick one
- NEVER use `rounded-full` on rectangles — only on squares, circles, or pills
- NEVER mix border-radius sizes in the same component group

---

## 4. Color & Theme

### Commit to a Palette

- Use CSS theme variables exclusively: `bg-background`, `text-foreground`, `bg-primary`, etc.
- Create visual hierarchy with opacity: `bg-primary/10` for subtle backgrounds
- Accent colors should be used sparingly — 1-2 accent colors maximum

### Contrast & Readability

- Ensure sufficient contrast for all text (WCAG AA minimum: 4.5:1 for body text)
- Use `text-muted-foreground` for secondary info — never `text-gray-400` or similar
- Dark backgrounds need `text-foreground` or lighter theme tokens

### Anti-patterns

- NEVER hardcode hex values — always use theme CSS variables
- NEVER use Tailwind palette colors directly (`bg-blue-500`, `text-gray-700`) — use semantic tokens
- NEVER use purple gradients on white backgrounds (the classic AI-generated look)

---

## 5. Motion & Animation

### Principles

- Animation should have purpose: guide attention, confirm actions, show relationships
- Prefer CSS transitions over JavaScript animations for simple state changes
- Use `transition-all duration-200 ease-out` as the baseline — adjust per element

### Duration Scale

- **Micro-interactions** (hover, focus, toggle): `150ms`
- **Element transitions** (expand, collapse, fade): `200-300ms`
- **Page transitions** (enter, exit): `300-500ms`
- NEVER exceed 500ms for UI transitions — it feels sluggish

### Interruptible Animations

- Use CSS `transition` (not `@keyframes`) for state changes — transitions are interruptible
- If a user hovers then leaves quickly, the element should animate back smoothly
- `@keyframes` are for one-shot animations (page load reveals, success checkmarks)

### Enter Animations

- Stagger child elements: apply increasing `animation-delay` to sibling items
- Combine opacity + translate for enter animations: `animate-in fade-in slide-in-from-bottom-2`
- Keep stagger intervals small: `50-100ms` between items

### Exit Animations

- Exit animations should be faster than enter (150ms vs 300ms)
- Fade out + slight scale down (`0.98`) feels natural
- Don't animate exit for frequently toggled elements (dropdowns, tooltips)

### Hover States

- Every interactive element needs a visible hover state
- Buttons: subtle background shift or slight scale (`hover:scale-[1.02]`)
- Cards: `hover:shadow-md` or `hover:border-primary/50` transition
- Icons in buttons: subtle translate on hover (e.g., arrow moves 2px right)

### Anti-patterns

- NEVER use `animation-duration: 0` — remove the animation entirely instead
- NEVER animate `width`, `height`, `top`, `left` — use `transform` and `opacity` only (GPU-composited)
- NEVER use `transition: all` on complex elements — specify exact properties
- NEVER add motion to elements that don't need it — gratuitous animation is worse than none

---

## 6. Components & Design System

### shadcn/ui First

- Always check if shadcn/ui has the component before building custom
- Use `cn()` for all conditional className logic
- Use CVA (class-variance-authority) for component variants

### Consistent Sizing

- Icons: `h-4 w-4` (inline/small), `h-5 w-5` (buttons), `h-6 w-6` (section headers)
- Touch targets: minimum `44×44px` on mobile — use `min-h-11 min-w-11` for small buttons
- Input heights: consistent across the form — don't mix `h-9` and `h-10`

### Responsive Design

- Mobile-first: base styles for mobile, breakpoints for larger screens
- Test at: 320px (small mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop)
- Stack horizontally on mobile, grid on desktop: `flex flex-col md:grid md:grid-cols-2`

---

## 7. Accessibility Quick Checks

- Interactive elements must be focusable: use `<button>`, not `<div onClick>`
- All images need `alt` text — decorative images get `alt=""`
- Focus indicators must be visible: don't remove `outline` without replacing it
- Color alone must not convey information — add icons or text labels
- Decorative icons get `aria-hidden="true"`
