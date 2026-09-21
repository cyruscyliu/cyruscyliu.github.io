import { readFile, readdir, writeFile } from 'node:fs/promises';
import lessonPlans from '../src/data/lesson-plans/index.js';

const site = 'https://www.55aaseclab.com';
const languages = ['en', 'zh'];
const sections = ['', 'news', 'people', 'courses', 'projects', 'tools', 'consultation', 'publications', 'blog', 'sponsorship'];
const blogIndex = JSON.parse(await readFile(new URL('../src/data/blog.json', import.meta.url), 'utf8'));
const blogDirectory = new URL('../src/content/blog/', import.meta.url);
const blogFiles = (await readdir(blogDirectory, { recursive: true })).filter((file) => file.endsWith('.md'));
const blogEntries = await Promise.all(blogIndex.entries.map(async (slug) => {
  const file = blogFiles.find((candidate) => candidate === `${slug}.md` || candidate.endsWith(`/${slug}.md`));
  if (!file) throw new Error(`Blog index references missing Markdown post: ${slug}`);
  const markdown = await readFile(new URL(file, blogDirectory), 'utf8');
  const language = markdown.match(/^language:\s*["']?(en|zh)["']?\s*$/m)?.[1];
  if (!language) throw new Error(`Markdown post is missing a valid language: ${file}`);
  return { language, path: `blog/${slug}` };
}));
const teaching = JSON.parse(await readFile(new URL('../src/data/courses.json', import.meta.url), 'utf8'));
const coursePaths = teaching.courses.map((course) => `courses/${course.code.toLowerCase()}`);
const lessonPaths = Object.entries(lessonPlans).flatMap(([courseCode, lessons]) =>
  lessons.map((lesson) => `courses/${courseCode.toLowerCase()}/lessons/${lesson.id}`)
);
const projects = JSON.parse(await readFile(new URL('../src/data/projects.json', import.meta.url), 'utf8'));
const projectPaths = projects.projects
  .filter((project) => project.detailSlug)
  .map((project) => `projects/${project.detailSlug}`);
const paths = [
  ...sections,
  ...projectPaths,
  ...coursePaths,
  ...lessonPaths,
];
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&apos;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const url = (lang, path) => `${site}/${lang}/${path ? `${path}/` : ''}`;
const entries = [
  ...paths.flatMap((path) => languages.map((lang) => `  <url>
    <loc>${escapeXml(url(lang, path))}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(url('en', path))}" />
    <xhtml:link rel="alternate" hreflang="zh" href="${escapeXml(url('zh', path))}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url('en', path))}" />
  </url>`)),
  ...blogEntries.map((entry) => `  <url>
    <loc>${escapeXml(url(entry.language, entry.path))}</loc>
  </url>`),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`Generated sitemap.xml with ${entries.length} URLs.`);
