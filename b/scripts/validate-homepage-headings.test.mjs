import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateHomepageHeadings } from './validate-homepage-headings.mjs';

async function createFixture(t, pages) {
  const distDirectory = await mkdtemp(path.join(tmpdir(), '55aa-homepage-headings-'));
  t.after(() => rm(distDirectory, { force: true, recursive: true }));
  for (const [language, html] of Object.entries(pages)) {
    await mkdir(path.join(distDirectory, language), { recursive: true });
    await writeFile(path.join(distDirectory, language, 'index.html'), html);
  }
  return distDirectory;
}

test('accepts one localized homepage h1 followed by section headings', async (t) => {
  const distDirectory = await createFixture(t, {
    en: '<section aria-labelledby="hero-title"><h1 id="hero-title">55AA Security Lab</h1></section><main><h2>News</h2></main>',
    zh: '<section aria-labelledby="hero-title"><h1 id="hero-title">55AA 安全实验室</h1></section><main><h2>新闻</h2></main>',
  });
  const result = await validateHomepageHeadings({ distDirectory });
  assert.deepEqual(result.issues, []);
  assert.equal(result.homepageCount, 2);
});

test('rejects missing, duplicate, or incorrectly named homepage h1 elements', async (t) => {
  const distDirectory = await createFixture(t, {
    en: '<section><h1>Wrong name</h1><h1>Duplicate</h1></section>',
    zh: '<section aria-labelledby="hero-title"><p id="hero-title">55AA 安全实验室</p></section><h2>新闻</h2>',
    fr: '<section><h1 id="wrong-id">Wrong name</h1></section><h2>Actualités</h2>',
  });
  const result = await validateHomepageHeadings({
    distDirectory,
    expectedNames: { en: '55AA Security Lab', zh: '55AA 安全实验室', fr: '55AA Security Lab' },
  });
  assert.ok(result.issues.some((issue) => issue.includes('en/index.html: expected exactly one h1, found 2')));
  assert.ok(result.issues.some((issue) => issue.includes('zh/index.html: expected exactly one h1, found 0')));
  assert.ok(result.issues.some((issue) => issue.includes('fr/index.html: h1 must be "55AA Security Lab", found "Wrong name"')));
  assert.ok(result.issues.some((issue) => issue.includes('fr/index.html: h1 must use id="hero-title"')));
  assert.ok(result.issues.some((issue) => issue.includes('fr/index.html: hero section must reference the h1')));
});
