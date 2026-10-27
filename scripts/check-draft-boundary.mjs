import assert from 'node:assert/strict'
import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { randomUUID, createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

// End-to-end fixture for the publication boundary, not a check that repeats the
// filter implementation. Never run concurrently with an editor or another build.
const root = process.cwd()
const source = resolve(root, 'src/portfolio/content.json')
const original = await readFile(source)
const originalHash = createHash('sha256').update(original).digest('hex')
const fixture = JSON.parse(original.toString('utf8'))
assert(fixture.cases?.length, 'A real case is required for the draft fixture.')
const slug = `draft-fixture-${randomUUID()}`
const sentinel = `DRAFT_NOT_FOR_PUBLICATION_${randomUUID()}`
fixture.cases.push({ ...structuredClone(fixture.cases[0]), slug, title: sentinel, summary: sentinel,
  pageStatus: 'draft', sections: [{ heading: sentinel, text: sentinel }] })
const env = { ...process.env, PUBLIC_BASE_PATH: '/sergey-portfolio/', SITE_URL: 'https://serrybalka.github.io', PUBLIC_INDEXABLE: 'false' }

function command(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: 'inherit' })
  if (result.error) throw result.error
  assert.equal(result.status, 0, `Command failed: node ${args.join(' ')}`)
}
async function files(directory) {
  const list = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) list.push(...await files(path))
    else if (entry.isFile()) list.push(path)
  }
  return list
}

let failure
try {
  await writeFile(source, `${JSON.stringify(fixture, null, 2)}\n`)
  command(['scripts/build-pages.mjs'])
  command(['scripts/check-pages.mjs'])
  const outputFiles = [...await files(resolve(root, 'dist')), ...await files(resolve(root, '.prerender'))]
  for (const path of outputFiles) {
    const bytes = await readFile(path)
    assert(!bytes.includes(Buffer.from(sentinel)), `Draft text leaked into ${path}`)
    assert(!bytes.includes(Buffer.from(slug)), `Draft slug leaked into ${path}`)
  }
  const report = JSON.parse(await readFile(resolve(root, '.prerender/build-report.json'), 'utf8'))
  assert(!report.routes.some(page => page.route.includes(slug)), 'Draft route was emitted.')
  assert.equal(await stat(resolve(root, 'dist/work', slug)).then(() => true, () => false), false, 'Draft HTML directory was emitted.')
  console.log(`Draft-boundary fixture passed: sentinel absent from ${outputFiles.length} client/SSR/static files, navigation and sitemap.`)
} catch (error) {
  failure = error
} finally {
  await writeFile(source, original)
  assert.equal(createHash('sha256').update(await readFile(source)).digest('hex'), originalHash, 'Original content was not restored byte-for-byte.')
  // Leave the working output in its real, non-fixture state and type-check it.
  command(['node_modules/typescript/bin/tsc', '-b'])
  command(['scripts/build-pages.mjs'])
  command(['scripts/check-pages.mjs'])
}
if (failure) throw failure
console.log('Original content restored byte-for-byte; final type-check, build and static checks passed.')
