import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const url = process.argv[2] || 'https://dblp.org/pid/61/3234-34.rss';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForTimeout(8_000);
const content = await page.content();
await writeFile('/tmp/dblp-response.html', content);
console.log(`Saved ${content.length} bytes to /tmp/dblp-response.html`);
console.log(`Title: ${await page.title()}`);
await browser.close();
