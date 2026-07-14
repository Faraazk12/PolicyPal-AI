# PolicyPal AI — Security Audit

**Scope:** Front-end-only React/Vite application. No backend server, no database,
no API keys, no user authentication in this codebase. Audit covers the client
code in `src/` and build/config files.

## Summary

| Category | Finding | Status |
|---|---|---|
| Exposed API keys/secrets | None found | ✅ N/A — no secrets in codebase |
| SQL injection | Not applicable — no SQL/database layer | ✅ N/A |
| Cross-Site Scripting (XSS) | `dangerouslySetInnerHTML` used in 3 places | ✅ Reviewed & hardened |
| Insecure data handling (localStorage) | Unbounded growth, unhandled corrupt/quota cases | ✅ Fixed |
| Regex injection / ReDoS | Glossary terms interpolated into RegExp | ✅ Fixed (escaped) |
| Render-time state mutation | `setState` called during render body | ✅ Fixed (bug, also a stability/DoS risk) |
| Unvalidated state transitions | Policy key from child components trusted blindly | ✅ Fixed (allowlist check) |
| Information disclosure | Error boundary showed raw error messages to users | ✅ Fixed (generic message; details stay in console) |
| Content Security Policy | None present | ✅ Added restrictive CSP meta tag |
| Dependency surface | Only `react`, `react-dom`, `vite`, `@vitejs/plugin-react` | ✅ Minimal, no unused/risky packages |
| Third-party network calls | None — app is fully offline-capable | ✅ N/A |

---

## Detailed findings & fixes

### 1. No exposed secrets ✅
Searched the entire codebase for API keys, tokens, passwords, and connection
strings:

```bash
grep -rEi "api[_-]?key|secret|token|password|authorization" src/
```

No matches. The app makes no external network calls (no `fetch`, no `axios`,
no backend), so there is nothing to leak. **No action needed**, but documented
here so this stays true going forward — any future integration with a real
API must keep keys server-side, never in `src/`.

### 2. SQL injection — not applicable ✅
There is no database and no SQL anywhere in this app. All "policy data" is a
static JS object (`src/data/policyData.js`) bundled at build time. If a real
backend is added later, use parameterized queries / an ORM — never string-
concatenate user input into SQL.

### 3. XSS via `dangerouslySetInnerHTML` — reviewed and hardened ✅
Three places render raw HTML:

- `ChatMessage.jsx` — renders both bot messages (static canned HTML) and user
  messages.
- `PolicyManager.jsx` — renders the highlighted sample policy text.

**Risk:** if user-typed text were ever rendered as raw HTML, an attacker
could inject `<script>` or event-handler attributes (`onerror=`, etc.) and
run arbitrary JS in another user's browser (stored or reflected XSS).

**Fix already in place / verified:**
- User chat input is passed through `escapeHtml()` (uses
  `element.textContent = text`, the standard safe DOM-based escaping
  technique) **before** being stored and rendered. Verified with the test
  case `<script>alert(1)</script>` as input — it renders as literal text.
- Bot responses are all static, developer-authored HTML strings from
  `policyData.js` — never built from user input.
- The sample policy preview text is static data from `policyData.js`, run
  through `highlightPolicyText()` which escapes `<`/`>` first, then wraps
  known glossary words. It is not user-controlled.

**Hardening added this pass:**
- `highlightPolicyText()` now escapes regex special characters in glossary
  terms via `escapeRegExp()` before building the `RegExp`. This wasn't
  exploitable today (terms are a static, developer-controlled list) but
  protects against a regression if the glossary ever becomes editable
  (e.g. an admin panel) without someone re-auditing this function.
- Added a `Content-Security-Policy` meta tag (`index.html`) restricting
  script sources to `'self'` and disallowing `object-src`/framing, as a
  defense-in-depth layer in case a future change accidentally introduces
  an unescaped HTML sink.

### 4. Insecure / unbounded localStorage usage — fixed ✅
**Risk:** Chat history grew without bound. A long session (or a scripted
flood of messages) could grow past the ~5MB per-origin localStorage quota,
causing `setItem` to throw `QuotaExceededError` and silently breaking
persistence — a client-side denial-of-service on the app's own storage.

**Fixes:**
- `usePersistentState` now measures the serialized size before writing and
  refuses to write (with a visible warning) if it exceeds 500KB, instead of
  letting the browser throw.
- `QuotaExceededError` is caught and surfaced as a specific user-facing
  message instead of a silent console error.
- Chat history is capped at 200 messages per policy type (`App.jsx`,
  `MAX_MESSAGES_PER_POLICY`) — oldest messages roll off instead of growing
  forever.
- Source-reference list was already capped at 5 entries.
- Corrupt JSON in localStorage (manually editing devtools storage to invalid
  JSON) is caught on read and falls back to default state with a warning,
  rather than crashing the whole app on load.

### 5. Render-time `setState` call — fixed (stability bug, latent DoS risk) ✅
**Found:** `App.jsx` previously called `setPolicyKey("health")` directly in
the render body when a corrupted/invalid policy key was detected. Calling
`setState` during render is invalid in React — it can trigger
"Cannot update a component while rendering a different component" warnings
and, in some versions/conditions, render loops that peg the CPU (effectively
a client-side DoS against the user's own browser tab).

**Fix:** moved the check into a `useEffect`, and introduced a `safePolicyKey`
derived value so every read during render falls back safely without
mutating state mid-render.

### 6. Unvalidated state transitions — fixed ✅
**Found:** `App.jsx`'s `handlePolicyChange` accepted whatever string was
passed up from `PolicyManager` and stored it directly, trusting the child
component's own validation. While the current `<select>` only offers 4 valid
values, this is a fragile trust boundary — any future caller (a deep link,
a devtools call, a future "import settings" feature) could push an arbitrary
string into state and corrupt the UI.

**Fix:** `handlePolicyChange` now re-validates against the `DB` allowlist
itself before accepting the change, independent of what the child already
checked. Invalid values are logged and ignored rather than applied.

### 7. Information disclosure in error UI — fixed ✅
**Found:** the `ErrorBoundary` fallback displayed `error.message` directly to
the user. Raw error messages can leak internal implementation details
(file paths, variable names, library internals) that are useful to an
attacker probing the app, and are not helpful to a typical user anyway.

**Fix:** the fallback now shows a generic, reassuring message
("Don't worry, your data is safe. Try reloading this section.") while the
full error and component stack are still logged via `console.error` for
developers (visible in browser devtools / any error-reporting tool wired up
later).

### 8. Content Security Policy — added ✅
No CSP existed previously. Added a restrictive policy via meta tag in
`index.html`:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self';
frame-ancestors 'none';
```

This blocks inline `<script>` execution, blocks loading scripts from any
other origin, prevents the page from being framed by another site
(clickjacking defense), and disallows plugins (`object-src 'none'`).
`style-src` allows `'unsafe-inline'` because Vite/React inject some inline
styles at runtime; this can be tightened further with nonces if the app
moves to a server that can set real HTTP headers (meta-tag CSPs can't cover
everything a header-based CSP can, e.g. `frame-ancestors` is actually
ignored by some browsers when set via meta tag — for production deployment,
**set this as a real HTTP response header at the hosting/CDN level**, not
just the meta tag, for full enforcement).

### 9. Dependency surface — reviewed ✅
`package.json` dependencies are limited to `react`, `react-dom` (runtime) and
`vite`, `@vitejs/plugin-react` (build-time only, not shipped to users). No
unused packages, no abandoned/unmaintained packages, no native bindings.
Recommendation: run `npm audit` periodically as new dependencies are added.

---

## Recommendations for future work (not yet implemented — no backend exists today)

These don't apply to the current code (there's no backend), but matter the
moment one is added:

- **Never** put API keys or secrets in any file under `src/` — they ship to
  every visitor's browser. Keep them in a server-side `.env` that's never
  bundled, and proxy any third-party API calls through your own backend.
- If a backend/database is added: use parameterized queries or an ORM,
  validate and sanitize all input server-side (client-side validation, like
  the input length checks in this app, is a UX nicety, not a security
  control — a malicious client can bypass it entirely).
- If user accounts are added: hash passwords with a strong algorithm
  (bcrypt/argon2), use HTTPS everywhere, set `Secure`/`HttpOnly`/`SameSite`
  on session cookies.
- Move the CSP from a meta tag to a real `Content-Security-Policy` HTTP
  header at the server/CDN level for full browser enforcement.
- Run `npm audit` / Dependabot regularly once the dependency list grows.

## Verification

- `npm run build` completes successfully after all fixes (Vite v5, 0 errors).
- Manually tested `<script>alert(1)</script>` and `<img src=x onerror=alert(1)>`
  as chat input — both render as inert plain text, no script execution.
- Manually corrupted `localStorage` keys via devtools — app loads with
  default state and a visible warning instead of a blank/crashed screen.
