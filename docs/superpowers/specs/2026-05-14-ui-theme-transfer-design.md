# UI & Theme Transfer: flovers-site → astro-business-starter + form-light-site

**Date:** 2026-05-14  
**Source:** `/Users/utopo4ek/Projects/Portfolio land/flovers-site`  
**Targets:**
- `/Users/utopo4ek/Projects/Portfolio land/astro-business-starter`
- `/Users/utopo4ek/Projects/Portfolio land/form-light-site`

---

## 1. Motivation

flovers-site has evolved a more mature implementation of three systems that the other two projects share but have at an earlier revision:

1. **Theme switcher** — astro:before-swap / astro:after-swap lifecycle, data-*-bound guards preventing duplicate listeners
2. **Reveal animation system** — IntersectionObserver lifecycle management (disconnect on before-swap, delayed re-init on after-swap)
3. **Reusable form UI components** — CustomSelect, PhoneField, DatePicker, TextField, TextareaField, SelectField, Icon with JS re-init guards

---

## 2. What Does NOT Transfer

| Artefact | Reason |
|---|---|
| FLOVERS colours (`#e9a8c7` pink, `#8a2f48` burgundy, `--font-display: Bodoni Moda`) | Branded identity |
| Contact data, bouquet data, catalog/product pages | FLOVERS-specific content |
| `orderTypes` options (готовый букет, свадебная флористика…) | FLOVERS domain data |
| Social link hardcoded URLs from flovers siteConfig | Wrong brand |
| `BouquetCard`, `Breadcrumbs`, floral section components | FLOVERS-specific |
| `flovers-theme` localStorage key | Must not appear in target projects |

---

## 3. Theme System

### 3.1 Key names (unchanged — already correct)
- `astro-business-starter` → `starter-theme`
- `form-light-site` → `form-light-theme`

### 3.2 BaseLayout inline script (anti-flash)
Both targets already have the correct inline script. No changes needed here.

### 3.3 BaseLayout `<script>` — Reveal lifecycle fix

**Current state (both targets):**  
Simple `initReveal()` called on `astro:page-load`. Creates new IntersectionObservers every navigation without disconnecting old ones. No before-swap / after-swap handling.

**Target state:**  
Transfer flovers pattern verbatim, adapting only the theme key in the `astro:after-swap` handler.

- Module-level `revealObserver`, `legacyRevealObserver`, `revealAfterTransition` flag, `revealTimer`, `revealFrame`
- `astro:before-swap`: disconnect observers, cancel timers, reset `el.dataset.revealBound` (≡ DOM `data-reveal-bound`) on pending elements, set `revealAfterTransition = true`
- `astro:after-swap`: restore `.js` class + `data-theme` / `data-themePreference` using the project-specific localStorage key; if `revealAfterTransition` is set, schedule `initRevealAfterViewTransition` via `setTimeout(..., 520)`
- `initRevealAfterViewTransition`: clears `revealAfterTransition` flag, schedules `runReveal` via `setTimeout(..., 280)` — total ~800ms after swap
- **Why 800ms:** View Transition fade-in animation runs for ~380ms (80ms delay + 380ms duration per CSS). 800ms total gives new page content time to paint before reveal triggers, preventing visual collision between VT and scroll-reveal animations. This delay is intentional and correct.
- `runReveal`: respects `prefers-reduced-motion`, checks `data-revealBound` guard to skip already-observed elements, handles both `[data-reveal]` and legacy `.reveal` selectors
- `DOMContentLoaded` + `astro:page-load` + immediate `initReveal()` call for first load

**dataset naming:** In JS, `el.dataset.revealBound` reads/writes the DOM attribute `data-reveal-bound`. This camelCase ↔ kebab-case mapping is standard. No naming inconsistency.

**Preserve:** existing `data-reveal` variant classes (`up`, `left`, `right`, `scale`, `clip`, `fade`) and CSS are identical in both targets — no CSS changes needed.

### 3.4 Header.astro — Theme switcher JS guards

**Current state (both targets):**  
`initThemeListeners()` adds new event listeners every `astro:page-load` call. No `data-*-bound` guards. The module-scope variables (`header`, `burgerBtn`, `closeBtn`, `mobileMenu`) are captured once at module init — after View Transition swap they reference stale DOM nodes.

**Target state:**  
Adopt flovers pattern:
- `initHeaderState()` with `data-headerScrollBound` guard on `documentElement`
- `initMobileMenu()` with `data-menuBound` guard on each button
- `initThemeSwitcher()` with `data-themeBound` guard on each interactive element
- `data-themeOutsideBound`, `data-themeOsBound`, `data-headerPageLoadBound`, `data-mobileMenuKeyBound` guards
- All functions re-run after `astro:page-load` safely — guards prevent double-binding
- Theme key: `starter-theme` / `form-light-theme` respectively

---

## 4. UI Components

Seven components transfer to both projects. All go in `src/components/ui/`.

### 4.1 Focus ring colour

flovers-site uses hardcoded `rgba(233, 168, 199, 0.18)` — a FLOVERS pink.  
**Replacement for all transferred components:**
```css
color-mix(in srgb, var(--color-accent) 18%, transparent)
```
If visually weak in a project, raise to 22–26% — still no hardcoded colour.

### 4.2 Component inventory

| File | Props | JS guard |
|---|---|---|
| `TextField.astro` | id, name, label, type?, placeholder?, autocomplete?, required?, error? | none (no JS) |
| `TextareaField.astro` | id, name, label, placeholder?, rows? | none (no JS) |
| `SelectField.astro` | id, name, label, placeholder, options[], required?, error? | none (no JS) |
| `CustomSelect.astro` | id, name, label, placeholder, options[], required?, error? | `data-selectReady` |
| `PhoneField.astro` | id, name, label, placeholder?, required?, error? | `data-maskReady` |
| `DatePicker.astro` | id, name, label, optionalLabel?, placeholder? | `data-dateReady` |
| `Icon.astro` | name (phone\|location\|telegram\|whatsapp\|instagram\|vk), size?, class? | none (no JS) |

All JS-initialised components handle `astro:page-load` reinit.

### 4.3 `Icon.astro` usage

- Icon.astro transfers as a generic SVG component — it contains no FLOVERS-specific content, only icon shapes
- In ContactSection usage, social links come exclusively from `siteConfig.contacts`
- No hardcoded flovers URLs anywhere

### 4.4 `CustomSelect.astro` — form submit correctness

Critical: CustomSelect uses a `<input type="hidden">` with the given `name` prop. The trigger button is cosmetic; form submission uses the hidden input value. Checklist:

- Hidden input `name` = prop `name` ✓
- `selectOption()` sets `input.value` and dispatches `input` + `change` events ✓
- `required` prop is set on the hidden input ✓
- Validation in ContactSection checks hidden input value (non-empty string) ✓

---

## 5. astro-business-starter: ContactSection refactor

Full refactor — this is a demo/starter form.

**Fields:**
1. `TextField` — name (required)
2. `PhoneField` — phone (required, +7 mask)
3. `TextField` — email (optional, type="email")
4. `CustomSelect` — project type (required); options: Консультация / Разработка / Сопровождение / Другое
5. `DatePicker` — preferred date (optional)
6. `TextareaField` — comment

**Left column:** phone + email + address from `siteConfig.contacts`, social icons via `Icon.astro` from `siteConfig.contacts`

**Form validation script:**  
Updated to handle `data-custom-control-for` (CustomSelect trigger element) and hidden input validation (DatePicker).

**PhoneField note for README:**  
The current mask (`+7 (___) ___-__-__`) is a Russian-format example. Add a note to README that the mask is illustrative and can be replaced per project.

---

## 6. form-light-site: ContactSection selective update

Careful update — preserve FORM & LIGHT visual identity and form intent.

**Changes:**
- `<input type="tel">` → `PhoneField` (adds +7 mask, `data-maskReady` guard)
- `<select>` (native) → `CustomSelect` (keyboard nav, consistent styling); options unchanged: Дом / Интерьер / Поселок / Другое
- `<input type="text">` for name → `TextField` component
- `<textarea>` → `TextareaField` component

**No changes to:**
- Form heading ("Оставьте заявку"), descriptive text, privacy checkbox
- Left column layout (ТЕЛ / МАЙ / АДР contact info)
- Success state markup

**DatePicker:** Added to `src/components/ui/` as a reusable component, but NOT used in ContactSection.

**Form validation script:**  
Updated for `data-custom-control-for` support.

---

## 7. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| `color-mix` not in target projects' existing CSS | Safe — Tailwind 4 projects, Safari 15.4+ baseline |
| Astro scoped CSS + `:global([data-theme="dark"])` in components | Transferred as-is — this pattern works correctly |
| Duplicate listeners if page-load fires multiple times | `data-*-bound` guards on all elements prevent this |
| Reveal re-bind on already-visible elements | `data-revealBound` guard + `.is-visible` selector exclusion |
| `flovers-theme` key leaking into targets | Final grep across both target trees before declaring done |
| form-light visual identity broken | Only field components replaced; all text, layout, colours unchanged |

---

## 8. Verification Checklist

Each target project, after changes:

```
npm run check
npm run build
git status
git diff --stat
```

**Pre-completion grep (both targets):**

```
grep -r "flovers-theme" src/
grep -r "flovers" src/ --include="*.ts" --include="*.astro"
grep -r "e9a8c7\|8a2f48\|Bodoni\|bouquet\|флорист" src/
```

Manual browser checks:
- First load — no theme flash
- light / dark / system switching
- Theme switcher active state reflects preference not resolved theme
- Theme persists after page navigation (View Transition)
- No duplicate event handlers (test: switch theme, navigate, switch again)
- Form: all fields, validation, submit, success state
- PhoneField: type, delete, paste, mobile inputmode
- CustomSelect: open, keyboard nav, click-outside, Escape
- DatePicker (starter): open, navigate months, select, close, click-outside
- Mobile 390px layout
- Dark theme all form fields

---

## 9. No Commit / Push

Changes will not be committed or pushed without explicit user confirmation.
