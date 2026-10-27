import { build } from 'vite'
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { resolve, join, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

// Static rendering is an adapter around Vite's official SSR API, not a server.
// React components and the data source are shared with the hydrated client.
const root = process.cwd()
const dist = resolve(root, 'dist')
const ssrDirectory = resolve(root, '.prerender')

function basePath(input = '/') {
  if (!input.startsWith('/') || input.includes('..') || input.includes('//') || /[?#\\]/.test(input)) {
    throw new Error('PUBLIC_BASE_PATH must be a local absolute path, e.g. /sergey-portfolio/.')
  }
  return input === '/' ? '/' : `${input.replace(/\/+$/, '')}/`
}

const base = basePath(process.env.PUBLIC_BASE_PATH || '/')
const site = process.env.SITE_URL ? new URL(process.env.SITE_URL) : null
if (site && (!['https:', 'http:'].includes(site.protocol) || site.username || site.password || site.search || site.hash || site.pathname !== '/')) {
  throw new Error('SITE_URL must be an HTTP(S) origin without a path, credentials, query or fragment.')
}
const indexable = process.env.PUBLIC_INDEXABLE === 'true'
if (indexable && (!site || site.protocol !== 'https:')) {
  throw new Error('An indexable release requires an explicit, verified HTTPS SITE_URL.')
}
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const routeUrl = (route) => site ? new URL(`${base}${route.replace(/^\//, '')}`, site).href : null
const specialRoute = (route) => route === '/ds/' || route === '/ds' || route === '/404.html'

await build({ root, base, build: { outDir: dist, emptyOutDir: true } })
const template = await readFile(join(dist, 'index.html'), 'utf8')
for (const marker of ['<!--ssr-outlet-->', '<!--head-outlet-->']) {
  if (template.split(marker).length !== 2) throw new Error(`Client template must contain exactly one ${marker}.`)
}

await build({
  root,
  base,
  build: {
    outDir: ssrDirectory,
    emptyOutDir: true,
    ssr: 'src/portfolio/entry-server.tsx',
    rollupOptions: { output: { entryFileNames: 'entry-server.js' } },
  },
})
const server = await import(pathToFileURL(join(ssrDirectory, 'entry-server.js')).href)
if (typeof server.renderPage !== 'function') throw new Error('SSR entry must export renderPage(route, basePath).')
const configuredRoutes = typeof server.routes === 'function' ? await server.routes(base) : server.routes
if (!Array.isArray(configuredRoutes) || configuredRoutes.length === 0) throw new Error('SSR entry must export a nonempty routes array or routes() function.')
const routes = [...new Set(configuredRoutes)]
if (routes.length !== configuredRoutes.length || !routes.includes('/') || !routes.includes('/ds/') || !routes.includes('/404.html')) {
  throw new Error('Routes must be unique and include /, /ds/, and /404.html.')
}

const rendered = []
for (const route of routes) {
  if (typeof route !== 'string' || !route.startsWith('/') || route.includes('..') || /[?#\\]/.test(route)) throw new Error(`Unsafe route: ${route}`)
  const page = await server.renderPage(route, base)
  if (!page || typeof page.html !== 'string' || !page.html.trim() || !page.title || !page.description) throw new Error(`Incomplete static page: ${route}`)
  const noindex = !indexable || specialRoute(route) || page.noindex === true
  const canonical = routeUrl(page.canonicalPath || route)
  const head = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}">`,
    `<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow'}">`,
    canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : '',
    `<meta property="og:title" content="${escapeHtml(page.title)}">`,
    `<meta property="og:description" content="${escapeHtml(page.description)}">`,
    '<meta property="og:type" content="website">',
    canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}">` : '',
    page.head || '',
  ].filter(Boolean).join('\n    ')
  const output = template.replace('<!--head-outlet-->', head).replace('<!--ssr-outlet-->', page.html)
  const destination = route === '/404.html' ? join(dist, '404.html') : join(dist, route.slice(1), 'index.html')
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, output)
  rendered.push({ route, file: destination.slice(dist.length + 1), title: page.title, noindex, canonical, lastmod: page.modifiedAt || null })
}

const indexed = rendered.filter((page) => !page.noindex && page.canonical)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed.map((page) => {
  const lastmod = /^\d{4}-\d{2}-\d{2}$/.test(page.lastmod || '') ? `<lastmod>${page.lastmod}</lastmod>` : ''
  return `  <url><loc>${escapeHtml(page.canonical)}</loc>${lastmod}</url>`
}).join('\n')}\n</urlset>\n`
await writeFile(join(dist, 'sitemap.xml'), sitemap)
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${site ? `Sitemap: ${new URL(`${base}sitemap.xml`, site).href}\n` : ''}`)
await writeFile(join(dist, '.nojekyll'), '')
await writeFile(join(ssrDirectory, 'build-report.json'), JSON.stringify({
  schemaVersion: 1,
  basePath: base,
  siteUrl: site?.origin || null,
  indexable,
  routes: rendered,
  // This timestamp is a build record, never a fabricated content lastmod.
  builtAt: new Date().toISOString(),
  staticFiles: await readdir(dist),
}, null, 2))
console.log(`Static pages built: ${rendered.length}; indexable pages: ${indexed.length}; base: ${base}`)
if (!site) console.log('Canonical URLs omitted in local preview: set SITE_URL for a hosted release.')
