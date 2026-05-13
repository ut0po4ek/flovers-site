# FLOVERS — Дизайн-документ

**Дата:** 2026-05-13  
**Статус:** Утверждён  
**Источник:** `astro-business-starter` (read-only)  
**Target:** `/Users/utopo4ek/Projects/Portfolio land/flovers-site`

---

## 1. Цель и бренд

**FLOVERS** — презентационный сайт премиального цветочного магазина.

- Авторские букеты, сезонные композиции, доставка
- Visual mood: тёмный, чувственный, floral, editorial, boutique
- Главный референс: тёмно-зелёный hero + бордово-розовый блок + крупная serif-типографика
- Не копировать чужой дизайн 1:1 — создать самостоятельный бренд FLOVERS

---

## 2. Создание проекта

### Копирование starter
```bash
rsync -a --exclude='node_modules' --exclude='dist' --exclude='.astro' \
  --exclude='.git' --exclude='.env' --exclude='.env.local' --exclude='.DS_Store' \
  "astro-business-starter/" "flovers-site/"
```

После — работать только в `flovers-site/`. Starter не трогать.

### Git setup
```bash
cd flovers-site
git init
git branch -M main
git remote add origin git@github-personal:ut0po4ek/flovers-site.git
```

Проверить: `user.name = ut0po4ek`, `user.email = utopo4ek@mail.ru`

**Коммит и пуш — только после подтверждения пользователя.**

---

## 3. package.json / astro.config.mjs

**package.json:**
- `name`: `flovers-site`
- `description`: `FLOVERS — premium flower shop website built with Astro`

**astro.config.mjs:**
- `site: 'https://example.com'` — пока без GitHub Pages base
- Для GitHub Pages project site в будущем:
  ```js
  site: 'https://ut0po4ek.github.io'
  base: '/flovers-site'
  ```
  (не добавлять сейчас, описать в README)

---

## 4. Цветовая система (`src/styles/global.css`)

Полностью заменить neutral/indigo палитру starter.

### Light theme (`:root`, `[data-theme="light"]`)
```css
--color-bg:         #fbf6f1;
--color-bg-warm:    #f3e8e1;
--color-surface:    #fffaf6;
--color-fg:         #261818;
--color-fg-muted:   rgba(38,24,24,0.68);
--color-fg-subtle:  rgba(38,24,24,0.45);
--color-border:     rgba(80,45,45,0.14);
--color-accent:     #e9a8c7;
--color-accent-dark:#8a2f48;

/* Buttons light */
--btn-primary-bg:   #261818;
--btn-primary-text: #fffaf6;
--btn-accent-bg:    #e9a8c7;
--btn-accent-text:  #261818;
```

### Dark theme (`[data-theme="dark"]`)
```css
--color-bg:         #101915;
--color-bg-warm:    #5a1f32;
--color-surface:    #16221d;
--color-fg:         #fff4ee;
--color-fg-muted:   rgba(255,244,238,0.72);
--color-fg-subtle:  rgba(255,244,238,0.48);
--color-border:     rgba(255,244,238,0.16);
--color-accent:     #f4b3d2;
--color-accent-dark:#b94d6a;

/* Buttons dark */
--btn-primary-bg:   #f4b3d2;
--btn-primary-text: #321221;
--btn-accent-bg:    #f4b3d2;
--btn-accent-text:  #321221;
```

### Glass tokens (Header)
```css
/* Hero state (над hero-секцией) */
--glass-hero-bg:       rgba(12,20,15,0.60);
--glass-hero-border:   rgba(255,255,255,0.08);
--glass-hero-text:     rgba(255,244,238,0.92);
--glass-hero-text-m:   rgba(255,244,238,0.58);
--glass-hero-cta-bd:   rgba(244,179,210,0.45);

/* Scrolled state */
--glass-scroll-bg:     rgba(251,246,241,0.90);
--glass-scroll-border: rgba(38,24,24,0.10);
--glass-scroll-text:   rgba(38,24,24,0.88);
--glass-scroll-text-m: rgba(38,24,24,0.55);
--glass-scroll-cta-bd: rgba(38,24,24,0.35);
```

Сохранить всю систему анимаций, reveal, scrollbar из starter без изменений.

---

## 5. Типографика

### Шрифты (Google Fonts, подключить в BaseLayout)
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
```

### Применение
| Элемент | Шрифт | Вес | Размер |
|---|---|---|---|
| Hero H1 | Cormorant Garamond | 300 | `clamp(3rem, 7vw, 6.5rem)` |
| Section H2 | Cormorant Garamond | 300 | `clamp(2rem, 4vw, 3.5rem)` |
| Product title | Cormorant Garamond | 300–400 | `clamp(1.75rem, 3vw, 2.75rem)` |
| Editorial quote | Cormorant Garamond | 300 italic | `clamp(1.25rem, 2.5vw, 2rem)` |
| Body / nav / buttons | Inter | 300–500 | 0.875rem–1rem |
| Labels / tags | Inter | 500 | 0.6875rem, uppercase, ls 0.12em |

**Mobile fallback:** если Cormorant 300 плохо читается (<320px), section H2 переключать на weight 400.

---

## 6. siteConfig (`src/config/site.ts`)

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
    telegram: '#', whatsapp: '#', instagram: '#',
  },
  nav: [
    { label: 'О нас',    href: '/#about' },
    { label: 'Каталог',  href: '/catalog' },
    { label: 'Доставка', href: '/#delivery' },
    { label: 'FAQ',      href: '/#faq' },
    { label: 'Контакты', href: '/#contacts' },
  ],
  cta: { label: 'Заказать', href: '/catalog' },
  footer: {
    tagline: 'Авторские букеты, сезонные композиции и бережная доставка цветов.',
    ctaText: 'Расскажите, для кого букет — соберём под настроение и повод.',
    privacyHref: '/privacy',
  },
  seo: { ogImage: '/og-image.jpg' },
};
```

---

## 7. Theme switcher

В `BaseLayout.astro` и `Header.astro` заменить ключ `'starter-theme'` → `'flovers-theme'`.

---

## 8. Data layer (`src/data/bouquets.ts`)

### Интерфейс
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
  image: string;            // primary Unsplash URL
  gallery: string[];        // 2–4 URLs
  composition: string[];    // ['Роза Jumilia 15 шт', ...]
  size: string;             // 'Средний, 35–40 см'
  care: string[];           // tips
  delivery: string;
  badge?: string;           // 'Хит' | 'Новинка'
  isBestseller?: boolean;
}
```

### 8 букетов
1. **Dolce Rose** — roses, 4 900 ₽, isBestseller
2. **Malina** — roses, 5 500 ₽, isBestseller
3. **Felicia** — gift, 7 200 ₽, isBestseller
4. **Ivory Garden** — seasonal, 6 800 ₽
5. **Pink Mood** — peonies, 8 500 ₽
6. **Velvet Peony** — peonies, 9 200 ₽
7. **Morning Blush** — mono, 3 800 ₽
8. **Wild Romance** — seasonal, 5 500 ₽

### Хелперы
```ts
export function getBouquetBySlug(slug: string): Bouquet | undefined
export function getRelatedBouquets(currentSlug: string, count = 3): Bouquet[]
export function getBestsellers(): Bouquet[]
```

Удалить `src/data/items.ts`, `src/data/team.ts`, `src/data/process.ts` — заменить флористическими данными или убрать.

---

## 9. Страницы

### Удалить / заменить
- `src/pages/items/` → заменить на `src/pages/catalog/`
- Из `src/pages/index.astro` убрать все секции starter, заменить цветочными

### Новые страницы
- `src/pages/index.astro` — главная
- `src/pages/catalog/index.astro` — каталог
- `src/pages/catalog/[slug].astro` — страница букета (static, `getStaticPaths`)

---

## 10. Компоненты (src/components/)

### Обновить / адаптировать
- `layout/Header.astro` — логотип FLOVERS, флористическая навигация, theme key
- `layout/Footer.astro` — FLOVERS брендинг, контакты, соцсети

### Заменить starter-секции

- `sections/Hero.astro` → переписать полностью под FLOVERS
- `sections/About.astro` → **MissionSection.astro**
- `sections/Services.astro` → **BestsellersSection.astro**
- `sections/Process.astro` → **DeliverySteps.astro**
- `sections/CtaSection.astro` → **CustomBouquetCta.astro**
- `sections/ContactSection.astro` → обновить поля
- Добавить: **FaqSection.astro**

### Новые компоненты UI
- `ui/BouquetCard.astro` — портретная карточка (3:4, hover, touch-friendly CTA)
- `ui/Breadcrumbs.astro` — хлебные крошки

---

## 11. Hero (главный экран)

### Dark theme (основной)
```
┌─────────────────────────────────────────────┐
│ [FLOVERS]    О нас  Каталог  Доставка  [Заказать] │  ← glass header
├─────────────────────────────────────────────┤
│                                             │
│  Создаём          [большое фото роз         │
│  любовь           на тёмно-зелёном          │
│  через цветы      фоне]                     │
│                                             │
│  subtitle                                   │
│  [Перейти в каталог] [Собрать букет]        │
├─────────────────────────────────────────────┤  ← burgund block #5a1f32
│  subtitle + 2 декоративных фото с border-radius │
└─────────────────────────────────────────────┘
```

### Light theme (адаптация, без разрушения композиции)

- Верхний блок: `#fbf6f1` cream вместо `#101915`; если выглядит плоско — добавить лёгкий dusty rose или green tint (`#f5ede8` или `#eef4ef`), либо затемнить область за фото
- Нижний блок: `#f3e8e1` dusty rose вместо `#5a1f32`
- Типографика и фото остаются — меняются только фоновые цвета блоков
- Accent кнопка: `#261818` bg + `#fffaf6` text
- Цель: premium-контраст и boutique mood даже без тёмного фона; если cream выглядит как обычный лендинг — усиливать тонировкой, но не менять Variant A структуру

### Анимации
- Line-reveal на заголовке (строка за строкой, как в starter Hero, но адаптированный)
- Hero-фото: opacity 0 → 1 + `scale(1.03)` → `scale(1)` при появлении
- Нижний burgundy-блок: slide up при загрузке (150ms delay)
- Декоративные фото: staggered появление (200ms, 350ms)
- `prefers-reduced-motion`: отключить всё, показать конечное состояние

### Изображения hero
- Unsplash editorial тёмные цветочные: dark roses, peonies, bouquet studio
- Hero: `fetchpriority="high"`, `loading="eager"`, `decoding="sync"`

---

## 12. Компонент BouquetCard

```astro
---
interface Props {
  bouquet: Bouquet;
  loading?: 'lazy' | 'eager';
}
---
<!-- Структура -->
<article class="bouquet-card">
  <a href={`/catalog/${bouquet.slug}`} class="card-link">
    <div class="card-image-wrap">
      <img ... />
      <!-- Badge если есть -->
      <!-- CTA overlay (desktop hover / mobile always visible) -->
      <div class="card-cta">
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
```

**Touch/mobile**: `.card-cta` всегда visible (`opacity: 1`) через `@media (hover: none)`.  
**Desktop**: появляется на hover через CSS transition.

---

## 13. Каталог `/catalog`

### Структура страницы
1. Header
2. Page intro: "Каталог букетов" + subtitle
3. Фильтры (горизонтальный scroll на mobile)
4. Сетка карточек (3/2/1 колонки)
5. CTA "Не нашли? Соберём индивидуально"

### Фильтры — lightweight inline JS
```html
<div class="filters" role="group">
  <button class="filter-btn active" data-filter="all">Все</button>
  <button class="filter-btn" data-filter="roses">Розы</button>
  <!-- ... -->
</div>

<div class="catalog-grid">
  <div data-category="roses">...</div>
</div>
```

```js
// Inline <script> в catalog/index.astro
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cards.forEach(card => {
      card.hidden = cat !== 'all' && card.dataset.category !== cat;
    });
  });
});
```

No animation library — просто `hidden` attribute + CSS `display:none`.

---

## 14. Страница букета `/catalog/[slug]`

### Desktop layout (≥768px)
```
┌─────────────────┬──────────────────────┐
│                 │ Breadcrumbs          │
│  Фото 4:5       │ Категория            │
│  (sticky-ish)   │ Название (Cormorant) │
│                 │ Цена                 │
│   gallery dots  │ Описание             │
│                 │ Состав (теги)        │
│                 │ Детали (таблица)     │
│                 │ [Заказать букет]     │
└─────────────────┴──────────────────────┘
  Уход за букетом (full width)
  Галерея (2–4 фото editorial)
  Related bouquets (3 карточки)
  Custom CTA
```

### Mobile layout (<768px)
Фото (4:5) → Breadcrumbs → Категория → Название → Цена → **[Заказать букет]** → Описание → Состав → Детали → Уход → Галерея → Related

CTA "Заказать букет" — высоко, виден без лишнего скролла.

### Sticky info panel
`position: sticky; top: 88px` на desktop для info-панели справа — не применять на mobile (media query).

---

## 15. Секции главной страницы

### MissionSection (`#about`)
- Serif quote (Cormorant Garamond italic)
- Короткий текст о бренде
- `data-reveal="up"`

### BestsellersSection
- H2 "Бестселлеры"
- 3 карточки из `getBestsellers()`
- CTA "Смотреть весь каталог" → `/catalog`
- Dark bg: `var(--color-surface)` / Light bg: `var(--color-bg-warm)`

### DeliverySteps (`#delivery`)
- 4 шага: выбрать → уточнить детали → сборка → доставка
- Нумерация 01–04, thin line connector
- `data-reveal="up"` с delay

### CustomBouquetCta
- Фоновое фото + `rgba(90,31,50,0.65)` overlay
- Заголовок, текст, CTA "Оставить заявку" → `#contacts`

### FaqSection (`#faq`)

- `<details>/<summary>` — нативный HTML, без дополнительного JS
- CSS `max-height` transition желательна, но не обязательна — если усложняет код или ломает доступность, оставить нативное поведение браузера
- 5 вопросов из спецификации

### ContactSection (`#contacts`)
- Поля: Имя, Телефон, `<select>` Тип заказа, Дата доставки, Комментарий
- Select options: Готовый букет / Индивидуальный / Свадебная / Корпоративный / Другое
- Heading: "Расскажите, для кого букет"
- Валидация через HTML5 required

---

## 16. Header / Footer

### Header (адаптация starter)
- Логотип: `FLOVERS` (Inter 500, tracking-widest, uppercase)
- Nav: О нас / Каталог / Доставка / FAQ / Контакты
- CTA: "Заказать" → `/catalog`
- Theme switcher: ключ `flovers-theme`
- Сохранить glass effect, scroll state machine, mobile menu — всё из starter

### Footer
- FLOVERS + tagline
- Контакты (email, phone, address)
- Соцсети (instagram, telegram, whatsapp)
- Nav links
- CTA block
- © год

---

## 17. Изображения

Все Unsplash URLs — формат `https://images.unsplash.com/photo-{id}?w={w}&q=75&auto=format&fit=crop`

**Требования:**
- `alt` на каждом img
- `width` + `height` (предотвращает layout shift)
- Hero: `loading="eager"`, `fetchpriority="high"`, `decoding="sync"`
- Остальные: `loading="lazy"`, `decoding="async"`
- `object-fit: cover` для всех card images

**Тематика:** dark roses, pink peonies, bouquet studio, florist editorial — тёмная или мягкая пастельная эстетика.

---

## 18. Анимации

Использовать существующую систему starter:
- `data-reveal="up|left|right|scale|fade"` + `data-reveal-delay="100|200|..."`
- Intersection Observer из `BaseLayout.astro` — не переписывать
- Hero: собственная `.hero-animate` система (адаптировать из starter Hero)
- FAQ accordion: нативный `<details>` + CSS `max-height` transition
- Карточки: CSS hover `transform: translateY(-3px)` + image `scale(1.04)`
- `prefers-reduced-motion`: вся защита уже в global.css starter

---

## 19. Мобильная адаптация

| Breakpoint | Каталог | Hero |
|---|---|---|
| ≥1024px | 3 col | full layout |
| 768–1023px | 2 col | full layout |
| <768px | 1 col | стек (фото сверху) |
| <480px | 1 col | compact hero |

- Фильтры каталога: горизонтальный scroll (`overflow-x: auto`, `-webkit-overflow-scrolling: touch`)
- Букет detail: фото сверху, CTA высоко
- Header mobile menu: из starter, не трогать
- Нет горизонтального overflow на любом breakpoint

---

## 20. Очистка от starter

**Удалить полностью:**

- `src/data/items.ts` — заменён на `bouquets.ts`
- `src/pages/items/` — заменён на `src/pages/catalog/`
- `src/components/sections/Team.astro`

**Удалить после замены:**

- `src/data/process.ts` — после того как `Process.astro` заменён на `DeliverySteps.astro`
- `src/data/team.ts` — после удаления `Team.astro`

**Заменить по тексту:**

- Все упоминания `Starter Brand`, `astro-business-starter`, `Проект Альфа`, `project-alpha`, `project-beta`, `starter-theme`, `neutral/indigo`

Grep-проверка перед сдачей (`-E` для OR через `|`):

```bash
grep -RniE "Starter Brand|astro-business-starter|Проект Альфа|project-alpha|project-beta|starter-theme|FORM & LIGHT|DgVision|dg\.vision" \
  src public package.json astro.config.mjs README.md \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.astro --exclude-dir=.git
```

Отдельная проверка на `items` (может быть частью других слов — проверить вручную):

```bash
grep -RniE "\bitems\b" src public --exclude-dir=node_modules --exclude-dir=dist
```

---

## 21. README

Обновить под FLOVERS. Включить:

- Стек: Astro + Tailwind v4 (версию брать из `package.json`, не хардкодить)
- Страницы: `/`, `/catalog`, `/catalog/[slug]`
- Темы: light / dark / system
- Dev: `npm run dev`
- Build: `npm run build`
- GitHub Pages note (будущее):

```js
// astro.config.mjs для GitHub Pages project site:
site: 'https://ut0po4ek.github.io'
base: '/flovers-site'
```

---

## 22. Финальные проверки

```bash
npm install
npm run check   # TypeScript + Astro diagnostics
npm run build   # должен завершиться без ошибок
```

Grep-проверка на остатки starter (п.20).

**Commit / push — только после явного подтверждения пользователя.**
