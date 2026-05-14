# astro-business-starter UI Transfer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transfer mature theme switcher, reveal lifecycle, and reusable form UI components from flovers-site into astro-business-starter, and refactor ContactSection into a full demo form.

**Architecture:** Infrastructure fixes go into BaseLayout.astro (reveal lifecycle) and Header.astro (theme+mobile guards). New UI components are dropped into src/components/ui/ with no coupling to business logic. ContactSection is fully replaced using those components.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS 4, Astro ClientRouter (View Transitions), localStorage for theme persistence.

**Project root:** `/Users/utopo4ek/Projects/Portfolio land/astro-business-starter`  
**Source reference:** `/Users/utopo4ek/Projects/Portfolio land/flovers-site`  
**No commit/push without user confirmation.**

---

## Timing note (reveal after View Transitions)

flovers-site is the source of truth. Its `astro:after-swap` handler schedules:

```text
setTimeout(initRevealAfterViewTransition, 520)
  └─ setTimeout(runReveal, 280)
```

Total: **~800ms**. This is intentional. The VT CSS animations run for ~720ms total (fade-out 260ms + fade-in 80ms delay + 380ms duration). The 520ms first delay waits until the new page content is nearly fully faded in; the 280ms second delay gives the browser one more frame-batch before IntersectionObserver starts. Running reveal earlier causes scroll-reveal animations to collide with the still-running page transition. This timing is verified working in flovers-site and is transferred verbatim.

## dataset naming note

`el.dataset.revealBound` in JS reads/writes the DOM attribute `data-reveal-bound`. This camelCase ↔ kebab-case mapping is standard browser behaviour. There is no inconsistency — never write `data-revealBound` in HTML, always `data-reveal-bound` (or let JS set it via `.dataset`).

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/layouts/BaseLayout.astro` | Replace reveal script with lifecycle-managed version |
| Modify | `src/components/layout/Header.astro` | Replace theme+mobile script with data-*-bound guard version |
| Modify | `src/config/site.ts` | Add missing `vk` contact field |
| Create | `src/components/ui/TextField.astro` | Styled text/email input with label, error |
| Create | `src/components/ui/TextareaField.astro` | Styled textarea with label |
| Create | `src/components/ui/SelectField.astro` | Native styled select (fallback) |
| Create | `src/components/ui/CustomSelect.astro` | Custom dropdown with keyboard nav, singleton outside-click guard |
| Create | `src/components/ui/PhoneField.astro` | RU phone mask input, JS guard |
| Create | `src/components/ui/DatePicker.astro` | Calendar popover, singleton outside-click guard |
| Create | `src/components/ui/Icon.astro` | Generic SVG icon component |
| Modify | `src/components/sections/ContactSection.astro` | Full refactor using new UI components, initContactForm guard |

---

## Task 1: Fix reveal lifecycle in BaseLayout.astro

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Replace the `<script>` block inside `<body>`**

  The current script (lines ~82–128) creates new IntersectionObservers on every `astro:page-load` without cleanup. Replace the entire `<script>…</script>` inside `<body>` with:

  ```typescript
  let revealObserver: IntersectionObserver | null = null;
  let legacyRevealObserver: IntersectionObserver | null = null;
  let revealFrame = 0;
  let revealTimer = 0;
  let revealAfterTransition = false;

  function disconnectRevealObservers() {
    revealObserver?.disconnect();
    legacyRevealObserver?.disconnect();
    revealObserver = null;
    legacyRevealObserver = null;
  }

  function setRevealDelay(el: HTMLElement) {
    const raw = el.dataset.revealDelay;
    const delay = raw ? Number.parseInt(raw, 10) : 0;
    el.style.transitionDelay = Number.isFinite(delay) && delay > 0 ? `${delay}ms` : '';
  }

  function revealElement(el: HTMLElement) {
    if (el.classList.contains('is-visible')) return;
    setRevealDelay(el);
    el.dataset.revealBound = 'true';
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        el.classList.add('is-visible');
      });
    });
  }

  function isElementInViewport(el: Element) {
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
  }

  function initReveal() {
    if (revealAfterTransition) return;
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(revealFrame);
    revealFrame = window.requestAnimationFrame(runReveal);
  }

  function initRevealAfterViewTransition() {
    if (!revealAfterTransition) return;
    revealAfterTransition = false;
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(revealFrame);
    revealTimer = window.setTimeout(runReveal, 280);
  }

  function runReveal() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      disconnectRevealObservers();
      document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
        el.style.transitionDelay = '0ms';
        el.classList.add('visible', 'is-visible');
      });
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.transitionDelay = '0ms';
        el.classList.add('is-visible');
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            revealElement(el);
            revealObserver?.unobserve(el);
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
      );
    }

    document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((el) => {
      if (el.dataset.revealBound === 'true' && revealObserver) return;
      setRevealDelay(el);
      el.dataset.revealBound = 'true';
      if (isElementInViewport(el)) {
        revealElement(el);
      } else {
        revealObserver?.observe(el);
      }
    });

    if (!legacyRevealObserver) {
      legacyRevealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible', 'is-visible');
            legacyRevealObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -56px 0px' }
      );
    }

    document.querySelectorAll<HTMLElement>('.reveal:not(.visible):not(.is-visible)').forEach((el) => {
      if (el.dataset.revealBound === 'true' && legacyRevealObserver) return;
      el.dataset.revealBound = 'true';
      if (isElementInViewport(el)) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => el.classList.add('visible', 'is-visible'));
        });
      } else {
        legacyRevealObserver?.observe(el);
      }
    });
  }

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

  document.addEventListener('astro:after-swap', () => {
    const html = document.documentElement;
    html.classList.add('js');
    const savedTheme = (() => {
      try { return localStorage.getItem('starter-theme') || 'system'; } catch { return 'system'; }
    })();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = savedTheme === 'system' ? (prefersDark ? 'dark' : 'light') : savedTheme;
    html.dataset.theme = resolved;
    html.dataset.themePreference = savedTheme;

    if (!revealAfterTransition) return;
    window.clearTimeout(revealTimer);
    // 520ms: waits for VT fade-in (~460ms) to nearly complete before starting reveal
    revealTimer = window.setTimeout(initRevealAfterViewTransition, 520);
  });

  document.addEventListener('DOMContentLoaded', initReveal);
  document.addEventListener('astro:page-load', initReveal);
  initReveal();
  ```

- [ ] **Step 2: Run type check**

  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && npm run check
  ```
  Expected: no errors related to BaseLayout.

---

## Task 2: Fix theme switcher + mobile menu in Header.astro

**Files:**
- Modify: `src/components/layout/Header.astro`

- [ ] **Step 1: Replace the entire `<script>` block in Header.astro**

  The current script uses module-scope DOM references that go stale after View Transition swap, and `initThemeListeners()` adds duplicate listeners on every `astro:page-load`. Replace the full `<script>…</script>` block with:

  ```typescript
  type ThemePreference = 'light' | 'dark' | 'system';

  const STORAGE_KEY = 'starter-theme';
  const VALID_PREFS: ThemePreference[] = ['light', 'dark', 'system'];
  let menuOpen = false;
  let themeMenuOpen = false;

  function getThemePreference(): ThemePreference {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
      return saved && VALID_PREFS.includes(saved) ? saved : 'system';
    } catch {
      return 'system';
    }
  }

  function resolveTheme(preference: ThemePreference): 'light' | 'dark' {
    if (preference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return preference;
  }

  function syncTheme(preference = getThemePreference(), persist = false, animate = false) {
    if (!VALID_PREFS.includes(preference)) preference = 'system';
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, preference); } catch { /* Safari private mode */ }
    }
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('theme-transitioning');
      window.setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 300);
    }
    document.documentElement.dataset.theme = resolveTheme(preference);
    document.documentElement.dataset.themePreference = preference;
    updateThemeUI(preference);
  }

  function updateThemeUI(preference = getThemePreference()) {
    document.querySelectorAll<HTMLElement>('.theme-icon-light, .theme-icon-dark, .theme-icon-system').forEach(icon => {
      icon.classList.add('hidden');
    });
    document.querySelector<HTMLElement>(`.theme-icon-${preference}`)?.classList.remove('hidden');
    document.querySelectorAll<HTMLElement>('.theme-menu-item').forEach(btn => {
      btn.dataset.active = String(btn.dataset.themeOption === preference);
    });
    document.querySelectorAll<HTMLElement>('.mobile-theme-btn').forEach(btn => {
      btn.dataset.active = String(btn.dataset.mobileTheme === preference);
    });
  }

  function closeThemeMenu() {
    const themeButton = document.getElementById('theme-btn');
    const themeMenu = document.getElementById('theme-menu');
    themeMenuOpen = false;
    themeMenu?.classList.add('hidden');
    themeButton?.setAttribute('aria-expanded', 'false');
  }

  function openThemeMenu() {
    const themeButton = document.getElementById('theme-btn');
    const themeMenu = document.getElementById('theme-menu');
    if (!themeButton || !themeMenu) return;
    themeMenuOpen = true;
    themeMenu.classList.remove('hidden');
    themeButton.setAttribute('aria-expanded', 'true');
    const activeItem = themeMenu.querySelector<HTMLElement>('[data-active="true"]')
      ?? themeMenu.querySelector<HTMLElement>('[role="menuitem"]');
    activeItem?.focus();
  }

  function resolveHeaderState() {
    const header = document.getElementById('site-header');
    if (!header) return;
    const hero = document.getElementById('hero');
    if (!hero) { header.dataset.state = 'scrolled'; return; }
    header.dataset.state = hero.getBoundingClientRect().bottom < 72 ? 'scrolled' : 'hero';
  }

  function closeMobileMenu() {
    const burgerButton = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    menuOpen = false;
    mobileMenu?.classList.remove('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    burgerButton?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    const burgerButton = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!burgerButton || !mobileMenu) return;
    menuOpen = true;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burgerButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function initHeaderState() {
    resolveHeaderState();
    if (document.documentElement.dataset.headerScrollBound === 'true') return;
    document.documentElement.dataset.headerScrollBound = 'true';
    window.addEventListener('scroll', resolveHeaderState, { passive: true });
  }

  function initMobileMenu() {
    const burgerButton = document.getElementById('burger-btn');
    const closeButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (burgerButton && burgerButton.dataset.menuBound !== 'true') {
      burgerButton.dataset.menuBound = 'true';
      burgerButton.addEventListener('click', () => { menuOpen ? closeMobileMenu() : openMobileMenu(); });
    }
    if (closeButton && closeButton.dataset.menuBound !== 'true') {
      closeButton.dataset.menuBound = 'true';
      closeButton.addEventListener('click', closeMobileMenu);
    }
    mobileMenu?.querySelectorAll<HTMLElement>('[data-close-menu]').forEach(link => {
      if (link.dataset.menuBound === 'true') return;
      link.dataset.menuBound = 'true';
      link.addEventListener('click', closeMobileMenu);
    });
    if (document.documentElement.dataset.mobileMenuKeyBound !== 'true') {
      document.documentElement.dataset.mobileMenuKeyBound = 'true';
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuOpen) closeMobileMenu();
      });
    }
  }

  function initThemeSwitcher() {
    syncTheme(getThemePreference(), false, false);
    const themeButton = document.getElementById('theme-btn');
    const themeMenu = document.getElementById('theme-menu');

    if (themeButton && themeButton.dataset.themeBound !== 'true') {
      themeButton.dataset.themeBound = 'true';
      themeButton.addEventListener('click', () => { themeMenuOpen ? closeThemeMenu() : openThemeMenu(); });
    }
    if (themeMenu && themeMenu.dataset.themeBound !== 'true') {
      themeMenu.dataset.themeBound = 'true';
      themeMenu.addEventListener('keydown', (event: KeyboardEvent) => {
        const items = Array.from(themeMenu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        if (event.key === 'ArrowDown') { event.preventDefault(); items[(index + 1) % items.length]?.focus(); }
        else if (event.key === 'ArrowUp') { event.preventDefault(); items[(index - 1 + items.length) % items.length]?.focus(); }
        else if (event.key === 'Escape') { event.preventDefault(); closeThemeMenu(); themeButton?.focus(); }
      });
    }
    themeMenu?.querySelectorAll<HTMLElement>('[data-theme-option]').forEach(btn => {
      if (btn.dataset.themeBound === 'true') return;
      btn.dataset.themeBound = 'true';
      btn.addEventListener('click', () => { syncTheme(btn.dataset.themeOption as ThemePreference, true, true); closeThemeMenu(); });
    });
    document.querySelectorAll<HTMLElement>('[data-mobile-theme]').forEach(btn => {
      if (btn.dataset.themeBound === 'true') return;
      btn.dataset.themeBound = 'true';
      btn.addEventListener('click', () => { syncTheme(btn.dataset.mobileTheme as ThemePreference, true, true); });
    });
    if (document.documentElement.dataset.themeOutsideBound !== 'true') {
      document.documentElement.dataset.themeOutsideBound = 'true';
      document.addEventListener('click', (event) => {
        if (!themeMenuOpen) return;
        const btn = document.getElementById('theme-btn');
        const menu = document.getElementById('theme-menu');
        if (btn && menu && !btn.contains(event.target as Node) && !menu.contains(event.target as Node)) closeThemeMenu();
      });
    }
    if (document.documentElement.dataset.themeOsBound !== 'true') {
      document.documentElement.dataset.themeOsBound = 'true';
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (getThemePreference() === 'system') syncTheme('system', false, true);
      });
    }
  }

  function initHeaderChrome() {
    initHeaderState();
    initMobileMenu();
    initThemeSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderChrome, { once: true });
  } else {
    initHeaderChrome();
  }

  if (document.documentElement.dataset.headerPageLoadBound !== 'true') {
    document.documentElement.dataset.headerPageLoadBound = 'true';
    document.addEventListener('astro:page-load', initHeaderChrome);
  }
  ```

- [ ] **Step 2: Fix `theme-menu-item[data-active]` CSS in the `<style>` block**

  Find:
  ```css
  .theme-menu-item[data-active="true"] {
    color: var(--color-accent);
  }
  ```
  Replace with:
  ```css
  .theme-menu-item[data-active="true"] {
    color: var(--color-accent);
    background-color: var(--color-bg-warm);
  }

  .theme-menu-item:focus:not([data-active="true"]) {
    background-color: var(--color-bg-warm);
    color: var(--color-fg);
  }
  ```

- [ ] **Step 3: Run type check**

  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && npm run check
  ```
  Expected: no errors.

---

## Task 3: Add `vk` to siteConfig contacts

**Files:**
- Modify: `src/config/site.ts`

- [ ] **Step 1: Add `vk` field**

  The current `contacts` object has `telegram`, `whatsapp`, `instagram` but no `vk`. Add it:

  Find:
  ```typescript
    instagram: '#',
  },
  ```
  Replace with:
  ```typescript
    instagram: '#',
    vk: '#',
  },
  ```

---

## Task 4: Create TextField.astro

**Files:**
- Create: `src/components/ui/TextField.astro`

- [ ] **Step 1: Create the file**

  Note: `var(--color-surface, var(--color-bg))` — astro-business-starter's global.css does not define `--color-surface`, so the fallback to `--color-bg` is intentional.

  ```astro
  ---
  interface Props {
    id: string;
    name: string;
    label: string;
    type?: 'text' | 'email';
    placeholder?: string;
    autocomplete?: string;
    required?: boolean;
    error?: string;
  }

  const {
    id,
    name,
    label,
    type = 'text',
    placeholder = '',
    autocomplete,
    required = false,
    error,
  } = Astro.props;
  ---

  <div class="form-field">
    <label for={id} class="field-label">
      {label}{required && <span aria-hidden="true"> *</span>}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      autocomplete={autocomplete}
      required={required}
      placeholder={placeholder}
      aria-describedby={error ? `${id}-error` : undefined}
      class="form-control"
    />
    {error && <p id={`${id}-error`} class="field-error hidden">{error}</p>}
  </div>

  <style>
    .field-label {
      display: block;
      margin-bottom: 0.55rem;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-fg-muted);
    }

    .form-control {
      width: 100%;
      min-height: 3.25rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 62%, transparent);
      color: var(--color-fg);
      padding: 0.9rem 1rem;
      font: inherit;
      font-size: 0.9375rem;
      line-height: 1.2;
      transition: border-color 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
    }

    .form-control::placeholder { color: var(--color-fg-subtle); }

    .form-control:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 18%, transparent);
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 82%, transparent);
    }

    .field-error {
      margin-top: 0.35rem;
      font-size: 0.75rem;
      color: #ef4444;
    }
  </style>
  ```

---

## Task 5: Create TextareaField.astro

**Files:**
- Create: `src/components/ui/TextareaField.astro`

- [ ] **Step 1: Create the file**

  ```astro
  ---
  interface Props {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    rows?: number;
  }

  const { id, name, label, placeholder = '', rows = 4 } = Astro.props;
  ---

  <div class="form-field">
    <label for={id} class="field-label">{label}</label>
    <textarea
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      class="form-control"
    ></textarea>
  </div>

  <style>
    .field-label {
      display: block;
      margin-bottom: 0.55rem;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-fg-muted);
    }

    .form-control {
      width: 100%;
      min-height: 7.75rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 62%, transparent);
      color: var(--color-fg);
      padding: 0.95rem 1rem;
      font: inherit;
      font-size: 0.9375rem;
      line-height: 1.5;
      resize: vertical;
      transition: border-color 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
    }

    .form-control::placeholder { color: var(--color-fg-subtle); }

    .form-control:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 18%, transparent);
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 82%, transparent);
    }
  </style>
  ```

---

## Task 6: Create SelectField.astro (native styled select)

**Files:**
- Create: `src/components/ui/SelectField.astro`

- [ ] **Step 1: Create the file**

  ```astro
  ---
  interface Option {
    label: string;
    value: string;
  }

  interface Props {
    id: string;
    name: string;
    label: string;
    placeholder: string;
    options: Option[];
    required?: boolean;
    error?: string;
  }

  const { id, name, label, placeholder, options, required = false, error } = Astro.props;
  ---

  <div class="form-field">
    <label for={id} class="field-label">
      {label}{required && <span aria-hidden="true"> *</span>}
    </label>
    <div class="select-shell">
      <select
        id={id}
        name={name}
        required={required}
        aria-describedby={error ? `${id}-error` : undefined}
        class="form-control"
      >
        <option value="" disabled selected>{placeholder}</option>
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
      <svg class="select-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <polyline points="3,5 7,9 11,5"></polyline>
      </svg>
    </div>
    {error && <p id={`${id}-error`} class="field-error hidden">{error}</p>}
  </div>

  <style>
    .field-label {
      display: block;
      margin-bottom: 0.55rem;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-fg-muted);
    }

    .select-shell { position: relative; }

    .form-control {
      width: 100%;
      min-height: 3.25rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 72%, transparent);
      color: var(--color-fg);
      padding: 0.9rem 2.8rem 0.9rem 1rem;
      font: inherit;
      font-size: 0.9375rem;
      line-height: 1.2;
      appearance: none;
      cursor: pointer;
      transition: border-color 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 18%, transparent);
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 88%, transparent);
    }

    .select-arrow {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-fg-muted);
      pointer-events: none;
    }

    .field-error {
      margin-top: 0.35rem;
      font-size: 0.75rem;
      color: #ef4444;
    }
  </style>
  ```

---

## Task 7: Create CustomSelect.astro

**Files:**
- Create: `src/components/ui/CustomSelect.astro`

The `document.addEventListener('click', …)` for outside-click is registered once globally via a `data-customSelectOutsideBound` guard on `documentElement`. This prevents N listeners accumulating for N selects, and avoids stale-closure issues after View Transitions.

- [ ] **Step 1: Create the file**

  ```astro
  ---
  interface Option {
    label: string;
    value: string;
  }

  interface Props {
    id: string;
    name: string;
    label: string;
    placeholder: string;
    options: Option[];
    required?: boolean;
    error?: string;
  }

  const { id, name, label, placeholder, options, required = false, error } = Astro.props;
  ---

  <div class="form-field custom-select" data-custom-select>
    <label id={`${id}-label`} class="field-label">
      {label}{required && <span aria-hidden="true"> *</span>}
    </label>

    <input
      id={id}
      name={name}
      type="hidden"
      required={required}
      aria-describedby={error ? `${id}-error` : undefined}
      data-custom-value
    />

    <button
      type="button"
      class="select-trigger"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-labelledby={`${id}-label ${id}-value`}
      data-custom-control-for={id}
      data-select-trigger
    >
      <span id={`${id}-value`} class="select-value is-placeholder" data-select-value>{placeholder}</span>
      <svg class="select-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <polyline points="3,5 7,9 11,5"></polyline>
      </svg>
    </button>

    <div class="select-menu" role="listbox" tabindex="-1" hidden data-select-menu>
      {options.map((option) => (
        <button
          type="button"
          class="select-option"
          role="option"
          data-value={option.value}
          aria-selected="false"
        >
          {option.label}
        </button>
      ))}
    </div>

    {error && <p id={`${id}-error`} class="field-error hidden">{error}</p>}
  </div>

  <style>
    .custom-select { position: relative; }

    .field-label {
      display: block;
      margin-bottom: 0.55rem;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-fg-muted);
    }

    .select-trigger {
      width: 100%;
      min-height: 3.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 66%, transparent);
      color: var(--color-fg);
      padding: 0.9rem 1rem;
      font: inherit;
      font-size: 0.9375rem;
      line-height: 1.2;
      text-align: left;
      transition: border-color 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
    }

    .select-trigger:hover {
      border-color: color-mix(in srgb, var(--color-accent) 42%, var(--color-border));
    }

    .select-trigger:focus-visible,
    .custom-select.is-open .select-trigger {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 18%, transparent);
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 84%, transparent);
    }

    .select-value {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .select-value.is-placeholder { color: var(--color-fg-subtle); }

    .select-arrow {
      flex: 0 0 auto;
      color: var(--color-fg-muted);
      transition: transform 180ms ease, color 180ms ease;
    }

    .custom-select.is-open .select-arrow {
      color: var(--color-accent-dark);
      transform: rotate(180deg);
    }

    .select-menu {
      position: absolute;
      z-index: 30;
      left: 0;
      right: 0;
      top: calc(100% + 0.45rem);
      padding: 0.35rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: var(--color-surface, var(--color-bg));
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.12);
    }

    :global([data-theme="dark"]) .select-menu {
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
    }

    .select-option {
      width: 100%;
      display: flex;
      align-items: center;
      min-height: 2.5rem;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--color-fg-muted);
      padding: 0.65rem 0.75rem;
      font: inherit;
      font-size: 0.875rem;
      line-height: 1.25;
      text-align: left;
      transition: background-color 160ms ease, color 160ms ease;
    }

    .select-option:hover,
    .select-option:focus,
    .select-option[aria-selected="true"] {
      outline: none;
      background: color-mix(in srgb, var(--color-accent) 16%, transparent);
      color: var(--color-fg);
    }

    .field-error {
      margin-top: 0.35rem;
      font-size: 0.75rem;
      color: #ef4444;
    }
  </style>

  <script>
    function initCustomSelects() {
      // Register singleton outside-click listener once per document lifetime
      if (document.documentElement.dataset.customSelectOutsideBound !== 'true') {
        document.documentElement.dataset.customSelectOutsideBound = 'true';
        document.addEventListener('click', (event) => {
          document.querySelectorAll<HTMLElement>('[data-custom-select].is-open').forEach((openRoot) => {
            if (!openRoot.contains(event.target as Node)) {
              openRoot.classList.remove('is-open');
              openRoot.querySelector<HTMLButtonElement>('[data-select-trigger]')?.setAttribute('aria-expanded', 'false');
              const menu = openRoot.querySelector<HTMLElement>('[data-select-menu]');
              if (menu) menu.hidden = true;
            }
          });
        });
      }

      document.querySelectorAll<HTMLElement>('[data-custom-select]').forEach((root) => {
        if (root.dataset.selectReady === 'true') return;
        root.dataset.selectReady = 'true';

        const input = root.querySelector<HTMLInputElement>('[data-custom-value]');
        const trigger = root.querySelector<HTMLButtonElement>('[data-select-trigger]');
        const valueEl = root.querySelector<HTMLElement>('[data-select-value]');
        const menu = root.querySelector<HTMLElement>('[data-select-menu]');
        const options = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="option"]'));
        if (!input || !trigger || !valueEl || !menu || !options.length) return;

        let activeIndex = -1;

        const close = () => {
          root.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          menu.hidden = true;
        };

        const open = () => {
          root.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          menu.hidden = false;
          activeIndex = Math.max(0, options.findIndex((o) => o.dataset.value === input.value));
          options[activeIndex]?.focus();
        };

        const selectOption = (option: HTMLButtonElement) => {
          input.value = option.dataset.value || '';
          valueEl.textContent = option.textContent?.trim() || '';
          valueEl.classList.toggle('is-placeholder', !input.value);
          options.forEach((item) => item.setAttribute('aria-selected', String(item === option)));
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          close();
          trigger.focus();
        };

        trigger.addEventListener('click', () => { menu.hidden ? open() : close(); });

        trigger.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            open();
          }
        });

        menu.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') { event.preventDefault(); close(); trigger.focus(); return; }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const step = event.key === 'ArrowDown' ? 1 : -1;
            activeIndex = (activeIndex + step + options.length) % options.length;
            options[activeIndex]?.focus();
            return;
          }
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const option = document.activeElement as HTMLButtonElement;
            if (options.includes(option)) selectOption(option);
          }
        });

        options.forEach((option) => { option.addEventListener('click', () => selectOption(option)); });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCustomSelects, { once: true });
    } else {
      initCustomSelects();
    }
    document.addEventListener('astro:page-load', initCustomSelects);
  </script>
  ```

---

## Task 8: Create PhoneField.astro

**Files:**
- Create: `src/components/ui/PhoneField.astro`

Note: The +7 mask is a Russian-format example. The component is self-contained — replace the mask logic in the `<script>` block for other locales. UX verified: backspace operates on digits not mask characters, preventing the "stuck operator code" bug.

- [ ] **Step 1: Create the file**

  ```astro
  ---
  interface Props {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
  }

  const {
    id,
    name,
    label,
    placeholder = '+7 (___) ___-__-__',
    required = false,
    error,
  } = Astro.props;
  ---

  <div class="form-field">
    <label for={id} class="field-label">
      {label}{required && <span aria-hidden="true"> *</span>}
    </label>
    <input
      id={id}
      name={name}
      type="tel"
      inputmode="tel"
      autocomplete="tel"
      required={required}
      placeholder={placeholder}
      aria-describedby={error ? `${id}-error` : undefined}
      class="form-control"
      data-phone-mask="ru"
    />
    {error && <p id={`${id}-error`} class="field-error hidden">{error}</p>}
  </div>

  <style>
    .field-label {
      display: block;
      margin-bottom: 0.55rem;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-fg-muted);
    }

    .form-control {
      width: 100%;
      min-height: 3.25rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 62%, transparent);
      color: var(--color-fg);
      padding: 0.9rem 1rem;
      font: inherit;
      font-size: 0.9375rem;
      line-height: 1.2;
      transition: border-color 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
    }

    .form-control::placeholder { color: var(--color-fg-subtle); }

    .form-control:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 18%, transparent);
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 82%, transparent);
    }

    .field-error {
      margin-top: 0.35rem;
      font-size: 0.75rem;
      color: #ef4444;
    }
  </style>

  <script>
    function getRuPhoneDigits(value: string) {
      let digits = value.replace(/\D/g, '');
      if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
      if (digits.startsWith('7')) digits = digits.slice(1);
      return digits.slice(0, 10);
    }

    function formatRuPhoneFromDigits(digits: string) {
      if (!digits) return '';
      const code = digits.slice(0, 3);
      const first = digits.slice(3, 6);
      const second = digits.slice(6, 8);
      const third = digits.slice(8, 10);
      let result = `+7 (${code}`;
      if (code.length === 3) result += ')';
      if (first) result += ` ${first}`;
      if (second) result += `-${second}`;
      if (third) result += `-${third}`;
      return result;
    }

    function formatRuPhone(value: string) {
      return formatRuPhoneFromDigits(getRuPhoneDigits(value));
    }

    function getLocalDigitPositions(value: string) {
      const positions: number[] = [];
      for (let i = 0; i < value.length; i++) {
        if (/\d/.test(value[i])) positions.push(i);
      }
      // Skip the leading "7" of +7 — it's the country code, not a user digit
      return value.trimStart().startsWith('+7') ? positions.slice(1) : positions;
    }

    function initPhoneMasks() {
      document.querySelectorAll<HTMLInputElement>('[data-phone-mask="ru"]').forEach((input) => {
        if (input.dataset.maskReady === 'true') return;
        input.dataset.maskReady = 'true';

        input.addEventListener('beforeinput', (event: InputEvent) => {
          if (event.inputType !== 'deleteContentBackward' && event.inputType !== 'deleteContentForward') return;
          if (!input.value) return;
          const start = input.selectionStart ?? input.value.length;
          const end = input.selectionEnd ?? start;
          const positions = getLocalDigitPositions(input.value);
          let digits = getRuPhoneDigits(input.value);
          if (!digits) return;
          let removeFrom = -1;
          let removeTo = -1;
          if (start !== end) {
            const selectedIndexes = positions
              .map((pos, idx) => ({ pos, idx }))
              .filter(({ pos }) => pos >= start && pos < end)
              .map(({ idx }) => idx);
            if (selectedIndexes.length) {
              removeFrom = selectedIndexes[0];
              removeTo = selectedIndexes[selectedIndexes.length - 1] + 1;
            }
          }
          if (removeFrom === -1) {
            const targetIndex = event.inputType === 'deleteContentBackward'
              ? positions.map((pos, idx) => ({ pos, idx })).filter(({ pos }) => pos < start).pop()?.idx
              : positions.map((pos, idx) => ({ pos, idx })).find(({ pos }) => pos >= start)?.idx;
            if (targetIndex === undefined) return;
            removeFrom = targetIndex;
            removeTo = targetIndex + 1;
          }
          event.preventDefault();
          digits = `${digits.slice(0, removeFrom)}${digits.slice(removeTo)}`;
          input.value = formatRuPhoneFromDigits(digits);
          input.setSelectionRange(input.value.length, input.value.length);
        });

        input.addEventListener('input', () => {
          input.value = formatRuPhone(input.value);
          input.setSelectionRange(input.value.length, input.value.length);
        });

        input.addEventListener('blur', () => { input.value = formatRuPhone(input.value); });
      });
    }

    initPhoneMasks();
    document.addEventListener('astro:page-load', initPhoneMasks);
  </script>
  ```

---

## Task 9: Create DatePicker.astro

**Files:**
- Create: `src/components/ui/DatePicker.astro`

Outside-click uses a singleton `data-datePickerOutsideBound` guard — one global listener closes any open picker, avoiding N listeners for N pickers.

- [ ] **Step 1: Create the file**

  ```astro
  ---
  interface Props {
    id: string;
    name: string;
    label: string;
    optionalLabel?: string;
    placeholder?: string;
  }

  const { id, name, label, optionalLabel, placeholder = 'дд.мм.гггг' } = Astro.props;
  ---

  <div class="form-field date-picker" data-date-picker>
    <label id={`${id}-label`} class="field-label">
      {label}{optionalLabel && <span class="field-label-muted"> {optionalLabel}</span>}
    </label>

    <input id={id} name={name} type="hidden" data-date-value />

    <div class="date-control" data-custom-control-for={id}>
      <input
        type="text"
        class="date-display"
        placeholder={placeholder}
        inputmode="none"
        autocomplete="off"
        readonly
        aria-labelledby={`${id}-label`}
        data-date-display
      />
      <button type="button" class="date-icon-button" aria-label="Открыть календарь" data-date-toggle>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="4" y="5" width="16" height="15" rx="2"></rect>
          <line x1="8" y1="3" x2="8" y2="7"></line>
          <line x1="16" y1="3" x2="16" y2="7"></line>
          <line x1="4" y1="10" x2="20" y2="10"></line>
        </svg>
      </button>
    </div>

    <div class="calendar-popover" hidden data-calendar-popover>
      <div class="calendar-head">
        <button type="button" class="calendar-nav" aria-label="Предыдущий месяц" data-calendar-prev>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="10,3 5,8 10,13"></polyline>
          </svg>
        </button>
        <p class="calendar-title" data-calendar-title></p>
        <button type="button" class="calendar-nav" aria-label="Следующий месяц" data-calendar-next>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6,3 11,8 6,13"></polyline>
          </svg>
        </button>
      </div>
      <div class="calendar-weekdays" aria-hidden="true">
        <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
      </div>
      <div class="calendar-grid" data-calendar-grid></div>
    </div>
  </div>

  <style>
    .date-picker { position: relative; }

    .field-label {
      display: block;
      margin-bottom: 0.55rem;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-fg-muted);
    }

    .field-label-muted { color: var(--color-fg-subtle); }

    .date-control {
      width: 100%;
      min-height: 3.25rem;
      display: flex;
      align-items: center;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 62%, transparent);
      transition: border-color 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
    }

    .date-control:focus-within,
    .date-picker.is-open .date-control {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 18%, transparent);
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 82%, transparent);
    }

    .date-display {
      min-width: 0;
      flex: 1 1 auto;
      border: 0;
      background: transparent;
      color: var(--color-fg);
      padding: 0.9rem 0.25rem 0.9rem 1rem;
      font: inherit;
      font-size: 0.9375rem;
      line-height: 1.2;
      cursor: pointer;
    }

    .date-display:focus { outline: none; }
    .date-display::placeholder { color: var(--color-fg-subtle); }

    .date-icon-button {
      flex: 0 0 auto;
      width: 3rem;
      align-self: stretch;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-left: 1px solid color-mix(in srgb, var(--color-border) 75%, transparent);
      background: transparent;
      color: var(--color-fg-muted);
      transition: color 180ms ease, background-color 180ms ease;
    }

    .date-icon-button:hover,
    .date-icon-button:focus-visible {
      outline: none;
      color: var(--color-accent-dark);
      background: color-mix(in srgb, var(--color-accent) 10%, transparent);
    }

    .calendar-popover {
      position: absolute;
      z-index: 35;
      top: calc(100% + 0.5rem);
      right: 0;
      width: min(100%, 21rem);
      padding: 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: var(--color-surface, var(--color-bg));
      box-shadow: 0 20px 56px rgba(0, 0, 0, 0.12);
    }

    :global([data-theme="dark"]) .calendar-popover {
      box-shadow: 0 20px 56px rgba(0, 0, 0, 0.34);
    }

    .calendar-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.8rem;
    }

    .calendar-title {
      margin: 0;
      color: var(--color-fg);
      font-size: 0.9rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .calendar-nav {
      width: 2rem;
      height: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-border);
      border-radius: 999px;
      background: transparent;
      color: var(--color-fg-muted);
      transition: border-color 180ms ease, color 180ms ease, background-color 180ms ease;
    }

    .calendar-nav:hover,
    .calendar-nav:focus-visible {
      outline: none;
      border-color: var(--color-accent);
      color: var(--color-fg);
      background: color-mix(in srgb, var(--color-accent) 10%, transparent);
    }

    .calendar-weekdays,
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 0.25rem;
    }

    .calendar-weekdays {
      margin-bottom: 0.35rem;
      color: var(--color-fg-subtle);
      font-size: 0.67rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-align: center;
      text-transform: uppercase;
    }

    .calendar-day {
      aspect-ratio: 1;
      border: 1px solid transparent;
      border-radius: 999px;
      background: transparent;
      color: var(--color-fg-muted);
      font: inherit;
      font-size: 0.82rem;
      transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
    }

    .calendar-day:hover,
    .calendar-day:focus-visible {
      outline: none;
      border-color: var(--color-accent);
      color: var(--color-fg);
    }

    .calendar-day.is-today {
      border-color: color-mix(in srgb, var(--color-accent) 52%, transparent);
      color: var(--color-fg);
    }

    .calendar-day.is-selected {
      border-color: var(--color-accent);
      background: var(--color-accent);
      color: var(--color-bg-dark, #18181b);
    }

    .calendar-spacer { aspect-ratio: 1; }

    @media (max-width: 480px) {
      .calendar-popover { left: 0; right: 0; width: 100%; }
    }
  </style>

  <script>
    const MONTHS = [
      'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
      'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
    ];

    function padDatePart(value: number) { return String(value).padStart(2, '0'); }
    function toIsoDate(date: Date) { return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`; }
    function toDisplayDate(date: Date) { return `${padDatePart(date.getDate())}.${padDatePart(date.getMonth() + 1)}.${date.getFullYear()}`; }
    function sameDay(a: Date | null, b: Date) {
      return Boolean(a) && a!.getFullYear() === b.getFullYear() && a!.getMonth() === b.getMonth() && a!.getDate() === b.getDate();
    }

    function initDatePickers() {
      // Singleton outside-click: closes any open picker when clicking outside
      if (document.documentElement.dataset.datePickerOutsideBound !== 'true') {
        document.documentElement.dataset.datePickerOutsideBound = 'true';
        document.addEventListener('click', (event) => {
          document.querySelectorAll<HTMLElement>('[data-date-picker].is-open').forEach((openRoot) => {
            if (!openRoot.contains(event.target as Node)) {
              openRoot.classList.remove('is-open');
              const popover = openRoot.querySelector<HTMLElement>('[data-calendar-popover]');
              if (popover) popover.hidden = true;
            }
          });
        });
      }

      document.querySelectorAll<HTMLElement>('[data-date-picker]').forEach((root) => {
        if (root.dataset.dateReady === 'true') return;
        root.dataset.dateReady = 'true';

        const hiddenInput = root.querySelector<HTMLInputElement>('[data-date-value]');
        const displayInput = root.querySelector<HTMLInputElement>('[data-date-display]');
        const toggleButton = root.querySelector<HTMLButtonElement>('[data-date-toggle]');
        const popover = root.querySelector<HTMLElement>('[data-calendar-popover]');
        const title = root.querySelector<HTMLElement>('[data-calendar-title]');
        const grid = root.querySelector<HTMLElement>('[data-calendar-grid]');
        const prevButton = root.querySelector<HTMLButtonElement>('[data-calendar-prev]');
        const nextButton = root.querySelector<HTMLButtonElement>('[data-calendar-next]');
        if (!hiddenInput || !displayInput || !toggleButton || !popover || !title || !grid || !prevButton || !nextButton) return;

        const today = new Date();
        let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        let selectedDate: Date | null = null;

        const close = () => { root.classList.remove('is-open'); popover.hidden = true; };
        const open = () => { root.classList.add('is-open'); popover.hidden = false; };

        const render = () => {
          title.textContent = `${MONTHS[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;
          grid.textContent = '';
          const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
          const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
          const startOffset = (firstDay.getDay() + 6) % 7;
          for (let i = 0; i < startOffset; i++) {
            const spacer = document.createElement('span');
            spacer.className = 'calendar-spacer';
            grid.appendChild(spacer);
          }
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'calendar-day';
            button.textContent = String(day);
            button.setAttribute('aria-label', `Выбрать ${toDisplayDate(date)}`);
            if (sameDay(today, date)) button.classList.add('is-today');
            if (sameDay(selectedDate, date)) button.classList.add('is-selected');
            button.addEventListener('click', () => {
              selectedDate = date;
              hiddenInput.value = toIsoDate(date);
              displayInput.value = toDisplayDate(date);
              hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
              hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
              render();
              close();
              displayInput.focus();
            });
            grid.appendChild(button);
          }
        };

        render();
        displayInput.addEventListener('click', open);
        displayInput.addEventListener('focus', open);
        toggleButton.addEventListener('click', () => { popover.hidden ? open() : close(); displayInput.focus(); });
        prevButton.addEventListener('click', () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1); render(); });
        nextButton.addEventListener('click', () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1); render(); });
        root.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDatePickers, { once: true });
    } else {
      initDatePickers();
    }
    document.addEventListener('astro:page-load', initDatePickers);
  </script>
  ```

---

## Task 10: Create Icon.astro

**Files:**
- Create: `src/components/ui/Icon.astro`

- [ ] **Step 1: Create the file**

  ```astro
  ---
  interface Props {
    name: 'phone' | 'location' | 'telegram' | 'whatsapp' | 'instagram' | 'vk';
    size?: number;
    class?: string;
  }

  const { name, size = 18, class: className = '' } = Astro.props;
  ---

  <svg
    class={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    {name === 'phone' && (
      <path d="M6.6 4.8 8.5 3a1.7 1.7 0 0 1 2.7.45l1.05 2.34a1.8 1.8 0 0 1-.42 2l-1.1 1.1a11.6 11.6 0 0 0 4.38 4.38l1.1-1.1a1.8 1.8 0 0 1 2-.42l2.34 1.05A1.7 1.7 0 0 1 21 15.5l-1.8 1.9c-.86.9-2.15 1.25-3.36.9A18.2 18.2 0 0 1 5.7 8.16c-.35-1.21 0-2.5.9-3.36Z" />
    )}
    {name === 'location' && (
      <>
        <path d="M19 10.2c0 5.2-7 10.8-7 10.8S5 15.4 5 10.2a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10.2" r="2.2" />
      </>
    )}
    {name === 'telegram' && (
      <>
        <path d="M21 4.5 3.7 11.2c-1.1.43-1.1 1.05-.2 1.32l4.44 1.38 1.7 5.18c.2.57.48.7.98.22l2.45-2.34 4.98 3.68c.92.5 1.58.24 1.8-.86L23 5.62c.3-1.2-.45-1.73-2-1.12Z" />
        <path d="m8.1 13.8 10.74-6.78" />
      </>
    )}
    {name === 'whatsapp' && (
      <>
        <path d="M20.15 11.75a8.15 8.15 0 0 1-11.82 7.28L4 20.15l1.16-4.2a8.16 8.16 0 1 1 14.99-4.2Z" />
        <path d="M9.35 8.5c.18-.38.32-.42.66-.42h.46c.15 0 .36.03.54.44l.74 1.78c.08.2.1.36-.04.56l-.54.7c-.13.16-.18.34-.07.54.32.6.82 1.28 1.46 1.88.67.62 1.44 1.08 2.13 1.36.22.1.4.04.56-.13l.66-.75c.18-.2.36-.25.6-.16l1.84.84c.36.16.42.34.42.54v.4c0 .72-.78 1.46-1.48 1.63-1.18.3-2.9-.12-5.08-2.05-2.28-2.02-3.2-4.1-3.18-5.58.01-.78.22-1.27.36-1.58Z" />
      </>
    )}
    {name === 'instagram' && (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.25" />
        <circle cx="17" cy="7" r="0.65" fill="currentColor" stroke="none" />
      </>
    )}
    {name === 'vk' && (
      <path d="M4.3 7.5h2.95c.16 0 .3.1.36.25.58 1.5 1.36 2.84 2.2 3.72.26.28.72.1.72-.28V7.98c0-.28.22-.5.5-.5h2.4c.28 0 .5.22.5.5v3.02c0 .4.5.58.76.28.76-.9 1.48-2.2 2.05-3.5a.5.5 0 0 1 .46-.3h2.7c.38 0 .62.4.44.73-.74 1.42-1.55 2.62-2.45 3.62a.7.7 0 0 0 .02.96 24.3 24.3 0 0 1 2.9 3.45c.22.33-.02.77-.42.77h-2.95a.8.8 0 0 1-.6-.27c-.65-.72-1.33-1.37-2.04-1.96-.33-.28-.84-.04-.84.4v1.33c0 .28-.22.5-.5.5h-1.08c-3.76 0-6.68-2.9-8.52-8.78a.56.56 0 0 1 .53-.73Z" />
    )}
  </svg>
  ```

---

## Task 11: Refactor ContactSection.astro (full replacement)

**Files:**
- Modify: `src/components/sections/ContactSection.astro`

The form script is wrapped in `initContactForm()` with a `data-formReady` guard and re-initialised on `astro:page-load` to survive View Transitions.

- [ ] **Step 1: Replace the entire ContactSection.astro content**

  ```astro
  ---
  import Button from '../ui/Button.astro';
  import TextField from '../ui/TextField.astro';
  import PhoneField from '../ui/PhoneField.astro';
  import DatePicker from '../ui/DatePicker.astro';
  import CustomSelect from '../ui/CustomSelect.astro';
  import TextareaField from '../ui/TextareaField.astro';
  import Icon from '../ui/Icon.astro';
  import { siteConfig } from '../../config/site';

  const projectTypes = [
    { value: 'consulting', label: 'Консультация' },
    { value: 'development', label: 'Разработка' },
    { value: 'support', label: 'Сопровождение' },
    { value: 'other', label: 'Другое' },
  ];
  ---

  <section id="contacts" class="section-padding bg-[var(--color-bg)]">
    <div class="container-site">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <!-- Left -->
        <div>
          <span class="label-tag reveal">Контакты</span>
          <div class="divider my-4 reveal reveal-delay-1"></div>
          <h2 class="mt-6 mb-6 reveal reveal-delay-2" style="font-size: clamp(1.5rem, 3.5vw, 2.75rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.15;">
            Оставьте заявку
          </h2>
          <p class="text-[var(--color-fg-muted)] text-base leading-relaxed mb-10 reveal reveal-delay-3">
            Расскажите о своей задаче. Мы ответим в течение рабочего дня и предложим удобный формат первой встречи.
          </p>

          <div class="contact-direct reveal reveal-delay-4">
            <h3 class="contact-direct-title">Связаться напрямую</h3>
            <div class="contact-direct-list">
              <a href={`tel:${siteConfig.contacts.phone.replace(/[\s\-()]/g, '')}`} class="contact-direct-link">
                <span class="contact-direct-icon"><Icon name="phone" /></span>
                <span>{siteConfig.contacts.phone}</span>
              </a>
              <a href={`mailto:${siteConfig.contacts.email}`} class="contact-direct-link">
                <span class="contact-direct-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="2,4 12,13 22,4"/>
                  </svg>
                </span>
                <span>{siteConfig.contacts.email}</span>
              </a>
            </div>
            <div class="contact-socials" aria-label="Социальные сети и мессенджеры">
              {siteConfig.contacts.telegram && siteConfig.contacts.telegram !== '#' && (
                <a href={siteConfig.contacts.telegram} class="contact-social-link" aria-label="Telegram" target="_blank" rel="noreferrer"><Icon name="telegram" /></a>
              )}
              {siteConfig.contacts.whatsapp && siteConfig.contacts.whatsapp !== '#' && (
                <a href={siteConfig.contacts.whatsapp} class="contact-social-link" aria-label="WhatsApp" target="_blank" rel="noreferrer"><Icon name="whatsapp" /></a>
              )}
              {siteConfig.contacts.instagram && siteConfig.contacts.instagram !== '#' && (
                <a href={siteConfig.contacts.instagram} class="contact-social-link" aria-label="Instagram" target="_blank" rel="noreferrer"><Icon name="instagram" /></a>
              )}
              {siteConfig.contacts.vk && siteConfig.contacts.vk !== '#' && (
                <a href={siteConfig.contacts.vk} class="contact-social-link" aria-label="VK" target="_blank" rel="noreferrer"><Icon name="vk" /></a>
              )}
            </div>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="reveal reveal-delay-2">
          <form id="contact-form" class="flex flex-col gap-5" novalidate>
            <TextField id="field-name" name="name" label="Имя" autocomplete="name" required placeholder="Ваше имя" error="Пожалуйста, укажите ваше имя" />
            <PhoneField id="field-phone" name="phone" label="Телефон" required error="Пожалуйста, укажите ваш телефон" />
            <TextField id="field-email" name="email" label="Email" type="email" autocomplete="email" placeholder="your@email.com" />
            <CustomSelect id="field-type" name="project_type" label="Тип проекта" placeholder="Выберите направление" options={projectTypes} required error="Пожалуйста, выберите тип проекта" />
            <DatePicker id="field-date" name="preferred_date" label="Предпочтительная дата" optionalLabel="(опционально)" />
            <TextareaField id="field-comment" name="comment" label="Комментарий" rows={4} placeholder="Расскажите о задаче, пожеланиях и сроках..." />

            <!-- Privacy -->
            <div class="flex items-start gap-3">
              <div class="relative mt-0.5 shrink-0">
                <input
                  id="field-privacy"
                  name="privacy"
                  type="checkbox"
                  required
                  class="w-4 h-4 appearance-none border border-[var(--color-border)] bg-transparent checked:bg-[var(--color-fg)] checked:border-[var(--color-fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] cursor-pointer transition-colors duration-200"
                />
                <svg class="absolute inset-0 w-4 h-4 pointer-events-none opacity-0 privacy-check" viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="2" aria-hidden="true">
                  <polyline points="3,8 6,11 13,4"/>
                </svg>
              </div>
              <label for="field-privacy" class="text-xs text-[var(--color-fg-muted)] leading-relaxed cursor-pointer">
                Я согласен(а) с <a href="/privacy" class="underline hover:text-[var(--color-fg)] transition-colors duration-200">политикой конфиденциальности</a>
              </label>
            </div>
            <p id="privacy-error" class="hidden text-xs text-red-500 -mt-3">Необходимо ваше согласие</p>

            <Button type="submit" variant="submit" size="lg" fullWidth={true} id="submit-btn" class="mt-2">
              <span id="btn-text">Отправить заявку</span>
              <svg id="btn-spinner" class="hidden w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 10 10" stroke-linecap="round"/>
              </svg>
            </Button>
          </form>

          <!-- Success state -->
          <div id="form-success" class="hidden flex-col items-start gap-4 p-10 bg-[var(--color-bg-warm)] border border-[var(--color-border)]">
            <div class="w-10 h-10 border border-[var(--color-accent)] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--color-accent)" stroke-width="1.5">
                <polyline points="2,8 6,12 14,4"/>
              </svg>
            </div>
            <h3 class="text-lg font-light tracking-tight">Заявка принята</h3>
            <p class="text-[var(--color-fg-muted)] text-sm leading-relaxed">
              Мы свяжемся с вами в ближайшее время. Обычно отвечаем в течение одного рабочего дня.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <style>
    .contact-direct {
      max-width: 28rem;
      padding: 1.25rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: color-mix(in srgb, var(--color-surface, var(--color-bg)) 70%, transparent);
    }

    .contact-direct-title {
      margin: 0 0 1rem;
      font-size: 1.1rem;
      font-weight: 400;
      color: var(--color-fg);
    }

    .contact-direct-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .contact-direct-link {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      width: fit-content;
      color: var(--color-fg-muted);
      font-size: 0.92rem;
      line-height: 1.45;
      transition: color 180ms ease;
    }

    .contact-direct-link:hover,
    .contact-direct-link:focus-visible {
      outline: none;
      color: var(--color-accent-dark);
    }

    :global([data-theme="dark"]) .contact-direct-link:hover,
    :global([data-theme="dark"]) .contact-direct-link:focus-visible {
      color: var(--color-accent);
    }

    .contact-direct-icon {
      flex: 0 0 auto;
      width: 2rem;
      height: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in srgb, var(--color-accent) 34%, var(--color-border));
      border-radius: 999px;
      color: var(--color-accent-dark);
    }

    :global([data-theme="dark"]) .contact-direct-icon { color: var(--color-accent); }

    .contact-socials {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-top: 1.15rem;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }

    .contact-social-link {
      width: 2.45rem;
      height: 2.45rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-border);
      border-radius: 999px;
      color: var(--color-fg-muted);
      transition: border-color 180ms ease, color 180ms ease, background-color 180ms ease;
    }

    .contact-social-link:hover,
    .contact-social-link:focus-visible {
      outline: none;
      border-color: var(--color-accent);
      color: var(--color-accent-dark);
      background: color-mix(in srgb, var(--color-accent) 10%, transparent);
    }

    :global([data-theme="dark"]) .contact-social-link:hover,
    :global([data-theme="dark"]) .contact-social-link:focus-visible {
      color: var(--color-accent);
    }
  </style>

  <script>
    function initContactForm() {
      const form = document.getElementById('contact-form') as HTMLFormElement | null;
      if (!form) return;
      if (form.dataset.formReady === 'true') return;
      form.dataset.formReady = 'true';

      const successEl = document.getElementById('form-success');
      const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null;
      const btnText = document.getElementById('btn-text');
      const btnSpinner = document.getElementById('btn-spinner');
      const privacyError = document.getElementById('privacy-error');
      const privacyCheck = document.getElementById('field-privacy') as HTMLInputElement | null;
      if (!privacyCheck) return;

      privacyCheck.addEventListener('change', () => {
        const checkmark = privacyCheck.nextElementSibling as SVGElement;
        if (checkmark) checkmark.style.opacity = privacyCheck.checked ? '1' : '0';
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let valid = true;

        form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]').forEach((field) => {
          const errorEl = field.closest('.form-field')?.querySelector('.field-error') as HTMLElement | null;
          const controlEl = form.querySelector<HTMLElement>(`[data-custom-control-for="${field.id}"]`);
          const isEmpty = !field.value.trim() || (field.tagName === 'SELECT' && !field.value);
          if (isEmpty) {
            valid = false;
            if (controlEl) (controlEl as HTMLElement).style.borderColor = '#ef4444';
            else (field as HTMLElement).style.borderColor = '#ef4444';
            if (errorEl) errorEl.classList.remove('hidden');
          } else {
            if (controlEl) (controlEl as HTMLElement).style.borderColor = '';
            else (field as HTMLElement).style.borderColor = '';
            if (errorEl) errorEl.classList.add('hidden');
          }
        });

        if (!privacyCheck.checked) {
          valid = false;
          privacyError?.classList.remove('hidden');
        } else {
          privacyError?.classList.add('hidden');
        }

        if (!valid) return;

        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Отправка...';
        btnSpinner?.classList.remove('hidden');

        await new Promise((r) => setTimeout(r, 1500));

        form.style.display = 'none';
        if (successEl) {
          successEl.classList.remove('hidden');
          successEl.classList.add('flex');
        }
      });

      form.querySelectorAll('input, select, textarea').forEach((field) => {
        field.addEventListener('input', () => {
          (field as HTMLElement).style.borderColor = '';
          const controlEl = form.querySelector<HTMLElement>(`[data-custom-control-for="${(field as HTMLInputElement).id}"]`);
          if (controlEl) controlEl.style.borderColor = '';
          const errorEl = field.closest('.form-field')?.querySelector('.field-error') as HTMLElement | null;
          if (errorEl) errorEl.classList.add('hidden');
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initContactForm, { once: true });
    } else {
      initContactForm();
    }
    document.addEventListener('astro:page-load', initContactForm);
  </script>
  ```

---

## Task 12: Update README

**Files:**
- Modify: `README.md` (astro-business-starter root)

- [ ] **Step 1: Add UI Components section**

  Open the README and add the following section (after existing content or in an appropriate location):

  ```markdown
  ## UI Components

  Generic form and UI components live in `src/components/ui/`.

  | Component | Purpose |
  |-----------|---------|
  | `TextField` | Styled text or email input |
  | `TextareaField` | Styled textarea |
  | `SelectField` | Native styled select (no JS required) |
  | `CustomSelect` | Custom dropdown with keyboard navigation |
  | `PhoneField` | Phone input with +7 Russian format mask |
  | `DatePicker` | Calendar date picker popover |
  | `Icon` | SVG icon component (phone, location, telegram, whatsapp, instagram, vk) |

  ### Theme switcher

  Theme preference is stored in `localStorage` under the key `starter-theme`. When forking for a new project, update this key in two places:
  - `src/layouts/BaseLayout.astro` — the `astro:after-swap` handler (search `starter-theme`)
  - `src/components/layout/Header.astro` — the `STORAGE_KEY` constant

  ### PhoneField mask

  `PhoneField.astro` uses a `+7 (___) ___-__-__` mask as a Russian-format example. Replace the mask logic in the component's `<script>` block for other locales.
  ```

---

## Task 13: Run checks and verify

**Files:** none — verification only

- [ ] **Step 1: Type check**

  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && npm run check
  ```
  Expected: 0 errors.

- [ ] **Step 2: Build**

  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && npm run build
  ```
  Expected: build succeeds, no errors.

- [ ] **Step 3: Pre-completion grep — confirm no flovers artefacts**

  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter"
  grep -r "flovers-theme" src/ && echo "FOUND - fix needed" || echo "OK"
  grep -r "flovers" src/ --include="*.ts" --include="*.astro" && echo "FOUND - fix needed" || echo "OK"
  grep -r "e9a8c7\|8a2f48\|Bodoni\|bouquet\|флорист" src/ && echo "FOUND - fix needed" || echo "OK"
  ```
  Expected: all three `OK`.

- [ ] **Step 4: Git status**

  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && git status && git diff --stat
  ```
  Expected: modified/created files match the file map. No unexpected changes.

---

## Self-Review

**Spec + feedback coverage:**

| Requirement | Covered by |
|---|---|
| Theme key `starter-theme` | Tasks 1, 2 |
| `astro:before-swap` / `astro:after-swap` reveal lifecycle, 520+280ms verbatim from flovers | Task 1 |
| `data-*-bound` guards on Header, all DOM lookups via `getElementById` inside functions | Task 2 |
| Active state CSS fix for theme menu | Task 2 |
| Add `vk` to siteConfig | Task 3 |
| TextField, TextareaField, SelectField | Tasks 4–6 |
| CustomSelect: singleton outside-click via `data-customSelectOutsideBound` | Task 7 |
| PhoneField: `data-maskReady` guard, correct backspace via `beforeinput` | Task 8 |
| DatePicker: singleton outside-click via `data-datePickerOutsideBound` | Task 9 |
| Icon.astro with `vk` | Task 10 |
| ContactSection: `initContactForm()` + `data-formReady` guard + `astro:page-load` reinit | Task 11 |
| Social icons rendered only when value is not `'#'` placeholder | Task 11 |
| No flovers colours, keys, or branding | Task 13 step 3 |
| No commit/push | Task 13 step 4 (git status only) |
| PhoneField README note | Task 12 |

**Placeholder scan:** None — all code blocks complete.

**Type consistency:** `ThemePreference` defined once, used throughout. `initHeaderChrome` calls three init functions — consistent. `data-custom-control-for` set in CustomSelect/DatePicker templates, read in ContactSection script — consistent. `data-formReady` guard in ContactSection, `data-selectReady` in CustomSelect, `data-dateReady` in DatePicker, `data-maskReady` in PhoneField — all consistent.
