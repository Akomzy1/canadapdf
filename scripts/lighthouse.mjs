import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';
const chrome = await launch({ chromeFlags: ['--headless=new', '--disable-gpu', '--no-first-run'], chromePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
await mkdir('qa', { recursive: true });
try {
  for (const [name, path] of [['single-page', '/']]) {
    const result = await lighthouse(`http://127.0.0.1:4321${path}`, { port: chrome.port, output: ['json', 'html'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    await writeFile(`qa/lighthouse-${name}.json`, result.report[0]);
    await writeFile(`qa/lighthouse-${name}.html`, result.report[1]);
    console.log(JSON.stringify({ page: name, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)])), lcp: result.lhr.audits['largest-contentful-paint'].numericValue, cls: result.lhr.audits['cumulative-layout-shift'].numericValue, failures: Object.values(result.lhr.audits).filter(a => a.score !== null && a.score < 1 && a.details).map(a => ({ id: a.id, title: a.title, value: a.displayValue })) }));
  }
} finally { chrome.kill(); }
