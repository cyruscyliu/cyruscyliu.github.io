#!/usr/bin/env node
/**
 * Generate Xiaohongshu 3:4 image cards for a blog post.
 *
 * Usage:
 *   node scripts/to-xiaohongshu.js <url|file-path|slug>
 *
 * Examples:
 *   node scripts/to-xiaohongshu.js http://localhost:4400/zh/blog/syssec-not-hard-anymore/
 *   node scripts/to-xiaohongshu.js src/content/blog/zh/syssec-not-hard-anymore.md
 *   node scripts/to-xiaohongshu.js zh/blog/syssec-not-hard-anymore
 *
 * When given a file path, output is written next to the source file as:
 *   <blog-dir>/<slug>/xiaohongshu/01.png ...
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CARD_WIDTH = 2160;
const CARD_HEIGHT = 2880;
const MOBILE_WIDTH = 390;
const BASE_URL = process.env.BASE_URL || 'http://localhost:4400';

function resolveSource(input) {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    const url = new URL(input);
    const match = url.pathname.match(/^\/([^/]+)\/blog\/(.+?)\/?$/);
    if (!match) {
      throw new Error(`Unsupported URL path: ${url.pathname}`);
    }
    return { url: input };
  }

  const abs = path.resolve(input);
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
    const blogRoot = path.resolve('src/content/blog');
    const rel = path.relative(blogRoot, abs);
    const parts = rel.split(path.sep).filter(Boolean);
    if (parts.length < 2) {
      throw new Error(`Blog file must be under src/content/blog/<lang>/: ${input}`);
    }
    const lang = parts[0];
    const slug = parts[parts.length - 1].replace(/\.md$/, '');
    return {
      url: `${BASE_URL}/${lang}/blog/${slug}/`,
      outputDir: path.join(path.dirname(abs), slug, 'xiaohongshu')
    };
  }

  const slugMatch = input.match(/^([^/]+)\/blog\/(.+?)$/);
  if (slugMatch) {
    const [, lang, slug] = slugMatch;
    return { url: `${BASE_URL}/${lang}/blog/${slug}/` };
  }

  throw new Error(`Cannot resolve source: ${input}`);
}

function findChrome() {
  const candidates = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('Chrome executable not found');
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.log('Usage: node scripts/to-xiaohongshu.js <url|file-path|slug>');
    process.exit(1);
  }

  const { url, outputDir } = resolveSource(input);
  const outDir = outputDir || path.join(process.cwd(), 'xiaohongshu-output');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--incognito', '--disable-cache', '--disk-cache-size=0']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: MOBILE_WIDTH, height: 844, deviceScaleFactor: 3 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.reload({ waitUntil: 'networkidle0', bypassCache: true });
  await new Promise(r => setTimeout(r, 3000));

  await page.addStyleTag({
    content: `
      body > header, body > nav, body > footer,
      header, footer, nav,
      .site-header, .tabs, .footer-upper, .footer-lower,
      astro-dev-toolbar, [data-astro-dev-toolbar], .astro-dev-toolbar {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      main > p:first-of-type { display: none !important; }
      main {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 24px 20px 32px !important;
        box-sizing: border-box !important;
      }
      article {
        width: 100% !important;
        max-width: 100% !important;
      }
      h1, h2, h3, h4, h5, h6 {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      p {
        break-inside: auto !important;
        page-break-inside: auto !important;
        orphans: 3 !important;
        widows: 3 !important;
      }
      li, blockquote, td, th {
        break-inside: auto !important;
        page-break-inside: auto !important;
      }
      pre, figure, img, table, .mermaid, svg {
        break-inside: auto !important;
        page-break-inside: auto !important;
      }
    `
  });

  await page.evaluate(() => {
    const toolbar = document.querySelector('astro-dev-toolbar');
    if (toolbar && toolbar.parentNode) toolbar.parentNode.removeChild(toolbar);
  });

  // Extract Xiaohongshu metadata from the rendered page
  const meta = await page.evaluate(() => {
    const title = document.querySelector('article h1')?.textContent?.trim() || document.querySelector('h1')?.textContent?.trim() || '';
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
    const hashtags = Array.from(document.querySelectorAll('.tag')).map(el => el.textContent.trim()).filter(Boolean);
    return { title, description, hashtags };
  });
  fs.writeFileSync(path.join(outDir, 'xiaohongshu.json'), JSON.stringify(meta, null, 2));
  console.log(`Metadata: ${path.join(outDir, 'xiaohongshu.json')}`);

  const pdfPath = path.join(outDir, 'pages.pdf');
  await page.pdf({
    path: pdfPath,
    width: '4.0625in',
    height: '5.4167in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  await browser.close();

  execSync(`pdftoppm -png -scale-to-x ${CARD_WIDTH} -scale-to-y ${CARD_HEIGHT} -f 1 "${pdfPath}" "${path.join(outDir, 'page')}"`);

  const files = fs.readdirSync(outDir)
    .filter(f => /^page-\d+\.png$/.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));

  const now = Date.now() / 1000;
  for (let i = 0; i < files.length; i++) {
    const src = path.join(outDir, files[i]);
    const dst = path.join(outDir, `${String(i + 1).padStart(2, '0')}.png`);
    fs.renameSync(src, dst);
    // Set timestamps so 01.png is newest; apps that sort by mtime newest-first
    // will present cards in the intended order.
    const t = now - i * 60;
    fs.utimesSync(dst, t, t);
    console.log(`Card ${i + 1}: ${dst}`);
  }
  fs.unlinkSync(pdfPath);

  const count = files.length;
  const cols = (() => {
    const s = Math.floor(Math.sqrt(count));
    for (let c = s; c >= 2; c--) {
      if (count % c === 0) return c;
    }
    return s || 1;
  })();
  const cardFiles = Array.from({ length: count }, (_, i) =>
    path.join(outDir, `${String(i + 1).padStart(2, '0')}.png`)
  ).join(' ');
  const montagePath = path.join(outDir, 'preview-montage.png');
  execSync(`montage ${cardFiles} -tile ${cols}x -geometry 360x480+8+8 -background '#1a1a1a' "${montagePath}"`);
  // Keep montage preview older than all cards so it doesn't sort first.
  const montageTime = now - files.length * 60;
  fs.utimesSync(montagePath, montageTime, montageTime);
  console.log(`Montage: ${montagePath}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
