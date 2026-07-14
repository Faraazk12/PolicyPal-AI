# PolicyPal AI — Testing Report

**Date:** 2026-07-12
**Scope:** Full front-end React/Vite application (client-only, no backend)
**Build status:** ✅ `npm run build` passes (Vite v5.4.21, 40 modules, 0 errors)

---

## 1. Features tested

| Area | Feature | Result |
|---|---|---|
| Header | Live query/term counters | ✅ Pass |
| Header | Online/offline status badge | ✅ Pass |
| Banners | Offline warning banner | ✅ Pass |
| Banners | Storage-failure warning banner | ✅ Pass |
| Policy Manager | Policy type switching (4 types) | ✅ Pass |
| Policy Manager | Per-policy chat/source isolation | ✅ Pass |
| Policy Manager | Sample policy load with loading state | ✅ Pass |
| Policy Manager | Glossary term highlighting + tooltips | ✅ Pass |
| Policy Manager | Quick-question buttons | ✅ Pass |
| Policy Manager | Dashboard stats (answered/terms/coverage) | ✅ Pass |
| Chat Assistant | Send via Enter key and Send button | ✅ Pass |
| Chat Assistant | Typing indicator timing | ✅ Pass |
| Chat Assistant | Keyword-matching answer engine (all 4 policy types) | ✅ Pass |
| Chat Assistant | Glossary fallback for unmatched-but-known terms | ✅ Pass |
| Chat Assistant | "No match" fallback for unrelated input | ✅ Pass |
| Chat Assistant | Input validation (empty/short/long) | ✅ Pass |
| Chat Assistant | Double-submit prevention while typing | ✅ Pass |
| Chat Assistant | Clear chat (scoped to active policy) | ✅ Pass |
| Chat Assistant | XSS payload as chat input | ✅ Pass (rendered as inert text) |
| Source Panel | Source card rendering + confidence bar | ✅ Pass |
| Source Panel | 5-card cap, newest-first ordering | ✅ Pass |
| Source Panel | Empty state | ✅ Pass |
| Persistence | Policy/chat/stats/sources survive refresh | ✅ Pass |
| Persistence | Corrupted localStorage value handled gracefully | ✅ Pass (fixed this pass) |
| Persistence | Oversized data handled without crash | ✅ Pass (fixed this pass) |
| Responsive | Layout at 320/375/768/1024/1440px | ✅ Pass |
| Error handling | Component error → ErrorBoundary fallback | ✅ Pass |

Full step-by-step checklist: see `docs/TESTING_CHECKLIST.md`.

---

## 2. Bugs found and fixed this pass

| # | Bug | Severity | Fix |
|---|---|---|---|
| 1 | `setPolicyKey()` called directly in the render body when a corrupted/invalid policy key was loaded from storage — invalid in React, risk of warnings and render loops | High (stability) | Moved the check into a `useEffect`; introduced `safePolicyKey` so render never depends on a state write happening mid-render |
| 2 | `localStorage` writes for chat history had no size cap — long sessions could hit the browser's quota and silently stop persisting | Medium (data loss / DoS on own storage) | Added a 500KB pre-write size check + capped chat history to 200 messages per policy |
| 3 | `QuotaExceededError` and other write failures were shown with the same generic message, making it hard to tell users what actually happened | Low | Added a specific message for `QuotaExceededError` |
| 4 | `ErrorBoundary` displayed the raw `error.message` to end users, which can leak internal implementation details | Medium (information disclosure) | Replaced with a generic, reassuring message; full error still logged to console for developers |
| 5 | `App.jsx` trusted whatever policy key string was passed up from the child component without re-validating | Low (defense-in-depth) | `handlePolicyChange` now re-checks against the policy allowlist before accepting |
| 6 | Glossary terms were interpolated into a `RegExp` without escaping regex metacharacters | Low (currently static data, but a latent risk if glossary becomes editable) | Added `escapeRegExp()` before building the highlight regex |
| 7 | No Content-Security-Policy at all | Medium (defense-in-depth) | Added a restrictive CSP meta tag; documented that production hosting should also set it as a real HTTP header |

No bugs were found in: the keyword-matching answer engine, per-policy data
isolation, input escaping for chat messages, or the responsive layout
breakpoints — these all behaved as expected across manual testing.

---

## 3. Security measures implemented

See `docs/SECURITY_AUDIT.md` for full detail. Summary:

- ✅ No API keys/secrets in the codebase (none needed — fully client-side, no external calls)
- ✅ No SQL/database layer (not applicable)
- ✅ All user-typed chat input is HTML-escaped before storage/render (DOM-based `textContent` escaping — blocks `<script>`, `onerror=`, etc.)
- ✅ Regex-special characters escaped before building dynamic `RegExp` patterns
- ✅ `localStorage` reads/writes wrapped in try/catch with user-visible fallback warnings
- ✅ `localStorage` size-capped (500KB/key) and chat history length-capped (200 msgs/policy) to prevent unbounded growth
- ✅ State transitions re-validated against an allowlist rather than trusting child components
- ✅ Error boundary shows a generic message to users; full details only in developer console
- ✅ Content-Security-Policy meta tag restricting script/object/frame sources
- ✅ Minimal dependency surface (`react`, `react-dom` only at runtime)

---

## 4. Accessibility features

| Feature | Where |
|---|---|
| Semantic `<header>` element | `Header.jsx` |
| `<label htmlFor>` associated with the policy `<select>` | `PolicyManager.jsx` |
| `aria-label="Clear chat"` on the icon-only clear button | `ChatAssistant.jsx` |
| `aria-invalid` set on the chat input when validation fails | `ChatAssistant.jsx` |
| `role="alert"` on inline validation/send errors | `ChatAssistant.jsx` |
| `role="alert"` on the ErrorBoundary fallback | `ErrorBoundary.jsx` |
| `role="status"` on offline/storage warning banners (non-disruptive live region) | `App.jsx` |
| Keyboard support: Enter key sends a chat message (no mouse required) | `ChatAssistant.jsx` |
| All interactive elements are real `<button>`/`<select>`/`<input>` tags (focusable and keyboard-operable by default, not `<div onClick>`) | All components |
| Sufficient color contrast for primary text (`--text` on `--bg`/`--surface`) | `App.css` |
| Tooltips on highlighted glossary terms via native `title` attribute (accessible to assistive tech that supports it) | `chatEngine.js` / `PolicyManager.jsx` |

### Recommended next accessibility steps (not yet done)
- Add visible focus rings (currently relies on browser defaults — verify they're not suppressed by any reset CSS)
- Add `aria-live="polite"` to the chat window so screen-reader users are notified when a new bot message arrives
- Run an automated pass with axe DevTools or Lighthouse for a fuller audit beyond this manual review

---

## 5. Conclusion

The application builds cleanly, the core chat/answer flow works across all
four policy types, persistence survives refresh and degrades gracefully when
storage is unavailable or corrupted, and the previously-unguarded XSS/state-
safety/storage-growth issues found during this review have been fixed and
verified. Remaining recommendations (HTTP-header CSP, ARIA live regions,
automated a11y scan) are documented above for the next iteration.
