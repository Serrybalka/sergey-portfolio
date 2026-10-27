import { createRoot, hydrateRoot } from 'react-dom/client'
import { PortfolioApp } from './portfolio/App'
import './portfolio/portfolio.css'

const basePath = import.meta.env.BASE_URL
const pathname = window.location.pathname
const path = basePath === '/' ? pathname : pathname.startsWith(basePath) ? '/' + pathname.slice(basePath.length) : '/404.html'
const root = document.getElementById('root')!
const app = <PortfolioApp path={path || '/'} basePath={basePath} />
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
