import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.QA_URL || 'http://127.0.0.1:4321';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('qa', { recursive: true });
const results = [];
try {
  for (const route of process.env.QA_PIXEL_ONLY ? [] : ['/']) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.error('Page error:', error.message); });
    const pixelRequests = [];
    page.on('request', request => { if (/connect\.facebook\.net|facebook\.com\/tr/.test(request.url())) pixelRequests.push(request.url()); });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('#inside .inside-grid > li').count(), 12);
    assert.equal(await page.locator('#germany .inside-grid > li').count(), 12);
    assert.equal(await page.locator('.faq-items details').count(), 9);
    assert.equal(await page.locator('#bonus .bonus-grid > li').count(), 6);
    assert.equal(await page.locator('[data-product="germany"][data-checkout]').count(), 1);
    assert.equal(await page.locator('[data-product="germany"][data-checkout]').getAttribute('href'), '#germany-offer');
    assert.ok(await page.locator('#offer').evaluate(el => el.compareDocumentPosition(document.querySelector('#germany')) & Node.DOCUMENT_POSITION_FOLLOWING));
    assert.equal(pixelRequests.length, 0);
    await page.getByRole('button', { name: 'Decline', exact: true }).click();
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.consent-banner').isVisible(), false);
    for (const width of [320, 360, 414, 768, 1280]) {
      await page.setViewportSize({ width, height: width < 768 ? 740 : 900 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
      const geometry = await page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth, heroImageTop: document.querySelector('.main-cover img').getBoundingClientRect().top, ctaBottom: document.querySelector('#hero-checkout').getBoundingClientRect().bottom }));
      assert.ok(geometry.scroll <= width, `${route} horizontal overflow at ${width}: ${geometry.scroll}`);
      if (width === 360) { assert.ok(geometry.ctaBottom < 740, `${route}: hero CTA below first fold`); assert.ok(geometry.heroImageTop < 740, `${route}: cover below first fold`); }
      await page.screenshot({ path: `qa/${route === '/' ? 'canada' : 'germany'}-${width}.png` });
      results.push({ route, width, ...geometry });
    }
    await page.evaluate(async () => { for (const img of document.images) img.loading = 'eager'; await Promise.all([...document.images].map(img => img.decode().catch(() => {}))); });
    await page.screenshot({ path: `qa/${route === '/' ? 'canada' : 'germany'}-full.png`, fullPage: true });
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    results.push({ route, accessibilityViolations: axe.violations.map(v => ({ id: v.id, description: v.description, nodes: v.nodes.map(n => n.target) })) });
    assert.equal(axe.violations.length, 0, JSON.stringify(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))));
    const preview = page.locator('[data-preview]').first();
    await preview.click();
    assert.equal(await page.locator('dialog').evaluate(el => el.open), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.closest('dialog') !== null), true);
    await page.keyboard.press('Escape');
    assert.equal(await preview.evaluate(el => el === document.activeElement), true);
    if (route === '/') {
      await page.setViewportSize({ width: 360, height: 740 });
      await page.locator('#inside').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => !document.querySelector('.sticky-cta').hidden);
      await page.locator('#offer').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.sticky-cta').hidden);
      await page.locator('#germany-offer').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.sticky-cta').hidden);
      await page.locator('#germany .upsell-details > details').nth(1).locator('summary').click();
      const germanPreview = page.locator('#germany [data-preview]').first();
      await germanPreview.click();
      assert.equal(await page.locator('dialog').evaluate(el => el.open), true);
      await page.keyboard.press('Escape');
      await page.locator('.footer').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.sticky-cta').hidden);
    }
    await page.getByRole('button', { name: 'Cookie settings', exact: true }).click();
    assert.equal(await page.locator('.consent-banner').isVisible(), true);
    await page.getByRole('button', { name: 'Accept', exact: true }).click();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('jr-consent')).choice), 'granted');
    assert.equal(pixelRequests.length, 0, 'Empty Pixel ID should never contact Meta');
    await page.goto(base + '/germany?utm_source=legacy&fbclid=legacy-test', { waitUntil: 'networkidle' });
    await page.waitForURL(url => url.pathname === '/' && url.hash === '#germany');
    assert.equal(new URL(page.url()).searchParams.get('utm_source'), 'legacy');
    assert.equal(new URL(page.url()).searchParams.get('fbclid'), 'legacy-test');
    assert.deepEqual(errors, []);
    await context.close();
  }
  // Exercise real script loading and events against a local stub, never Meta.
  const context = await browser.newContext({ viewport: { width: 360, height: 740 } });
  await context.route('**/fbevents.js', route => route.fulfill({ contentType: 'application/javascript', body: 'window.__pixelEvents = window.fbq.queue.slice(); window.fbq.callMethod = (...args) => window.__pixelEvents.push(args);' }));
  await context.route(base + '/?*', async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace(/data-pixel-id(?:="")?(?=\s)/, 'data-pixel-id="TEST_ONLY"');
    await route.fulfill({ response, body });
  });
  const page = await context.newPage();
  await page.goto(base + '/?utm_source=test&utm_campaign=qa&fbclid=abc');
  assert.equal(await page.locator('#jr-meta-pixel').count(), 0);
  await page.getByRole('button', { name: 'Accept', exact: true }).click();
  await page.waitForFunction(() => window.__pixelEvents?.some(e => e[1] === 'ViewContent'));
  assert.equal(await page.evaluate(() => window.__pixelEvents.filter(e => e[1] === 'PageView').length), 1);
  await page.locator('[data-preview]').first().click();
  assert.equal(await page.evaluate(() => window.__pixelEvents.some(e => e[0] === 'trackCustom' && e[1] === 'PreviewOpen')), true);
  await page.keyboard.press('Escape');
  await page.locator('[data-checkout]').evaluateAll(links => links.forEach(link => {
    link.dataset.checkoutUrl = 'https://checkout.example/book';
    link.addEventListener('click', event => event.preventDefault(), { once: true });
  }));
  for (const link of await page.locator('[data-checkout]').all()) await link.dispatchEvent('click');
  const checkoutEvents = await page.evaluate(() => window.__pixelEvents.filter(event => event[1] === 'CheckoutClick').map(event => event[2]));
  assert.deepEqual(checkoutEvents.map(event => event.placement).sort(), ['final', 'hero', 'offer', 'planb', 'sticky']);
  assert.equal(checkoutEvents.find(event => event.placement === 'planb').product, 'germany');
  assert.ok(checkoutEvents.filter(event => event.placement !== 'planb').every(event => event.product === 'canada'));
  await page.locator('#hero-checkout').evaluate(el => { el.dataset.checkoutUrl = 'https://checkout.example/book'; });
  await page.route('https://checkout.example/**', route => route.fulfill({ body: '<h1>Test checkout</h1>', contentType: 'text/html' }));
  await page.locator('#hero-checkout').click();
  await page.waitForURL('https://checkout.example/**');
  const url = new URL(page.url());
  assert.equal(url.searchParams.get('utm_source'), 'test');
  assert.equal(url.searchParams.get('fbclid'), 'abc');
  assert.equal(url.searchParams.get('utm_content'), 'hero');
  await page.goto(base + '/?utm_source=test');
  await page.waitForFunction(() => window.__pixelEvents?.some(e => e[1] === 'ViewContent'));
  await page.getByRole('button', { name: 'Cookie settings', exact: true }).click();
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('#jr-meta-pixel').count(), 0);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('jr-consent')).choice), 'denied');
  await context.close();
  console.log(process.env.QA_PIXEL_ONLY ? 'Pixel stub, checkout-event placements, UTM navigation and consent withdrawal passed.' : 'Single-page QA passed: five viewport checks, Canada/bonus/upsell structure, legacy redirect, accessibility, lightbox, sticky CTA, consent, Pixel events and UTM navigation.');
} finally {
  if (results.length) await writeFile('qa/browser-results.json', JSON.stringify(results, null, 2));
  await browser.close();
}
