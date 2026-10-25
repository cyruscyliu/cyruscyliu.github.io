import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const startups = JSON.parse(await readFile(new URL('../src/data/startups.json', import.meta.url), 'utf8'));
const tools = JSON.parse(await readFile(new URL('../src/data/tools.json', import.meta.url), 'utf8'));
const collaboration = JSON.parse(await readFile(new URL('../src/data/collaboration.json', import.meta.url), 'utf8'));
const contact = JSON.parse(await readFile(new URL('../src/data/contact.json', import.meta.url), 'utf8'));
const projects = JSON.parse(await readFile(new URL('../src/data/projects.json', import.meta.url), 'utf8'));
const home = JSON.parse(await readFile(new URL('../src/data/home.json', import.meta.url), 'utf8'));
const homepageSource = await readFile(new URL('../src/pages/[lang]/index.astro', import.meta.url), 'utf8');
const projectsIndexSource = await readFile(new URL('../src/pages/[lang]/projects/index.astro', import.meta.url), 'utf8');
const startupsIndexSource = await readFile(new URL('../src/pages/[lang]/startups/index.astro', import.meta.url), 'utf8');
const startupDetailSource = await readFile(new URL('../src/pages/[lang]/startups/[slug].astro', import.meta.url), 'utf8');
const previewSource = await readFile(new URL('../src/components/Preview.astro', import.meta.url), 'utf8');

test('keeps three localized products in the Startups collection', () => {
  assert.equal(startups.items.length, 3);
  const slugs = startups.items.map((startup) => startup.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'startup slugs must be unique');
  assert.deepEqual(slugs, [
    'cyber-autoresearch',
    'cyber-simulation-sandbox',
    'system-security-handbook',
  ]);

  for (const startup of startups.items) {
    assert.equal(startup.indexable, true, `${startup.slug} must explicitly opt in to indexing`);
    assert.ok(startup.title.en && startup.title.zh, `${startup.slug} must have bilingual titles`);
    assert.ok(startup.seo.title.en && startup.seo.title.zh, `${startup.slug} must have bilingual SEO titles`);
    assert.equal('stage' in startup, false, `${startup.slug} must not expose a landing-page stage badge`);
    assert.equal('availability' in startup, false, `${startup.slug} must not expose a product-roadmap status grid`);
    assert.equal('proofGates' in startup, false, `${startup.slug} must not expose internal proof gates`);
    assert.equal('entityStatus' in startup, false, `${startup.slug} must not lead with legal-entity commentary`);
    for (const removedField of ['overview', 'audiences', 'workflow', 'development', 'limits', 'demo']) {
      assert.equal(removedField in startup, false, `${startup.slug} must not retain the old ${removedField} section`);
    }

    if (startup.venture) {
      assert.ok(startup.venture.demo.en && startup.venture.demo.zh, `${startup.slug} must have a bilingual demo status`);
      assert.equal('progress' in startup.venture, false, `${startup.slug} must not retain the removed progress section`);
    } else {
      assert.equal('venture' in startup, false, `${startup.slug} must stop after its title, descriptor, and summary`);
    }
  }
});

test('keeps Cyber AutoResearch focused on demo and the customer ask', () => {
  const startup = startups.items.find((item) => item.slug === 'cyber-autoresearch');
  assert.ok(startup?.venture);
  assert.equal(startup.venture.demo.zh, '准备中。');
  assert.match(startup.venture.ask.zh, /早期客户/);
  assert.equal(startupDetailSource.includes('CyberAutoresearchDemo'), false);
  assert.ok(startupDetailSource.includes('id="demo-title"'));
  assert.ok(startupDetailSource.includes('id="ask-title"'));
  assert.equal(startupDetailSource.includes('id="progress-title"'), false);
  assert.equal(startupDetailSource.includes('venture-progress'), false);
});

test('gives Cyber Range a preparation-only demo section', () => {
  const startup = startups.items.find((item) => item.slug === 'cyber-simulation-sandbox');
  assert.ok(startup?.venture);
  assert.equal(startup.summary.zh, 'Cyber Range 在合成场景中检验安全治理方案，让团队在实际应用前比较各方案控制风险的效果，以及可能带来的意外影响。');
  assert.equal(startup.venture.demo.zh, '准备中。');
  assert.equal('ask' in startup.venture, false);
});

test('gives Cyber Handbook a preparation-only demo section', () => {
  const startup = startups.items.find((item) => item.slug === 'system-security-handbook');
  assert.ok(startup?.venture);
  assert.equal(startup.venture.demo.zh, '准备中。');
  assert.equal('ask' in startup.venture, false);
});

test('does not mix startup slugs into student projects', () => {
  const startupSlugs = new Set(startups.items.map((startup) => startup.slug));
  const studentProjectKeys = projects.projects.flatMap((project) => [project.id, project.detailSlug].filter(Boolean));
  assert.equal(studentProjectKeys.some((key) => startupSlugs.has(key)), false);
  assert.equal(projects.meta.title.en, 'Student Research Projects');
  assert.equal(projects.meta.title.zh, '学生项目');
});

test('uses Startups as the single public entry for products, tools, and collaboration', () => {
  const startupSection = home.sections.find((section) => section.key === 'startups');
  const projectSection = home.sections.find((section) => section.key === 'projects');
  assert.deepEqual(startupSection?.label, { en: 'Startups', zh: '创业项目' });
  assert.deepEqual(projectSection?.label, { en: 'Student Projects', zh: '学生项目' });
  assert.equal(home.sections.some((section) => section.key === 'tools'), false);
  assert.equal(home.sections.some((section) => section.key === 'consultation'), false);

  assert.equal(tools.tools.length, 4);
  for (const tool of tools.tools) {
    assert.ok(tool.title && tool.repo);
    assert.ok(tool.summary.en && tool.summary.zh, `${tool.repo} must have a public bilingual summary`);
  }
  assert.ok(collaboration.services.length >= 1);
  assert.deepEqual(collaboration.services.map((service) => service.title.zh), ['交流', '咨询', '陪跑', '合作']);
  assert.match(collaboration.meta.description.zh, /投资人/);
  assert.match(collaboration.meta.description.zh, /企业负责人/);
  assert.match(collaboration.meta.description.zh, /创业者/);
  assert.match(contact.form.url, /^https:\/\/docs\.google\.com\/forms\//);
});

test('keeps News first and Student Projects ahead of Startups on the homepage', () => {
  const newsPosition = homepageSource.indexOf('<h2>News</h2>');
  const projectsPosition = homepageSource.indexOf('keyName="projects"');
  const startupsPosition = homepageSource.indexOf('class="startup-preview"');
  assert.ok(newsPosition >= 0, 'homepage must include the News heading');
  assert.ok(projectsPosition > newsPosition, 'homepage Student Projects preview must follow News');
  assert.ok(startupsPosition > projectsPosition, 'homepage Startups preview must follow Student Projects');
  assert.equal(homepageSource.includes('keyName="courses"'), false, 'homepage must not include a Courses preview');
  assert.equal(homepageSource.includes('StartupCard'), false, 'homepage must not reintroduce startup cards');
  assert.equal('introduction' in startups.meta, false, 'Startups data must not retain the removed introduction');
  assert.equal('statusNote' in startups.meta, false, 'Startups data must not retain the redundant project status note');
  assert.equal(homepageSource.includes('startups.meta.statusNote'), false, 'homepage must not include the redundant project status note');
});

test('uses h2 for homepage sections and h3 for their entries', () => {
  assert.ok(homepageSource.includes('<h2>News</h2>'));
  assert.ok(previewSource.includes('<h2>{title}</h2>'));
  assert.ok(homepageSource.includes('<h2 id="startup-preview-title">{startupLabels.title}</h2>'));
  assert.ok(homepageSource.includes('<h3>{entry.href ?'), 'News entries must use h3');
  assert.ok(homepageSource.includes('<h3><a href={project.detailSlug'), 'Student Project entries must use h3');
  assert.ok(homepageSource.includes('<h3><a href={`/${lang}/startups/${startup.slug}/`}>'), 'Startup entries must use h3');
  assert.match(previewSource, /\.preview-heading h2\s*\{[^}]*font-size:\s*1\.05rem/);
});

test('uses plain lists instead of cards on the Startups index', () => {
  assert.equal(startupsIndexSource.includes('StartupCard'), false);
  assert.doesNotMatch(startupsIndexSource, /(?:startup|tool|service|contact)-card/);
  assert.equal(startupsIndexSource.includes('class="page-intro"'), false, 'Startups index must not include the redundant page introduction');
  assert.equal(startupsIndexSource.includes('class="page-links"'), false, 'Startups index must not include the redundant jump navigation');
  assert.equal(startupsIndexSource.includes('startups.meta.statusNote'), false, 'Startups index must not include the redundant product status note');
  assert.equal(startupsIndexSource.includes('id="products-title"'), false, 'Startups index must not repeat the Products heading');
  for (const section of ['products', 'tools', 'work-with-us']) {
    assert.ok(startupsIndexSource.includes(`id="${section}"`), `Startups index must keep the ${section} section`);
  }
});

test('keeps list-page titles semantic but hidden by page CSS', () => {
  for (const source of [projectsIndexSource, startupsIndexSource]) {
    assert.match(source, /<h1 class="page-title">/);
    assert.match(source, /\.page-title\s*\{\s*display:\s*none/);
  }
});

test('keeps startup details free of landing-page styling and removed sections', () => {
  assert.equal(startupDetailSource.includes('data-availability-status'), false);
  assert.doesNotMatch(startupDetailSource, /(?:bottom-cta|hero-actions|availability-list)/);
  for (const removedFragment of [
    'CyberSimulationDemo',
    'HandbookPathDemo',
    'audience-title',
    'workflow-title',
    'development-title',
    'limits-title',
    'contact-line',
  ]) {
    assert.equal(startupDetailSource.includes(removedFragment), false, `startup details must not retain ${removedFragment}`);
  }
});
