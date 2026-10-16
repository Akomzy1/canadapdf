export const site = {
  brand: 'Japa Right',
  domain: 'TODO: https://japaright.com',
  contactEmail: 'TODO: hello@japaright.com',
  figuresCheckedOn: '16 October 2026',
  prices: { canada: 'TODO', germany: 'TODO', bundle: null as string | null },
  selar: { canada: 'TODO: https://selar.com/xxxx', germany: 'TODO: https://selar.com/xxxx', bundle: null as string | null },
  refundPolicy: 'TODO: Set the refund policy before launch.',
  governingLaw: 'TODO: Owner to choose the governing law.',
  metaPixelId: import.meta.env?.PUBLIC_META_PIXEL_ID ?? '', // TODO: Set PUBLIC_META_PIXEL_ID in the host environment.
  testimonials: [] as { name: string; city: string; text: string }[],
  dates: { edition: '2026/27', year: '2026', levelsPlan: '2027–2029', oldAdvice: '2023', pastChanges: '2025', jobPoints: '25 March 2025', ontario: '25 June 2026', spouse: '21 January 2025', annualThresholds: '1 January' },
  routes: { home: '/', germany: '/#germany', legacyGermany: '/germany', germanyOffer: '#germany-offer', bonus: '#bonus', previews: '#look-inside', privacy: '/privacy', terms: '/terms', refunds: '/refunds', disclaimer: '/disclaimer', offer: '#offer', inside: '#inside', main: '#main' },
  assets: { og: '/og-image.jpg', favicon: '/favicon.svg' },
  tracking: { script: 'https://connect.facebook.net/en_US/fbevents.js' },
  legal: { selarPrivacy: 'https://selar.com/privacy' },
  ui: { priceFallback: 'See price at checkout', todoBadge: 'TODO: set in site.ts', consent: 'We use the Meta Pixel for analytics and advertising only with your consent.', accept: 'Accept', decline: 'Decline', close: 'Close preview', skip: 'Skip to content', notFound: 'Page not found', notFoundBody: 'This page could not be found.', home: 'Back to Japa Right: Canada' },
};

export type Product = keyof typeof site.selar;
export const isUnset = (value: string | null | undefined) => !value || value.startsWith('TODO');
export const price = (product: Product) => isUnset(site.prices[product]) ? site.ui.priceFallback : site.prices[product]!;
export const checkoutUrl = (product: Product) => isUnset(site.selar[product]) ? (product === 'germany' ? site.routes.germanyOffer : site.routes.offer) : site.selar[product]!;
export const domain = isUnset(site.domain) ? undefined : site.domain;
export const contactUrl = isUnset(site.contactEmail) ? undefined : `mailto:${site.contactEmail}`;
export const unsetFields = () => [
  ...['domain', 'contactEmail', 'refundPolicy', 'governingLaw'].filter(key => isUnset(site[key as 'domain'])),
  ...(['canada', 'germany'] as const).flatMap(key => [isUnset(site.prices[key]) ? `prices.${key}` : '', isUnset(site.selar[key]) ? `selar.${key}` : '']).filter(Boolean),
  ...(!site.metaPixelId ? ['metaPixelId / PUBLIC_META_PIXEL_ID'] : []),
];
