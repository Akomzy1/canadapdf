import { getConsent } from './consent';
type Pixel = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; push: Pixel; loaded: boolean; version: string };
declare global { interface Window { fbq?: Pixel; _fbq?: Pixel } }
let loaded = false;
export function loadPixel() {
  if (loaded || getConsent() !== 'granted') return;
  const id = document.body.dataset.pixelId;
  const src = document.body.dataset.pixelSrc;
  if (!id || !src) { if (import.meta.env.DEV) console.info('Meta Pixel disabled: set PUBLIC_META_PIXEL_ID.'); return; }
  const fbq = function (...args: unknown[]) { if (fbq.callMethod) fbq.callMethod(...args); else fbq.queue.push(args); } as Pixel;
  fbq.queue = []; fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0';
  window.fbq = window._fbq = fbq;
  fbq('consent', 'grant'); fbq('init', id);
  const script = document.createElement('script'); script.async = true; script.src = src; script.id = 'jr-meta-pixel';
  document.head.append(script); loaded = true;
  track('PageView');
  const product = document.body.dataset.product;
  if (product) track('ViewContent', { content_name: `Japa Right: ${product === 'canada' ? 'Canada' : 'Germany'}`, content_category: 'ebook', currency: 'NGN' });
}
export function track(event: 'PageView' | 'ViewContent' | 'CheckoutClick' | 'PreviewOpen', params?: Record<string, unknown>) {
  if (!loaded || getConsent() !== 'granted' || !window.fbq) return;
  window.fbq(event === 'CheckoutClick' || event === 'PreviewOpen' ? 'trackCustom' : 'track', event, params);
}
export function revokePixel() { window.fbq?.('consent', 'revoke'); loaded = false; }
