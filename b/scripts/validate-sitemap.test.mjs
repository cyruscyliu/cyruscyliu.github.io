import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateSitemap } from './validate-sitemap.mjs';

const site = 'https://www.55aaseclab.com';

const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

async function createFixture(t, { locations, pages = {} }) {
  const directory = await mkdtemp(path.join(tmpdir(), '55aa-sitemap-'));
  t.after(() => rm(directory, { force: true, recursive: true }));
  const distDirectory = path.join(directory, 'dist');
  await mkdir(distDirectory, { recursive: true });
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locations.map((location) => `  <url><loc>${escapeXml(location)}</loc></url>`).join('\n')}
</urlset>
`;
  await writeFile(path.join(distDirectory, 'sitemap.xml'), sitemap);

  for (const [url, { canonical = url, robots = 'index, follow' }] of Object.entries(pages)) {
    const pathname = new URL(url).pathname.replace(/^\/+/, '');
    const outputPath = path.join(distDirectory, pathname, 'index.html');
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `<!doctype html><html><head>
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${robots}">
</head><body>Fixture</body></html>`);
  }

  return { distDirectory };
}

test('accepts a unique generated canonical page', async (t) => {
  const url = `${site}/en/blog/example/`;
  const fixture = await createFixture(t, { locations: [url], pages: { [url]: {} } });
  const result = await validateSitemap(fixture);
  assert.deepEqual(result.issues, []);
  assert.equal(result.locationCount, 1);
  assert.equal(result.generatedFileCount, 1);
  assert.equal(result.htmlPageCount, 1);
});

test('rejects duplicate sitemap URLs', async (t) => {
  const url = `${site}/en/blog/example/`;
  const fixture = await createFixture(t, { locations: [url, url], pages: { [url]: {} } });
  const result = await validateSitemap(fixture);
  assert.ok(result.issues.some((issue) => issue.includes('duplicate <loc> URL')));
});

test('rejects a sitemap URL without generated output', async (t) => {
  const brokenUrl = `${site}/en/blog/en/example/`;
  const fixture = await createFixture(t, { locations: [brokenUrl] });
  const result = await validateSitemap(fixture);
  assert.ok(result.issues.some((issue) => issue.includes('missing generated output')));
});

test('rejects canonical mismatches and noindex pages', async (t) => {
  const url = `${site}/en/blog/example/`;
  const fixture = await createFixture(t, {
    locations: [url],
    pages: { [url]: { canonical: `${site}/zh/blog/example/`, robots: 'noindex, follow' } },
  });
  const result = await validateSitemap(fixture);
  assert.ok(result.issues.some((issue) => issue.includes(`canonical is ${site}/zh/blog/example/`)));
  assert.ok(result.issues.some((issue) => issue.includes('must not declare noindex')));
});
