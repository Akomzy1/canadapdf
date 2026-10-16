import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { domain, unsetFields, site } from './src/config/site.ts';

export default defineConfig({
  output: 'static',
  site: domain,
  integrations: [
    ...(domain ? [sitemap({ filter: url => new URL(url).pathname.replace(/\/$/, '') !== site.routes.legacyGermany })] : []),
    { name: 'japa-right-config-check', hooks: { 'astro:build:start': ({ logger }) => {
      const missing = unsetFields();
      if (missing.length) logger.warn(`Unset launch fields: ${missing.join(', ')}. Canonical and sitemap wait for a real domain.`);
    } } },
  ],
  vite: { plugins: [tailwind()] },
});
