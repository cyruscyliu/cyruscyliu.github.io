import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.55aaseclab.com',
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});
