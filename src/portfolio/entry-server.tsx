import { renderToString } from 'react-dom/server'
import { PortfolioApp } from './App'
import { content, getCase, visibleCases } from './data'

export const routes = ['/', '/about/', '/work/', ...visibleCases.map(item => `/work/${item.slug}/`), '/ds/', '/404.html']

export function renderPage(path: string, basePath = '/') {
  const slug = path.match(/^\/work\/([^/]+)\/?$/)?.[1]
  const item = slug ? getCase(slug) : undefined
  const title = item ? `${item.title} — Сергей Рыбалка` : path.startsWith('/about') ? 'Обо мне — Сергей Рыбалка' : path.startsWith('/ds') ? 'Дизайн-система — Сергей Рыбалка' : path.startsWith('/work') ? 'Работы — Сергей Рыбалка' : path.includes('404') ? 'Страница не найдена — Сергей Рыбалка' : 'Сергей Рыбалка — Senior Product Designer / Design Lead'
  const description = item?.summary || (path.startsWith('/about') ? 'Опыт Сергея Рыбалки: сложные B2B-интерфейсы, координация дизайнеров, UI Kit, темы, токены и AI-прототипирование.' : path.startsWith('/work') ? 'Избранные работы Сергея Рыбалки: корпоративная платформа, дизайн-система, ТАСС и проектные UX/UI-концепции.' : path.startsWith('/ds') ? 'Живая дизайн-система портфолио: токены, типографика, компоненты, состояния и правила применения из общего источника.' : path.includes('404') ? 'Страница не найдена. Вернитесь к работам и контактам Сергея Рыбалки.' : content.home.description)
  return { html: renderToString(<PortfolioApp path={path} basePath={basePath} />), title, description, noindex: path.startsWith('/ds') || path.includes('404') || item?.pageStatus !== 'published' && !!item, canonicalPath: path, head: '' }
}
