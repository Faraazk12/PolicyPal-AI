# PolicyPal AI 🛡️

A chat-based insurance policy interpreter. Pick a policy type (Health, Motor,
Home, or Life), load a sample policy document, and ask plain-language
questions like *"What is covered?"* or *"How do I file a claim?"* — PolicyPal
matches your question to the right policy clause and shows the source
section it used, with a confidence score.

This started as a single-file HTML/JS prototype and has been rebuilt as a
proper React + Vite project with multiple components, validation, error
handling, persistence, and mobile support.

## Features

- **Policy-aware chat** — keyword-matching engine maps natural-language
  questions to the right policy clause for the selected policy type.
- **Source reference panel** — every answer shows which policy section it
  came from and a match-confidence score.
- **Sample policy viewer** — loads a sample policy document with key
  insurance terms highlighted and defined on hover.
- **Quick questions** — one-click common questions per policy type.
- **Persistence** — your selected policy, chat history (per policy type),
  stats, and source references are saved to `localStorage` and restored on
  refresh.
- **Input validation** — empty, too-short, and too-long messages are caught
  before being sent, with inline error messages.
- **Error handling** — a top-level error boundary catches rendering errors,
  storage failures fall back gracefully with a visible warning banner, and
  chat-response failures show an in-chat error instead of breaking the UI.
- **Online/offline detection** — a banner appears when the browser goes
  offline.
- **Mobile-friendly layout** — the three-column desktop layout collapses
  into a single stacked column with a touch-friendly scroll layout on
  screens under 900px.

## Project structure

```
policypal-ai/
├── index.html                  # Vite HTML entry point
├── package.json
├── vite.config.js
├── public/                     # Static assets (favicon, etc.)
└── src/
    ├── main.jsx                 # React root / app bootstrap
    ├── App.jsx                  # Top-level state, layout, persistence wiring
    ├── components/
    │   ├── Header.jsx            # Top bar: logo, stats, online status
    │   ├── PolicyManager.jsx      # Left panel: policy select, preview, quick Qs, dashboard
    │   ├── ChatAssistant.jsx      # Center panel: chat log, input, validation
    │   ├── ChatMessage.jsx        # Single chat bubble
    │   ├── SourcePanel.jsx        # Right panel: source cards + insights
    │   └── ErrorBoundary.jsx      # Top-level render-error guard
    ├── data/
    │   └── policyData.js          # Sample policies, Q&A intents, glossary
    ├── hooks/
    │   └── usePersistentState.js  # useState + localStorage, with error handling
    ├── utils/
    │   └── chatEngine.js          # Keyword-matching response logic
    └── styles/
        └── App.css                # All styles, including mobile breakpoints
```

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

Requires Node.js 18+.

## How the chat engine works

Each policy type in `src/data/policyData.js` defines:

- `sample` — the raw sample policy text shown in the preview panel.
- `kw` — a map of *intents* (e.g. `coverage`, `claim`, `premium`) to lists of
  keywords/substrings.
- `res` — the canned answer, source section, and supporting excerpt for each
  intent.

When you ask a question, `src/utils/chatEngine.js` scores your input against
every intent's keyword list (longer keywords count for more) and returns the
highest-scoring intent's answer. If nothing matches well, it falls back to a
small insurance glossary, and finally to a "couldn't find a match" message.

This is intentionally simple, rule-based matching — there's no external API
call and no real NLP model — which keeps the app fast, fully offline-capable,
and easy to extend: add a new intent by adding keywords and a response block
to `policyData.js`.

## Persistence model

`usePersistentState` (in `src/hooks/`) is a drop-in replacement for
`useState` that reads from and writes to `localStorage` under a namespaced
key (e.g. `policypal:messages`). It:

- Falls back to the provided default value if storage is empty, corrupted,
  or unavailable (e.g. private browsing mode).
- Surfaces read/write failures as a returned `storageError` string instead of
  throwing, so the UI can show a non-blocking warning banner rather than
  crash.

Four pieces of state are persisted independently per policy type where
relevant: active policy, chat messages, dashboard stats, and source
reference cards.

## Documentation

- [`docs/TESTING_CHECKLIST.md`](docs/TESTING_CHECKLIST.md) — full manual testing checklist (every feature/button)
- [`docs/SECURITY_AUDIT.md`](docs/SECURITY_AUDIT.md) — security audit findings and fixes
- [`docs/TESTING_REPORT.md`](docs/TESTING_REPORT.md) — features tested, bugs found/fixed, security & accessibility summary
- [`docs/SECURITY_CHECKLIST.md`](docs/SECURITY_CHECKLIST.md) — at-a-glance security/validation/error-handling checklist

## Known limitations

- The chat engine is keyword-based, not a real language model — phrasing
  that doesn't share enough vocabulary with the configured keywords will
  fall through to the glossary or a "no match" response.
- Sample policies are static demo data, not real policy documents.
- `localStorage` is per-browser/per-device; there's no account system or
  cross-device sync.

## License

For demo/educational use.
