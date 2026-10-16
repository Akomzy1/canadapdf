import test from 'node:test';
import assert from 'node:assert/strict';
import { attributedUrl } from '../src/scripts/checkout.ts';
import { getConsent, saveConsent } from '../src/scripts/consent.ts';

test('checkout carries attribution without overwriting the checkout query', () => {
  const result = new URL(attributedUrl('https://checkout.example/book?utm_source=selar&ref=owner', 'https://landing.example/?utm_source=test&utm_medium=paid&utm_campaign=launch&utm_content=creative&utm_term=guide&fbclid=abc&private=ignore', 'hero'));
  assert.equal(result.searchParams.get('utm_source'), 'selar');
  for (const [key, value] of Object.entries({ utm_medium: 'paid', utm_campaign: 'launch', utm_content: 'creative', utm_term: 'guide', fbclid: 'abc', ref: 'owner' })) assert.equal(result.searchParams.get(key), value);
  assert.equal(result.searchParams.has('private'), false);
});
test('placement is a fallback and TODO anchor remains local', () => {
  assert.equal(new URL(attributedUrl('https://checkout.example/book', 'https://landing.example/', 'offer')).searchParams.get('utm_content'), 'offer');
  assert.equal(attributedUrl('#offer', 'https://landing.example/?utm_source=test', 'hero'), '#offer');
});
test('consent defaults safely, persists choice and timestamp, and denies on storage failure', () => {
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.equal(getConsent(), null);
  assert.equal(saveConsent('granted'), true);
  assert.equal(getConsent(), 'granted');
  assert.ok(JSON.parse(values.get('jr-consent')).timestamp > 0);
  saveConsent('denied'); assert.equal(getConsent(), 'denied');
  values.set('jr-consent', 'corrupted'); assert.equal(getConsent(), 'denied');
  globalThis.localStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.equal(getConsent(), 'denied'); assert.equal(saveConsent('granted'), false);
  delete globalThis.localStorage;
});
