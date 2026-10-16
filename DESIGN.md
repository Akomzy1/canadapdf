# DESIGN.md: Japa Right visual system

## Current user revision: premium single-page design

The requested redesign supersedes the original all-red hero and standalone Germany theme below. Use warm ivory for the opening, ink and deep-red display type, a thin-rule masthead, generous editorial spacing, the actual Canada cover as the lead artwork, and a smaller Resume Kit cover beside it on desktop. The free-resource section uses forest green with white text. Canada keeps the main red checkout action. Germany is a restrained night-and-gold upsell below Canada's offer, with additional detail collapsed in place. Preserve all existing tokens, self-hosted fonts, approved copy, meaningful image alt text, mobile-first behavior and accessibility requirements.

The site must look like it belongs with the three ebook covers in `public/images/covers/`. Study them first. Their language is **editorial and premium**: tall high-contrast serif display type, widely letter-spaced uppercase kickers, a thin gold rule, warm photography, rounded pill badges. Aim for the feel of a well-published book, not a "make money online" funnel. Never use neon gradients, emoji or exclamation-heavy styling.

## Colour tokens

Define in `src/styles/global.css` with Tailwind v4 `@theme`:

| Token | Hex | Use |
|---|---|---|
| `--color-canada` | `#B42318` | Canada accent, primary buttons on `/` |
| `--color-canada-deep` | `#7E140C` | Hero background on `/`, button hover |
| `--color-ink` | `#141414` | Body text, dark sections |
| `--color-night` | `#121417` | Germany hero, footer |
| `--color-gold` | `#C9A24A` | Thin rules, pill borders, small highlights |
| `--color-gold-bright` | `#F2C230` | Germany accent (on dark only) |
| `--color-cream` | `#F7F1E6` | Light section background, Resume Kit section |
| `--color-forest` | `#0E3B2E` | Resume Kit accent |
| `--color-paper` | `#FFFFFF` | Cards |
| `--color-muted` | `#5B5B5B` | Secondary text (AA on white and cream) |
| `--color-line` | `#E7E1D6` | Borders, dividers |

Contrast rules: white text only on `canada-deep`, `canada`, `night`, `forest`. Gold text only on `night`. Check every pairing for WCAG AA.

**Page themes:** `/` uses red (`canada-deep` hero, `canada` buttons). `/germany` uses night and gold (`night` hero, gold-bright button with ink text). Shared sections alternate `paper` and `cream` backgrounds.

## Typography

| Role | Font | Size (mobile → desktop) | Notes |
|---|---|---|---|
| Display H1 | Playfair Display 700 | 40 → 64 px, line-height 1.05 | Tight letter-spacing (−0.01em). Matches the cover serif |
| H2 | Playfair Display 700 | 30 → 44 px | |
| H3 / card titles | Inter 700 | 18 → 20 px | |
| Kicker | Inter 600, uppercase | 12 → 13 px, letter-spacing 0.22em | Gold or muted, preceded by a 24 px gold rule on desktop |
| Body | Inter 400 | 17 px, line-height 1.6 | Max line length 65ch |
| Small print | Inter 400 | 13–14 px | `muted` |

Self-host via `@fontsource/playfair-display` and `@fontsource/inter` (latin subset, `font-display: swap`). Preload the Playfair 700 file used by the H1.

## Layout

- Container max-width 1120 px; side padding 16 px (mobile), 24 px (tablet), 32 px (desktop).
- Section vertical padding 64 px mobile, 96 px desktop.
- Grid: 4-column mobile, 12-column desktop.
- Radius: 14 px cards, 999 px pills and buttons.
- Shadows: one soft shadow for covers only (`0 24px 48px -16px rgb(0 0 0 / .35)`). Cards use borders, not shadows.

## Components

- **CheckoutButton**: pill, 52 px tall, full width on mobile, Inter 700 16 px, label + price separated by a middle dot. Background `canada` (or gold-bright on `/germany`). Hover darkens; focus ring 3 px gold offset 2 px. Small lock icon (inline SVG) optional.
- **Trust chip**: pill, 1 px gold border, 13 px text, small check icon.
- **Dead-route card**: paper background, left 4 px `canada` border, label in uppercase 12 px `canada`, title H3, body. Small "✕ Dead route" tag top-right.
- **Method step**: big gold numeral (Playfair 48 px) above title and body; three in a row on desktop, stacked on mobile.
- **Inside grid**: 2 columns mobile, 3 desktop; number in a gold circle outline, title bold, description muted.
- **Look-inside strip**: preview pages at 3:4.3 ratio, white with a 1 px line border and subtle shadow; horizontal scroll with `scroll-snap-type: x mandatory` on mobile; 3×2 grid on desktop. Lightbox uses `<dialog>` with a dark backdrop.
- **Offer box**: cream card with a 1 px gold border, price in Playfair 40 px, list with gold check icons, CTA full width.
- **Sticky CTA**: fixed bottom, `night` background, white text, safe-area inset padding (`env(safe-area-inset-bottom)`), slides up with a 200 ms transform (none if reduced motion).
- **Consent banner**: bottom sheet on mobile, bottom-left card on desktop; two equal-weight buttons "Accept" and "Decline", link to Privacy.

## Imagery

- Covers: `covers/cover-canada.webp`, `cover-germany.webp`, `cover-resume.webp` (1000 × 1428). Display with the cover shadow, slight 2–3° tilt on desktop only.
- Hero on `/`: Canada cover in front, Resume Kit cover behind and offset (desktop); Canada cover alone on mobile, about 62% of viewport width.
- Previews: `previews/*.webp` (910 × 1300) real pages from the books.
- Do not use stock photos of passports, planes or smiling families. The covers and real pages are the visuals.
- `og-image.jpg` (1200 × 630) supplied for social sharing.

## Motion

Subtle only: 8–12 px fade-up on section entry using `IntersectionObserver`, 300 ms ease-out, disabled under `prefers-reduced-motion`. No parallax, no autoplay carousels.
