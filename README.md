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
