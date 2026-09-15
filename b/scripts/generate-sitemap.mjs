import { readFile, writeFile } from 'node:fs/promises';

const site = 'https://cyruscyliu.github.io';
const languages = ['en', 'zh'];
const sections = ['', 'news', 'people', 'teaching', 'projects', 'tools', 'consultation', 'publications', 'blog', 'sponsorship'];
const blog = JSON.parse(await readFile(new URL('../src/data/blog.json', import.meta.url), 'utf8'));
const paths = [
  ...sections,
  ...blog.entries.map((entry, index) => `blog/${entry.date}-${index + 1}`)
];
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&apos;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const url = (lang, path) => `${site}/${lang}/${path ? `${path}/` : ''}`;
const entries = paths.flatMap((path) => languages.map((lang) => `  <url>
    <loc>${escapeXml(url(lang, path))}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(url('en', path))}" />
    <xhtml:link rel="alternate" hreflang="zh" href="${escapeXml(url('zh', path))}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url('en', path))}" />
  </url>`));
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`Generated sitemap.xml with ${entries.length} URLs.`);
