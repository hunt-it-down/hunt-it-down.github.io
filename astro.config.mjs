import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hunt-it-down.github.io',
  output: 'static',
  trailingSlash: 'always',
  markdown: { shikiConfig: { theme: 'github-dark' } },
});
