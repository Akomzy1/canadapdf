# PRD.md: Japa Right landing site v1

## Current user revision: one premium sales page

The user has replaced the original two-landing-page structure with one landing page. Canada remains the main product; the Canadian Resume Kit and its included resources are free with Canada; Germany is an optional upsell on the same page. This revision supersedes the older route and section-order instructions below where they conflict.

- `/` is the only sales page. The approved Canada copy remains verbatim.
- `#bonus` presents the kit and its six included resources without a separate paid CTA.
- `#offer` is the primary Canada purchase box, followed by `#germany` for the optional Germany purchase.
- Germany retains its own configured Selar URL, price and `CheckoutClick` product. Its checkout placement is `planb`. Its contents, previews and FAQ expand in place.
- `/germany` is a compatibility redirect to `/#germany`, preserving supported UTM parameters and `fbclid`; it is excluded from the sitemap.
- Shared footer links point to the Germany section. Legal pages remain separate.
- Use the premium ivory/red/forest treatment described by the current revision in DESIGN.md. Keep the same performance, accessibility, consent and copy requirements.
- All TODO checkout URLs remain local anchors. Germany falls back to `#germany-offer`, never the Canada purchase box.

## 1. Goal

Turn Meta ad clicks into Selar checkouts for **Japa Right: Canada** (main product, with a free bonus), and offer **Japa Right: Germany** as a companion purchase.

Primary metric: click-through from landing page to Selar checkout (target ≥ 8% of landing sessions).
Secondary: Germany add-on click-through from `/germany` and from the Plan B section.

## 2. Audience

- Nigerians aged roughly 24–45, mostly in Lagos, Abuja, Port Harcourt and other cities, graduates or HND holders with work experience, some with French or nursing backgrounds.
- They have seen "easy route", "visa sponsorship" and "no IELTS" offers, and many have lost money to agents. **Trust is the main barrier**, not interest.
- Device: Android phone, Chrome or the in-app Facebook/Instagram browser, mobile data. Assume a slow network and a small screen.

## 3. The products (facts to use; do not exaggerate)

| Product | Format | Size | Contents |
|---|---|---|---|
| **Japa Right: Canada 2026/27** | PDF | 76 pages | 12 parts + 5 appendices: Pathway Finder; Canada in 2026 (open/changed/dead); Express Entry with full CRS tables; the French route; provincial programs; employer routes (RCIP, FCIP, AIP, LMIA); study to PR; the document factory (Nigeria edition); the 60-day chain after an invitation; refusals and fraud; first 90 days; Plan B. Appendices: glossary, official sources, master checklist, cost planner, verification log |
| **Bonus: The Canadian Resume Kit** | PDF + editable Word template | 21 pages | Canadian resume rules, fill-in template, full before-and-after makeover, cover letter template, Express Entry employer reference-letter template, job-search toolkit |
| **Japa Right: Germany 2026/27** | PDF | 62 pages | 12 parts + 5 appendices: Germany Pathway Finder; 2026 numbers; recognition (anabin, ZAB, nurses, HND); Opportunity Card points line by line; Blue Card and job-offer routes; Ausbildung; study; German plan; documents and the Lagos visa appointment; job search; refusals and scams; first 90 days |

Figures in all books were checked on **16 October 2026**. Buyers get free updated 2026/27 editions (next update after Canada's 2027–2029 levels plan, due by 1 November 2026).

## 4. Pages

| Route | Purpose |
|---|---|
| `/` | Canada sales page (main ad destination) |
| `/germany` | Germany sales page (upsell; also linked from the Plan B section and footer) |
| `/privacy` | Privacy policy (NDPA 2023 and UK GDPR basics; Meta Pixel; Selar as processor for payments) |
| `/terms` | Terms of sale and licence (one buyer, no resale/sharing) |
| `/refunds` | Refund policy (text from `COPY.md`; owner sets terms in `site.ts`) |
| `/disclaimer` | Full legal disclaimer (not legal advice; IRPA s.91; no affiliation) |
| `/404` | Friendly not-found page with a link home |

## 5. `/` section order (copy in `COPY.md` §Home)

1. **Announcement bar**: dated trust line.
2. **Hero**: H1, sub-headline, primary CTA (`CheckoutButton` → Canada), secondary text link "See what's inside ↓", cover image (Canada cover, with the Resume Kit cover tucked behind it on ≥ 768 px), trust chips.
3. **"Most Canada guides are out of date"**: three dated "dead route" cards.
4. **The method**: three numbered steps.
5. **What's inside**: 12-part grid + appendices line.
6. **Look inside**: horizontally scrollable strip of 6 preview pages (snap scrolling on mobile, grid on desktop); tap to open a lightbox (`<dialog>`), keyboard and swipe close.
7. **Who it's for / not for**: two columns (stack on mobile).
8. **Free bonus**: Resume Kit cover + bullets.
9. **Plan B: Germany**: Germany cover, short pitch, link to `/germany`.
10. **Offer box**: what you get, price from `site.prices.canada`, CTA, small print (instant download via Selar, free 2026/27 updates, refund line).
11. **The honest part**: what this book will not do (trust section).
12. **FAQ**: `<details>` accordion, first item open.
13. **Final CTA**.
14. **Footer**: links, disclaimer summary, cookie settings, © line.
15. **Sticky mobile CTA bar** (< 768 px): appears after the hero CTA scrolls out of view; hides when the Offer box or Final CTA is visible. Shows the price + button.

Testimonials slot (between 11 and 12): render only if `site.testimonials.length > 0`. Each entry needs name, city and text, and is shown with the visitor's permission. Ship it empty.

## 6. `/germany` section order (copy in `COPY.md` §Germany)

Announcement bar → Hero (Germany cover, CTA → Germany) → "Why Germany is a strong Plan B" comparison table → What's inside (12 parts) → Look inside (2 previews) → Offer box (`site.prices.germany`; if `site.selar.bundle` is set, show the bundle option too) → FAQ (Germany subset) → Footer.

## 7. `src/config/site.ts` (single source of truth)

```ts
export const site = {
  brand: 'Japa Right',
  domain: 'TODO: https://japaright.com',
  contactEmail: 'TODO: hello@japaright.com',
  figuresCheckedOn: '16 October 2026',
  prices: {            // display strings, naira, exactly as on Selar
    canada: 'TODO',    // e.g. '₦15,000'. Must match Selar
    germany: 'TODO',
    bundle: null as string | null,
  },
  selar: {
    canada: 'TODO: https://selar.com/xxxx',
    germany: 'TODO: https://selar.com/xxxx',
    bundle: null as string | null,
  },
  refundPolicy: 'TODO: e.g. 7-day money-back guarantee if the guide does not meet the description',
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID ?? '',
  testimonials: [] as { name: string; city: string; text: string }[],
};
```

Behaviour when a value is still `TODO`: in dev, show a small red "TODO: set in site.ts" badge where it renders; in production builds, a price falls back to "See price at checkout" and the build logs a warning listing every unset field. CTA buttons with a `TODO` URL link to `#offer` instead of breaking.

## 8. SEO and sharing

- `<title>`: "Japa Right: Canada 2026/27 | The honest DIY route map for Nigerians"
- Meta description from `COPY.md`.
- Open Graph + Twitter card using `/og-image.jpg` (1200×630, supplied).
- Canonical URL from `site.domain`. `robots.txt` allows all; add `sitemap` via `@astrojs/sitemap`.
- Structured data: `Product` schema per book (name, description, image, offers with price in NGN only when the price is set). **No `aggregateRating` or `review`.**

## 9. Acceptance criteria

- Above the fold at 360 × 740: H1, sub-headline, CTA button and part of the cover visible without scrolling.
- Every CTA goes to the right Selar URL with UTM pass-through.
- Look-inside lightbox works with touch, mouse and keyboard; focus is trapped while open and returned on close.
- Sticky CTA never covers the cookie banner or the footer links.
- No layout shift from fonts or images (CLS < 0.05).
- All copy matches `COPY.md`; banned-phrase check passes.
