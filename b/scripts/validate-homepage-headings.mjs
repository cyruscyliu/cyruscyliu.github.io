import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const defaultDistDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const homepageNames = { en: '55AA Security Lab', zh: '55AA 安全实验室' };

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'");
}

function headingText(markup) {
  return decodeHtml(markup.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
}

export async function validateHomepageHeadings({
  distDirectory = defaultDistDirectory,
  expectedNames = homepageNames,
} = {}) {
  const issues = [];

  for (const [language, expectedName] of Object.entries(expectedNames)) {
    const relativePath = path.join(language, 'index.html');
    let html;
    try {
      html = await readFile(path.join(distDirectory, relativePath), 'utf8');
    } catch (error) {
      issues.push(`${relativePath}: cannot read generated homepage (${error.message}).`);
      continue;
    }

    const h1Matches = [...html.matchAll(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi)];
    if (h1Matches.length !== 1) {
      issues.push(`${relativePath}: expected exactly one h1, found ${h1Matches.length}.`);
      continue;
    }

    const [, attributes, contents] = h1Matches[0];
    const actualName = headingText(contents);
    if (actualName !== expectedName) {
      issues.push(`${relativePath}: h1 must be "${expectedName}", found "${actualName}".`);
    }
    if (!/\bid=(?:"hero-title"|'hero-title')/i.test(attributes)) {
      issues.push(`${relativePath}: h1 must use id="hero-title".`);
    }
    if (!/<section\b[^>]*\baria-labelledby=(?:"hero-title"|'hero-title')[^>]*>/i.test(html)) {
      issues.push(`${relativePath}: hero section must reference the h1 with aria-labelledby="hero-title".`);
    }
    if ((html.match(/<h2\b/gi) ?? []).length === 0) {
      issues.push(`${relativePath}: expected section headings after the h1.`);
    }
  }

  return { homepageCount: Object.keys(expectedNames).length, issues };
}

async function main() {
  const result = await validateHomepageHeadings();
  if (result.issues.length > 0) {
    console.error(`Homepage heading validation failed with ${result.issues.length} issue(s):`);
    for (const issue of result.issues) console.error(`- ${issue}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Validated homepage headings: ${result.homepageCount} pages, one localized h1 per page.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) await main();
