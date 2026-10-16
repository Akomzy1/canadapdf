# TRACKING.md: Meta Pixel, consent and outbound links

## Principles

- Selar's own Meta Pixel and Conversions API integration tracks **purchases**. The owner enters the same Pixel ID in Selar. This site does **not** fire `Purchase`, and does not fire `InitiateCheckout` either (Selar's checkout does), so nothing is double-counted.
- This site tracks only page views, content views and clicks to checkout, and only after consent.

## Setup

- Pixel ID comes from `PUBLIC_META_PIXEL_ID` (`.env`, also set in the hosting dashboard). If it is empty, never load the pixel, and log a dev-only console note.
- Create `src/scripts/pixel.ts` exporting `loadPixel()` and `track(event, params?)`. `loadPixel()` injects the standard Meta base code only when `jr-consent === 'granted'`. `track()` is a no-op until the pixel is loaded.

## Events

| When | Event | Parameters |
|---|---|---|
| Consent granted (or page load with consent already stored) | `PageView` | — |
| Page load with consent, on `/` | `ViewContent` | `{ content_name: 'Japa Right: Canada', content_category: 'ebook', currency: 'NGN' }` |
| Page load with consent, on `/germany` | `ViewContent` | `{ content_name: 'Japa Right: Germany', content_category: 'ebook', currency: 'NGN' }` |
| Any CheckoutButton click | `trackCustom('CheckoutClick')` | `{ product: 'canada' \| 'germany' \| 'bundle', placement: 'hero' \| 'offer' \| 'sticky' \| 'final' \| 'planb' }` |
| Lightbox opened | `trackCustom('PreviewOpen')` | `{ page: '<image name>' }` |

If you add a numeric `value`, use the real price from `site.ts`, parsed from the display string, never a made-up figure.

## Outbound checkout links (UTM pass-through)

`CheckoutButton` builds its `href` at click time:

1. Start from the Selar URL in `site.ts`.
2. Copy any `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` and `fbclid` from the current page URL onto the Selar URL (do not overwrite parameters already on it).
3. Add `utm_content=<placement>` only if no `utm_content` exists.
4. Navigate in the same tab.

The server-rendered `href` must be the plain Selar URL, so the link works with JavaScript disabled.

## Testing checklist

- [ ] With no consent: Network tab shows no request to `connect.facebook.net` or `facebook.com/tr`
- [ ] Accept → `PageView` and `ViewContent` fire (verify with Meta Pixel Helper or Events Manager Test Events)
- [ ] Click each CTA → `CheckoutClick` with the correct `placement`
- [ ] `/?utm_source=fb&utm_campaign=test&fbclid=abc` → Selar link carries all three
- [ ] Decline → reload → still no pixel requests
