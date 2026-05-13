# FLOVERS Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium flower shop presentation website (FLOVERS) by adapting `astro-business-starter` into a fully branded Astro site with home page, catalog, and bouquet detail pages.

**Architecture:** Copy the starter via rsync (read-only source), then replace all starter content and palette with the FLOVERS brand — dark green + burgundy dark theme, cream + dusty-rose light theme, Cormorant Garamond headings, portrait bouquet cards, inline-JS catalog filters, and a 2-column bouquet detail page.

**Tech Stack:** Astro 6, Tailwind v4 (via `@tailwindcss/vite`), TypeScript, Google Fonts (Cormorant Garamond + Inter), Unsplash remote images.

---

## File Map

**Create (new files):**
- `src/data/bouquets.ts` — bouquet data + helper functions
- `src/components/ui/BouquetCard.astro` — portrait card component
- `src/components/ui/Breadcrumbs.astro` — breadcrumbs component
- `src/components/sections/MissionSection.astro` — about/mission section
- `src/components/sections/BestsellersSection.astro` — bestsellers grid
- `src/components/sections/DeliverySteps.astro` — how-it-works steps
- `src/components/sections/CustomBouquetCta.astro` — photo bg CTA
- `src/components/sections/FaqSection.astro` — native details/summary FAQ
- `src/pages/catalog/index.astro` — catalog page with filters
- `src/pages/catalog/[slug].astro` — bouquet detail page

**Modify (existing files):**
- `src/styles/global.css` — replace color palette with FLOVERS tokens
- `src/layouts/BaseLayout.astro` — add Cormorant Garamond font, change theme key
- `src/config/site.ts` — replace with FLOVERS config
- `src/components/layout/Header.astro` — change theme key `starter-theme` → `flovers-theme`
- `src/components/layout/Footer.astro` — adapt copy for FLOVERS
- `src/components/sections/Hero.astro` — full rewrite for FLOVERS hero
- `src/components/sections/ContactSection.astro` — update fields and copy
- `src/pages/index.astro` — rewire all sections
- `package.json` — update name/description
- `astro.config.mjs` — update site URL
- `README.md` — rewrite for FLOVERS

**Delete:**
- `src/data/items.ts`
- `src/data/team.ts`
- `src/data/process.ts`
- `src/pages/items/` (entire directory)
- `src/components/sections/Team.astro`
- `src/components/sections/Services.astro`
- `src/components/sections/Process.astro`
- `src/components/sections/About.astro`
- `src/components/sections/CtaSection.astro`

---

## Task 1: Create project from starter

**Files:**
- Create: `/Users/utopo4ek/Projects/Portfolio land/flovers-site/` (entire project)

- [ ] **Step 1.1: Verify source exists and target is safe**

```bash
# Verify source exists
test -d "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src" && echo "source exists" || echo "ERROR: source missing"

# Verify target is empty (safe to proceed)
if [ -e "/Users/utopo4ek/Projects/Portfolio land/flovers-site" ] && [ "$(ls -A '/Users/utopo4ek/Projects/Portfolio land/flovers-site' 2>/dev/null)" ]; then
  echo "ERROR: target is not empty — stop, do not overwrite"
  exit 1
else
  echo "target is free — safe to proceed"
fi
```

Expected: "source exists" and "target is free". If "ERROR: target is not empty" — STOP and report, do NOT rsync.

- [ ] **Step 1.2: Copy starter via rsync**

```bash
rsync -a \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.astro' \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='.env.local' \
  --exclude='.DS_Store' \
  "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/" \
  "/Users/utopo4ek/Projects/Portfolio land/flovers-site/"
```

Expected: exits 0, no errors.

- [ ] **Step 1.3: Verify source untouched**

```bash
ls "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src"
```

Expected: same files as before — `config/`, `components/`, `data/`, `layouts/`, `pages/`, `styles/`.

- [ ] **Step 1.4: Verify target has expected structure**

```bash
ls "/Users/utopo4ek/Projects/Portfolio land/flovers-site/src"
```

Expected: `components/`, `config/`, `data/`, `layouts/`, `pages/`, `styles/`.

- [ ] **Step 1.5: Git init and remote**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site"
git init
git branch -M main
git remote add origin git@github-personal:ut0po4ek/flovers-site.git
git remote -v
git config user.name
git config user.email
```

Expected: remote shows `git@github-personal:ut0po4ek/flovers-site.git` for fetch and push; `user.name = ut0po4ek`; `user.email = utopo4ek@mail.ru`.

---

## Task 2: Update package.json and astro.config.mjs

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`

- [ ] **Step 2.1: Update package.json name and description**

In `package.json`, replace:
```json
"name": "astro-business-starter",
"description": "Reusable Astro starter for modern business websites",
```
With:
```json
"name": "flovers-site",
"description": "FLOVERS — premium flower shop website built with Astro",
```

- [ ] **Step 2.2: Verify astro.config.mjs (no change needed)**

```bash
cat "/Users/utopo4ek/Projects/Portfolio land/flovers-site/astro.config.mjs"
```

Expected: `site: 'https://example.com'` — keep as is. Do NOT add `base`.

- [ ] **Step 2.3: Install dependencies**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site" && npm install
```

Expected: exits 0, `node_modules/` created.

---

## Task 3: Replace color palette in global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 3.1: Replace `:root` / `[data-theme="light"]` tokens**

In `src/styles/global.css`, replace the entire `:root, [data-theme="light"]` block:

```css
:root,
[data-theme="light"] {
  --color-bg:          #fbf6f1;
  --color-bg-warm:     #f3e8e1;
  --color-bg-dark:     #261818;
  --color-surface:     #fffaf6;
  --color-fg:          #261818;
  --color-fg-muted:    rgba(38, 24, 24, 0.68);
  --color-fg-subtle:   rgba(38, 24, 24, 0.45);
  --color-accent:      #e9a8c7;
  --color-accent-dark: #8a2f48;
  --color-border:      rgba(80, 45, 45, 0.14);
  --color-border-dark: rgba(38, 24, 24, 0.20);

  --ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-inout: cubic-bezier(0.4, 0, 0.2, 1);

  --btn-primary-bg:           #261818;
  --btn-primary-text:         #fffaf6;
  --btn-primary-border:       #261818;
  --btn-primary-hover-bg:     #4a2828;
  --btn-primary-hover-text:   #fffaf6;
  --btn-primary-hover-border: #4a2828;

  --btn-secondary-bg:           transparent;
  --btn-secondary-text:         #261818;
  --btn-secondary-border:       rgba(38, 24, 24, 0.30);
  --btn-secondary-hover-bg:     rgba(38, 24, 24, 0.06);
  --btn-secondary-hover-text:   #261818;
  --btn-secondary-hover-border: rgba(38, 24, 24, 0.55);

  --btn-accent-bg:           #e9a8c7;
  --btn-accent-text:         #261818;
  --btn-accent-border:       #e9a8c7;
  --btn-accent-hover-bg:     #d990b4;
  --btn-accent-hover-text:   #261818;
  --btn-accent-hover-border: #d990b4;

  --btn-ghost-bg:           transparent;
  --btn-ghost-text:         rgba(38, 24, 24, 0.55);
  --btn-ghost-border:       transparent;
  --btn-ghost-hover-bg:     rgba(38, 24, 24, 0.05);
  --btn-ghost-hover-text:   #261818;
  --btn-ghost-hover-border: transparent;

  --glass-hero-bg:       rgba(12, 20, 15, 0.60);
  --glass-hero-border:   rgba(255, 255, 255, 0.08);
  --glass-hero-text:     rgba(255, 244, 238, 0.92);
  --glass-hero-text-m:   rgba(255, 244, 238, 0.58);
  --glass-hero-cta-bd:   rgba(244, 179, 210, 0.45);
  --glass-scroll-bg:     rgba(251, 246, 241, 0.90);
  --glass-scroll-border: rgba(38, 24, 24, 0.10);
  --glass-scroll-text:   rgba(38, 24, 24, 0.88);
  --glass-scroll-text-m: rgba(38, 24, 24, 0.55);
  --glass-scroll-cta-bd: rgba(38, 24, 24, 0.35);
}
```

- [ ] **Step 3.2: Replace `[data-theme="dark"]` tokens**

Replace the entire `[data-theme="dark"]` block:

```css
[data-theme="dark"] {
  --color-bg:          #101915;
  --color-bg-warm:     #5a1f32;
  --color-bg-dark:     #080e0a;
  --color-surface:     #16221d;
  --color-fg:          #fff4ee;
  --color-fg-muted:    rgba(255, 244, 238, 0.72);
  --color-fg-subtle:   rgba(255, 244, 238, 0.48);
  --color-accent:      #f4b3d2;
  --color-accent-dark: #b94d6a;
  --color-border:      rgba(255, 244, 238, 0.16);
  --color-border-dark: rgba(255, 244, 238, 0.10);

  --btn-primary-bg:           #f4b3d2;
  --btn-primary-text:         #321221;
  --btn-primary-border:       #f4b3d2;
  --btn-primary-hover-bg:     #f9cfe3;
  --btn-primary-hover-text:   #321221;
  --btn-primary-hover-border: #f9cfe3;

  --btn-secondary-bg:           rgba(255, 244, 238, 0.06);
  --btn-secondary-text:         #fff4ee;
  --btn-secondary-border:       rgba(255, 244, 238, 0.28);
  --btn-secondary-hover-bg:     rgba(255, 244, 238, 0.12);
  --btn-secondary-hover-text:   #fff4ee;
  --btn-secondary-hover-border: rgba(255, 244, 238, 0.45);

  --btn-accent-bg:           #f4b3d2;
  --btn-accent-text:         #321221;
  --btn-accent-border:       #f4b3d2;
  --btn-accent-hover-bg:     #f9cfe3;
  --btn-accent-hover-text:   #321221;
  --btn-accent-hover-border: #f9cfe3;

  --btn-ghost-bg:           transparent;
  --btn-ghost-text:         rgba(255, 244, 238, 0.60);
  --btn-ghost-border:       transparent;
  --btn-ghost-hover-bg:     rgba(255, 244, 238, 0.08);
  --btn-ghost-hover-text:   #fff4ee;
  --btn-ghost-hover-border: transparent;

  --card-bg:     rgba(255, 244, 238, 0.045);
  --card-border: rgba(255, 244, 238, 0.12);
  --card-text:   #fff4ee;
  --card-muted:  rgba(255, 244, 238, 0.70);

  --glass-hero-bg:       rgba(10, 15, 12, 0.65);
  --glass-hero-border:   rgba(255, 255, 255, 0.08);
  --glass-hero-text:     rgba(255, 244, 238, 0.92);
  --glass-hero-text-m:   rgba(255, 244, 238, 0.58);
  --glass-hero-cta-bd:   rgba(244, 179, 210, 0.45);
  --glass-scroll-bg:     rgba(16, 25, 21, 0.92);
  --glass-scroll-border: rgba(255, 244, 238, 0.10);
  --glass-scroll-text:   rgba(255, 244, 238, 0.92);
  --glass-scroll-text-m: rgba(255, 244, 238, 0.60);
  --glass-scroll-cta-bd: rgba(255, 244, 238, 0.35);
}
```

- [ ] **Step 3.3: Update base font family**

In `global.css`, find the `html { font-family: ... }` line and replace with:

```css
html {
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-fg);
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

(No change to `font-family` value — Inter stays. The rest of global.css — animations, reveal system, scrollbar, reduced-motion — keep unchanged.)

- [ ] **Step 3.4: Add `--btn-submit` tokens (missing from starter dark theme)**

At the end of `[data-theme="dark"]` block, verify `--btn-submit` is not separately needed — the starter maps `btn-submit` → same as `btn-primary` via CSS class `.btn-submit`. No change needed.

---

## Task 4: Update BaseLayout and siteConfig

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/config/site.ts`

- [ ] **Step 4.1: Add Cormorant Garamond font and change theme key in BaseLayout**

In `src/layouts/BaseLayout.astro`, replace:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
  rel="stylesheet"
/>
```

With:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap"
  rel="stylesheet"
/>
```

Also replace the inline theme key in the `<script is:inline>` block:

```js
var key = 'starter-theme';
```

→

```js
var key = 'flovers-theme';
```

- [ ] **Step 4.2: Replace siteConfig**

Replace entire content of `src/config/site.ts`:

```ts
export const siteConfig = {
  name: 'FLOVERS',
  shortName: 'FLOVERS',
  description: 'Авторские букеты, сезонные композиции и доставка цветов.',
  locale: 'ru',
  ogLocale: 'ru_RU',
  url: 'https://example.com',
  year: new Date().getFullYear(),

  contacts: {
    email: 'hello@flovers.ru',
    phone: '+7 900 123-45-67',
    address: 'Москва, ул. Цветочная, 12',
    telegram: '#',
    whatsapp: '#',
    instagram: '#',
  },

  nav: [
    { label: 'О нас',    href: '/#about' },
    { label: 'Каталог',  href: '/catalog' },
    { label: 'Доставка', href: '/#delivery' },
    { label: 'FAQ',      href: '/#faq' },
    { label: 'Контакты', href: '/#contacts' },
  ],

  cta: {
    label: 'Заказать',
    href: '/catalog',
  },

  footer: {
    tagline: 'Авторские букеты, сезонные композиции и бережная доставка цветов.',
    ctaText: 'Расскажите, для кого букет — соберём под настроение и повод.',
    privacyHref: '/privacy',
  },

  seo: {
    ogImage: '/og-image.jpg',
  },
};
```

- [ ] **Step 4.3: Update theme key in Header.astro**

In `src/components/layout/Header.astro`, find all occurrences of `'starter-theme'` and replace with `'flovers-theme'`. There are two: one in the `STORAGE_KEY` const and one in `getStoredPreference`.

```
const STORAGE_KEY = 'flovers-theme';
```

---

## Task 5: Create bouquets data layer

**Files:**
- Create: `src/data/bouquets.ts`

- [ ] **Step 5.1: Create bouquets.ts with interface and data**

Create `src/data/bouquets.ts`:

```ts
export interface Bouquet {
  id: string;
  slug: string;
  title: string;
  category: 'roses' | 'peonies' | 'seasonal' | 'mono' | 'gift';
  categoryLabel: string;
  price: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  composition: string[];
  size: string;
  care: string[];
  delivery: string;
  badge?: string;
  isBestseller?: boolean;
}

export const bouquets: Bouquet[] = [
  {
    id: 'dolce-rose',
    slug: 'dolce-rose',
    title: 'Dolce Rose',
    category: 'roses',
    categoryLabel: 'Розы',
    price: '4 900 ₽',
    shortDescription: 'Нежный букет из садовых роз в пыльно-розовых и персиковых оттенках.',
    description: 'Авторский букет из садовых роз сортов Jumilia и Ohara в пыльно-розовых и персиковых тонах. Каждый цветок подбирается вручную, упаковка — крафт с лентой. Подходит для романтических поводов, дней рождения и просто так.',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=75&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&q=75&auto=format&fit=crop',
    ],
    composition: ['Роза Jumilia — 7 шт', 'Роза Ohara — 5 шт', 'Эвкалипт — 3 ветки', 'Питтоспорум — 2 ветки'],
    size: 'Средний, 35–40 см',
    care: [
      'Подрезайте стебли под углом каждые 2 дня',
      'Меняйте воду ежедневно',
      'Держите вдали от прямых солнечных лучей и сквозняков',
      'Оптимальная температура — 16–20 °C',
    ],
    delivery: 'В течение 1–3 часов по Москве',
    badge: 'Хит',
    isBestseller: true,
  },
  {
    id: 'malina',
    slug: 'malina',
    title: 'Malina',
    category: 'roses',
    categoryLabel: 'Розы',
    price: '5 500 ₽',
    shortDescription: 'Яркий букет из алых и малиновых роз — страстный и запоминающийся.',
    description: 'Насыщенный букет из бархатистых роз в малиновых и тёмно-красных оттенках. Классика флористики в авторском исполнении — лаконично, дерзко и красиво. Идеален для признаний и ярких поводов.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=75&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1477039181047-efb4357d01bd?w=800&q=75&auto=format&fit=crop',
    ],
    composition: ['Роза Red Explorer — 9 шт', 'Роза Black Baccara — 4 шт', 'Зелень ростки — 5 шт'],
    size: 'Средний, 38–42 см',
    care: [
      'Подрезайте стебли под углом каждые 2 дня',
      'Меняйте воду ежедневно',
      'Держите в прохладе',
    ],
    delivery: 'В течение 1–3 часов по Москве',
    isBestseller: true,
  },
  {
    id: 'felicia',
    slug: 'felicia',
    title: 'Felicia',
    category: 'gift',
    categoryLabel: 'Подарочные',
    price: '7 200 ₽',
    shortDescription: 'Пышный подарочный букет с розами, пионовидными гвоздиками и зеленью.',
    description: 'Щедрый подарочный букет с нежными розами, пионовидными гвоздиками и декоративной зеленью. Упаковка — матовая бумага и атласная лента. Подходит для праздников, юбилеев и корпоративных подарков.',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=75&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1487530811015-780e2d7f9591?w=800&q=75&auto=format&fit=crop',
    ],
    composition: ['Роза Sweet Avalanche — 5 шт', 'Гвоздика пионовидная — 6 шт', 'Лизиантус — 4 шт', 'Эвкалипт — 4 ветки'],
    size: 'Большой, 45–50 см',
    care: [
      'Подрезайте стебли под углом',
      'Меняйте воду каждые 1–2 дня',
      'Избегайте фруктов рядом — этилен ускоряет увядание',
    ],
    delivery: 'В течение 1–3 часов по Москве',
    badge: 'Новинка',
    isBestseller: true,
  },
  {
    id: 'ivory-garden',
    slug: 'ivory-garden',
    title: 'Ivory Garden',
    category: 'seasonal',
    categoryLabel: 'Сезонные',
    price: '6 800 ₽',
    shortDescription: 'Воздушный сезонный букет в молочно-белых и кремовых тонах.',
    description: 'Лёгкий и воздушный букет из белых и кремовых цветов — ранункулюсов, анемонов и мимозы. Передаёт настроение ранней весны. Подходит для тематических свадеб и нежных поводов.',
    image: 'https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?w=800&q=75&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=75&auto=format&fit=crop',
    ],
    composition: ['Ранункулюс белый — 7 шт', 'Анемон — 5 шт', 'Мимоза — 3 ветки', 'Гипсофила — 2 ветки'],
    size: 'Средний, 35–40 см',
    care: [
      'Держите в прохладе — не выше 18 °C',
      'Подрезайте стебли каждые 2 дня',
      'Избегайте прямых солнечных лучей',
    ],
    delivery: 'В течение 1–3 часов по Москве',
  },
  {
    id: 'pink-mood',
    slug: 'pink-mood',
    title: 'Pink Mood',
    category: 'peonies',
    categoryLabel: 'Пионы',
    price: '8 500 ₽',
    shortDescription: 'Роскошный букет из розовых пионов — пышный, ароматный, праздничный.',
    description: 'Пышный сезонный букет из розовых пионов сорта Sarah Bernhardt и Bowl of Beauty. Аромат — сильный, сладкий. Каждый пион — крупный и плотный. Подходит для особых поводов и юбилеев.',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=75&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490750967868-88df5691cc26?w=800&q=75&auto=format&fit=crop',
    ],
    composition: ['Пион Sarah Bernhardt — 5 шт', 'Пион Bowl of Beauty — 4 шт', 'Питтоспорум — 3 ветки'],
    size: 'Большой, 40–45 см',
    care: [
      'Пионы в бутонах — держите в тёплой комнате для раскрытия',
      'Меняйте воду каждый день',
      'Подрезайте стебли наискось',
    ],
    delivery: 'В течение 2–4 часов по Москве (сезонный товар)',
  },
  {
    id: 'velvet-peony',
    slug: 'velvet-peony',
    title: 'Velvet Peony',
    category: 'peonies',
    categoryLabel: 'Пионы',
    price: '9 200 ₽',
    shortDescription: 'Тёмно-бордовые пионы для тех, кто ценит глубину и характер.',
    description: 'Тёмно-бордовые пионы с бархатистыми лепестками — редкий и эффектный выбор. Букет производит сильное впечатление, подходит для торжественных поводов и ценителей необычных цветов.',
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc26?w=800&q=75&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1490750967868-88df5691cc26?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=75&auto=format&fit=crop',
    ],
    composition: ['Пион Red Charm — 7 шт', 'Пион Karl Rosenfield — 3 шт', 'Лавровишня — 3 ветки'],
    size: 'Большой, 42–48 см',
    care: [
      'Держите в прохладе для более долгого цветения',
      'Меняйте воду каждый день',
      'Подрезайте стебли каждые 2 дня',
    ],
    delivery: 'В течение 2–4 часов по Москве (сезонный товар)',
  },
  {
    id: 'morning-blush',
    slug: 'morning-blush',
    title: 'Morning Blush',
    category: 'mono',
    categoryLabel: 'Монобукеты',
    price: '3 800 ₽',
    shortDescription: 'Нежный монобукет из кремовых тюльпанов — лёгкость весеннего утра.',
    description: 'Простой и изысканный монобукет из кремово-розовых тюльпанов. Минимализм и чистота формы. Идеален для тех, кто ценит сдержанную элегантность. Доступный вариант без потери в качестве.',
    image: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&q=75&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=1200&q=80&auto=format&fit=crop',
    ],
    composition: ['Тюльпан кремово-розовый — 15 шт'],
    size: 'Стандарт, 30–35 см',
    care: [
      'Тюльпаны продолжают расти в вазе — обрезайте стебли',
      'Меняйте воду каждый день',
      'Держите в прохладе',
    ],
    delivery: 'В течение 1–2 часов по Москве',
  },
  {
    id: 'wild-romance',
    slug: 'wild-romance',
    title: 'Wild Romance',
    category: 'seasonal',
    categoryLabel: 'Сезонные',
    price: '5 500 ₽',
    shortDescription: 'Букет-сюрприз из сезонных полевых цветов с диким, живым настроением.',
    description: 'Авторский сезонный букет из полевых и садовых цветов — каждый раз разный состав в зависимости от урожая. Живой, непредсказуемый, пахнущий летом. Для тех, кто ценит натуральность.',
    image: 'https://images.unsplash.com/photo-1487530811015-780e2d7f9591?w=800&q=75&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1487530811015-780e2d7f9591?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?w=800&q=75&auto=format&fit=crop',
    ],
    composition: ['Состав — сезонный, определяется в день сборки', 'Злаки, полевые цветы, декоративная зелень'],
    size: 'Средний, 35–45 см',
    care: [
      'Подрезайте стебли под углом',
      'Меняйте воду каждые 1–2 дня',
    ],
    delivery: 'В течение 1–3 часов по Москве',
  },
];

export function getBouquetBySlug(slug: string): Bouquet | undefined {
  return bouquets.find(b => b.slug === slug);
}

export function getRelatedBouquets(currentSlug: string, count = 3): Bouquet[] {
  return bouquets.filter(b => b.slug !== currentSlug).slice(0, count);
}

export function getBestsellers(): Bouquet[] {
  return bouquets.filter(b => b.isBestseller === true);
}
```

- [ ] **Step 5.2: Delete old data files**

```bash
rm "/Users/utopo4ek/Projects/Portfolio land/flovers-site/src/data/items.ts"
rm "/Users/utopo4ek/Projects/Portfolio land/flovers-site/src/data/team.ts"
rm "/Users/utopo4ek/Projects/Portfolio land/flovers-site/src/data/process.ts"
```

---

## Task 6: Create BouquetCard and Breadcrumbs components

**Files:**
- Create: `src/components/ui/BouquetCard.astro`
- Create: `src/components/ui/Breadcrumbs.astro`

- [ ] **Step 6.1: Create BouquetCard.astro**

Create `src/components/ui/BouquetCard.astro`:

```astro
---
import type { Bouquet } from '../../data/bouquets';

interface Props {
  bouquet: Bouquet;
  loading?: 'lazy' | 'eager';
}

const { bouquet, loading = 'lazy' } = Astro.props;
---

<article class="bouquet-card">
  <a href={`/catalog/${bouquet.slug}`} class="card-link" aria-label={`${bouquet.title} — ${bouquet.price}`}>
    <div class="card-image-wrap">
      <img
        src={bouquet.image}
        alt={bouquet.shortDescription}
        loading={loading}
        decoding={loading === 'eager' ? 'sync' : 'async'}
        width="600"
        height="800"
        class="card-img"
      />
      {bouquet.badge && (
        <span class="card-badge">{bouquet.badge}</span>
      )}
      <div class="card-cta" aria-hidden="true">
        <span>Подробнее</span>
      </div>
    </div>
    <div class="card-body">
      <p class="card-category">{bouquet.categoryLabel}</p>
      <h3 class="card-title">{bouquet.title}</h3>
      <p class="card-price">{bouquet.price}</p>
    </div>
  </a>
</article>

<style>
  .bouquet-card {
    display: flex;
    flex-direction: column;
  }

  .card-link {
    display: flex;
    flex-direction: column;
    flex: 1;
    color: inherit;
    text-decoration: none;
  }

  .card-image-wrap {
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    aspect-ratio: 3 / 4;
    background-color: var(--color-surface);
  }

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .card-link:hover .card-img,
  .card-link:focus-visible .card-img {
    transform: scale(1.04);
  }

  .card-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: var(--color-accent);
    color: var(--btn-primary-bg, #261818);
    font-size: 0.5625rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 3px 8px;
  }

  /* CTA overlay — hidden on desktop until hover; always visible on touch */
  .card-cta {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(90, 31, 50, 0.80) 0%, transparent 100%);
    color: #fff4ee;
    font-size: 0.5625rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 16px 12px 12px;
    opacity: 0;
    transition: opacity 260ms ease;
    pointer-events: none;
  }

  /* Desktop hover shows CTA */
  @media (hover: hover) {
    .card-link:hover .card-cta,
    .card-link:focus-visible .card-cta {
      opacity: 1;
    }
  }

  /* Touch devices — CTA always visible */
  @media (hover: none) {
    .card-cta {
      opacity: 1;
    }
  }

  .card-body {
    padding: 10px 2px 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .card-category {
    font-size: 0.5625rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-fg-subtle);
    margin: 0;
  }

  .card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1rem, 1.4vw, 1.25rem);
    font-weight: 300;
    letter-spacing: 0.01em;
    line-height: 1.2;
    color: var(--color-fg);
    margin: 0;
  }

  .card-price {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-accent-dark);
    margin: 0;
  }

  [data-theme="dark"] .card-price {
    color: var(--color-accent);
  }

  .card-link:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
    border-radius: 6px;
  }
</style>
```

- [ ] **Step 6.2: Create Breadcrumbs.astro**

Create `src/components/ui/Breadcrumbs.astro`:

```astro
---
interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

const { crumbs } = Astro.props;
---

<nav aria-label="Хлебные крошки" class="breadcrumbs">
  <ol class="breadcrumbs-list">
    {crumbs.map((crumb, i) => (
      <li class="breadcrumbs-item">
        {crumb.href && i < crumbs.length - 1 ? (
          <a href={crumb.href} class="breadcrumbs-link">{crumb.label}</a>
        ) : (
          <span class="breadcrumbs-current" aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
            {crumb.label}
          </span>
        )}
        {i < crumbs.length - 1 && (
          <span class="breadcrumbs-sep" aria-hidden="true">·</span>
        )}
      </li>
    ))}
  </ol>
</nav>

<style>
  .breadcrumbs {
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.10em;
    text-transform: uppercase;
  }

  .breadcrumbs-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .breadcrumbs-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .breadcrumbs-link {
    color: var(--color-fg-subtle);
    text-decoration: none;
    transition: color 200ms ease;
  }

  .breadcrumbs-link:hover {
    color: var(--color-fg-muted);
  }

  .breadcrumbs-current {
    color: var(--color-fg-muted);
  }

  .breadcrumbs-sep {
    color: var(--color-fg-subtle);
    margin: 0 4px;
  }
</style>
```

---

## Task 7: Rewrite Hero section

**Files:**
- Modify: `src/components/sections/Hero.astro` (full rewrite)

- [ ] **Step 7.1: Rewrite Hero.astro**

Replace entire content of `src/components/sections/Hero.astro`:

```astro
---
import Button from '../ui/Button.astro';
import { siteConfig } from '../../config/site';
---

<section
  id="hero"
  class="hero-section relative overflow-hidden"
  aria-label="Главный экран"
>
  <!-- ── Top block: dark green ── -->
  <div class="hero-top">
    <!-- Background image -->
    <div class="hero-photo-bg" aria-hidden="true">
      <img
        src="https://images.unsplash.com/photo-1495841674375-6f5de87aab5c?w=1600&q=80&auto=format&fit=crop"
        alt=""
        width="1600"
        height="1067"
        fetchpriority="high"
        loading="eager"
        decoding="sync"
        class="hero-bg-img"
      />
      <div class="hero-photo-overlay" aria-hidden="true"></div>
    </div>

    <!-- Content -->
    <div class="container-site hero-content">
      <!-- Eyebrow -->
      <div class="hero-eyebrow">
        <span class="label-tag" style="color: var(--glass-hero-text-m);">Авторская флористика · Москва</span>
      </div>

      <!-- H1 with line-by-line reveal -->
      <h1
        class="hero-title"
        aria-label="Создаём любовь через цветы"
      >
        <span class="hero-line-wrap" aria-hidden="true">
          <span class="hero-line hero-line-1">Создаём</span>
        </span>
        <span class="hero-line-wrap" aria-hidden="true">
          <span class="hero-line hero-line-2">
            <em class="hero-em">любовь</em>
          </span>
        </span>
        <span class="hero-line-wrap" aria-hidden="true">
          <span class="hero-line hero-line-3">через цветы</span>
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="hero-sub">
        Авторские букеты, сезонные композиции<br class="hidden md:block" />
        и доставка цветов для важных моментов.
      </p>

      <!-- CTAs -->
      <div class="hero-btns">
        <Button href="/catalog" variant="accent" size="md">
          Перейти в каталог
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <line x1="0" y1="7" x2="12" y2="7"/>
            <polyline points="8,3 12,7 8,11"/>
          </svg>
        </Button>
        <Button href="/#contacts" variant="secondary" size="md">
          Собрать букет
        </Button>
      </div>
    </div>
  </div>

  <!-- ── Bottom block: burgundy ── -->
  <div class="hero-bottom">
    <div class="container-site hero-bottom-inner">
      <!-- Left: tagline + description -->
      <div class="hero-bottom-text">
        <p class="hero-bottom-tagline">
          Мы выращиваем цветы с любовью и вниманием, специально для вас. Трепетно относимся к каждому букету.
        </p>
      </div>

      <!-- Right: decorative photo cards -->
      <div class="hero-photos" aria-hidden="true">
        <div class="hero-photo-card hero-photo-card-1">
          <img
            src="https://images.unsplash.com/photo-1490750967868-88df5691cc26?w=600&q=75&auto=format&fit=crop"
            alt=""
            width="600"
            height="800"
            loading="lazy"
            decoding="async"
            class="hero-photo-img"
          />
        </div>
        <div class="hero-photo-card hero-photo-card-2">
          <img
            src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=75&auto=format&fit=crop"
            alt=""
            width="600"
            height="800"
            loading="lazy"
            decoding="async"
            class="hero-photo-img"
          />
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* ── Viewport height ── */
  .hero-section {
    display: flex;
    flex-direction: column;
  }

  /* ── Hero top: dark green ── */
  .hero-top {
    position: relative;
    min-height: 70vh;
    min-height: 70svh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background-color: #101915;
    overflow: hidden;
  }

  /* Light theme: cream top */
  :global([data-theme="light"]) .hero-top {
    background-color: #eef4ef;
  }

  /* ── Background image ── */
  .hero-photo-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .hero-bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
    opacity: 0;
    transform: scale(1.04);
    transition:
      opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s,
      transform 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
  }

  .hero-photo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10, 20, 14, 0.45) 0%,
      rgba(10, 20, 14, 0.15) 40%,
      rgba(10, 20, 14, 0.70) 100%
    );
  }

  /* Light theme overlay — lighter */
  :global([data-theme="light"]) .hero-photo-overlay {
    background: linear-gradient(
      to bottom,
      rgba(238, 244, 239, 0.30) 0%,
      rgba(238, 244, 239, 0.05) 40%,
      rgba(238, 244, 239, 0.55) 100%
    );
  }

  /* ── Content ── */
  .hero-content {
    position: relative;
    z-index: 10;
    padding-top: 7rem;
    padding-bottom: 3rem;
  }

  /* ── Eyebrow ── */
  .hero-eyebrow {
    margin-bottom: 1.5rem;
    opacity: 0;
    transform: translateY(0.5rem);
    transition: opacity 0.8s var(--ease-out) 0.3s, transform 0.8s var(--ease-out) 0.3s;
  }

  /* ── Title ── */
  .hero-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 300;
    font-size: clamp(3rem, 7vw, 6.5rem);
    line-height: 1.05;
    letter-spacing: -0.01em;
    color: #fff4ee;
    margin: 0 0 1.5rem;
    max-width: 16ch;
  }

  /* Light theme — dark text on cream */
  :global([data-theme="light"]) .hero-title {
    color: #261818;
  }

  .hero-em {
    font-style: italic;
    color: #f4b3d2;
  }

  :global([data-theme="light"]) .hero-em {
    color: #8a2f48;
  }

  /* Line-by-line reveal */
  .hero-line-wrap {
    display: block;
    overflow: hidden;
  }

  .hero-line {
    display: block;
    transform: translateY(110%);
    opacity: 0;
    transition:
      transform 1s var(--ease-out),
      opacity   0.8s var(--ease-out);
  }

  .hero-line-1 { transition-delay: 0.45s; }
  .hero-line-2 { transition-delay: 0.60s; }
  .hero-line-3 { transition-delay: 0.75s; }

  /* ── Subtitle ── */
  .hero-sub {
    color: rgba(255, 244, 238, 0.72);
    font-size: clamp(0.875rem, 1.5vw, 1.125rem);
    line-height: 1.7;
    margin: 0 0 2.5rem;
    max-width: 38ch;
    opacity: 0;
    transform: translateY(1rem);
    transition: opacity 0.9s var(--ease-out) 0.9s, transform 0.9s var(--ease-out) 0.9s;
  }

  :global([data-theme="light"]) .hero-sub {
    color: rgba(38, 24, 24, 0.68);
  }

  /* ── Buttons ── */
  .hero-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    opacity: 0;
    transform: translateY(1rem);
    transition: opacity 0.9s var(--ease-out) 1.05s, transform 0.9s var(--ease-out) 1.05s;
  }

  /* ── Hero bottom block ── */
  .hero-bottom {
    background-color: #5a1f32;
    position: relative;
    transform: translateY(2rem);
    opacity: 0;
    transition: opacity 0.9s var(--ease-out) 0.15s, transform 0.9s var(--ease-out) 0.15s;
  }

  :global([data-theme="light"]) .hero-bottom {
    background-color: #f3e8e1;
  }

  .hero-bottom-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .hero-bottom-text {
    flex: 1;
    max-width: 38ch;
  }

  .hero-bottom-tagline {
    font-size: 0.8125rem;
    line-height: 1.65;
    color: rgba(255, 244, 238, 0.72);
    margin: 0;
  }

  :global([data-theme="light"]) .hero-bottom-tagline {
    color: rgba(38, 24, 24, 0.68);
  }

  /* ── Decorative photo cards ── */
  .hero-photos {
    display: flex;
    gap: 0.75rem;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.9s var(--ease-out) 0.3s;
  }

  .hero-photo-card {
    width: 90px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    transition: transform 0.6s var(--ease-out);
  }

  .hero-photo-card-1 { transition-delay: 0.2s; }
  .hero-photo-card-2 { transition-delay: 0.35s; }

  .hero-photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* ── Animate-in state ── */
  .hero-animate .hero-line      { transform: translateY(0); opacity: 1; }
  .hero-animate .hero-eyebrow   { opacity: 1; transform: translateY(0); }
  .hero-animate .hero-sub       { opacity: 1; transform: translateY(0); }
  .hero-animate .hero-btns      { opacity: 1; transform: translateY(0); }
  .hero-animate .hero-bottom    { opacity: 1; transform: translateY(0); }
  .hero-animate .hero-photos    { opacity: 1; }
  .hero-animate .hero-bg-img    { opacity: 1; transform: scale(1); }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .hero-title {
      font-size: clamp(2.75rem, 12vw, 4rem);
    }

    .hero-bottom-inner {
      flex-direction: column;
      align-items: flex-start;
    }

    .hero-photos {
      width: 100%;
      justify-content: flex-start;
    }

    .hero-photo-card {
      width: 80px;
      height: 105px;
    }
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .hero-line,
    .hero-eyebrow,
    .hero-sub,
    .hero-btns,
    .hero-bottom,
    .hero-photos,
    .hero-bg-img {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
</style>

<script>
  function startHeroReveal() {
    const section = document.getElementById('hero');
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('hero-animate');
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => section.classList.add('hero-animate')));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startHeroReveal);
  } else {
    startHeroReveal();
  }
  document.addEventListener('astro:page-load', startHeroReveal);
</script>
```

---

## Task 8: Create section components

**Files:**
- Create: `src/components/sections/MissionSection.astro`
- Create: `src/components/sections/BestsellersSection.astro`
- Create: `src/components/sections/DeliverySteps.astro`
- Create: `src/components/sections/CustomBouquetCta.astro`
- Create: `src/components/sections/FaqSection.astro`

- [ ] **Step 8.1: Create MissionSection.astro**

Create `src/components/sections/MissionSection.astro`:

```astro
---
---

<section id="about" class="section-padding bg-[var(--color-bg)]">
  <div class="container-site">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      <!-- Left: quote + text -->
      <div>
        <span class="label-tag text-[var(--color-fg-subtle)]" data-reveal="left">О нас</span>
        <div class="divider my-4" data-reveal="clip" data-reveal-delay="150"></div>
        <blockquote
          class="mt-8 mb-8"
          data-reveal="up"
          data-reveal-delay="200"
        >
          <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 300; font-style: italic; letter-spacing: -0.01em; line-height: 1.2; color: var(--color-fg);">
            Каждый букет — это не просто цветы.<br />Это чувство, которое вы дарите.
          </p>
        </blockquote>
        <p class="text-[var(--color-fg-muted)] leading-relaxed text-base max-w-md" data-reveal="up" data-reveal-delay="300">
          Мы создаём авторские букеты с вниманием к каждой детали — от выбора цветка до упаковки. Работаем только с сезонными и свежими цветами.
        </p>
      </div>

      <!-- Right: three values -->
      <div class="flex flex-col gap-8" data-reveal="right" data-reveal-delay="200">
        {[
          { num: '01', title: 'Сезонные цветы', desc: 'Работаем только с тем, что цветёт сейчас — ярко, свежо и без химии.' },
          { num: '02', title: 'Ручная сборка', desc: 'Каждый букет собирается флористом лично, под конкретный повод.' },
          { num: '03', title: 'Бережная доставка', desc: 'Доставляем в специальной упаковке — цветы приедут такими, какими ушли.' },
        ].map((item) => (
          <div class="flex gap-6 pb-8 border-b border-[var(--color-border)] last:border-0 last:pb-0">
            <span class="label-tag shrink-0 w-6 text-[var(--color-accent)]">{item.num}</span>
            <div>
              <h3 class="text-sm font-medium mb-2">{item.title}</h3>
              <p class="text-[var(--color-fg-muted)] text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 8.2: Create BestsellersSection.astro**

Create `src/components/sections/BestsellersSection.astro`:

```astro
---
import BouquetCard from '../ui/BouquetCard.astro';
import Button from '../ui/Button.astro';
import { getBestsellers } from '../../data/bouquets';

const bestsellers = getBestsellers().slice(0, 3);
---

<section class="section-padding" style="background-color: var(--color-surface);">
  <div class="container-site">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 md:mb-16">
      <div>
        <span class="label-tag text-[var(--color-fg-subtle)]" data-reveal="left">Популярное</span>
        <div class="divider my-4" data-reveal="clip" data-reveal-delay="150"></div>
        <h2
          class="mt-6"
          style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.1;"
          data-reveal="up"
          data-reveal-delay="200"
        >
          Бестселлеры
        </h2>
      </div>
      <div data-reveal="up" data-reveal-delay="300">
        <Button href="/catalog" variant="secondary" size="sm">
          Смотреть каталог
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <line x1="0" y1="6" x2="10" y2="6"/>
            <polyline points="7,3 10,6 7,9"/>
          </svg>
        </Button>
      </div>
    </div>

    <!-- Grid -->
    <div class="bestsellers-grid">
      {bestsellers.map((bouquet, i) => (
        <div data-reveal="up" data-reveal-delay={String(100 + i * 120)}>
          <BouquetCard bouquet={bouquet} />
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .bestsellers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 767px) {
    .bestsellers-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .bestsellers-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 8.3: Create DeliverySteps.astro**

Create `src/components/sections/DeliverySteps.astro`:

```astro
---
const steps = [
  { num: '01', title: 'Выберите букет', desc: 'Откройте каталог и найдите готовую композицию или используйте её как основу для индивидуального заказа.' },
  { num: '02', title: 'Уточните детали', desc: 'Напишите нам в мессенджер или оставьте заявку — уточним размер, оттенки, упаковку и время доставки.' },
  { num: '03', title: 'Флорист соберёт', desc: 'Мастер соберёт букет из свежих цветов специально для вас. Срок сборки — 1–2 часа.' },
  { num: '04', title: 'Доставим вовремя', desc: 'Курьер доставит букет в бережной упаковке в удобное для вас время по всей Москве.' },
];
---

<section id="delivery" class="section-padding bg-[var(--color-bg)]">
  <div class="container-site">
    <div class="max-w-2xl mb-14 md:mb-16">
      <span class="label-tag text-[var(--color-fg-subtle)]" data-reveal="left">Как заказать</span>
      <div class="divider my-4" data-reveal="clip" data-reveal-delay="150"></div>
      <h2
        class="mt-6"
        style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.1;"
        data-reveal="up"
        data-reveal-delay="200"
      >
        Четыре шага<br />до вашего букета
      </h2>
    </div>

    <div class="steps-grid">
      {steps.map((step, i) => (
        <div
          class="step-item"
          data-reveal="up"
          data-reveal-delay={String(100 + i * 100)}
        >
          <span class="label-tag text-[var(--color-accent)] block mb-4">{step.num}</span>
          <h3 class="text-base font-medium mb-3 tracking-tight">{step.title}</h3>
          <p class="text-[var(--color-fg-muted)] text-sm leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    position: relative;
  }

  /* Thin connector line between steps */
  .steps-grid::before {
    content: '';
    position: absolute;
    top: 0.75rem;
    left: 2.5rem;
    right: 2.5rem;
    height: 1px;
    background: var(--color-border);
    z-index: 0;
  }

  .step-item {
    position: relative;
  }

  @media (max-width: 1023px) {
    .steps-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .steps-grid::before { display: none; }
  }

  @media (max-width: 480px) {
    .steps-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 8.4: Create CustomBouquetCta.astro**

Create `src/components/sections/CustomBouquetCta.astro`:

```astro
---
import Button from '../ui/Button.astro';
---

<section class="custom-cta-section section-padding relative overflow-hidden">
  <!-- Background image -->
  <img
    src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1600&q=75&auto=format&fit=crop"
    alt=""
    width="1600"
    height="900"
    loading="lazy"
    decoding="async"
    class="cta-bg-img"
    aria-hidden="true"
  />
  <!-- Overlay -->
  <div class="cta-overlay" aria-hidden="true"></div>

  <!-- Content -->
  <div class="container-site relative z-10 text-center">
    <div class="max-w-2xl mx-auto">
      <span class="label-tag cta-label" data-reveal="up">Индивидуальный заказ</span>
      <div class="divider my-4 mx-auto cta-divider" data-reveal="clip" data-reveal-delay="150" style="background-color: #f4b3d2;"></div>
      <h2
        class="cta-heading mt-8 mb-6"
        style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.15;"
        data-reveal="up"
        data-reveal-delay="200"
      >
        Мы соберём букет<br />лично для вас
      </h2>
      <p class="cta-body mb-10 text-base leading-relaxed" data-reveal="up" data-reveal-delay="300">
        Расскажите о поводе, любимых оттенках и настроении — флорист подберёт композицию индивидуально.
      </p>
      <div data-reveal="up" data-reveal-delay="400">
        <Button href="/#contacts" variant="accent" size="lg">
          Оставить заявку
        </Button>
      </div>
    </div>
  </div>
</section>

<style>
  .custom-cta-section {
    position: relative;
    isolation: isolate;
  }

  .cta-bg-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2;
    display: block;
  }

  .cta-overlay {
    position: absolute;
    inset: 0;
    background: rgba(90, 31, 50, 0.31);
    z-index: -1;
  }

  .cta-label,
  .cta-heading,
  .cta-body {
    color: rgba(255, 244, 238, 0.90);
  }

  .cta-label {
    color: rgba(255, 244, 238, 0.65);
  }
</style>
```

- [ ] **Step 8.5: Create FaqSection.astro**

Create `src/components/sections/FaqSection.astro`:

```astro
---
const faqs = [
  {
    q: 'Как сделать заказ?',
    a: 'Выберите букет в каталоге и нажмите «Заказать букет», или заполните форму на странице контактов. Мы свяжемся с вами в течение 15 минут для подтверждения заказа.',
  },
  {
    q: 'Можно ли изменить состав букета?',
    a: 'Да, любой букет можно адаптировать — заменить цветы, изменить оттенки или размер. Напишите пожелания в комментарии к заказу или свяжитесь с нами напрямую.',
  },
  {
    q: 'Сколько стоит доставка?',
    a: 'Доставка по Москве в пределах МКАД — 350 ₽. За МКАД — от 500 ₽ в зависимости от расстояния. При заказе от 7 000 ₽ доставка бесплатна.',
  },
  {
    q: 'Когда лучше оформить заказ?',
    a: 'Для срочной доставки принимаем заказы за 2–3 часа. Для особых дат (праздники, свадьбы) рекомендуем оформить заказ за 1–2 дня заранее.',
  },
  {
    q: 'Можно ли приложить открытку?',
    a: 'Да, к любому букету можно добавить авторскую открытку с вашим текстом. Укажите текст в комментарии к заказу — оформим красиво.',
  },
];
---

<section id="faq" class="section-padding bg-[var(--color-bg-warm)]">
  <div class="container-site">
    <div class="max-w-3xl mx-auto">
      <span class="label-tag text-[var(--color-fg-subtle)]" data-reveal="left">Вопросы</span>
      <div class="divider my-4" data-reveal="clip" data-reveal-delay="150"></div>
      <h2
        class="mt-6 mb-12"
        style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.1;"
        data-reveal="up"
        data-reveal-delay="200"
      >
        Частые вопросы
      </h2>

      <div class="faq-list">
        {faqs.map((faq, i) => (
          <details
            class="faq-item"
            data-reveal="up"
            data-reveal-delay={String(100 + i * 80)}
          >
            <summary class="faq-summary">
              <span class="faq-question">{faq.q}</span>
              <span class="faq-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                  <line x1="8" y1="2" x2="8" y2="14" class="faq-v"/>
                  <line x1="2" y1="8" x2="14" y2="8"/>
                </svg>
              </span>
            </summary>
            <div class="faq-body">
              <p class="faq-answer">{faq.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  </div>
</section>

<style>
  .faq-list {
    border-top: 1px solid var(--color-border);
  }

  .faq-item {
    border-bottom: 1px solid var(--color-border);
  }

  .faq-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 0;
    cursor: pointer;
    list-style: none;
    user-select: none;
  }

  .faq-summary::-webkit-details-marker { display: none; }
  .faq-summary::marker { display: none; }

  .faq-summary:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 2px;
  }

  .faq-question {
    font-size: 0.9375rem;
    font-weight: 400;
    color: var(--color-fg);
    line-height: 1.4;
  }

  .faq-icon {
    flex-shrink: 0;
    color: var(--color-fg-subtle);
    transition: transform 300ms var(--ease-out), color 200ms ease;
  }

  .faq-item[open] .faq-icon {
    transform: rotate(45deg);
    color: var(--color-accent);
  }

  .faq-v {
    transition: opacity 200ms ease;
  }
  .faq-item[open] .faq-v {
    opacity: 0;
  }

  .faq-body {
    padding-bottom: 1.25rem;
  }

  .faq-answer {
    font-size: 0.875rem;
    line-height: 1.7;
    color: var(--color-fg-muted);
    max-width: 56ch;
    margin: 0;
  }
</style>
```

---

## Task 9: Update ContactSection, Header footer

**Files:**
- Modify: `src/components/sections/ContactSection.astro`
- Modify: `src/components/layout/Footer.astro`

- [ ] **Step 9.1: Update ContactSection heading and form fields**

In `src/components/sections/ContactSection.astro`, update the heading block (left column):

Replace:
```html
<h2 class="text-display-sm mt-6 mb-6 reveal reveal-delay-2" style="font-size: clamp(1.5rem, 3.5vw, 2.75rem);">
  Оставьте заявку
</h2>
<p class="text-[var(--color-fg-muted)] text-base leading-relaxed mb-10 reveal reveal-delay-3">
  Расскажите о своей задаче. Мы ответим в течение рабочего дня и предложим удобный формат первой встречи.
</p>
```

With:
```html
<h2
  class="mt-6 mb-6 reveal reveal-delay-2"
  style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.75rem, 3.5vw, 3rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.15;"
>
  Расскажите,<br />для кого букет
</h2>
<p class="text-[var(--color-fg-muted)] text-base leading-relaxed mb-10 reveal reveal-delay-3">
  Мы подберём цветы, оттенки и упаковку под настроение, повод и бюджет.
</p>
```

Replace the "Тип проекта" select options:
```html
<option value="" disabled selected>Выберите направление</option>
<option value="ready">Готовый букет</option>
<option value="custom">Индивидуальный букет</option>
<option value="wedding">Свадебная флористика</option>
<option value="corporate">Корпоративный заказ</option>
<option value="other">Другое</option>
```

Replace the "Тип проекта" label:
```html
<label for="field-type" class="label-tag block mb-2">Тип заказа *</label>
```

Replace the Email field with a Delivery Date field (after Phone):
```html
<!-- Delivery date -->
<div class="form-field">
  <label for="field-date" class="label-tag block mb-2">Дата доставки <span class="text-[var(--color-fg-subtle)]">(опционально)</span></label>
  <input
    id="field-date"
    name="delivery_date"
    type="date"
    class="w-full bg-transparent border border-[var(--color-border)] px-4 py-3.5 text-sm placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:border-[var(--color-fg)] transition-colors duration-200"
  />
</div>
```

Replace comment placeholder text:
```html
placeholder="Расскажите о поводе, пожеланиях, оттенках..."
```

Replace section label:
```html
<span class="label-tag reveal">Контакты</span>
```
→
```html
<span class="label-tag reveal">Заказ</span>
```

**Important note for Step 9.1:** Do NOT do a blind exact-text replacement if the file structure differs from expected. Adapt by semantic intent:
- Update the heading text to flower shop copy
- Update the subtitle text
- Update select options to flower order types
- Update the section label
- All other structure (form fields layout, Button component, validation JS) — keep intact, only change content values

- [ ] **Step 9.2: Update Footer copy**

In `src/components/layout/Footer.astro`, the footer already uses `siteConfig` variables — no structural changes needed. The copy updates come automatically from the updated `siteConfig` in Task 4. Verify the file renders correctly by checking that `siteConfig.name` is `FLOVERS` and `siteConfig.footer.tagline` has the floral copy.

---

## Task 10: Rewrite index.astro (home page)

**Files:**
- Modify: `src/pages/index.astro`
- Delete: `src/components/sections/Team.astro`, `src/components/sections/Services.astro`, `src/components/sections/Process.astro`, `src/components/sections/About.astro`, `src/components/sections/CtaSection.astro`

- [ ] **Step 10.1: Delete unused starter section components**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site"
rm src/components/sections/Team.astro
rm src/components/sections/Services.astro
rm src/components/sections/Process.astro
rm src/components/sections/About.astro
rm src/components/sections/CtaSection.astro
```

- [ ] **Step 10.2: Rewrite index.astro**

Replace entire content of `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import Hero from '../components/sections/Hero.astro';
import MissionSection from '../components/sections/MissionSection.astro';
import BestsellersSection from '../components/sections/BestsellersSection.astro';
import DeliverySteps from '../components/sections/DeliverySteps.astro';
import CustomBouquetCta from '../components/sections/CustomBouquetCta.astro';
import FaqSection from '../components/sections/FaqSection.astro';
import ContactSection from '../components/sections/ContactSection.astro';
import { siteConfig } from '../config/site';
---

<BaseLayout
  title={`${siteConfig.name} — ${siteConfig.description}`}
  description={siteConfig.description}
>
  <Header />
  <main>
    <Hero />
    <MissionSection />
    <BestsellersSection />
    <DeliverySteps />
    <CustomBouquetCta />
    <FaqSection />
    <ContactSection />
  </main>
  <Footer />
</BaseLayout>
```

---

## Task 11: Create catalog page

**Files:**
- Create: `src/pages/catalog/index.astro`
- Delete: `src/pages/items/` directory

- [ ] **Step 11.1: Delete old items pages**

```bash
rm -rf "/Users/utopo4ek/Projects/Portfolio land/flovers-site/src/pages/items"
```

- [ ] **Step 11.2: Create catalog/index.astro**

Create `src/pages/catalog/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
import BouquetCard from '../../components/ui/BouquetCard.astro';
import Button from '../../components/ui/Button.astro';
import { bouquets } from '../../data/bouquets';
import { siteConfig } from '../../config/site';

const filters = [
  { label: 'Все',         value: 'all' },
  { label: 'Розы',        value: 'roses' },
  { label: 'Пионы',       value: 'peonies' },
  { label: 'Сезонные',    value: 'seasonal' },
  { label: 'Монобукеты',  value: 'mono' },
  { label: 'Подарочные',  value: 'gift' },
];
---

<BaseLayout
  title={`Каталог букетов — ${siteConfig.name}`}
  description="Авторские букеты, сезонные композиции и монобукеты. Выберите готовую композицию или закажите индивидуальный букет."
>
  <Header />
  <main class="pt-20">
    <!-- Page intro -->
    <section class="section-padding bg-[var(--color-bg)]">
      <div class="container-site">
        <span class="label-tag text-[var(--color-fg-subtle)]" data-reveal="left">Каталог</span>
        <div class="divider my-4" data-reveal="clip" data-reveal-delay="150"></div>
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-6">
          <h1
            class=""
            style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 300; letter-spacing: -0.02em; line-height: 1.05;"
            data-reveal="up"
            data-reveal-delay="200"
          >
            Каталог букетов
          </h1>
          <p class="text-[var(--color-fg-muted)] text-sm max-w-xs leading-relaxed" data-reveal="up" data-reveal-delay="300">
            Выберите готовую композицию или используйте её как основу для индивидуального заказа.
          </p>
        </div>
      </div>
    </section>

    <!-- Filters + Grid -->
    <section class="section-padding" style="padding-top: 0; background-color: var(--color-bg);">
      <div class="container-site">
        <!-- Filter bar -->
        <div class="catalog-filters" role="group" aria-label="Фильтр по категории">
          {filters.map((f) => (
            <button
              class={`filter-btn ${f.value === 'all' ? 'active' : ''}`}
              data-filter={f.value}
              type="button"
            >
              {f.label}
            </button>
          ))}
        </div>

        <!-- Bouquet grid -->
        <div class="catalog-grid" id="catalog-grid">
          {bouquets.map((bouquet, i) => (
            <div
              class="catalog-card-wrap"
              data-category={bouquet.category}
              data-reveal="up"
              data-reveal-delay={String(Math.min(i * 60, 400))}
            >
              <BouquetCard bouquet={bouquet} />
            </div>
          ))}
        </div>

        <!-- No results message (hidden by default) -->
        <p id="no-results" class="hidden text-center text-[var(--color-fg-subtle)] text-sm py-16">
          Нет букетов в этой категории
        </p>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="section-padding section-adaptive text-center">
      <div class="container-site max-w-2xl mx-auto">
        <h2
          class="mb-5"
          style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.75rem, 3.5vw, 2.75rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.15;"
          data-reveal="up"
        >
          Не нашли подходящий букет?
        </h2>
        <p class="text-[var(--color-fg-muted)] text-base leading-relaxed mb-8" data-reveal="up" data-reveal-delay="100">
          Соберём индивидуальную композицию под ваш повод, оттенки и бюджет.
        </p>
        <div data-reveal="up" data-reveal-delay="200">
          <Button href="/#contacts" variant="primary" size="lg">
            Оставить заявку
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <line x1="0" y1="7" x2="12" y2="7"/>
              <polyline points="8,3 12,7 8,11"/>
            </svg>
          </Button>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>

<style>
  /* Filter bar */
  .catalog-filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.5rem;
    margin-bottom: 2.5rem;
    scrollbar-width: none;
  }
  .catalog-filters::-webkit-scrollbar { display: none; }

  .filter-btn {
    flex-shrink: 0;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.5rem 1.125rem;
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-fg-muted);
    cursor: pointer;
    white-space: nowrap;
    transition: border-color 200ms ease, color 200ms ease, background-color 200ms ease;
    border-radius: 2px;
  }

  .filter-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-fg);
  }

  .filter-btn.active {
    border-color: var(--color-accent);
    background-color: var(--color-accent);
    color: var(--btn-primary-bg, #261818);
  }

  [data-theme="dark"] .filter-btn.active {
    color: #321221;
  }

  /* Catalog grid */
  .catalog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 1023px) {
    .catalog-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .catalog-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script>
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  const cards = document.querySelectorAll<HTMLElement>('.catalog-card-wrap');
  const noResults = document.getElementById('no-results');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter ?? 'all';

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      let visibleCount = 0;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.hidden = !show;
        if (show) visibleCount++;
      });

      if (noResults) {
        noResults.classList.toggle('hidden', visibleCount > 0);
      }
    });
  });
</script>
```

---

## Task 12: Create bouquet detail page

**Files:**
- Create: `src/pages/catalog/[slug].astro`

- [ ] **Step 12.1: Create [slug].astro**

Create `src/pages/catalog/[slug].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
import Button from '../../components/ui/Button.astro';
import Breadcrumbs from '../../components/ui/Breadcrumbs.astro';
import BouquetCard from '../../components/ui/BouquetCard.astro';
import { bouquets, getBouquetBySlug, getRelatedBouquets } from '../../data/bouquets';
import { siteConfig } from '../../config/site';

export function getStaticPaths() {
  return bouquets.map(b => ({ params: { slug: b.slug } }));
}

const { slug } = Astro.params;
const bouquet = getBouquetBySlug(slug);

if (!bouquet) {
  return Astro.redirect('/catalog');
}

const related = getRelatedBouquets(slug, 3);
---

<BaseLayout
  title={`${bouquet.title} — ${siteConfig.name}`}
  description={bouquet.shortDescription}
>
  <Header />
  <main class="pt-20">
    <!-- Product section -->
    <section class="section-padding bg-[var(--color-bg)]">
      <div class="container-site">
        <Breadcrumbs
          crumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Каталог', href: '/catalog' },
            { label: bouquet.title },
          ]}
        />

        <!-- 2-column layout -->
        <div class="product-grid mt-8">
          <!-- Left: photo -->
          <div class="product-photo-col">
            <div class="product-photo-wrap">
              <img
                src={bouquet.image}
                alt={bouquet.shortDescription}
                width="800"
                height="1067"
                fetchpriority="high"
                loading="eager"
                decoding="sync"
                class="product-photo"
              />
              {bouquet.badge && (
                <span class="product-badge">{bouquet.badge}</span>
              )}
            </div>
          </div>

          <!-- Right: info panel -->
          <div class="product-info-col">
            <div class="product-info-panel">
              <p class="label-tag text-[var(--color-fg-subtle)] mb-3">{bouquet.categoryLabel}</p>
              <h1
                class="product-title"
                style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.1; margin: 0 0 0.5rem;"
              >
                {bouquet.title}
              </h1>
              <p class="product-price">{bouquet.price}</p>
              <p class="product-desc text-[var(--color-fg-muted)] text-sm leading-relaxed mt-4 mb-6">
                {bouquet.description}
              </p>

              <!-- CTA -->
              <Button href="/#contacts" variant="primary" size="lg" fullWidth={true} class="mb-6">
                Заказать букет
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <line x1="0" y1="7" x2="12" y2="7"/>
                  <polyline points="8,3 12,7 8,11"/>
                </svg>
              </Button>

              <hr class="border-[var(--color-border)] mb-6" />

              <!-- Composition -->
              <div class="mb-6">
                <p class="label-tag text-[var(--color-fg-subtle)] mb-3">Состав</p>
                <ul class="composition-tags">
                  {bouquet.composition.map(item => (
                    <li class="composition-tag">{item}</li>
                  ))}
                </ul>
              </div>

              <!-- Details table -->
              <dl class="details-table">
                <div class="detail-row">
                  <dt class="label-tag text-[var(--color-fg-subtle)]">Размер</dt>
                  <dd class="text-sm text-[var(--color-fg-muted)]">{bouquet.size}</dd>
                </div>
                <div class="detail-row">
                  <dt class="label-tag text-[var(--color-fg-subtle)]">Доставка</dt>
                  <dd class="text-sm text-[var(--color-fg-muted)]">{bouquet.delivery}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Care section -->
    <section class="section-padding section-adaptive">
      <div class="container-site max-w-3xl">
        <span class="label-tag text-[var(--color-fg-subtle)]" data-reveal="left">Уход</span>
        <div class="divider my-4" data-reveal="clip" data-reveal-delay="150"></div>
        <h2
          class="mt-6 mb-8"
          style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.1;"
          data-reveal="up"
          data-reveal-delay="200"
        >
          Как ухаживать за букетом
        </h2>
        <ul class="care-list">
          {bouquet.care.map((tip, i) => (
            <li
              class="care-item"
              data-reveal="up"
              data-reveal-delay={String(100 + i * 80)}
            >
              <span class="care-dot" aria-hidden="true"></span>
              <span class="text-sm text-[var(--color-fg-muted)] leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <!-- Gallery -->
    {bouquet.gallery.length > 1 && (
      <section class="section-padding bg-[var(--color-bg)]">
        <div class="container-site">
          <span class="label-tag text-[var(--color-fg-subtle)]" data-reveal="left">Галерея</span>
          <div class="divider my-4" data-reveal="clip" data-reveal-delay="150"></div>
          <div class="gallery-grid mt-8">
            {bouquet.gallery.map((src, i) => (
              <div
                class={`gallery-item ${i === 0 ? 'gallery-item-wide' : ''}`}
                data-reveal="up"
                data-reveal-delay={String(100 + i * 100)}
              >
                <img
                  src={src}
                  alt={`${bouquet.title} — фото ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height={i === 0 ? '533' : '800'}
                  class="gallery-img"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    <!-- Related bouquets -->
    {related.length > 0 && (
      <section class="section-padding" style="background-color: var(--color-surface);">
        <div class="container-site">
          <div class="flex items-end justify-between mb-12">
            <div>
              <span class="label-tag text-[var(--color-fg-subtle)]" data-reveal="left">Похожие букеты</span>
              <div class="divider my-4" data-reveal="clip" data-reveal-delay="150"></div>
            </div>
            <a href="/catalog" class="label-tag text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors duration-200">
              Весь каталог →
            </a>
          </div>
          <div class="related-grid">
            {related.map((b, i) => (
              <div data-reveal="up" data-reveal-delay={String(100 + i * 120)}>
                <BouquetCard bouquet={b} />
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    <!-- Custom CTA -->
    <section class="section-padding section-adaptive text-center">
      <div class="container-site max-w-xl mx-auto">
        <h2
          class="mb-5"
          style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.2;"
          data-reveal="up"
        >
          Хотите изменить оттенки или состав?
        </h2>
        <p class="text-[var(--color-fg-muted)] text-sm leading-relaxed mb-8" data-reveal="up" data-reveal-delay="100">
          Соберём индивидуально под ваш повод и бюджет.
        </p>
        <div data-reveal="up" data-reveal-delay="200">
          <Button href="/#contacts" variant="primary" size="md">
            Оставить заявку
          </Button>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>

<style>
  /* Product 2-col grid */
  .product-grid {
    display: grid;
    grid-template-columns: 55% 1fr;
    gap: 4rem;
    align-items: start;
  }

  .product-photo-col {
    position: sticky;
    top: 88px;
  }

  .product-photo-wrap {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 4 / 5;
    background-color: var(--color-surface);
  }

  .product-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .product-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background-color: var(--color-accent);
    color: var(--btn-primary-bg, #261818);
    font-size: 0.5625rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 3px 8px;
  }

  .product-price {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--color-accent-dark);
    margin: 0;
  }

  [data-theme="dark"] .product-price {
    color: var(--color-accent);
  }

  .composition-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .composition-tag {
    font-size: 0.6875rem;
    border: 1px solid var(--color-border);
    color: var(--color-fg-muted);
    padding: 3px 10px;
    border-radius: 2px;
    line-height: 1.6;
  }

  .details-table {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .detail-row:last-child { border-bottom: none; }

  /* Care list */
  .care-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .care-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .care-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--color-accent);
    flex-shrink: 0;
    margin-top: 0.45rem;
  }

  /* Gallery */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .gallery-item {
    border-radius: 6px;
    overflow: hidden;
    aspect-ratio: 3 / 4;
    background-color: var(--color-surface);
  }

  .gallery-item-wide {
    grid-column: span 2;
    aspect-ratio: 4 / 3;
  }

  .gallery-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 600ms var(--ease-out);
  }

  .gallery-item:hover .gallery-img {
    transform: scale(1.03);
  }

  /* Related grid */
  .related-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  /* Mobile */
  @media (max-width: 767px) {
    .product-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .product-photo-col {
      position: static;
    }

    .product-info-col {
      order: 1;
    }

    /* On mobile show CTA early — it's right after price via DOM order */

    .gallery-grid {
      grid-template-columns: 1fr 1fr;
    }

    .gallery-item-wide {
      grid-column: span 2;
      aspect-ratio: 4 / 3;
    }

    .related-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 480px) {
    .related-grid {
      grid-template-columns: 1fr;
    }

    .gallery-grid {
      grid-template-columns: 1fr;
    }

    .gallery-item-wide {
      grid-column: span 1;
    }
  }
</style>
```

---

## Task 13: Update README and run checks

**Files:**
- Modify: `README.md`

- [ ] **Step 13.1: Rewrite README.md**

Replace entire content of `README.md`:

```markdown
# FLOVERS — Flower Shop Website

Premium flower shop presentation site built with Astro and Tailwind.

## Stack

- **Astro** + **Tailwind v4** (via `@tailwindcss/vite`)
- **TypeScript**
- **Google Fonts**: Cormorant Garamond (headings) + Inter (body)
- **Unsplash** remote images

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, mission, bestsellers, delivery, FAQ, contacts |
| `/catalog` | Catalog with inline category filters |
| `/catalog/[slug]` | Bouquet detail — photo, info, care, gallery, related |

## Themes

Light / Dark / System — toggle in header. Preference stored in `localStorage` under key `flovers-theme`.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # TypeScript + Astro diagnostics
npm run build    # production build → dist/
npm run preview  # preview production build
```

## GitHub Pages (future)

To deploy as a GitHub Pages project site, update `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://ut0po4ek.github.io',
  base: '/flovers-site',
  // ...
});
```

## Structure

```
src/
  components/
    layout/        Header, Footer
    sections/      Hero, MissionSection, BestsellersSection,
                   DeliverySteps, CustomBouquetCta, FaqSection, ContactSection
    ui/            Button, BouquetCard, Breadcrumbs
  config/          site.ts
  data/            bouquets.ts
  layouts/         BaseLayout.astro
  pages/           index.astro, catalog/index.astro, catalog/[slug].astro
  styles/          global.css
```
```

- [ ] **Step 13.2: Run npm run check**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site" && npm run check
```

Expected: 0 errors. Fix any type errors before continuing.

- [ ] **Step 13.3: Run npm run build**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site" && npm run build
```

Expected: exits 0, `dist/` directory created with `index.html`, `catalog/index.html`, `catalog/dolce-rose/index.html` etc.

- [ ] **Step 13.4: Grep for starter remnants**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site"
grep -RniE "Starter Brand|astro-business-starter|Проект Альфа|project-alpha|project-beta|starter-theme|FORM & LIGHT|DgVision|dg\.vision" \
  src public package.json astro.config.mjs README.md \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.astro --exclude-dir=.git
```

Expected: no output. If matches found — fix before proceeding.

- [ ] **Step 13.5: Grep for items references**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site"
grep -RniE "\bitems\b" src public \
  --exclude-dir=node_modules --exclude-dir=dist
```

Expected: no output.

- [ ] **Step 13.6: Verify git remote (do NOT commit yet)**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site"
git remote -v
git status
```

Expected: remote is `git@github-personal:ut0po4ek/flovers-site.git`. Do NOT commit or push without user confirmation.

---

## Self-Review Checklist

After running tasks above, verify against spec:

- [ ] Hero: dark green top + burgundy bottom + cream light theme variant
- [ ] Hero: line-reveal animation + photo scale-in
- [ ] Cormorant Garamond on all H1/H2/product titles
- [ ] `flovers-theme` localStorage key (not `starter-theme`)
- [ ] `/catalog` page exists with filter buttons
- [ ] Filter JS works without page reload
- [ ] `/catalog/[slug]` exists for all 8 bouquets (verify in build output)
- [ ] BouquetCard: `.card-cta` always visible on `@media (hover: none)`
- [ ] Breadcrumbs on detail page
- [ ] `npm run check` passes
- [ ] `npm run build` passes
- [ ] No starter brand names in grep
- [ ] Git remote correct, no commit made
