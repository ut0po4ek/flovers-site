# Reveal Animation Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix reveal animations on `/catalog` and `/catalog/[slug]` so they fire correctly on direct load, reload, and after Astro View Transitions in both directions.

**Architecture:** Two-file change only. In `BaseLayout.astro` the reveal JS is patched: `astro:before-swap` clears pending timers/frames and resets `data-reveal-bound` only on not-yet-visible elements; `initRevealAfterViewTransition` delays reveal start to 280ms (VT overlap); `setRevealDelay` becomes the single source of truth for transition delays via `el.style.transitionDelay`. In `global.css` the CSS `[data-reveal-delay="N"]` utility block is deleted — delays are now JS-only so any numeric value works.

**Tech Stack:** Astro 4.x, Astro View Transitions (`ClientRouter`), vanilla TypeScript in `<script>`, CSS custom properties.

---

## File Map

| File | Action | What changes |
|------|--------|--------------|
| `src/layouts/BaseLayout.astro` | Modify lines 81–227 (`<script>` block) | `astro:before-swap`, `initRevealAfterViewTransition`, `setRevealDelay` |
| `src/styles/global.css` | Modify lines 402–410 | Delete CSS delay utility block |

No other files touched.

---

### Task 1: Delete CSS delay utility block from `global.css`

**Files:**
- Modify: `src/styles/global.css` (lines 402–410)

- [ ] **Step 1: Remove the CSS delay utilities block**

In `src/styles/global.css`, find and delete this entire block (currently lines 402–410):

```css
/* Delay utilities */
[data-reveal-delay="100"]  { transition-delay: 100ms; }
[data-reveal-delay="150"]  { transition-delay: 150ms; }
[data-reveal-delay="200"]  { transition-delay: 200ms; }
[data-reveal-delay="300"]  { transition-delay: 300ms; }
[data-reveal-delay="400"]  { transition-delay: 400ms; }
[data-reveal-delay="500"]  { transition-delay: 500ms; }
[data-reveal-delay="600"]  { transition-delay: 600ms; }
[data-reveal-delay="700"]  { transition-delay: 700ms; }
[data-reveal-delay="800"]  { transition-delay: 800ms; }
```

After deletion the `/* Legacy .reveal class */` comment block should immediately follow the `[data-reveal].is-visible` rule. The surrounding blocks (`/* Base hidden state */`, variant rules, `.is-visible`, JS-guard, mobile media query, `/* Legacy .reveal */`) all stay as-is.

- [ ] **Step 2: Verify the MOTION SYSTEM block still looks correct**

After the edit, the motion system section in `global.css` should have this structure (no delay utilities between the mobile media query and legacy reveal):

```css
/* mobile media query */
@media (max-width: 767px) {
  [data-reveal="up"]    { transform: translate3d(0, 1.25rem, 0) scale(0.99); }
  [data-reveal="left"]  { transform: translate3d(-1.25rem, 0, 0); }
  [data-reveal="right"] { transform: translate3d(1.25rem, 0, 0); }
}

/* Legacy .reveal class (backwards compat) */
.reveal {
  opacity: 0;
  ...
```

No `[data-reveal-delay]` attribute selectors should remain anywhere in the file. Verify with:

```bash
grep -n "data-reveal-delay" "/Users/utopo4ek/Projects/Portfolio land/flovers-site/src/styles/global.css"
```

Expected output: no matches (empty).

- [ ] **Step 3: Commit**

```bash
git add "src/styles/global.css"
git commit -m "refactor: remove CSS delay utilities — delays now managed by JS only"
```

---

### Task 2: Fix `setRevealDelay` in `BaseLayout.astro`

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (function `setRevealDelay`, approx line 95–98)

- [ ] **Step 1: Replace the `setRevealDelay` function body**

Find the current function (lines 95–98):

```ts
function setRevealDelay(el: HTMLElement) {
  const delay = Number.parseInt(el.dataset.revealDelay || '0', 10);
  el.style.transitionDelay = `${Number.isFinite(delay) ? delay : 0}ms`;
}
```

Replace with:

```ts
function setRevealDelay(el: HTMLElement) {
  const raw = el.dataset.revealDelay;
  const delay = raw ? Number.parseInt(raw, 10) : 0;
  el.style.transitionDelay = Number.isFinite(delay) && delay > 0 ? `${delay}ms` : '';
}
```

Key differences:
- When no `data-reveal-delay` attribute is set, `transitionDelay` is cleared (`''`) instead of being set to `'0ms'`. This prevents a stale `0ms` inline style from overriding any future CSS transitions on the element.
- The check `delay > 0` prevents setting `transitionDelay` for zero or negative values.

- [ ] **Step 2: Verify no other callers of `setRevealDelay` exist**

```bash
grep -n "setRevealDelay" "/Users/utopo4ek/Projects/Portfolio land/flovers-site/src/layouts/BaseLayout.astro"
```

Expected: 3 matches — the function definition and two call sites (inside `revealElement` and inside `runReveal`'s `forEach`). No other files call it.

- [ ] **Step 3: Commit**

```bash
git add "src/layouts/BaseLayout.astro"
git commit -m "fix: setRevealDelay clears transitionDelay when no delay attr present"
```

---

### Task 3: Fix `astro:before-swap` handler

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (lines 210–218, the `astro:before-swap` listener)

- [ ] **Step 1: Replace the `astro:before-swap` event listener**

Find the current handler (approx lines 210–218):

```ts
document.addEventListener('astro:before-swap', (event) => {
  disconnectRevealObservers();
  revealAfterTransition = true;

  const transitionEvent = event as Event & { viewTransition?: ViewTransition };
  transitionEvent.viewTransition?.finished
    .catch(() => undefined)
    .finally(initRevealAfterViewTransition);
});
```

Replace with:

```ts
document.addEventListener('astro:before-swap', () => {
  disconnectRevealObservers();
  window.clearTimeout(revealTimer);
  window.cancelAnimationFrame(revealFrame);
  revealAfterTransition = true;

  document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach(el => {
    delete el.dataset.revealBound;
    el.style.transitionDelay = '';
  });
});
```

What changed:
- Added `clearTimeout` + `cancelAnimationFrame` to cancel any pending reveal from the outgoing page before swap starts.
- Added the `forEach` that resets `data-reveal-bound` and `transitionDelay` on elements that haven't yet become visible. This allows `runReveal` on the next page to re-observe them.
- Removed `viewTransition.finished` hook — timing is now handled entirely by `initRevealAfterViewTransition` via `setTimeout`.
- Removed the `event` parameter (no longer needed).

- [ ] **Step 2: Verify `astro:after-swap` handler still references `initRevealAfterViewTransition`**

The `astro:after-swap` handler (approx lines 219–223) should remain unchanged:

```ts
document.addEventListener('astro:after-swap', () => {
  if (!revealAfterTransition) return;
  window.clearTimeout(revealTimer);
  revealTimer = window.setTimeout(initRevealAfterViewTransition, 520);
});
```

This is the fallback: if `viewTransition.finished` no longer triggers `initRevealAfterViewTransition`, `astro:after-swap` fires it after 520ms. That's fine — `initRevealAfterViewTransition` is idempotent (it checks `revealAfterTransition` and resets it, so double-calls are safe).

- [ ] **Step 3: Commit**

```bash
git add "src/layouts/BaseLayout.astro"
git commit -m "fix: before-swap clears pending timers and resets reveal-bound on invisible elements"
```

---

### Task 4: Fix `initRevealAfterViewTransition` timing

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (function `initRevealAfterViewTransition`, approx lines 129–136)

- [ ] **Step 1: Change the reveal delay from 80ms to 280ms**

Find the current function:

```ts
function initRevealAfterViewTransition() {
  if (!revealAfterTransition) return;

  revealAfterTransition = false;
  window.clearTimeout(revealTimer);
  window.cancelAnimationFrame(revealFrame);
  revealTimer = window.setTimeout(runReveal, 80);
}
```

Replace with:

```ts
function initRevealAfterViewTransition() {
  if (!revealAfterTransition) return;

  revealAfterTransition = false;
  window.clearTimeout(revealTimer);
  window.cancelAnimationFrame(revealFrame);
  revealTimer = window.setTimeout(runReveal, 280);
}
```

Only change: `80` → `280`.

**Why 280ms:** The View Transition CSS in `global.css` runs `vt-fade-out` at 260ms and `vt-fade-in` at `380ms + 80ms delay = 460ms total`. Starting reveal at 280ms (from when `initRevealAfterViewTransition` is called, which itself is triggered ~0ms after `astro:after-swap`) means reveal begins while the new page is fully rendered but the fade-in is still in its last ~180ms — a smooth overlap.

- [ ] **Step 2: Commit**

```bash
git add "src/layouts/BaseLayout.astro"
git commit -m "fix: reveal starts at 280ms after VT swap for smooth overlap"
```

---

### Task 5: Run type-check and build

**Files:** none modified

- [ ] **Step 1: Run Astro type check**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site" && npm run check
```

Expected: no TypeScript errors. If there are errors, they will be in `BaseLayout.astro`'s `<script>` block — fix before continuing.

- [ ] **Step 2: Run production build**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site" && npm run build
```

Expected: build completes with no errors. Output will be in `dist/`.

Common failure modes:
- TypeScript error from removing the `event` parameter from `astro:before-swap` — if the type declaration was `(event: Event & {...})`, removing the parameter is fine in TS (event listeners allow ignoring parameters).
- Build error if `data-reveal-delay` CSS selectors were referenced elsewhere — they weren't, but `grep -r "data-reveal-delay" src/styles/` should confirm.

- [ ] **Step 3: Commit build-verified state**

```bash
git add "src/layouts/BaseLayout.astro" "src/styles/global.css"
git commit -m "fix: reveal animations working after Astro View Transitions (approach B)"
```

---

## Manual Verification Checklist

After the build passes, start the dev server (`npm run dev`) and verify each scenario:

```
npm run dev
# open http://localhost:4321
```

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Direct open `/catalog` | Label, divider, h1, subtitle animate up staggered; filter bar fades up; cards stagger in |
| 2 | `/` → `/catalog` via navbar link | VT plays; after ~280ms reveal fires; all catalog elements animate; filter buttons work |
| 3 | `/catalog/dolce-rose` → `/catalog` via breadcrumb or navbar | Reveal fires again on catalog; filters are clickable and toggle cards |
| 4 | `/catalog` → `/catalog/dolce-rose` | Photo scales in, info panel staggered up, care items stagger, gallery staggered, related staggered |
| 5 | Reload on `/catalog` | Same as direct open (scenario 1) |
| 6 | Filter clicks after any transition | Active state updates; hidden cards disappear; no double reveal animations |
| 7 | Light theme | All animations visible |
| 8 | Dark theme | All animations visible |
| 9 | System theme (matches OS) | All animations visible |
| 10 | `prefers-reduced-motion: reduce` (DevTools → Rendering → Emulate) | All elements immediately visible, no transitions |

**Do NOT commit or push without user confirmation.**
