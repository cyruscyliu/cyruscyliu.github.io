import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sax from 'sax';

export const DEFAULT_SITE_ORIGIN = 'https://www.55aaseclab.com';

const scriptPath = fileURLToPath(import.meta.url);
const defaultDistDirectory = fileURLToPath(new URL('../dist/', import.meta.url));

export function parseSitemapLocations(xml) {
  const locations = [];
  let currentLocation = null;
  const parser = sax.parser(true, { normalize: false, trim: false });

  parser.onopentag = ({ name }) => {
    if (name === 'loc') currentLocation = '';
  };
  parser.ontext = (text) => {
    if (currentLocation !== null) currentLocation += text;
  };
  parser.oncdata = (text) => {
    if (currentLocation !== null) currentLocation += text;
  };
  parser.onclosetag = (name) => {
    if (name !== 'loc' || currentLocation === null) return;
    locations.push(currentLocation.trim());
    currentLocation = null;
  };

  parser.write(xml).close();
  return locations;
}

function parseTagAttributes(tag) {
  const attributes = new Map();
  const pattern = /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  for (const match of tag.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? '');
  }
  return attributes;
}

function findCanonicalHrefs(html) {
  return (html.match(/<link\b[^>]*>/gi) ?? [])
    .map(parseTagAttributes)
    .filter((attributes) => (attributes.get('rel') ?? '').toLowerCase().split(/\s+/).includes('canonical'))
    .map((attributes) => attributes.get('href') ?? '');
}

function findRobotsDirectives(html) {
  return (html.match(/<meta\b[^>]*>/gi) ?? [])
    .map(parseTagAttributes)
    .filter((attributes) => (attributes.get('name') ?? '').toLowerCase() === 'robots')
    .map((attributes) => attributes.get('content') ?? '');
}

function containsNoindex(directives) {
  return directives.some((content) => content.toLowerCase().split(/[\s,]+/).includes('noindex'));
}

export async function validateSitemap({
  distDirectory = defaultDistDirectory,
  sitemapPath = path.join(distDirectory, 'sitemap.xml'),
  expectedOrigin = DEFAULT_SITE_ORIGIN,
} = {}) {
  const resolvedDistDirectory = path.resolve(distDirectory);
  const normalizedOrigin = new URL(expectedOrigin).origin;
  const xml = await readFile(sitemapPath, 'utf8');
  const locations = parseSitemapLocations(xml);
  const issues = [];
  const seenLocations = new Set();
  let generatedFileCount = 0;
  let htmlPageCount = 0;

  if (locations.length === 0) issues.push('Sitemap contains no <loc> entries.');

  for (const [index, location] of locations.entries()) {
    const label = location || `<loc> entry ${index + 1}`;
    if (!location) {
      issues.push(`${label}: URL is empty.`);
      continue;
    }
    if (seenLocations.has(location)) issues.push(`${label}: duplicate <loc> URL.`);
    seenLocations.add(location);

    let url;
    try {
      url = new URL(location);
    } catch {
      issues.push(`${label}: URL is not valid.`);
      continue;
    }

    if (url.origin !== normalizedOrigin) {
      issues.push(`${label}: origin must be ${normalizedOrigin}.`);
    }
    if (url.search || url.hash) issues.push(`${label}: sitemap URLs must not contain a query or fragment.`);

    let decodedPathname;
    try {
      decodedPathname = decodeURIComponent(url.pathname);
    } catch {
      issues.push(`${label}: pathname contains invalid percent encoding.`);
      continue;
    }

    const relativePathname = decodedPathname.replace(/^\/+/, '');
    const outputPath = decodedPathname.endsWith('/')
      ? path.resolve(resolvedDistDirectory, relativePathname, 'index.html')
      : path.resolve(resolvedDistDirectory, relativePathname);
    const isInsideDist = outputPath === resolvedDistDirectory || outputPath.startsWith(`${resolvedDistDirectory}${path.sep}`);
    if (!isInsideDist) {
      issues.push(`${label}: generated output resolves outside dist.`);
      continue;
    }

    let output;
    try {
      output = await readFile(outputPath);
      generatedFileCount += 1;
    } catch (error) {
      if (error?.code === 'ENOENT') issues.push(`${label}: missing generated output ${path.relative(resolvedDistDirectory, outputPath)}.`);
      else issues.push(`${label}: cannot read generated output (${error.message}).`);
      continue;
    }

    const isHtmlPage = decodedPathname.endsWith('/') || outputPath.endsWith('.html');
    if (!isHtmlPage) continue;
    htmlPageCount += 1;
    const html = output.toString('utf8');
    const canonicalHrefs = findCanonicalHrefs(html);
    if (canonicalHrefs.length !== 1) {
      issues.push(`${label}: expected exactly one canonical link, found ${canonicalHrefs.length}.`);
    } else if (canonicalHrefs[0] !== location) {
      issues.push(`${label}: canonical is ${canonicalHrefs[0] || '(empty)'}.`);
    }
    if (containsNoindex(findRobotsDirectives(html))) {
      issues.push(`${label}: sitemap page must not declare noindex.`);
    }
  }

  return {
    generatedFileCount,
    htmlPageCount,
    issues,
    locationCount: locations.length,
    uniqueLocationCount: seenLocations.size,
  };
}

async function main() {
  try {
    const result = await validateSitemap();
    if (result.issues.length > 0) {
      console.error(`Sitemap validation failed with ${result.issues.length} issue(s):`);
      for (const issue of result.issues.slice(0, 50)) console.error(`- ${issue}`);
      if (result.issues.length > 50) console.error(`- ...and ${result.issues.length - 50} more.`);
      process.exitCode = 1;
      return;
    }
    console.log(
      `Validated sitemap.xml: ${result.locationCount} unique URLs, ${result.generatedFileCount} generated files, ${result.htmlPageCount} canonical HTML pages.`,
    );
  } catch (error) {
    console.error(`Sitemap validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) await main();
