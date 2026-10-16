import { readFileSync, globSync } from 'node:fs';
const patterns = [/guarantee(d)? (visa|approval|job|pr|success)/i, /100% (approval|success)/i,
  /(easiest|fastest|quickest) (route|way|pathway)/i, /visa sponsorship (list|jobs)/i, /no ielts/i,
  /without ielts/i, /get your visa/i, /approved in \d+/i, /secret (route|method|loophole)/i, /loophole/i,
  /limited (time|spots|copies)/i, /only \d+ (left|copies|spots)/i, /\d+ people (bought|purchased)/i, /as seen on/i];
let fail = 0;
const files = globSync('dist/**/*.html');
if (!files.length) throw new Error('Build the site before checking claims.');
for (const file of files) {
  const text = readFileSync(file, 'utf8').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  for (const pattern of patterns) if (pattern.test(text)) { console.error(`${file}: ${pattern}`); fail++; }
}
console.log(`${files.length} pages checked; ${fail} banned-phrase matches.`);
process.exit(fail ? 1 : 0);
