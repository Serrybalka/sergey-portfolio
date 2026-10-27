import { fileURLToPath } from 'node:url'
import { defineConfig, normalizePath, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Filter before Vite's JSON transform: hiding cards at runtime would still
// disclose imported draft text in the client and SSR bundles.
function publicPortfolioContent(): Plugin {
  const contentPath = normalizePath(fileURLToPath(new URL('./src/portfolio/content.json', import.meta.url)))
  return {
    name: 'portfolio-public-content',
    apply: 'build',
    enforce: 'pre',
    transform(source, id) {
      if (normalizePath(id.split('?')[0]) !== contentPath) return
      const content = JSON.parse(source) as { cases?: Array<{ pageStatus?: string }> }
      if (!Array.isArray(content.cases)) throw new Error('Portfolio content must contain a cases array.')
      if (content.cases.some(item => !item || !['draft', 'preview', 'published'].includes(item.pageStatus || ''))) {
        throw new Error('Each portfolio case requires a known pageStatus.')
      }
      return { code: JSON.stringify({ ...content, cases: content.cases.filter(item => item.pageStatus !== 'draft') }), map: null }
    },
  }
}

export default defineConfig({
  plugins: [publicPortfolioContent(), react(), tailwindcss()],
})
