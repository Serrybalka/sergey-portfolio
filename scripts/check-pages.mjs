import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { resolve, join, extname, relative } from 'node:path'
import { gzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'

const root = process.cwd()
const dist = resolve(root, process.argv[2] || 'dist')
const reportPath = resolve(root, '.prerender/build-report.json')
const metadata = JSON.parse(await readFile(reportPath, 'utf8'))
const base = metadata.basePath
const origin = metadata.siteUrl || 'https://local.invalid'
const errors = [], pages = [], assets = []
const text = (html) => html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
const attr = (tag, name) => new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i').exec(tag)?.[1]
const fail = (page, message) => errors.push(`${page}: ${message}`)
const fileExists = async (path) => { try { return (await stat(path)).isFile() } catch { return false } }

async function allFiles(dir) {
  const result = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Published output contains a symbolic link: ${relative(dist, file)}`)
    if (entry.isDirectory()) result.push(...await allFiles(file))
    else result.push(file)
  }
  return result
}

const files = await allFiles(dist)
const htmlFiles = files.filter((file) => file.endsWith('.html'))
const knownTitles = new Set()
for (const file of htmlFiles) {
  const path = relative(dist, file).replaceAll('\\', '/')
  const html = await readFile(file, 'utf8')
  const record = metadata.routes.find((page) => page.file === path)
  if (!record) { fail(path, 'HTML page is not declared by the SSR route list'); continue }
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim()
  if (!title || knownTitles.has(title)) fail(path, 'Missing or duplicate title')
  knownTitles.add(title)
  if (!/<html\b[^>]*\blang=["']ru["']/i.test(html)) fail(path, 'HTML lang must be ru')
  if ((html.match(/<h1(?:\s|>)/gi) || []).length !== 1) fail(path, 'Expected exactly one h1')
  const descriptionTag = (html.match(/<meta\b[^>]+>/gi) || []).find((tag) => attr(tag, 'name') === 'description')
  if (!descriptionTag || (attr(descriptionTag, 'content') || '').length < 25) fail(path, 'Missing substantive description')
  if (!/<div\b[^>]*\bid=["']root["'][^>]*>\s*\S/i.test(html) || text(html).length < 160) fail(path, 'Main content was not statically rendered')
  if (/<!--(?:ssr|head)-outlet-->/.test(html)) fail(path, 'Unfilled render marker')
  if (/<(?:YOUR_[A-Z_]+|TODO|PLACEHOLDER)>|&lt;(?:YOUR_[A-Z_]+|TODO|PLACEHOLDER)&gt;/.test(html)) fail(path, 'Unfilled configuration placeholder')
  const canonicalTag = (html.match(/<link\b[^>]+>/gi) || []).filter((tag) => attr(tag, 'rel') === 'canonical')
  if (metadata.siteUrl && (canonicalTag.length !== 1 || decode(attr(canonicalTag[0], 'href') || '') !== record.canonical)) fail(path, 'Canonical URL does not match the configured route')
  const robotsTag = (html.match(/<meta\b[^>]+>/gi) || []).find((tag) => attr(tag, 'name') === 'robots')
  if (record.noindex && !(attr(robotsTag || '', 'content') || '').includes('noindex')) fail(path, 'Technical/preview page must be noindex')
  const current = new URL(`${base}${record.route.replace(/^\//, '')}`, origin)
  const resources = []
  for (const tag of html.match(/<(?:a|img|script|link|source)\b[^>]*>/gi) || []) {
    const tagName = /^<(\w+)/.exec(tag)[1].toLowerCase()
    const isNavigation = tagName === 'a'
    const candidate = attr(tag, isNavigation || tagName === 'link' ? 'href' : 'src')
    if (candidate !== undefined) resources.push({ url: decode(candidate), navigation: isNavigation })
    if (tagName === 'img' && attr(tag, 'alt') === undefined) fail(path, 'Image without alt attribute')
    if (tagName === 'img' && (!attr(tag, 'width') || !attr(tag, 'height'))) fail(path, 'Image without intrinsic width/height')
    for (const part of (attr(tag, 'srcset') || '').split(',')) {
      const url = part.trim().split(/\s+/)[0]
      if (url) resources.push({ url: decode(url), navigation: false })
    }
  }
  for (const resource of resources) {
    if (!resource.url || resource.url === '#') { fail(path, 'Empty URL or dead placeholder link'); continue }
    if (/^(?:mailto:|tel:|data:|blob:)/i.test(resource.url)) continue
    if (/^javascript:/i.test(resource.url)) { fail(path, 'javascript: URL'); continue }
    const url = new URL(resource.url, current)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') continue
    if (url.origin !== origin) continue
    if (!url.pathname.startsWith(base)) { fail(path, `Local URL escapes the configured base path: ${url.pathname}`); continue }
    const local = decodeURIComponent(url.pathname.slice(base.length))
    let target = join(dist, local)
    if (url.pathname.endsWith('/')) target = join(target, 'index.html')
    else if (!extname(target) && !(await fileExists(target))) target = join(target, 'index.html')
    if (!(await fileExists(target))) { fail(path, `Broken local ${resource.navigation ? 'link' : 'resource'}: ${url.pathname}`); continue }
    if (resource.navigation && url.hash && target.endsWith('.html')) {
      const targetHtml = target === file ? html : await readFile(target, 'utf8')
      const fragment = decodeURIComponent(url.hash.slice(1))
      if (!(targetHtml.match(/\bid\s*=\s*["']([^"']+)["']/g) || []).some((item) => attr(item, 'id') === fragment)) fail(path, `Missing anchor target: ${url.pathname}${url.hash}`)
    }
  }
  pages.push({ route: record.route, file: path, title, textCharacters: text(html).length, noindex: record.noindex })
}

for (const route of metadata.routes) if (!htmlFiles.some((file) => relative(dist, file).replaceAll('\\', '/') === route.file)) fail(route.route, 'Declared route was not emitted')
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]))
for (const url of sitemapUrls) {
  const route = metadata.routes.find((page) => page.canonical === url)
  if (!route || route.noindex || /\/(?:ds|404\.html)\/?$/.test(new URL(url).pathname)) fail('sitemap.xml', `Excluded or unknown page in sitemap: ${url}`)
}
for (const page of metadata.routes.filter((page) => !page.noindex && page.canonical)) if (!sitemapUrls.includes(page.canonical)) fail('sitemap.xml', `Indexable route is absent: ${page.route}`)
if (!await fileExists(join(dist, '.nojekyll'))) fail('.nojekyll', 'Missing GitHub Pages static-output marker')
const robots = await readFile(join(dist, 'robots.txt'), 'utf8')
if (/Disallow:\s*.*(?:\/ds|\/404)/i.test(robots)) fail('robots.txt', 'Do not block crawling of technical-page noindex directives')

let jsGzipBytes = 0, totalBytes = 0
for (const file of files) {
  const path = relative(dist, file).replaceAll('\\', '/')
  if (/(?:^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|\.openai(?:\/|$)|\.codex(?:\/|$)|\.mcp(?:\.|\/|$)|node_modules(?:\/|$)|\.prerender(?:\/|$))/.test(path) || /\.(?:drawio|zip|bak)$/i.test(path)) fail(path, 'Private/source/archive material in the published output')
  const buffer = await readFile(file)
  totalBytes += buffer.length
  const gzipBytes = file.endsWith('.js') ? gzipSync(buffer).length : null
  if (gzipBytes) jsGzipBytes += gzipBytes
  if (/\.(?:js|json|html|css|txt|xml)$/i.test(path)) {
    const body = buffer.toString('utf8')
    if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{40,}/.test(body)) fail(path, 'Possible private credential in published output; inspect without logging its value')
  }
  assets.push({ file: path, bytes: buffer.length, gzipBytes, sha256: createHash('sha256').update(buffer).digest('hex') })
}
const budget = Number(process.env.JS_GZIP_BUDGET_KB || '110') * 1024
if (!Number.isFinite(budget) || budget <= 0) throw new Error('JS_GZIP_BUDGET_KB must be a positive number.')
if (jsGzipBytes > budget) fail('assets', `Client JS gzip total ${jsGzipBytes} bytes exceeds the ${budget}-byte budget`)
const report = { schemaVersion: 1, checkedAt: new Date().toISOString(), basePath: base, siteUrl: metadata.siteUrl, pageCount: pages.length, pages, sitemapUrls, totalBytes, jsGzipBytes, jsGzipBudgetBytes: budget, assets, errors }
await writeFile(resolve(root, '.prerender/check-report.json'), JSON.stringify(report, null, 2))
if (errors.length) {
  console.error(`Static-output checks failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join('\n')}`)
  process.exitCode = 1
} else {
  console.log(`Static-output checks passed: ${pages.length} pages, ${assets.length} files, JS gzip ${jsGzipBytes}/${budget} bytes.`)
  console.log('This validates static output and asset budgets; it is not browser, accessibility, or field Core Web Vitals evidence.')
}
