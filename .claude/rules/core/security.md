# Security Rules

## 1. No Secrets in Code

- **NEVER** hardcode API keys, tokens, passwords, or secrets in source code
- Use environment variables via `.env.local` (never committed)
- Server-only secrets: prefix with no `NEXT_PUBLIC_`
- Client-safe values: prefix with `NEXT_PUBLIC_`

```typescript
// ✅ Correct
const apiKey = process.env.API_KEY; // server-only
const publicKey = process.env.NEXT_PUBLIC_MAPS_KEY; // client-safe

// ❌ Wrong
const apiKey = "sk-abc123...";
const secret = "my-secret-token";
```

## 2. XSS Prevention

- **NEVER** use `dangerouslySetInnerHTML` without sanitization
- If raw HTML is unavoidable, use a sanitizer library (e.g., DOMPurify)
- Validate and sanitize all user input before rendering

```tsx
// ✅ Correct — React auto-escapes
<p>{userInput}</p>

// ⚠️ If HTML rendering is needed — sanitize first
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />

// ❌ Wrong — unsanitized HTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

## 3. Input Validation

- Validate ALL user input at the boundary (forms, URL params, search queries)
- Use Zod schemas for runtime validation
- Never trust client-side data on the server

```typescript
// ✅ Correct
const params = SearchParamsSchema.parse(rawParams);

// ❌ Wrong — trusting raw input
const query = searchParams.get("q");
await db.query(`SELECT * FROM hotels WHERE name = '${query}'`);
```

## 4. Authentication Checks

- Protect sensitive routes with middleware or layout-level auth checks
- Never expose user data without verifying the session
- Use `redirect()` for unauthorized access — don't just hide UI elements

## 5. Dependencies

- Regularly audit dependencies for vulnerabilities
- Prefer well-maintained, widely-used packages
- Be cautious with packages that require broad permissions
- Lock dependency versions in production

## 6. Sensitive Data in URLs

- Never put sensitive data (tokens, passwords, PII) in URL query parameters
- Use POST requests for sensitive operations
- Be careful with `Referer` headers leaking URL data
