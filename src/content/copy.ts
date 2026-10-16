import source from '../../COPY.md?raw';
import { price, site } from '../config/site';

// The approved source remains authoritative. Parse it at build time; no Markdown runtime ships.
const homeSource = source.split('## Home (`/`):')[1].split('## Germany (`/germany`):')[0];
const germanySource = source.split('## Germany (`/germany`):')[1].split('## Legal pages')[0];
const dateValues: Record<string, string> = {
  '25 March 2025': site.dates.jobPoints, '25 June 2026': site.dates.ontario,
  '21 January 2025': site.dates.spouse, '2026/27': site.dates.edition,
  '2027–2029': site.dates.levelsPlan, '2026': site.dates.year, '2023': site.dates.oldAdvice,
  '2025': site.dates.pastChanges, '1 January': site.dates.annualThresholds,
};
export function text(value: string): string {
  return value.replace(/\{\{(.*?)\}\}/g, (_, key: string) => {
    if (key === 'prices.canada') return price('canada');
    if (key === 'prices.germany') return price('germany');
    if (key === 'prices.bundle') return price('bundle');
    return String(site[key as keyof typeof site] ?? '');
  }).replace(/25 March 2025|25 June 2026|21 January 2025|2026\/27|2027–2029|2026|2023|2025|1 January/g, match => dateValues[match]);
}
export const rich = (value: string) => text(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
export function section(heading: string, germany = false): string {
  const match = (germany ? germanySource : homeSource).split(`### ${heading}\n`)[1];
  if (!match) throw new Error(`Missing approved copy section: ${heading}`);
  return match.split('\n### ')[0].split('\n---')[0].trim();
}
export function line(block: string, label: string): string {
  return text(block.split('\n').find(value => value.startsWith(`${label}: `))?.slice(label.length + 2) ?? '');
}
export const bullets = (block: string) => block.split('\n').filter(value => value.startsWith('- ')).map(value => text(value.slice(2)));
export const paragraphs = (block: string) => block.split('\n\n').filter(value => value && !value.startsWith('>'));
export const numbered = (block: string) => [...block.matchAll(/^\d+\. (.+?): (.+)$/gm)].map(([,title,description]) => ({title: text(title), description: text(description)}));
export const disclaimer = line(section('Footer'), 'Disclaimer summary');
