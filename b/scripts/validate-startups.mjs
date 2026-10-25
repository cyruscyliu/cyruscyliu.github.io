import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_SITE_ORIGIN, parseSitemapLocations } from './validate-sitemap.mjs';

const scriptPath = fileURLToPath(import.meta.url);
const defaultDistDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const defaultStartupsPath = fileURLToPath(new URL('../src/data/startups.json', import.meta.url));
const defaultToolsPath = fileURLToPath(new URL('../src/data/tools.json', import.meta.url));
const defaultContactPath = fileURLToPath(new URL('../src/data/contact.json', import.meta.url));

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'");
}

function textContent(markup) {
  return decodeHtml(markup.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
}

function headingValues(html, level) {
  const expression = new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, 'gi');
  return [...html.matchAll(expression)].map((match) => textContent(match[1]));
}

async function readGeneratedPage(distDirectory, relativePath, issues) {
  try {
    return await readFile(path.join(distDirectory, relativePath, 'index.html'), 'utf8');
  } catch (error) {
    issues.push(`${relativePath}/: cannot read generated page (${error.message}).`);
    return null;
  }
}

async function generatedPageExists(distDirectory, relativePath) {
  try {
    await access(path.join(distDirectory, relativePath, 'index.html'));
    return true;
  } catch {
    return false;
  }
}

export async function validateStartups({
  distDirectory = defaultDistDirectory,
  startupsPath = defaultStartupsPath,
  toolsPath = defaultToolsPath,
  contactPath = defaultContactPath,
  sitemapPath = path.join(distDirectory, 'sitemap.xml'),
  expectedOrigin = DEFAULT_SITE_ORIGIN,
} = {}) {
  const issues = [];
  const data = JSON.parse(await readFile(startupsPath, 'utf8'));
  const tools = JSON.parse(await readFile(toolsPath, 'utf8'));
  const contact = JSON.parse(await readFile(contactPath, 'utf8'));
  const sitemapLocations = new Set(parseSitemapLocations(await readFile(sitemapPath, 'utf8')));
  const languages = ['en', 'zh'];
  const slugs = new Set();
  let pageCount = 0;

  for (const startup of data.items) {
    if (!startup.slug || slugs.has(startup.slug)) issues.push(`${startup.id ?? '(unknown startup)'}: slug must be present and unique.`);
    slugs.add(startup.slug);
  }

  for (const language of languages) {
    const expectedListTitle = data.meta.title[language];
    const listRelativePath = `${language}/startups`;
    const listHtml = await readGeneratedPage(distDirectory, listRelativePath, issues);
    const homepageHtml = await readGeneratedPage(distDirectory, language, issues);
    const listUrl = `${expectedOrigin}/${language}/startups/`;
    const retiredRoutes = [`${language}/tools`, `${language}/consultation`];

    if (!sitemapLocations.has(listUrl)) issues.push(`${listUrl}: startup index is missing from sitemap.`);
    for (const retiredRoute of retiredRoutes) {
      const retiredUrl = `${expectedOrigin}/${retiredRoute}/`;
      if (sitemapLocations.has(retiredUrl)) issues.push(`${retiredUrl}: retired top-level route is still in sitemap.`);
      if (await generatedPageExists(distDirectory, retiredRoute)) issues.push(`${retiredRoute}/: retired top-level page is still generated.`);
      if (homepageHtml?.includes(`href="/${retiredRoute}/"`)) issues.push(`${language}/: homepage still links to retired route /${retiredRoute}/.`);
    }

    if (listHtml) {
      pageCount += 1;
      const headings = headingValues(listHtml, 1);
      if (headings.length !== 1 || headings[0] !== expectedListTitle) {
        issues.push(`${listRelativePath}/: expected one h1 named "${expectedListTitle}", found ${JSON.stringify(headings)}.`);
      }
      for (const anchor of ['products', 'tools', 'work-with-us']) {
        if (!listHtml.includes(`id="${anchor}"`)) issues.push(`${listRelativePath}/: missing unified ${anchor} section.`);
      }
      for (const tool of tools.tools) {
        if (!listHtml.includes(`href="https://github.com/${tool.repo}"`)) issues.push(`${listRelativePath}/: missing GitHub link for ${tool.repo}.`);
      }
      if (!decodeHtml(listHtml).includes(`href="${contact.form.url}"`)) issues.push(`${listRelativePath}/: missing shared contact form link.`);
    }

    for (const startup of data.items.filter((item) => item.indexable)) {
      const relativePath = `${language}/startups/${startup.slug}`;
      const expectedUrl = `${expectedOrigin}/${language}/startups/${startup.slug}/`;
      const projectUrl = `${expectedOrigin}/${language}/projects/${startup.slug}/`;
      const detailHtml = await readGeneratedPage(distDirectory, relativePath, issues);

      if (!sitemapLocations.has(expectedUrl)) issues.push(`${expectedUrl}: indexable startup is missing from sitemap.`);
      if (sitemapLocations.has(projectUrl)) issues.push(`${projectUrl}: startup must not be published in the student-project namespace.`);
      if (listHtml && !listHtml.includes(`href="/${language}/startups/${startup.slug}/"`)) {
        issues.push(`${listRelativePath}/: missing link to ${startup.slug}.`);
      }
      if (homepageHtml && !homepageHtml.includes(`href="/${language}/startups/${startup.slug}/"`)) {
        issues.push(`${language}/: homepage is missing featured startup link to ${startup.slug}.`);
      }
      if (!detailHtml) continue;

      pageCount += 1;
      const expectedTitle = startup.title[language];
      const headings = headingValues(detailHtml, 1);
      if (headings.length !== 1 || headings[0] !== expectedTitle) {
        issues.push(`${relativePath}/: expected one h1 named "${expectedTitle}", found ${JSON.stringify(headings)}.`);
      }
      if (!detailHtml.includes(`data-startup-detail="${startup.slug}"`)) {
        issues.push(`${relativePath}/: missing startup identity marker.`);
      }
      const detailText = textContent(detailHtml);
      if (!detailText.includes(startup.descriptor[language])) issues.push(`${relativePath}/: missing startup descriptor.`);
      if (!detailText.includes(startup.summary[language])) issues.push(`${relativePath}/: missing startup summary.`);
      if (startup.venture) {
        if (!detailHtml.includes('id="demo-title"')) issues.push(`${relativePath}/: venture page must contain its Demo section.`);
        if (detailHtml.includes('id="progress-title"')) issues.push(`${relativePath}/: venture page retains the removed current progress section.`);
        if (!detailText.includes(startup.venture.demo[language])) issues.push(`${relativePath}/: missing demo status.`);
        if (startup.venture.ask) {
          if (!detailHtml.includes('id="ask-title"')) issues.push(`${relativePath}/: missing current ask section.`);
          if (!detailText.includes(startup.venture.ask[language].trim())) issues.push(`${relativePath}/: missing current ask.`);
        } else if (detailHtml.includes('id="ask-title"')) {
          issues.push(`${relativePath}/: unexpected current ask section.`);
        }
      } else {
        const sectionHeadings = headingValues(detailHtml, 2);
        if (sectionHeadings.length !== 0) {
          issues.push(`${relativePath}/: expected the concise hero only, found h2 sections ${JSON.stringify(sectionHeadings)}.`);
        }
      }
      if (!decodeHtml(detailHtml).includes(`href="${contact.form.url}"`)) issues.push(`${relativePath}/: missing shared contact form link.`);

      const internalHeadings = [
        'Evidence required before stronger claims',
        'Boundaries and non-claims',
        'Venture and entity status',
        '提出更强主张前需要的证据',
        '边界与非主张',
        '创业与主体状态',
        'Current availability',
        'Available now',
        '目前进展',
        '目前可用',
        'PreDemo method',
        'PreDemo 方法',
      ];
      for (const heading of internalHeadings) {
        if (detailHtml.includes(heading)) issues.push(`${relativePath}/: internal memo heading is public: "${heading}".`);
      }
    }
  }

  return { startupCount: data.items.length, pageCount, issues };
}

async function main() {
  try {
    const result = await validateStartups();
    if (result.issues.length > 0) {
      console.error(`Startup validation failed with ${result.issues.length} issue(s):`);
      for (const issue of result.issues) console.error(`- ${issue}`);
      process.exitCode = 1;
      return;
    }
    console.log(`Validated unified Startups architecture: ${result.startupCount} products across ${result.pageCount} generated pages.`);
  } catch (error) {
    console.error(`Startup validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) await main();
