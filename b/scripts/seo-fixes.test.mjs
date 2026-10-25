import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const publicationsSource = await readFile(new URL('../src/pages/[lang]/publications/index.astro', import.meta.url), 'utf8');
const blogDetailSource = await readFile(new URL('../src/pages/[lang]/blog/[slug].astro', import.meta.url), 'utf8');
const siteHeaderSource = await readFile(new URL('../src/components/SiteHeader.astro', import.meta.url), 'utf8');
const seoHeadSource = await readFile(new URL('../src/components/SeoHead.astro', import.meta.url), 'utf8');
const projectDetailSource = await readFile(new URL('../src/pages/[lang]/projects/[slug].astro', import.meta.url), 'utf8');
const sitemapSource = await readFile(new URL('../scripts/generate-sitemap.mjs', import.meta.url), 'utf8');

test('publications pages keep one visually hidden h1', () => {
  assert.match(publicationsSource, /<h1 class="visually-hidden">\{config\.meta\.title\[lang\]\}<\/h1>/);
  assert.ok(publicationsSource.includes('.visually-hidden { position: absolute'));
});

test('blog language switch only renders when a translation exists', () => {
  assert.ok(blogDetailSource.includes('hasTranslation'));
  assert.match(blogDetailSource, /alternates=\{hasTranslation\}/);
  assert.match(blogDetailSource, /showLanguageSwitch=\{hasTranslation\}/);
  assert.ok(siteHeaderSource.includes('showLanguageSwitch = true'));
  assert.match(siteHeaderSource, /\{showLanguageSwitch && <a class="header-action"/);
});

test('bilingual blog hreflang also appears in the generated sitemap', () => {
  assert.ok(sitemapSource.includes('blogLanguagesByPath'));
  assert.ok(sitemapSource.includes('hasTranslations'));
  assert.ok(sitemapSource.includes('xhtml:link rel="alternate" hreflang="x-default"'));
});

test('project detail pages use a dedicated short seo description', () => {
  assert.ok(projectDetailSource.includes('seoDescription'));
  assert.match(projectDetailSource, /text\(project\.seoDescription\) \|\| description/);
});

test('social share image is the 1200x630 card', () => {
  assert.ok(seoHeadSource.includes("image = '/social-card.png'"));
  assert.ok(seoHeadSource.includes('og:image:width" content="1200"'));
  assert.ok(seoHeadSource.includes('og:image:height" content="630"'));
});
