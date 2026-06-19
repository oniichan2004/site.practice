# Orchestrator

This file defines how the agent makes decisions. Follow this logic for every interaction.

---

## Decision Priority Chain

Evaluate in this order — stop at the first match:

### 1. Workflow invoked?

If the user invokes a slash command (e.g. `/code-review`, `/rams`):
→ Execute the workflow protocol exactly as defined
→ Workflows override all other behavior
→ Mode setting does not affect workflow execution

### 2. Mode constraints?

Check the current operating mode (`strict`, `assist`, `agent`):
→ Apply mode-specific behavior rules from `core/modes.md`
→ Default mode is `assist` unless user explicitly changes it

### 3. Memory available?

Before starting any implementation:
→ Recall relevant Claude Code memories (check the MEMORY.md index) for a quick component overview (always)
→ Recall relevant Claude Code memories (check the MEMORY.md index) (if creating or using components)
→ Recall relevant Claude Code memories (recurring patterns) (if implementing a feature similar to existing ones)
→ Recall relevant Claude Code memories for relevant decisions (if making architectural choices)

### 4. Skill match?

Select skills based on task context:
→ Read the `## Metadata` section of each installed skill
→ Match `triggers` against the current task keywords
→ Apply maximum **3 skills** per task (prevents overload)
→ Higher `priority` skills (1) are preferred over lower (3)
→ If skills conflict, prefer the one matching `context` most closely

### 5. Default

If none of the above apply:
→ Apply core rules only (`agent-behavior.md`, `typescript-strict.md`, etc.)
→ No skills, no memory reads, no special behavior

---

## Skill Selection Logic

### How to match skills

1. Identify the **task type** from the user's prompt (e.g., "create a form", "optimize performance", "add auth")
2. Check installed skills' `## Metadata` → `triggers` field
3. Rank matches by:
   - **Trigger relevance** — direct keyword match scores highest
   - **Priority** — 1 (core) > 2 (important) > 3 (specialized)
   - **Context fit** — skill's `context` matches project's detected stack

### Limits

- Apply **at most 3 skills** per task
- **design-engineering** skill is always active for UI tasks (does not count toward the 3-skill limit)
- If no skill matches → proceed with core rules only

---

## Memory Integration

### Before a task

| Action | When | How |
|--------|------|-----|
| Read component registry | Creating or referencing UI components | Recall relevant Claude Code memories (check the MEMORY.md index) |
| Read patterns | Implementing features | Recall relevant Claude Code memories (recurring patterns) |
| Check decisions | Making architectural choices | Recall relevant Claude Code memories (check the MEMORY.md index) |

### After a task

| Action | When | How |
|--------|------|-----|
| Register new component | Created a new custom component | Save a Claude Code memory file (metadata.type: project or reference) and add a pointer line in MEMORY.md |
| Register shadcn install | Ran `npx shadcn@latest add` | Save a Claude Code memory file (metadata.type: project or reference) and add a pointer line in MEMORY.md |
| Save pattern | Detected a recurring structure (3+) | Save a Claude Code memory (recurring patterns) |
| Save decision | User confirmed an architectural choice | Save a Claude Code memory (metadata.type: project) |

Memory write behavior is controlled by the current mode — see `core/modes.md`.

---

## Conflict Resolution

When rules, skills, or memory provide conflicting guidance:

```
Project-specific rules (.claude/rules/ project files)
  ↓ overrides
Core rules (core/*.md)
  ↓ overrides
Skill guides (.claude/rules/skills/*.md)
  ↓ overrides
Claude Code memory (advisory)
```

- **User's project rules always win** — they are never overridden
- Core rules override skills — e.g., "no any types" cannot be bypassed by a skill
- Skills override memory — a skill's recommendation beats a saved pattern
- Memory is advisory — it informs but does not mandate

---

## Component Creation Protocol

Before creating any new component:

1. **Recall** relevant Claude Code memories (check the MEMORY.md index) — check if shadcn/ui has it
2. **Recall** relevant Claude Code memories (check the MEMORY.md index) — check if a custom component exists
3. **Search** `components/` directory — grep for similar names
4. If component exists → **reuse** it
5. If similar exists → **extend** it, don't duplicate
6. If nothing exists → create new, then save a Claude Code memory

---

## Error Recovery

If the agent encounters an issue:

1. **Missing memory files** — proceed without memory, note the absence
2. **Corrupted memory file** — do not write, report to user, suggest manual fix
3. **Conflicting decisions** — present both options to user, ask for resolution
4. **Skill not found** — proceed with core rules only
