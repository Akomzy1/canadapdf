# Japa Right

One static Astro sales page: Canada is the main purchase, the Canadian Resume Kit and its templates are included free, and Germany is the optional upsell below the Canada offer. The approved sales copy is parsed from `COPY.md` at build time. No UI framework, remote font request, or client-side Markdown renderer is shipped.

The current user brief supersedes the original two-sales-page layout in `PRD.md` and the original hero treatment in `DESIGN.md`. The new design uses warm ivory, deep red, forest green, larger book artwork and restrained editorial layouts. `/germany` is now a compatibility redirect to `/#germany`, preserving supported ad-attribution parameters. Legal pages remain separate. Germany’s table of contents, sample pages and FAQ expand within the main page. The free kit remains included with Canada; it is not a separate paid checkout.

## Local development

Use Node 24 LTS and npm. From this cloned repository:

```sh
npm ci
npm run dev
```

On Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`.

```sh
npm run check
npm test
npm run build
npm run check:claims
npm run preview
```

If Astro telemetry cannot write to the user profile in a restricted environment, set `ASTRO_TELEMETRY_DISABLED=1`. On Windows systems with a managed certificate authority, `NODE_USE_SYSTEM_CA=1` lets npm use the Windows trust store; TLS verification stays enabled.

## Before launch

Set these fields in `src/config/site.ts`:

- `domain`
- `contactEmail`
- `prices.canada`, `prices.germany`
- `selar.germany`
- `governingLaw`
- `PUBLIC_META_PIXEL_ID` in the host environment, if tracking is wanted

`prices.bundle` and `selar.bundle` intentionally default to `null`. Set both to show the optional offer. Testimonials remain empty until genuine, permissioned entries are supplied.

An unset price displays “See price at checkout”. An unset checkout URL points to `#offer` for Canada or `#germany-offer` for Germany. Development also shows red TODO badges. Email and governing-law placeholders stay visible so that incomplete legal terms cannot look final. Build warnings list all unset launch fields. Canonical URLs and sitemap generation activate only when the domain is real; `robots.txt` is generated from the same configuration. Do not run paid ads before the commercial and legal settings are filled in and reviewed.

The owner-supplied refund policy was added on 17 October 2026. `/refunds` contains the full wording, including support through the Selar receipt, the two-working-day file-resolution commitment and the consumer-rights qualification. Both purchase offers show the policy introduction and consumer-rights qualification with a link to the full policy.

The Canada checkout is configured as `https://selar.com/1h92g1w281`. Its display price remains unset until the matching Selar price is supplied or verified.

Consent is stored as `{ choice: 'granted' | 'denied', timestamp: number }` under `jr-consent`. Storage failure means denied. Meta is never contacted before consent or with an empty Pixel ID. Cookie settings reopens the choice; withdrawal revokes the Pixel and reloads the page. Purchase and InitiateCheckout events belong to Selar and are not fired here.

## Browser verification

With `npm run preview -- --host 127.0.0.1` running, and Chrome installed:

```sh
node scripts/browser-qa.mjs
node scripts/lighthouse.mjs
```

Screenshots, accessibility results and Lighthouse reports go into ignored `qa/`. Browser tests use an intercepted Pixel stub and example checkout, so no real advertising events or payments occur. Unit tests cover UTM precedence and storage failure. The image previews link to full-size optimized images when JavaScript is disabled.

The single-page QA suite checks 320, 360, 414, 768 and 1280 px, WCAG A/AA accessibility, primary/bonus/upsell structure, native-dialog keyboard focus, persisted consent, withdrawal, sticky CTA visibility, checkout attribution and locally stubbed Pixel events. It also checks that the old Germany URL redirects to the upsell without losing attribution. Reports and screenshots are regenerated in `qa/`; historical two-page Lighthouse scores do not apply to this redesign. Live Meta Events Manager verification still requires the owner's real Pixel ID.

The rebuilt single page passed browser QA at all five widths with no accessibility violations. The local mobile Lighthouse run on 16 October 2026 scored Performance 100, Accessibility 100, Best Practices 100 and SEO 100, with LCP 1.54 seconds and CLS 0.002. These measurements describe the local production build; hosting and network conditions can change them. The compiled JavaScript totals approximately 1.9 KB gzipped, excluding the optional consent-gated Pixel.

## Deploy to Cloudflare Pages

Connect this repository to a Pages project, select Node 24, set the build command to `npm run build`, and the output directory to `dist`. Set `PUBLIC_META_PIXEL_ID` if used. Or deploy a local build with Wrangler after authenticating:

```sh
npm ci
npm run check
npm test
npm run build
npm run check:claims
npx wrangler pages deploy dist --project-name YOUR_PAGES_PROJECT
```

## Deploy to Netlify

Connect the repository; `netlify.toml` supplies the build command, Node version and output folder. Set the same environment variable in the dashboard. Or deploy the checked local output:

```sh
npx netlify deploy --dir=dist
npx netlify deploy --prod --dir=dist
```

No server runtime or adapter is required. Keep `src/assets/images` in source control; never upload the paid PDF source books to `public/`.

## Implementation decisions and owner review

- `COMPLIANCE.md` takes precedence over the shorter German offer disclaimer, so both offers say “General information, not legal or immigration advice.”
- The source provides legal outlines, but no exact consent sentence, accessibility control labels or 404 wording. Minimal functional wording is centralized in `site.ui`; legal pages follow the supplied outlines and need owner review.
- Dates within the approved source are substituted from `site.dates` at build time. The marketing claims have been reproduced as supplied, not independently fact-checked.
- Basic legal-source references used when drafting the supplied outlines: [IRPA section 91](https://laws-lois.justice.gc.ca/eng/acts/i-2.5/section-91.html), [ICO individual rights](https://ico.org.uk/for-the-public/), [Nigeria Data Protection Commission](https://ndpc.gov.ng/). These references do not replace owner review of policies.
- The screenshot and performance reports describe a local build. Verify the final public domain, Selar prices/links, live Pixel events in Meta Events Manager, and the host’s delivery behavior before advertising.

## Source layout

```text
src/
  assets/images/{covers,previews}/
  config/site.ts
  content/{copy,faq}.ts
  layouts/{Base,Legal}.astro
  components/    # sections, covers, checkout, consent and preview controls
  pages/         # /, /germany, legal pages, 404, robots.txt
  scripts/       # consent, checkout attribution, Pixel and UI behavior
  styles/global.css
public/          # social image, favicon, hosting headers
scripts/         # claims, browser QA and Lighthouse
tests/           # meaningful consent and attribution tests
```
