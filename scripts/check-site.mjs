import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

// Check built pages, not template implementation. Runs after every CI build.
const root = path.resolve('dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory()
    ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = await walk(root);
const pages = files.filter((file) => file.endsWith('.html'));
for (const route of ['index.html', 'projects/index.html', 'notes/index.html', 'essays/index.html', 'tags/index.html', '404.html']) {
  assert(files.includes(path.join(root, route)), `Missing required page: ${route}`);
}

const decodeEntities = (text) => text.replace(/&amp;/g, '&').replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const htmlByFile = new Map(await Promise.all(pages.map(async (file) => [file, await readFile(file, 'utf8')])));
let links = 0;
const failures = [];
for (const [file, html] of htmlByFile) {
  assert.match(html, /<html[^>]+lang="zh-CN"/, `${file}: missing page language`);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${file}: expected one h1 (use ## for article headings)`);
  assert.match(html, /<main[^>]+id="main"/, `${file}: missing main landmark`);
  const pagePath = '/' + path.relative(root, file).split(path.sep).join('/').replace(/index\.html$/, '');
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = new URL(decodeEntities(match[1]), `https://hunt-it-down.github.io${pagePath}`);
    if (url.origin !== 'https://hunt-it-down.github.io') continue;
    // Preserve literal percent-encoded tag directories emitted by Astro, then try decoded paths.
    const candidates = [...new Set([url.pathname, decodeURIComponent(url.pathname)])];
    let target;
    for (const pathname of candidates) {
      let candidate = path.join(root, pathname);
      if (!(candidate === root || candidate.startsWith(root + path.sep))) continue;
      try {
        if ((await stat(candidate)).isDirectory()) candidate = path.join(candidate, 'index.html');
        if ((await stat(candidate)).isFile()) { target = candidate; break; }
      } catch { /* Try the other URL representation. */ }
    }
    links++;
    if (!target) { failures.push(`${pagePath} → ${match[1]}`); continue; }
    if (url.hash && htmlByFile.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1));
      const ids = [...htmlByFile.get(target).matchAll(/\bid="([^"]*)"/g)].map((m) => decodeEntities(m[1]));
      if (!ids.includes(id)) failures.push(`${pagePath} → missing anchor ${match[1]}`);
    }
  }
}
assert.deepEqual(failures, [], 'Broken local links/assets/anchors');
assert(!files.some((file) => /\.(md|ts|astro)$/.test(file)), 'Source files must not be published');
console.log(`PASS: ${pages.length} HTML pages, ${links} local links/assets/anchors; required routes and reading landmarks present.`);
