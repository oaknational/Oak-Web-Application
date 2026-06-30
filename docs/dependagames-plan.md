# 🏹 Dependagames — Dependency Update Plan

**Date:** 30 June 2026
**Tributes:** 2–3 · **Time box:** 1 hour
**Branch:** `chore/june-dependagames-1` (shared) — each tribute works on a branch off this and merges back at the end.

## 📋 State of play (`main`)
- **160 updatable** — 89 major · 60 minor · 11 patch
- � **`pnpm audit` = 128 vulnerabilities** — 4 critical · 58 high · 54 moderate · 12 low. **There IS security urgency this round.** (Note: `npm audit` reports clean — it doesn't work in this pnpm repo; always use `pnpm audit`.)
- ⚠️ **Pinned via `overrides`:** `@types/react` / `@types/react-dom` held at 18 → this blocks `react`/`react-dom` 19. Leave alone.

## 🎯 Scope for the hour
**Security only this session.** Pure-maintenance minor/patch bumps are deliberately deferred to a future Dependagames (see bottom) — their upside is mostly non-urgent (bug fixes, smaller future jumps). The whole hour goes on clearing critical/high advisories, split across tributes below.

Strike packages off as they go in (`~~package~~`). Run `pnpm test:ci` + `pnpm check-types` before committing each bundle, and smoke-test the noted area. Re-run `pnpm audit` at the end to confirm the critical/high count dropped.

---

## 🚨 Security fixes — the whole session (split across tributes)

### Tribute 1 — Direct-dependency security bumps
**Bundle S1 — Critical/high direct deps**
- [ ] **@clerk/nextjs** `6.38.2 → ^6.39.5` — 🔴 CRITICAL middleware route-protection bypass + HIGH auth bypass. Auth library — top priority.
- [ ] **next** `15.5.15 → 15.5.19` — 🟠 HIGH ×7 (middleware/proxy bypass, SSRF, DoS). Minor bump fixes it **without** the v16 major. ⚠️ Own commit; smoke-test routing/middleware.
- [ ] **dompurify** `3.4.0 → 3.4.11` — 🟠 HIGH/XSS (direct + via posthog-js).
- [ ] **js-cookie** `3.0.5 → 3.0.8` — 🟠 HIGH (per-instance prototype hijack).

**Smoke test:** sign-in/sign-out + protected routes (Clerk), middleware redirects, sanitised HTML rendering, a build.

### Tribute 2 — `overrides` pins for transitive criticals/highs
- [ ] **protobufjs** `>=7.2.5 → >=7.5.6` — 🔴 CRITICAL RCE (via @google-cloud/firestore, grpc).
- [ ] **axios** add `>=1.16.0` — 🟠 HIGH ×11 (SSRF, proxy credential leak, prototype pollution; via posthog-node, @slack/bolt).
- [ ] **tar** add `>=7.5.11` — 🟠 HIGH (path traversal / arbitrary file write; via firebase-tools).
- [ ] **ws** add `>=8.21.0` — 🟠 HIGH (DoS; transitive).
- [ ] **lodash** add `>=4.17.24` — 🟠 HIGH (code injection via `_.template`).
- [ ] **shell-quote** add `>=1.8.4` — 🔴 CRITICAL (command injection).
- [ ] **form-data** add `>=4.0.6` — 🟠 HIGH (CRLF injection).
- [ ] **undici** add `>=6.27.0` · **@xmldom/xmldom** add `>=0.8.13` · **@grpc/grpc-js** add `>=1.13.5`

> ⚠️ Overrides force transitive versions — verify the app still builds (`pnpm build`) and tests pass after `pnpm install`. If a parent refuses a forced version, note it and skip rather than fighting it in the hour. **One owner for the whole `overrides` block** — it's a single edit, so don't parallelise it (merge conflicts).

**Smoke test:** `pnpm build`, full `pnpm test:ci`. Re-run `pnpm audit` to confirm criticals/highs are cleared.

### Tribute 3 (if present) — Parent-update alternative + verification
Some transitive vulns can be cleared by **updating the direct parent** instead of an override (cleaner long-term). Investigate, and fall back to an override if it's a major/risky jump:
- [ ] `@google-cloud/storage` / `@google-cloud/firestore` / `@google-cloud/secret-manager` minors → may pull patched `@grpc/grpc-js` (≥1.13.5) & `protobufjs`.
- [ ] `@sentry/nextjs` `10.52 → 10.62` → may pull patched transitive deps.
- [ ] Own the final **`pnpm audit` re-run** and update the PR description / Dependa Log with the before → after counts.

---

## 🟠 Stretch (only if a tribute finishes early) — isolated PRs
One package family per **separate branch + PR** (per Dependagames rules). Do **not** put these on the shared branch.
- [ ] `next` 15→16 **major** family: next, @next/env, @next/bundle-analyzer, eslint-config-next, @next/eslint-plugin-next — _separate from the S1 security minor (15.5.19); only attempt the major if the minor is already merged._
- [ ] `glob` 11→13 (always its own PR)
- [ ] `typescript` 5→6
- [ ] `jest` 29→30: jest, @jest/globals, jest-environment-jsdom, @types/jest

---

## 🕛 Deferred to a future session — maintenance minor/patch bumps
Non-security, low-urgency. Pulled out of this hour on purpose; batch them next round.
- **Patches:** postcss, @eslint/eslintrc, zustand, @oaknational/oak-consent-client, eslint-import-resolver-typescript, graphql-tag, pa11y-ci, @upstash/ratelimit.
- **Lint/format minors:** prettier, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, eslint-plugin-react-hooks, @eslint/compat, globals, stylelint.
- **UI runtime minors:** react-aria, react-stately, @react-aria/*, @react-stately/combobox, @react-types/*, react-focus-on, react-hook-form, @hookform/resolvers, zod.
- **Backend/build minors:** posthog-js, @axe-core/react, @google-cloud/*, openai, @upstash/redis, nanoid, date-fns, webpack, tsx, rimraf, sharp. _(Some double as the Tribute 3 parent-update route — if used there for a security fix, tick them off here too.)_

## 🅿️ Out of scope this session (need a dedicated spike)
`react`/`react-dom` 19 (blocked by pinned types) · `styled-components` 5→6 · `storybook` 9→10 · `graphql` 16→17 · `@tiptap/*` 2→3 · `@portabletext/*` · `@graphql-codegen/*` · `mathjax` 3→4 · `firebase-tools` · `@slack/bolt`.

## 🧹 Knip note (separate cleanup PR, not this hour)
Knip flagged ~49 "unused" deps but **most are false positives** (webpack polyfills `buffer`/`crypto-browserify`/`stream-*`/`url`/`util`, `core-js`, codegen/storybook CLIs run via npm scripts). Only triage genuine removals (`node-fetch`, `favicons`, `escape-html`, `micromatch`, `open`/`open-cli`, `properties-file`) in a **dedicated PR** with a grep check first.

---

## 🔗 PRs created (fill in during session)
| Package / bundle | Tribute | PR | Status |
|---|---|---|---|
| | | | |
