import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  isCourseIndexable,
  isCourseIndexPageIndexable,
  isLessonIndexable,
} from '../src/lib/course-indexing.js';
import { validateCourseIndexing } from './validate-course-indexing.mjs';

const site = 'https://www.55aaseclab.com';

test('course and lesson pages require explicit indexing approval', () => {
  assert.equal(isCourseIndexPageIndexable({ meta: {} }), false);
  assert.equal(isCourseIndexPageIndexable({ meta: { indexable: true } }), true);
  assert.equal(isCourseIndexable({}), false);
  assert.equal(isCourseIndexable({ indexable: true }), true);
  assert.equal(isLessonIndexable({ indexable: true }, {}), false);
  assert.equal(isLessonIndexable({}, { indexable: true }), false);
  assert.equal(isLessonIndexable({ indexable: true }, { indexable: true }), true);
});

async function createFixture(t, { robots = 'noindex, follow', includeCourseInSitemap = false } = {}) {
  const directory = await mkdtemp(path.join(tmpdir(), '55aa-course-indexing-'));
  t.after(() => rm(directory, { force: true, recursive: true }));
  const distDirectory = path.join(directory, 'dist');
  const urls = [
    `${site}/en/courses/`,
    `${site}/zh/courses/`,
    `${site}/en/courses/55aa-test/`,
    `${site}/zh/courses/55aa-test/`,
    `${site}/en/courses/55aa-test/lessons/lesson-1/`,
    `${site}/zh/courses/55aa-test/lessons/lesson-1/`,
  ];

  await mkdir(distDirectory, { recursive: true });
  const locations = includeCourseInSitemap ? [`${site}/en/courses/`] : [`${site}/en/`];
  await writeFile(path.join(distDirectory, 'sitemap.xml'), `<?xml version="1.0"?>
<urlset>${locations.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`);

  for (const url of urls) {
    const pathname = new URL(url).pathname.replace(/^\/+/, '');
    const outputPath = path.join(distDirectory, pathname, 'index.html');
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `<meta name="robots" content="${robots}">`);
  }

  return {
    distDirectory,
    teaching: {
      meta: { indexable: false },
      courses: [{ code: '55AA-TEST', indexable: false }],
    },
    lessons: {
      '55AA-TEST': [{ id: 'lesson-1', indexable: false }],
    },
  };
}

test('accepts unpublished course pages that are noindex and absent from sitemap', async (t) => {
  const fixture = await createFixture(t);
  const result = await validateCourseIndexing(fixture);
  assert.deepEqual(result.issues, []);
  assert.equal(result.pageCount, 6);
  assert.equal(result.indexablePageCount, 0);
  assert.equal(result.noindexPageCount, 6);
});

test('rejects unpublished course pages that are indexable or present in sitemap', async (t) => {
  const fixture = await createFixture(t, { robots: 'index, follow', includeCourseInSitemap: true });
  const result = await validateCourseIndexing(fixture);
  assert.ok(result.issues.some((issue) => issue.includes('must not appear in sitemap')));
  assert.ok(result.issues.some((issue) => issue.includes('must declare noindex')));
});
