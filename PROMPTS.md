# PROMPTS.md: prompts for GPT-6 Astra (Codex in VS Code)

Use these in order. Run each one in a fresh task. Set reasoning effort to **high** for prompts 1 and 3, and medium for the rest.

---

## 1. Build the site (kick-off)

```
You are building the Japa Right landing site in this repository.

Before writing any code, read every Markdown file in the project root in this order:
AGENTS.md, PRD.md, COPY.md, DESIGN.md, COMPLIANCE.md, TRACKING.md.
They are the complete specification. Follow AGENTS.md's order of authority if anything conflicts.

Then:
1. Scaffold an Astro (latest stable, static, TypeScript strict) project in this folder with
   Tailwind CSS v4 via @tailwindcss/vite, @fontsource/playfair-display, @fontsource/inter and
   @astrojs/sitemap. Keep the existing .md files and public/ assets.
2. Move public/images/covers and public/images/previews into src/assets/images/ and use
   astro:assets for every image.
3. Create src/config/site.ts exactly as specified in PRD.md §7, with every unknown value left
   as a TODO.
4. Build every page and section listed in PRD.md, using COPY.md word for word and the tokens
   and components in DESIGN.md. Mobile first, starting at 360 px.
5. Implement the consent banner, the Meta Pixel loader and the CheckoutButton UTM
   pass-through exactly as in TRACKING.md and COMPLIANCE.md.
6. Add scripts/check-claims.mjs from COMPLIANCE.md as `npm run check:claims`.
7. Run `npx astro check`, `npm run build` and `npm run check:claims`, then fix everything
   until all three pass.

Do not invent testimonials, ratings, sales numbers, prices, links or any copy that isn't in
COPY.md. If something is missing or ambiguous, choose the simplest compliant option and list
it under "Open questions".

When you finish, reply with:
- the file tree you created
- every TODO still left in src/config/site.ts
- the results of astro check, build and check:claims
- open questions
- the exact commands to run locally and to deploy to Cloudflare Pages or Netlify
```

---

## 2. Fill in the real values (after you create the Selar products)

```
Update src/config/site.ts with these real values, and change nothing else:
- domain: https://YOUR-DOMAIN
- contactEmail: YOUR-EMAIL
- prices.canada: '₦XX,XXX'
- prices.germany: '₦XX,XXX'
- prices.bundle: '₦XX,XXX' (or null)
- selar.canada: https://selar.com/...
- selar.germany: https://selar.com/...
- selar.bundle: https://selar.com/... (or null)
- refundPolicy: 'YOUR REFUND SENTENCE'
Then rebuild, run check:claims, and confirm that no TODO badges or "See price at checkout"
fallbacks remain anywhere on the site.
```

---

## 3. Quality pass (mobile, performance, accessibility)

```
Audit the site against AGENTS.md's "Definition of done" and PRD.md §9 acceptance criteria.

1. Run Lighthouse in mobile mode (throttled) on / and /germany: npx lighthouse or
   unlighthouse. Fix every issue until Performance ≥ 90, Accessibility ≥ 95, Best Practices
   ≥ 95 and SEO ≥ 95, with LCP ≤ 2.5 s and CLS < 0.05.
2. Check total shipped JS (gzipped) is ≤ 15 KB before consent.
3. Use Playwright to screenshot / and /germany at 320, 360, 414, 768 and 1280 px. Look at
   every screenshot and fix overflow, clipped text, overlapping sticky CTA or banner, and
   tap targets under 44 px.
4. Test keyboard-only use: skip link, focus order, lightbox focus trap and return, FAQ.
5. Test the consent flow and pixel events using TRACKING.md's checklist (no pixel requests
   before Accept).
6. Re-run check:claims.

Report what you changed, the before and after Lighthouse scores, and anything you could
not fix.
```

---

## 4. Ad-to-page match (optional, once ads are written)

```
Here are my Meta ad texts: <paste ads>.
Check each ad against COPY.md and COMPLIANCE.md. For each ad, tell me:
(a) any claim that the landing page does not visibly support,
(b) any phrase that breaks COMPLIANCE.md or Meta's ad standards (personal-attribute
    wording like "Are you a Nigerian struggling to…", outcome promises, urgency),
(c) a compliant rewrite.
Do not change the site.
```

---

## 5. Deploy

```
Prepare this Astro site for deployment on Cloudflare Pages (or Netlify):
- add a short README.md section with build command (npm run build), output directory (dist)
  and the PUBLIC_META_PIXEL_ID environment variable;
- add security headers (_headers file): Content-Security-Policy that allows only self,
  connect.facebook.net and www.facebook.com for the pixel, plus X-Content-Type-Options,
  Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy;
- add long cache headers for /_astro/* and fonts;
- confirm robots.txt and sitemap URLs use site.domain.
Then build once more and confirm the dist output is ready to upload.
```
