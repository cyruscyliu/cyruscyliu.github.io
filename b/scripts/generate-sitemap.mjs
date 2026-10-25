import { readFile, readdir, writeFile } from 'node:fs/promises';
import lessonPlans from '../src/data/lesson-plans/index.js';
import {
  isCourseIndexable,
  isCourseIndexPageIndexable,
  isLessonIndexable,
} from '../src/lib/course-indexing.js';

const site = 'https://www.55aaseclab.com';
const languages = ['en', 'zh'];
const blogIndex = JSON.parse(await readFile(new URL('../src/data/blog.json', import.meta.url), 'utf8'));
const blogDirectory = new URL('../src/content/blog/', import.meta.url);
const blogFiles = (await readdir(blogDirectory, { recursive: true })).filter((file) => file.endsWith('.md'));
const blogEntries = await Promise.all(blogIndex.entries.map(async (entryKey) => {
  const file = blogFiles.find((candidate) => candidate === `${entryKey}.md` || candidate.endsWith(`/${entryKey}.md`));
  if (!file) throw new Error(`Blog index references missing Markdown post: ${entryKey}`);
  const markdown = await readFile(new URL(file, blogDirectory), 'utf8');
  const language = markdown.match(/^language:\s*["']?(en|zh)["']?\s*$/m)?.[1];
  if (!language) throw new Error(`Markdown post is missing a valid language: ${file}`);
  const slug = markdown.match(/^slug:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1];
  if (!slug) throw new Error(`Markdown post is missing a slug: ${file}`);
  if (entryKey !== `${language}/${slug}`) {
    throw new Error(`Blog index key does not match frontmatter: ${entryKey}`);
  }
  return { language, path: `blog/${slug}` };
}));
const teaching = JSON.parse(await readFile(new URL('../src/data/courses.json', import.meta.url), 'utf8'));
const coursesByCode = new Map(teaching.courses.map((course) => [course.code, course]));
const sections = ['', 'news', 'people', 'projects', 'startups', 'publications', 'blog', 'sponsorship'];
if (isCourseIndexPageIndexable(teaching)) sections.splice(3, 0, 'courses');
const coursePaths = teaching.courses
  .filter(isCourseIndexable)
  .map((course) => `courses/${course.code.toLowerCase()}`);
const lessonPaths = Object.entries(lessonPlans).flatMap(([courseCode, lessons]) =>
  lessons
    .filter((lesson) => isLessonIndexable(coursesByCode.get(courseCode), lesson))
    .map((lesson) => `courses/${courseCode.toLowerCase()}/lessons/${lesson.id}`)
);
const projects = JSON.parse(await readFile(new URL('../src/data/projects.json', import.meta.url), 'utf8'));
const projectPaths = projects.projects
  .filter((project) => project.detailSlug)
  .map((project) => `projects/${project.detailSlug}`);
const startups = JSON.parse(await readFile(new URL('../src/data/startups.json', import.meta.url), 'utf8'));
const startupPaths = startups.items
  .filter((startup) => startup.indexable)
  .map((startup) => `startups/${startup.slug}`);
const people = JSON.parse(await readFile(new URL('../src/data/people.json', import.meta.url), 'utf8'));
const peoplePaths = people.people
  .filter((person) => person.profile?.slug)
  .map((person) => `people/${person.profile.slug}`);
const paths = [
  ...sections,
  ...projectPaths,
  ...startupPaths,
  ...peoplePaths,
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
