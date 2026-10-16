import { getConsent, saveConsent, type Consent } from './consent';
import { loadPixel, track, revokePixel } from './pixel';
import { attributedUrl } from './checkout';

const banner = document.querySelector<HTMLElement>('.consent-banner')!;
const sticky = document.querySelector<HTMLElement>('.sticky-cta');
let settingsOpener: HTMLElement | null = null;
function showBanner(show: boolean) {
  banner.hidden = !show;
  document.body.classList.toggle('consent-open', show);
  updateSticky();
}
document.querySelectorAll<HTMLButtonElement>('[data-cookie-settings]').forEach(button => button.addEventListener('click', () => {
  settingsOpener = button; showBanner(true); banner.querySelector<HTMLButtonElement>('button')?.focus();
}));
document.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach(button => button.addEventListener('click', () => {
  const previous = getConsent();
  const choice = button.dataset.consent as Consent;
  const persisted = saveConsent(choice);
  showBanner(false);
  if (choice === 'denied' || !persisted) {
    revokePixel();
    if (previous === 'granted') { window.location.reload(); return; }
  } else loadPixel();
  settingsOpener?.focus(); settingsOpener = null;
}));
window.addEventListener('storage', event => {
  if (event.key !== 'jr-consent') return;
  if (getConsent() === 'granted') loadPixel(); else { revokePixel(); window.location.reload(); }
});
document.querySelectorAll<HTMLAnchorElement>('[data-checkout]').forEach(link => {
  const prepare = () => { link.href = attributedUrl(link.dataset.checkoutUrl!, window.location.href, link.dataset.placement); };
  link.addEventListener('pointerdown', prepare);
  link.addEventListener('click', () => { prepare(); if (!link.dataset.checkoutUrl?.startsWith('#')) track('CheckoutClick', { product: link.dataset.product, placement: link.dataset.placement }); });
});
document.querySelectorAll<HTMLAnchorElement>('[data-companion]').forEach(link => {
  const destination = link.href;
  link.addEventListener('click', () => { link.href = attributedUrl(destination, window.location.href); });
});

const dialog = document.querySelector<HTMLDialogElement>('.preview-dialog');
let previewOpener: HTMLAnchorElement | null = null;
if (dialog) {
  document.querySelectorAll<HTMLAnchorElement>('[data-preview]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); previewOpener = link;
    const img = new Image(); img.src = link.href; img.alt = link.dataset.alt!; img.width = 910; img.height = 1300;
    dialog.querySelector('.lightbox-image')!.replaceChildren(img);
    dialog.showModal(); document.body.classList.add('lightbox-open');
    track('PreviewOpen', { page: link.dataset.name });
  }));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') { event.preventDefault(); dialog.querySelector<HTMLButtonElement>('.preview-close')?.focus(); }
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('lightbox-open'); previewOpener?.focus(); });
  let startX = 0, startY = 0;
  dialog.addEventListener('touchstart', event => { startX = event.changedTouches[0].clientX; startY = event.changedTouches[0].clientY; }, { passive: true });
  dialog.addEventListener('touchend', event => {
    const dx = event.changedTouches[0].clientX - startX, dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy) * 1.5) dialog.close();
  }, { passive: true });
}

let heroPassed = false;
const visibleBlockers = new Set<Element>();
function updateSticky() { if (sticky) sticky.hidden = !heroPassed || visibleBlockers.size > 0 || !banner.hidden; }
if (sticky) {
  const hero = document.querySelector('#hero-checkout');
  if (hero) new IntersectionObserver(entries => { heroPassed = entries[0].boundingClientRect.bottom <= 0; updateSticky(); }).observe(hero);
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) visibleBlockers.add(entry.target); else visibleBlockers.delete(entry.target); }); updateSticky(); }, { rootMargin: '0px 0px 100px 0px' });
  document.querySelectorAll('[data-sticky-hide]').forEach(element => observer.observe(element));
}
showBanner(getConsent() === null);
loadPixel();
