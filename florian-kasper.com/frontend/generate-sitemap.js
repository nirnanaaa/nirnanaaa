import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const baseUrl = 'https://www.florian-kasper.com'
const today = new Date().toISOString().split('T')[0]

const pages = [
  { path: '/', dePath: '/de/', priority: '1.0' },
  { path: '/about', dePath: '/de/about', priority: '0.8' },
  { path: '/clients', dePath: '/de/clients', priority: '0.8' },
  { path: '/projects', dePath: '/de/projects', priority: '0.6' },
  { path: '/uses', dePath: '/de/uses', priority: '0.6' },
  { path: '/privacy', dePath: '/de/privacy', priority: '0.3' },
]

function urlEntry(loc, enHref, deHref, priority) {
  return `  <url>
    <loc>${baseUrl}${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${enHref}"/>
    <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}${deHref}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${enHref}"/>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>`
}

const entries = pages.flatMap(({ path, dePath, priority }) => [
  urlEntry(path, path, dePath, priority),
  urlEntry(dePath, path, dePath, priority),
])

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`

const outPath = resolve(__dirname, '../cmd/server/dist/sitemap.xml')
writeFileSync(outPath, sitemap)
console.log(`sitemap written to ${outPath}`)
