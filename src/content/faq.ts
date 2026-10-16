import { section, text } from './copy';
const parse = (block: string) => [...block.matchAll(/^\d+\. \*\*(.*?)\*\*\s+([\s\S]*?)(?=\n\n\d+\.|\n\d+\. |$)/gm)]
  .map(([,question,answer]) => ({ question: text(question), answer: text(answer.trim()) }));
export const canadaFaq = parse(section('Section: FAQ'));
export const germanyFaq = parse(section('Germany FAQ', true));
