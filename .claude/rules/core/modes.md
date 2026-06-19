# Operating Modes

The agent operates in one of three modes. The mode affects autonomy, memory writes, and decision-making.

---

## `assist` mode (DEFAULT)

The default mode for all interactions. Balanced between control and productivity.

### Behavior

- Apply rules and skills automatically based on context
- Recall relevant Claude Code memories before implementation (components, patterns)
- Take independent decisions for pattern matching and code style
- Ask clarifying questions only when genuinely ambiguous (maximum 2)
- Save a Claude Code memory only after explicit component creation or shadcn install
- Do not proactively detect patterns
- Save decisions only when user explicitly confirms

### When active

- Any regular prompt without a mode override
- After a workflow completes, mode returns to `assist`

---

## `strict` mode

Maximum control. The agent follows instructions literally and asks before acting.

### Behavior

- Follow rules exactly as written — no creative interpretation
- Do not take independent decisions
- Ask for confirmation before modifying any file
- Never save a Claude Code memory automatically
- Only save a Claude Code memory when user explicitly asks
- Present options and wait for user to choose
- No pattern detection, no proactive suggestions

### When active

- User says: "strict mode", "be strict", "careful mode"
- Use for: production hotfixes, critical code reviews, sensitive refactors

---

## `agent` mode

Maximum autonomy. The agent acts proactively and manages memory.

### Behavior

- Full skill and memory integration — recall and save Claude Code memories freely
- Create plans and execute without waiting for approval (tasks < 8 files)
- For tasks >= 8 files, present plan and wait for confirmation
- Automatically save a Claude Code memory for new components after creation
- Automatically detect and save recurring patterns as Claude Code memories (3+ occurrences)
- Save architectural decisions as a Claude Code memory (metadata.type: project) when user confirms
- Proactively suggest improvements based on Claude Code memories (recurring patterns)
- Run self-improvement protocol after every 3rd task in session

### When active

- User says: "agent mode", "go autonomous", "full agent"
- Use for: greenfield features, large refactors, exploratory development

---

## Mode Switching

### How to switch

| User says | Mode |
|-----------|------|
| (default — nothing) | `assist` |
| "strict mode" / "be strict" / "careful mode" | `strict` |
| "agent mode" / "go autonomous" / "full agent" | `agent` |
| "normal mode" / "default mode" / "assist mode" | `assist` |

### Rules

- Mode persists for the duration of the conversation unless changed
- Workflows (e.g. `/code-review`, `/rams`) execute their protocol regardless of mode — mode only affects non-workflow behavior
- After a workflow completes, the mode remains whatever it was before the workflow
- If uncertain which mode is active, default to `assist`

---

## Mode Comparison

| Capability | `strict` | `assist` | `agent` |
|-----------|----------|----------|---------|
| Apply core rules | ✅ | ✅ | ✅ |
| Auto-select skills | ❌ | ✅ | ✅ |
| Recall Claude Code memories | on request | ✅ | ✅ |
| Save Claude Code memories | on request | after creation | proactive |
| Pattern detection | ❌ | ❌ | ✅ |
| Independent decisions | ❌ | limited | ✅ |
| Execute without approval | ❌ | small tasks | tasks < 8 files |
| Self-improvement loop | ❌ | ❌ | ✅ |
| Suggest refactors | ❌ | ❌ | ✅ |
