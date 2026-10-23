import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lessonPlans from '../src/data/lesson-plans/index.js';
import {
  isCourseIndexable,
  isCourseIndexPageIndexable,
  isLessonIndexable,
} from '../src/lib/course-indexing.js';
import { DEFAULT_SITE_ORIGIN, parseSitemapLocations } from './validate-sitemap.mjs';

const scriptPath = fileURLToPath(import.meta.url);
const defaultDistDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const defaultTeaching = JSON.parse(
  await readFile(new URL('../src/data/courses.json', import.meta.url), 'utf8'),
);

function parseTagAttributes(tag) {
  const attributes = new Map();
  const pattern = /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  for (const match of tag.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? '');
  }
  return attributes;
}

function pageDeclaresNoindex(html) {
  return (html.match(/<meta\b[^>]*>/gi) ?? [])
    .map(parseTagAttributes)
    .filter((attributes) => (attributes.get('name') ?? '').toLowerCase() === 'robots')
    .some((attributes) => (attributes.get('content') ?? '').toLowerCase().split(/[\s,]+/).includes('noindex'));
}

function pageDefinitions({ teaching, lessons, siteOrigin }) {
  const languages = ['en', 'zh'];
  const pages = languages.map((lang) => ({
    label: `${lang} course index`,
    url: `${siteOrigin}/${lang}/courses/`,
    indexable: isCourseIndexPageIndexable(teaching),
  }));

  for (const course of teaching.courses) {
    for (const lang of languages) {
      pages.push({
        label: `${lang} course ${course.code}`,
        url: `${siteOrigin}/${lang}/courses/${course.code.toLowerCase()}/`,
        indexable: isCourseIndexable(course),
      });
    }

    for (const lesson of lessons[course.code] ?? []) {
      for (const lang of languages) {
        pages.push({
          label: `${lang} lesson ${course.code}/${lesson.id}`,
          url: `${siteOrigin}/${lang}/courses/${course.code.toLowerCase()}/lessons/${lesson.id}/`,
          indexable: isLessonIndexable(course, lesson),
        });
      }
    }
  }

  return pages;
}

export async function validateCourseIndexing({
  distDirectory = defaultDistDirectory,
  sitemapPath = path.join(distDirectory, 'sitemap.xml'),
  siteOrigin = DEFAULT_SITE_ORIGIN,
  teaching = defaultTeaching,
  lessons = lessonPlans,
} = {}) {
  const normalizedOrigin = new URL(siteOrigin).origin;
  const sitemap = await readFile(sitemapPath, 'utf8');
  const sitemapLocations = new Set(parseSitemapLocations(sitemap));
  const pages = pageDefinitions({ teaching, lessons, siteOrigin: normalizedOrigin });
  const expectedUrls = new Set(pages.map((page) => page.url));
  const issues = [];
  let indexablePageCount = 0;
  let noindexPageCount = 0;

  for (const page of pages) {
    const inSitemap = sitemapLocations.has(page.url);
    if (page.indexable) {
      indexablePageCount += 1;
      if (!inSitemap) issues.push(`${page.label}: indexable page is missing from sitemap.`);
    } else {
      noindexPageCount += 1;
      if (inSitemap) issues.push(`${page.label}: noindex page must not appear in sitemap.`);
    }

    const pathname = new URL(page.url).pathname.replace(/^\/+/, '');
    const outputPath = path.join(distDirectory, pathname, 'index.html');
    let html;
    try {
      html = await readFile(outputPath, 'utf8');
    } catch (error) {
      if (error?.code === 'ENOENT') issues.push(`${page.label}: missing generated page ${pathname}index.html.`);
      else issues.push(`${page.label}: cannot read generated page (${error.message}).`);
      continue;
    }

    const noindex = pageDeclaresNoindex(html);
    if (page.indexable && noindex) issues.push(`${page.label}: indexable page declares noindex.`);
    if (!page.indexable && !noindex) issues.push(`${page.label}: unpublished page must declare noindex.`);
  }

  for (const location of sitemapLocations) {
    const url = new URL(location);
    if (url.origin === normalizedOrigin && /^\/(?:en|zh)\/courses\//.test(url.pathname) && !expectedUrls.has(location)) {
      issues.push(`${location}: unexpected course URL in sitemap.`);
    }
  }

  return {
    indexablePageCount,
    issues,
    noindexPageCount,
    pageCount: pages.length,
  };
}

async function main() {
  try {
    const result = await validateCourseIndexing();
    if (result.issues.length > 0) {
      console.error(`Course indexing validation failed with ${result.issues.length} issue(s):`);
      for (const issue of result.issues.slice(0, 50)) console.error(`- ${issue}`);
      if (result.issues.length > 50) console.error(`- ...and ${result.issues.length - 50} more.`);
      process.exitCode = 1;
      return;
    }
    console.log(
      `Validated course indexing: ${result.pageCount} pages, ${result.indexablePageCount} indexable, ${result.noindexPageCount} noindex.`,
    );
  } catch (error) {
    console.error(`Course indexing validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) await main();
