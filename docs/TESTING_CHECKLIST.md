# PolicyPal AI — Manual Testing Checklist

Go through every box. ☐ = not tested yet, mark ✅ when it works, ❌ + note if it doesn't.

## 1. Header

- [ ] Logo and "PolicyPal AI" title render correctly
- [ ] "Queries" counter starts at 0 and increases by 1 per answered question
- [ ] "Terms" counter increases when an answer contains highlighted terms
- [ ] "Terms" pill is hidden on mobile widths (<900px), visible on desktop
- [ ] Status badge shows "● ACTIVE" (green) when online
- [ ] Status badge switches to "● OFFLINE" (red) when network is disconnected
- [ ] "v1.0" badge hidden on mobile, visible on desktop

## 2. Offline / Storage Banners

- [ ] Turn off Wi-Fi/network → offline banner appears at top
- [ ] Turn network back on → offline banner disappears
- [ ] Fill `localStorage` to quota (devtools) → storage warning banner appears, app keeps working
- [ ] Use a private/incognito window with storage disabled → app still loads, shows storage warning, doesn't crash

## 3. Policy Manager (left panel)

- [ ] Policy Type dropdown shows all 4 options: Health, Motor, Home, Life
- [ ] Selecting a different policy type updates: preview box, quick questions, dashboard stats, chat history, source list
- [ ] Switching policy and switching back restores that policy's own chat history (per-policy persistence)
- [ ] "Load Sample Policy Text" button shows "Loading…" briefly, then renders sample text
- [ ] Sample text has glossary terms highlighted (yellow) with hover tooltips
- [ ] Clicking "Load Sample Policy Text" again refreshes the preview correctly
- [ ] Button is disabled (not clickable twice) while loading
- [ ] Quick question buttons (5 per policy) — clicking one sends it as a chat message automatically
- [ ] Clicking the same quick question twice in a row triggers two separate answers (not ignored the second time)
- [ ] Dashboard "Answered" count matches header "Queries" count
- [ ] Dashboard "Terms ID'd" count matches header "Terms" count
- [ ] Dashboard "Coverage" % changes per policy type
- [ ] "Policy Active & Valid" status row always visible with pulsing green dot

## 4. Chat Assistant (center panel)

- [ ] Welcome message displays on first load
- [ ] Typing a question and pressing **Enter** sends it
- [ ] Typing a question and clicking **Send ➤** sends it
- [ ] Typing indicator (3 bouncing dots) appears after sending, before the answer
- [ ] Bot answer appears with correct highlighted terms (`coverage`, `claim`, etc.)
- [ ] Source reference card appears in the right panel after a matched answer
- [ ] Chat auto-scrolls to the latest message
- [ ] **Validation — empty input:** click Send with an empty box → inline error, no message sent
- [ ] **Validation — whitespace only:** type only spaces → inline error, no message sent
- [ ] **Validation — too short:** type a single character → inline error
- [ ] **Validation — too long:** paste >300 characters → input is capped at 300 chars (browser `maxLength`) and/or shows the "too long" error
- [ ] Typing again after a validation error clears the error message
- [ ] **Send button disabled** while a response is being generated (prevents double-submit)
- [ ] Clicking 🗑️ **Clear** resets the chat to a single "Chat cleared!" message for the current policy
- [ ] Clearing chat does **not** clear chat history of other policy types
- [ ] Asking something irrelevant (e.g. "what is the weather") returns the "couldn't find a match" fallback, not a crash
- [ ] Asking about a glossary term not tied to an intent (e.g. "what is a rider") returns the glossary definition
- [ ] HTML/script-like input (e.g. `<script>alert(1)</script>`, `<img src=x onerror=alert(1)>`) is displayed as plain harmless text, not executed
- [ ] Refresh the page → chat history for the current policy is restored from storage
- [ ] Refresh the page → selected policy type is restored

## 5. Source Reference Panel (right panel)

- [ ] Shows "No references yet" empty state before any question is asked
- [ ] New answers are added to the **top** of the source list
- [ ] List caps at 5 cards (oldest drops off)
- [ ] Each card shows: policy name, section name, quoted excerpt, and a confidence % bar
- [ ] Confidence bar width visually matches the % shown
- [ ] Switching policy type shows that policy's own saved source list
- [ ] "Policy Insights" block always shows 4 insight rows with correct color coding (green/yellow/red)

## 6. Error Handling / Resilience

- [ ] Forcibly corrupt `localStorage` value (devtools: set `policypal:messages` to invalid JSON) → app still loads with a default state and a storage warning, doesn't show a blank screen
- [ ] Trigger a component error (e.g. temporarily throw inside a child) → ErrorBoundary fallback UI shows "Something went wrong" with a "Try again" button instead of a blank white screen
- [ ] "Try again" button on the error fallback recovers the UI
- [ ] Disconnect network mid-session → app continues to function (fully client-side), only the offline banner appears

## 7. Responsive / Mobile

- [ ] At <900px width: layout stacks vertically (Chat on top, Policy Manager, then Source Reference)
- [ ] At <900px: header "Terms" pill and "v1.0" badge are hidden
- [ ] At <480px: dashboard stat boxes wrap to 2 columns instead of 4
- [ ] Touch targets (buttons, dropdown, input) are comfortably tappable on a real mobile device or device emulator
- [ ] No horizontal scrolling/overflow at any tested width (320px, 375px, 768px, 1024px, 1440px)
- [ ] Chat bubbles wrap long text instead of overflowing the screen

## 8. Cross-browser / Accessibility quick pass

- [ ] Test in Chrome, Firefox, Safari (or available equivalents)
- [ ] Tab key can reach: policy dropdown, load sample button, quick question buttons, chat input, send button, clear button
- [ ] Screen reader (or browser accessibility inspector) announces error banners (`role="alert"`/`role="status"`) and the offline/storage warnings
- [ ] Color contrast of text on dark background is readable (especially `--text3` muted text)

---

**How to use this:** copy this file, check off each box during a real pass through the app, and note any ❌ with enough detail (steps + expected vs actual) to reproduce it.
