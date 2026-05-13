# Reveal Animation Fix — Design Spec
**Date:** 2026-05-14  
**Project:** FLOVERS flower shop site  
**Approach:** B — JS-driven delays + VT timing fix

---

## Problem Summary

Three bugs prevent reveal animations from working correctly on `/catalog` and `/catalog/[slug]` after Astro View Transitions:

1. **`data-reveal-bound` not cleared after swap** — `astro:before-swap` calls `disconnectRevealObservers()` but leaves `data-reveal-bound="true"` on elements that haven't yet received `.is-visible`. On the next page, `runReveal` skips these elements because it sees `data-reveal-bound === 'true'`, so they never get an observer and never animate.

2. **CSS delay utilities conflict with JS** — `global.css` has `[data-reveal-delay="100"] { transition-delay: 100ms; }` etc., covering only values `100, 150, 200, 300, 400, 500, 600, 700, 800`. Values like `80, 140, 180, 260, 320, 460, 520` that appear in the page templates have no matching CSS rule, so their delays silently fall back to 0. The JS function `setRevealDelay()` already applies `style.transitionDelay` via `el.dataset.revealDelay`, but the CSS attribute selectors are redundant and potentially confusing.

3. **Reveal starts before View Transition completes** — `initRevealAfterViewTransition` fires `runReveal` after only `80ms` from `astro:after-swap`. The View Transition animation is `380ms duration + 80ms delay = 460ms total`. Elements receive `.is-visible` while the page is still mid-transition, so the reveal appears janky or invisible.

---

## Solution: Approach B

### Single source of truth for delays

Remove CSS delay utilities from `global.css`. All delays are managed exclusively by JS via `el.style.transitionDelay`. This means any numeric `data-reveal-delay` value works, not just the predefined set.

### Fix `astro:before-swap`

```js
document.addEventListener('astro:before-swap', () => {
  disconnectRevealObservers();
  window.clearTimeout(revealTimer);      // cancel any pending reveal timer
  window.cancelAnimationFrame(revealFrame); // cancel any pending rAF
  revealAfterTransition = true;

  // Only reset elements that haven't animated yet
  document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach(el => {
    delete el.dataset.revealBound;
    el.style.transitionDelay = '';
  });
});
```

**Why clear timer/frame here:** A reveal timer or rAF scheduled on the outgoing page could fire mid-swap and add `.is-visible` to elements that no longer exist in the DOM, or worse — to new elements that were just swapped in before the VT completes.

**Why only non-visible elements:** Elements already showing `.is-visible` are done — no need to re-animate them. Resetting visible elements would cause a flash.

Remove the `viewTransition.finished` hook from this handler — timing is now handled via `setTimeout` in `initRevealAfterViewTransition`.

### Fix `initRevealAfterViewTransition` timing

```js
function initRevealAfterViewTransition() {
  if (!revealAfterTransition) return;
  revealAfterTransition = false;
  window.clearTimeout(revealTimer);
  window.cancelAnimationFrame(revealFrame);
  revealTimer = window.setTimeout(runReveal, 280); // was 80ms
}
```

**Why 280ms:** View Transition runs `80ms delay + 380ms animation = 460ms`. Starting reveal at `~280ms` means it overlaps the final third of the transition — elements begin fading in as the new page is fully visible, creating a seamless feel without a blank pause.

**Why not 500ms:** Would create a noticeable empty pause after the transition ends.

### Fix `setRevealDelay`

```js
function setRevealDelay(el: HTMLElement) {
  const raw = el.dataset.revealDelay;
  const delay = raw ? Number.parseInt(raw, 10) : 0;
  el.style.transitionDelay = Number.isFinite(delay) && delay > 0 ? `${delay}ms` : '';
}
```

Called before observer binding and before adding `.is-visible`. Clears `transitionDelay` when no delay is set, preventing stale values from a previous page visit.

### `runReveal` — explicit order per element

For each `[data-reveal]:not(.is-visible)` element, the order must be:

1. **Skip** if `.is-visible` already present
2. **`setRevealDelay(el)`** — reset stale delay, apply current `data-reveal-delay` value
3. **Mark** `el.dataset.revealBound = 'true'`
4. **Bind**: if in viewport → `revealElement(el)` immediately; else → `revealObserver.observe(el)`

This order ensures the correct `transitionDelay` is active before either the immediate double-rAF reveal or the observer callback fires. No structural rewrite needed — the existing `runReveal` body already follows this order; it just needs to confirm step 1 happens before step 2 (currently guarded in `revealElement`, but the `setRevealDelay` + `data.revealBound = 'true'` happen before the guard — that's fine, we just need to verify the guard is in the right place).

### `global.css` — remove delay utilities

```css
/* DELETE this entire block: */
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

All other CSS in the MOTION SYSTEM block stays as-is.

---

## Files Changed

| File | Change |
|------|--------|
| `src/layouts/BaseLayout.astro` | Fix `astro:before-swap`, fix timing in `initRevealAfterViewTransition`, fix `setRevealDelay` |
| `src/styles/global.css` | Remove CSS delay utility block |

No changes to `/catalog/index.astro`, `/catalog/[slug].astro`, or component files — their `data-reveal` + `data-reveal-delay` markup is already correct.

---

## Verification Scenarios

1. Direct open `/catalog` — intro label, divider, h1, subtitle, filters, cards all animate in staggered
2. `/` → `/catalog` via navbar — after VT completes, reveal fires; filters work
3. `/catalog/dolce-rose` → `/catalog` — reveal re-fires on catalog page; filters work
4. `/catalog` → `/catalog/dolce-rose` — product photo, info, care, gallery, related all animate
5. Reload on `/catalog` — same as direct open
6. Filter clicks after any transition — cards toggle correctly; no double animations
7. Light / dark / system themes — animations work in all three
8. `prefers-reduced-motion: reduce` — all elements immediately visible, no transitions

---

## What Is NOT Changed

- Existing `.reveal` legacy class support (kept as-is)
- `IntersectionObserver` thresholds and rootMargin
- `prefers-reduced-motion` handling in `runReveal`
- CSS reveal variants (`up`, `fade`, `scale`, `left`, `right`, `clip`)
- All page templates and components
- No new libraries or dependencies
