# Git Workflow Rules

## 1. Conventional Commits

All commit messages follow the conventional format:

```
<type>(<scope>): <description>

[optional body]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `style`: Formatting, missing semicolons, etc. (no code change)
- `chore`: Maintenance tasks (deps, config)
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `perf`: Performance improvement

**Examples**:
```
feat(hotels): add rating filter to hotel listing
fix(search): resolve date picker not closing on mobile
refactor(booking): extract form validation into custom hook
style(ui): align spacing in card component
chore(deps): update next to 16.1.5
```

## 2. Branch Naming

```
<type>/<short-description>

feat/hotel-rating-filter
fix/mobile-date-picker
refactor/booking-form-hooks
```

## 3. Safety Rules

- **NEVER** use `--no-verify` to skip git hooks
- **NEVER** use `--force` push (use `--force-with-lease` if absolutely necessary)
- **ALWAYS** review changes before committing (`git diff --staged`)
- **ALWAYS** pull before pushing to avoid conflicts
- Keep commits atomic — one logical change per commit

## 4. Before Pushing

- Verify TypeScript compiles: `tsc --noEmit`
- Verify linting passes: `eslint .` or project lint command
- Verify build succeeds: `next build` or project build command
- Check for accidental console.log or debug code
