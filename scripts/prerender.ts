import fs from 'node:fs';
import path from 'node:path';
import { GAMES } from '../src/data/games';
import { INSIGHTS, JOB_GUIDES } from '../src/data/insights';
import { renderRoute } from '../src/entry-server';
import { SITE_URL, type PageMeta } from '../src/utils/seo';
import { buildRobotsTxt, buildSitemapEntries, buildSitemapXml } from '../src/utils/sitemap';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  throw new Error('dist/index.html not found. Run vite build first.');
}

const templateHtml = fs.readFileSync(templatePath, 'utf8');

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectPageHtml(template: string, appHtml: string, meta: PageMeta): string {
  let out = template;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(meta.title)}</title>`);
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtmlAttr(meta.description)}" />`
  );
  out = out.replace(
    /<meta name="robots" content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${escapeHtmlAttr(meta.robots)}" />`
  );
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtmlAttr(meta.canonical)}" />`
  );
  out = out.replace(
    /<meta property="og:type" content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${escapeHtmlAttr(meta.ogType)}" />`
  );
  out = out.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtmlAttr(meta.title)}" />`
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtmlAttr(meta.description)}" />`
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtmlAttr(meta.canonical)}" />`
  );
  out = out.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtmlAttr(meta.ogImage)}" />`
  );
  out = out.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtmlAttr(meta.title)}" />`
  );
  out = out.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtmlAttr(meta.description)}" />`
  );
  out = out.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeHtmlAttr(meta.ogImage)}" />`
  );

  const ldScripts = meta.jsonLd
    .map(
      (schema) =>
        `    <script type="application/ld+json" data-mokumong-ld="true">${JSON.stringify(schema)}</script>`
    )
    .join('\n');

  out = out.replace('<!--ssr-head-->', ldScripts);
  out = out.replace('<!--ssr-outlet-->', appHtml);
  return out;
}

function writeRouteHtml(routePath: string, outputRelPath: string) {
  const { html, meta } = renderRoute(routePath);
  const fullHtml = injectPageHtml(templateHtml, html, meta);
  const outPath = path.join(distDir, outputRelPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, fullHtml, 'utf8');
}

// 1. Prerender Home, Trust Pages & 404
writeRouteHtml('/', 'index.html');
writeRouteHtml('/about', 'about/index.html');
writeRouteHtml('/privacy', 'privacy/index.html');
writeRouteHtml('/terms', 'terms/index.html');
writeRouteHtml('/404', '404.html');

// 2. Prerender all 277 Game URLs (preserving legacy /game/:id routes)
for (const game of GAMES) {
  writeRouteHtml(`/game/${game.id}`, `game/${game.id}/index.html`);
}

// 3. Prerender Insights & Legacy Job Routes
writeRouteHtml('/insights', 'insights/index.html');
for (const article of INSIGHTS) {
  writeRouteHtml(`/insights/${article.slug}`, `insights/${article.slug}/index.html`);
}
for (const job of JOB_GUIDES) {
  writeRouteHtml(`/job/${job.slug}`, `job/${job.slug}/index.html`);
}

// 4. Generate synchronized Sitemap XML (with Google Image Sitemap) & robots.txt to BOTH public/ and dist/
const sitemapXml = buildSitemapXml(SITE_URL, GAMES, INSIGHTS);
const robotsTxt = buildRobotsTxt(SITE_URL);
const sitemapEntries = buildSitemapEntries(SITE_URL, GAMES, INSIGHTS);
const imageCount = sitemapEntries.reduce((sum, e) => sum + (e.images?.length || 0), 0);

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');

const totalHtml = 5 + GAMES.length + 1 + INSIGHTS.length + JOB_GUIDES.length;
console.log(
  `SSG Prerender complete: ${totalHtml} HTML files, ${sitemapEntries.length} canonical URLs & ${imageCount} images in sitemap.xml.`
);
