import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const upstream = join(root, 'upstream-v0.3.24')
const gallerySource = join(upstream, 'docs/docs/examples.mdx')
const galleryDir = join(root, 'gallery')
const docsDir = join(root, 'docs-examples')

mkdirSync(galleryDir, { recursive: true })
mkdirSync(docsDir, { recursive: true })

function extractSections(source) {
  const text = readFileSync(source, 'utf8')
  const headings = [...text.matchAll(/^## (.+)$/gm)]
  return headings.map((heading, index) => {
    const title = heading[1].trim()
    const section = text.slice(heading.index, headings[index + 1]?.index ?? text.length)
    const match = section.match(/<summary>Source Code<\/summary>\s*```typescript\r?\n([\s\S]*?)\r?\n```/)
    if (!match)
      throw new Error(`Missing TypeScript source for ${title} in ${source}`)
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return { title, slug, code: match[1] }
  })
}

const gallery = extractSections(gallerySource)
if (gallery.length !== 39)
  throw new Error(`Expected 39 v0.3.24 gallery entries, found ${gallery.length}`)
for (const { slug, code } of gallery)
  writeFileSync(join(galleryDir, `${slug}.ts`), `${code}\n`)

const docsSources = ['animations', 'graphing', '3d-scenes', 'new']
const additional = docsSources.flatMap(page =>
  extractSections(join(upstream, `docs/docs/examples/${page}.mdx`))
    .filter(({ slug }) => !gallery.some(entry => entry.slug === slug))
    .map(entry => ({ ...entry, page })))

if (additional.length !== 18 || new Set(additional.map(entry => entry.slug)).size !== 18)
  throw new Error(`Expected 18 distinct additional docs examples, found ${additional.length}`)
for (const { slug, code } of additional)
  writeFileSync(join(docsDir, `${slug}.ts`), `${code}\n`)

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesUnder(path) : [relative(join(upstream, 'examples'), path)]
  })
}

const exampleRoot = join(upstream, 'examples')
const files = filesUnder(exampleRoot).sort()
const typescript = files.filter(path => path.endsWith('.ts'))
const html = files.filter(path => path.endsWith('.html'))
const htmlOnly = html.filter(path => !typescript.includes(path.replace(/\.html$/, '.ts')))

if (typescript.length !== 60 || html.length !== 89 || htmlOnly.length !== 29)
  throw new Error(`Expected 60 TypeScript, 89 HTML, and 29 HTML-only files; found ${typescript.length}, ${html.length}, and ${htmlOnly.length}`)

const index = [
  '# Manim-web example index',
  '',
  'Source: [manim-web v0.3.24](https://github.com/maloyan/manim-web/tree/v0.3.24).',
  'The files are reference source, not pre-adapted Slidev components.',
  '',
  '## Website gallery (39 source snippets)',
  '',
  ...gallery.map(({ title, slug }) => `- [${title}](gallery/${slug}.ts)`),
  '',
  '## Additional documentation examples (18 source snippets)',
  '',
  ...additional.map(({ title, slug, page }) =>
    `- [${title}](docs-examples/${slug}.ts) ([${page} page](upstream-v0.3.24/docs/docs/examples/${page}.mdx))`),
  '',
  '## Upstream TypeScript examples (60 files)',
  '',
  ...typescript.map((path) => {
    const htmlPath = path.replace(/\.ts$/, '.html')
    return `- [${path}](upstream-v0.3.24/examples/${path}) ([HTML](upstream-v0.3.24/examples/${htmlPath}))`
  }),
  '',
  '## Additional HTML-only examples (29 files)',
  '',
  ...htmlOnly.map(path => `- [${path}](upstream-v0.3.24/examples/${path})`),
  '',
  'The 60 paired HTML pages are linked beside their TypeScript files above. The',
  '[upstream examples directory](upstream-v0.3.24/examples/) also includes their',
  'font asset. The full gallery and annotated pages are preserved under',
  '[upstream-v0.3.24/docs/docs/](upstream-v0.3.24/docs/docs/).',
  '',
]
writeFileSync(join(root, 'INDEX.md'), index.join('\n'))

console.log(`Indexed ${gallery.length} gallery snippets, ${additional.length} additional docs snippets, ${typescript.length} TypeScript files, and ${html.length} HTML pages.`)
