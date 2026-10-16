import { domain } from '../config/site';
export function GET() { return new Response(`User-agent: *\nAllow: /\n${domain ? `Sitemap: ${new URL('/sitemap-index.xml', domain).href}\n` : ''}`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }); }
