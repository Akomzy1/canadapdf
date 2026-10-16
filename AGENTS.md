# AGENTS.md: Japa Right landing site

You are building the sales landing site for **Japa Right**, a series of DIY relocation ebooks for Nigerians, sold on Selar and advertised with Meta (Facebook/Instagram) ads. Most visitors come from a Meta ad, are on a mid-range Android phone, use mobile data, and decide within 10 seconds whether to keep scrolling.

Read these files before writing any code, in this order:

1. `AGENTS.md` (this file): stack, rules, definition of done
2. `PRD.md`: goals, pages, sections, behaviour, acceptance criteria
3. `COPY.md`: **every word on the site**. Use it verbatim.
4. `DESIGN.md`: brand tokens, typography, components, imagery
5. `COMPLIANCE.md`: claims you must never make, required disclaimers, consent
6. `TRACKING.md`: Meta Pixel, consent and outbound-link rules

If two files conflict, the order of authority is `COMPLIANCE.md` > `COPY.md` > `PRD.md` > `DESIGN.md` > this file. If something is missing, choose the simplest option consistent with these docs and list it under "Open questions" in your final summary. Do not invent facts, figures, testimonials, reviews, sales numbers or ratings.

## Stack (fixed)

- **Astro** (latest stable), static output (`output: 'static'`), TypeScript strict.
- **Tailwind CSS v4** via `@tailwindcss/vite`. Define design tokens in `src/styles/global.css` with `@theme`.
- Fonts self-hosted via `@fontsource` packages (no Google Fonts network call): **Playfair Display** (display), **Inter** (body/UI).
- Images through `astro:assets` (`<Image />` / `<Picture />`) with AVIF + WebP output, explicit width/height, lazy below the fold.
- **No UI framework** (no React/Vue/Svelte). Interactivity is minimal vanilla TypeScript in `<script>` tags: the FAQ uses `<details>`, the consent banner and sticky CTA are small scripts.
- Package manager: **npm**. Node LTS.
- Deploy target: any static host (Cloudflare Pages, Netlify or Vercel). No server code.

## Commands

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --no-git
npx astro add tailwind   # or install @tailwindcss/vite and wire it manually
npm run dev              # local dev
npm run build && npm run preview
```

The project root already contains these docs and `public/`. If `create-astro` refuses to run in a non-empty folder, scaffold into `./_scaffold`, move its contents into the root (do not overwrite the `.md` files or `public/images`, `public/og-image.jpg`), then delete `./_scaffold`.

## Project structure

```
src/
  config/site.ts          # ALL prices, Selar URLs, contact email, pixel ID, dates: single source of truth
  content/faq.ts          # FAQ items (from COPY.md)
  layouts/Base.astro      # <head>, SEO/OG tags, fonts, consent + pixel loader, footer
  components/             # one component per section (Hero, DeadRoutes, Method, Inside, LookInside,
                          # WhoFor, Bonus, PlanB, Offer, Honesty, Faq, FinalCta, StickyCta,
                          # ConsentBanner, Footer, CheckoutButton, PreviewLightbox)
  pages/
    index.astro           # Japa Right: Canada (main sales page)
    germany.astro         # Japa Right: Germany (upsell page)
    privacy.astro  terms.astro  refunds.astro  disclaimer.astro  404.astro
  assets/images/          # move public/images/* here so astro:assets can optimise them
public/
  favicon.svg  og-image.jpg  robots.txt
```

Images are supplied in `public/images/covers/` and `public/images/previews/`. Move them to `src/assets/images/` (same subfolders) so they are optimised at build. Keep `public/og-image.jpg` in `public/`.

## Non-negotiable rules

1. **Copy is fixed.** Use `COPY.md` word for word. You may adjust only line breaks for layout. If a string is too long for a component, flag it; do not rewrite it.
2. **Config, not hard-coding.** Every price, URL, date, email and ID comes from `src/config/site.ts`. Placeholder values in that file are marked `TODO`. Never put a real-looking price or link anywhere else.
3. **No fabricated social proof.** No testimonials, star ratings, "X people bought", countdown timers, fake scarcity or fake strikethrough prices. The `Testimonials` slot in `PRD.md` stays hidden until `site.testimonials` contains real entries.
4. **Compliance wording.** Run the banned-phrase check in `COMPLIANCE.md` before you finish. Zero matches allowed in rendered HTML.
5. **No tracking before consent.** The Meta Pixel loads only after the visitor accepts (see `TRACKING.md`).
6. **Performance budget** (mobile, Lighthouse, throttled 4G): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. LCP ≤ 2.5 s. Total JS shipped ≤ 15 KB gzipped (excluding the pixel after consent). Hero image is the LCP element: `loading="eager"`, `fetchpriority="high"`, correctly sized.
7. **Accessibility.** Semantic landmarks, one `<h1>` per page, visible focus states, colour contrast AA, all images with meaningful `alt` (preview pages: describe the page, e.g. "Sample page: the 12-question Pathway Finder worksheet"), tap targets ≥ 44 px, respects `prefers-reduced-motion`.
8. **Mobile first.** Design at 360 px wide first, then scale up. No horizontal scroll at any width from 320 px.
9. **Outbound checkout links** open in the same tab, carry the visitor's `utm_*` and `fbclid` parameters through (see `TRACKING.md`), and use `rel="noopener"`.

## Definition of done

- [ ] All pages in `PRD.md` exist and render with copy from `COPY.md`
- [ ] `npm run build` passes with zero errors and zero Astro check warnings (`npx astro check`)
- [ ] Banned-phrase check passes (`COMPLIANCE.md`)
- [ ] Lighthouse mobile scores meet the budget on `/` and `/germany`
- [ ] Consent banner blocks the pixel until accepted; the choice persists; "Cookie settings" in the footer reopens it
- [ ] Every CTA reads its URL from `site.ts`; UTM pass-through works (test with `?utm_source=test`)
- [ ] Tested at 320, 360, 414, 768, 1280 px
- [ ] Final summary lists: files created, every `TODO` left in `site.ts`, open questions, and how to deploy
