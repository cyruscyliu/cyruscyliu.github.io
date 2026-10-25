import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const contact = JSON.parse(await readFile(new URL('../src/data/contact.json', import.meta.url), 'utf8'));
const homepageSource = await readFile(new URL('../src/pages/[lang]/index.astro', import.meta.url), 'utf8');
const footerSource = await readFile(new URL('../src/components/SiteFooter.astro', import.meta.url), 'utf8');
const startupsIndexSource = await readFile(new URL('../src/pages/[lang]/startups/index.astro', import.meta.url), 'utf8');
const startupDetailSource = await readFile(new URL('../src/pages/[lang]/startups/[slug].astro', import.meta.url), 'utf8');

test('uses one Google Form for site-wide contact entry points', () => {
  const formUrl = new URL(contact.form.url);
  assert.equal(formUrl.protocol, 'https:');
  assert.equal(formUrl.hostname, 'docs.google.com');
  assert.match(formUrl.pathname, /^\/forms\/d\/e\/[^/]+\/viewform$/);

  for (const source of [homepageSource, footerSource, startupsIndexSource, startupDetailSource]) {
    assert.ok(source.includes('contact.form.url'));
  }

  assert.ok(homepageSource.includes('class="hero-contact"'));
  assert.ok(footerSource.includes('class="footer-form"'));
  assert.ok(footerSource.includes('<SocialIcon kind="contact"'));
  assert.ok(footerSource.includes('aria-label={contact.form.label[lang]}'));
  assert.ok(footerSource.includes('title={contact.form.label[lang]}'));
  assert.ok(startupsIndexSource.includes('<SiteFooter lang={lang} />'));
  assert.ok(startupsIndexSource.includes('<a href={contact.form.url}'));
  assert.equal(startupsIndexSource.includes('class="contact-line"'), false);
  assert.equal(footerSource.includes('mailto:'), false);
  assert.equal(startupsIndexSource.includes('mailto:'), false);
  assert.equal(startupDetailSource.includes('mailto:'), false);
});
