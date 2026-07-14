# PolicyPal AI — Security Checklist

## ✓ Security measures in place

- ✓ No API keys, tokens, or secrets anywhere in the codebase (verified via repo-wide grep)
- ✓ No external network calls — app is 100% client-side, nothing to intercept or leak to
- ✓ No SQL/database layer — SQL injection is not applicable to this app
- ✓ Content-Security-Policy meta tag restricting scripts/objects/frames (`index.html`)
- ✓ Error boundary shows users a generic message only — raw error details never reach the UI, only `console.error`
- ✓ State changes from child components re-validated against an allowlist before being trusted (`handlePolicyChange`)
- ✓ No use of `eval()`, `new Function()`, or dynamic script injection anywhere
- ✓ Minimal dependency footprint: `react` + `react-dom` at runtime only

## ✓ Data protection methods

- ✓ All data stored is non-sensitive (chat Q&A history, UI stats, a sample demo policy) — no PII, no credentials
- ✓ `localStorage` reads wrapped in try/catch — corrupted data falls back to safe defaults instead of crashing
- ✓ `localStorage` writes wrapped in try/catch — quota/write failures show a visible warning instead of failing silently
- ✓ Stored data size capped (500KB per key) to prevent runaway growth from exhausting browser storage quota
- ✓ Chat history capped at 200 messages per policy type; source-reference list capped at 5 entries
- ✓ Data is scoped per-browser/device only (no account system, no cross-device sync, no server-side storage to secure)

## ✓ Input validation rules

| Input | Rule | Enforced where |
|---|---|---|
| Chat message | Must not be empty or whitespace-only | `ChatAssistant.jsx` → `validate()` |
| Chat message | Minimum 2 characters | `ChatAssistant.jsx` → `validate()` |
| Chat message | Maximum 300 characters | `ChatAssistant.jsx` → `validate()` + native `maxLength` attribute + re-enforced in `chatEngine.js` |
| Chat message (display) | HTML-escaped before storage/render | `escapeHtml()` in `ChatAssistant.jsx` (DOM `textContent` technique) |
| Policy type selection | Must be one of the 4 known keys (`health`/`motor`/`home`/`life`) | Validated in both `PolicyManager.jsx` (on change) and `App.jsx` (`handlePolicyChange`, defense-in-depth) |
| Glossary/keyword regex terms | Regex metacharacters escaped before building dynamic `RegExp` | `escapeRegExp()` in `chatEngine.js` |
| Persisted storage keys | Must be a non-empty string | `usePersistentState.js` (throws on invalid key — a dev-time guard) |

## ✓ Error handling coverage

| Failure scenario | Behavior |
|---|---|
| Component throws during render | `ErrorBoundary` shows a friendly fallback + "Try again" button, rest of the app tab doesn't go blank |
| `localStorage.getItem` throws or returns invalid JSON | Falls back to default value, shows a dismissable-on-fix warning banner |
| `localStorage.setItem` throws (quota exceeded, disabled storage, private mode) | Specific warning message shown; app keeps working with in-memory state |
| Chat response generation throws unexpectedly | Caught in `ChatAssistant.jsx`; shows an in-chat apology message instead of breaking the chat window |
| User submits invalid input (empty/short/long) | Inline, accessible (`role="alert"`) validation message; nothing is sent |
| Browser goes offline | `online`/`offline` listeners update a status badge and show a banner; app (being fully client-side) continues to function |
| Unknown/corrupted policy key in storage | Detected in a `useEffect`, reset to a safe default (`health`) without a render-time crash |
| Unrecognized chat question | Falls through keyword matching → glossary → "couldn't find a match" message; never throws |

---

**Last reviewed:** 2026-07-12 — see `docs/SECURITY_AUDIT.md` for full findings and rationale, and `docs/TESTING_REPORT.md` for the complete test pass.
