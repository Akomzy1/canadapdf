# COMPLIANCE.md: claims, disclaimers and consent

This site is the destination for Meta ads about immigration information sold to Nigerians. Three sets of rules apply: Meta's advertising standards (landing pages are reviewed and must match the ad), Canadian law on immigration advice (IRPA s.91), and data-protection law (Nigeria Data Protection Act 2023, and UK GDPR because the business is UK-based). Breaking any of them can get the ad account disabled.

## 1. Never say (banned phrases)

Run this check against the built HTML (`dist/**/*.html`), case-insensitive. **Zero matches allowed.**

```
guarantee(d)? (visa|approval|job|pr|success)
100% (approval|success)
(easiest|fastest|quickest) (route|way|pathway)
visa sponsorship (list|jobs)
no ielts
without ielts
get your visa
approved in \d+
secret (route|method|loophole)
loophole
limited (time|spots|copies)
only \d+ (left|copies|spots)
\d+ people (bought|purchased)
as seen on
```

Example script (`scripts/check-claims.mjs`) the agent should create and add as `npm run check:claims`:

```js
import { readFileSync, globSync } from 'node:fs'; // fs.globSync: Node 22+
const patterns = [/guarantee(d)? (visa|approval|job|pr|success)/i, /100% (approval|success)/i,
  /(easiest|fastest|quickest) (route|way|pathway)/i, /visa sponsorship (list|jobs)/i, /no ielts/i,
  /without ielts/i, /get your visa/i, /approved in \d+/i, /secret (route|method|loophole)/i, /loophole/i,
  /limited (time|spots|copies)/i, /only \d+ (left|copies|spots)/i, /\d+ people (bought|purchased)/i, /as seen on/i];
let fail = 0;
for (const f of globSync('dist/**/*.html')) {
  const text = readFileSync(f, 'utf8').replace(/<[^>]+>/g, ' ');
  for (const p of patterns) if (p.test(text)) { console.error(`✗ ${f}: ${p}`); fail++; }
}
process.exit(fail ? 1 : 0);
```

(If `fs.globSync` is unavailable in the Node version, use the `glob` package.)

Note: COPY.md quotes some out-of-date claims inside the "dead routes" section (for example "+50 or +200 points"). Those are fine because they are presented as wrong. The phrase list above is written so that this copy passes.

## 2. Always true on the page

- **No outcome promises.** The product gives information; it does not promise visas, jobs, invitations or permanent residence.
- **No income or speed claims.** No "in 30 days", no "fast-track your visa".
- **No fake urgency or scarcity.** No countdown timers, "price goes up tonight" or stock counters.
- **No fabricated proof.** No testimonials, ratings, logos of media outlets, buyer counts or "featured in" badges unless real, verifiable and supplied by the owner.
- **Prices are real.** The displayed price equals the Selar price. No strikethrough "was" price unless the product was genuinely sold at that price before.
- **No impersonation.** No government logos, flags styled as official seals, maple-leaf or eagle emblems implying government endorsement, or wording like "official guide". Country names and the covers' imagery are fine.
- **Ad/page consistency.** Whatever an ad promises must be visibly delivered on this page.

## 3. Required disclaimers (copy in COPY.md)

- Footer disclaimer summary on every page.
- Offer-box small print: "General information, not legal or immigration advice."
- `/disclaimer` page including the IRPA s.91 statement.
- "Figures checked {{figuresCheckedOn}}" visible near the top of each sales page.

## 4. Consent and privacy

- No cookies or tracking scripts load before the visitor accepts the consent banner.
- "Decline" is as easy as "Accept" (same size and prominence).
- The choice is stored in `localStorage` (`jr-consent` = `granted` | `denied`, with a timestamp). Wrap all storage access in try/catch; if storage fails, treat as `denied`.
- Footer "Cookie settings" reopens the banner and lets the visitor change their mind; withdrawing consent stops future pixel loads (reload the page after a change).
- `/privacy` explains the Pixel, Selar's role and data rights under the NDPA 2023 and UK GDPR.

## 5. Accessibility is part of compliance

WCAG 2.2 AA as described in AGENTS.md. Disclaimers must be readable (≥ 13 px, AA contrast), not hidden or greyed out to near-invisibility.
