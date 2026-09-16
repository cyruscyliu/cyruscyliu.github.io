import { copyFileSync, createReadStream, mkdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(new URL('..', import.meta.url).pathname);
const dist = join(root, 'dist');
const publicDir = join(root, 'public');
mkdirSync(publicDir, { recursive: true });
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const safePath = normalize(relativePath);
  if (safePath.startsWith('..')) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }
  const directPath = join(dist, safePath);
  const isFile = (() => {
    try {
      return statSync(directPath).isFile();
    } catch {
      return false;
    }
  })();
  const filePath = isFile ? directPath : join(dist, safePath, 'index.html');
  createReadStream(filePath)
    .on('error', () => {
      response.writeHead(404);
      response.end('Not found');
    })
    .on('open', () => {
      response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
    })
    .pipe(response);
});

const waitForServer = () => new Promise((resolvePromise, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => resolvePromise(server.address().port));
});

const port = await waitForServer();
const browser = await chromium.launch({ headless: true });
try {
  for (const lang of ['en', 'zh']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
    await page.goto(`http://127.0.0.1:${port}/${lang}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const pdfPath = join(dist, `55AA-Security-Lab-${lang}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' }
    });
    // Keep a copy in public so `astro dev` can serve the same static files.
    copyFileSync(pdfPath, join(publicDir, `55AA-Security-Lab-${lang}.pdf`));
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

console.log('Generated English and Chinese site PDFs.');
