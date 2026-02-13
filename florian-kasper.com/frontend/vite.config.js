import { resolve } from 'path'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import yaml from 'js-yaml'
import fs from 'fs'
import { marked } from 'marked'

const locale = process.env.LOCALE || 'en'
const isDE = locale === 'de'
const prefix = isDE ? '/de' : ''
const altPrefix = isDE ? '' : '/de'

const cv = yaml.load(fs.readFileSync(resolve(__dirname, `../data/projects_${locale}.yaml`), 'utf8'))
const i18n = yaml.load(fs.readFileSync(resolve(__dirname, `../data/i18n/${locale}.yaml`), 'utf8'))
const privacyFile = isDE ? '../data/privacy_de.md' : '../data/privacy.md'
const privacy = marked(fs.readFileSync(resolve(__dirname, privacyFile), 'utf8'))
const sideProjectsData = yaml.load(fs.readFileSync(resolve(__dirname, '../data/side_projects.yaml'), 'utf8'))
const sideProjects = sideProjectsData.projects || []

const projects = cv.history
  .filter(p => (p.invertedSortingWeight ?? 99) > -1)
  .sort((a, b) => (a.invertedSortingWeight ?? 99) - (b.invertedSortingWeight ?? 99))

const baseUrl = 'https://www.florian-kasper.com'

const pages = ['about', 'clients', 'projects', 'uses', 'privacy']

function cleanUrlPlugin() {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url.split('?')[0]
        const bare = url.endsWith('/') ? url.slice(0, -1) : url
        const deMatch = bare.match(/^\/de\/(.+)$/)
        if (deMatch && pages.includes(deMatch[1])) {
          req.url = '/' + deMatch[1] + '/index.html'
          return next()
        }
        if (pages.includes(bare.slice(1))) {
          req.url = bare + '/index.html'
        }
        next()
      })
    },
  }
}

function pagePaths(pagePath) {
  const enPath = pagePath === '/' ? '/' : pagePath
  const dePath = pagePath === '/' ? '/de/' : '/de' + pagePath
  return { enPath, dePath }
}

const pageContext = {
  '/': {
    title: isDE
      ? 'Florian Kasper — Software- & DevOps-Ingenieur'
      : 'Florian Kasper — Software & DevOps Engineer',
    description: i18n.home.cvDescription,
    path: prefix === '' ? '/' : prefix + '/',
    isHome: true,
  },
  '/about': {
    title: isDE ? 'Über mich — Florian Kasper' : 'About — Florian Kasper',
    description: isDE
      ? 'Hintergrund, Fähigkeiten und Lebenslauf von Florian Kasper. Go, Kubernetes, AWS, Platform Engineering.'
      : 'Background, skills and CV of Florian Kasper. Go, Kubernetes, AWS, platform engineering.',
    path: prefix + '/about',
  },
  '/clients': {
    title: isDE ? 'Kunden — Florian Kasper' : 'Clients — Florian Kasper',
    description: isDE
      ? 'Ausgewählte Kundenprojekte: Scout24, EnBW, Baxter, IONOS und mehr. Kubernetes, Go, AWS.'
      : 'Selected client projects: Scout24, EnBW, Baxter, IONOS and more. Kubernetes, Go, AWS.',
    path: prefix + '/clients',
  },
  '/projects': {
    title: isDE ? 'Projekte — Florian Kasper' : 'Projects — Florian Kasper',
    description: isDE
      ? 'Nebenprojekte: Holzarbeiten, eigene Platinen und Firmware-Hacking.'
      : 'Side projects: woodworking, custom PCBs and firmware hacking.',
    path: prefix + '/projects',
  },
  '/uses': {
    title: isDE ? 'Tools — Florian Kasper' : 'Uses — Florian Kasper',
    description: isDE
      ? 'Tools, Hardware und Software, die ich für Entwicklung und Infrastruktur nutze.'
      : 'Tools, hardware and software I use for development and infrastructure work.',
    path: prefix + '/uses',
  },
  '/privacy': {
    title: isDE ? 'Datenschutz — Florian Kasper' : 'Privacy Policy — Florian Kasper',
    description: isDE
      ? 'Datenschutzerklärung für florian-kasper.com.'
      : 'Privacy policy for florian-kasper.com.',
    path: prefix + '/privacy',
  },
}

export default defineConfig({
  root: '.',
  plugins: [
    cleanUrlPlugin(),
    handlebars({
      context(pagePath) {
        let normalized = pagePath
          .replace(/\/index\.html$/, '')
          .replace(/\.html$/, '')
        if (normalized === '') normalized = '/'

        const page = pageContext[normalized] || pageContext['/']
        const { enPath, dePath } = pagePaths(normalized)
        const altPath = isDE ? enPath : dePath

        return {
          ...cv,
          projects,
          sideProjects,
          privacy,
          baseUrl,
          year: new Date().getFullYear(),
          lang: locale,
          prefix,
          ogLocale: isDE ? 'de_DE' : 'en_US',
          ogLocaleAlt: isDE ? 'en_US' : 'de_DE',
          enPath,
          dePath,
          altPath,
          i18n,
          ...page,
        }
      },
      partialDirectory: resolve(__dirname, 'partials'),
    }),
  ],
  build: {
    outDir: resolve(__dirname, '../cmd/server/dist' + (isDE ? '/de' : '')),
    emptyOutDir: !isDE,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html'),
        clients: resolve(__dirname, 'clients/index.html'),
        projects: resolve(__dirname, 'projects/index.html'),
        uses: resolve(__dirname, 'uses/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        notfound: resolve(__dirname, '404.html'),
      },
    },
  },
})
