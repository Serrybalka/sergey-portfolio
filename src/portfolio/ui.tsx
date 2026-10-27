import { useState } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, MouseEventHandler, ReactNode } from 'react'
import {
  ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, Check, ChevronDown, ChevronUp,
  Menu, X, Copy, Mail, ExternalLink, Layers, Component, Sparkles, ShieldCheck,
  LayoutTemplate, Users, CircleCheck, Download, Monitor, Smartphone, LoaderCircle,
  Search, Plus, Minus, CircleAlert, Link, CodeXml, LockKeyhole,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { tokenCss } from './tokens'

const iconMap = {
  'arrow-up-right': ArrowUpRight, 'arrow-right': ArrowRight, 'arrow-left': ArrowLeft,
  'arrow-down': ArrowDown, check: Check, 'chevron-down': ChevronDown, 'chevron-up': ChevronUp,
  menu: Menu, x: X, copy: Copy, mail: Mail, 'external-link': ExternalLink,
  layers: Layers, component: Component, sparkles: Sparkles, shield: ShieldCheck,
  layout: LayoutTemplate, users: Users, 'circle-check': CircleCheck, download: Download,
  monitor: Monitor, smartphone: Smartphone, loader: LoaderCircle, search: Search,
  plus: Plus, minus: Minus, 'alert-circle': CircleAlert, link: Link, code: CodeXml,
  lock: LockKeyhole,
} as const

export type IconName = keyof typeof iconMap
export function Icon({ name = 'arrow-up-right', size = 20, ...props }: LucideProps & { name?: IconName }) {
  const Glyph = iconMap[name]
  return <Glyph size={size} strokeWidth={1.7} aria-hidden="true" focusable="false" {...props} />
}

export function hrefFor(basePath: string, path = '') {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path
  const base = `/${basePath.split('/').filter(Boolean).join('/')}`.replace(/\/$/, '')
  if (path.startsWith('#') || path.startsWith('?')) return `${base || ''}/${path}`
  const normalized = path.replace(/^\/+/, '')
  return `${base || ''}/${normalized}`
}

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'sm'
  href?: string
  loading?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  target?: string
  rel?: string
  download?: boolean | string
}

export function Button({ children, variant = 'primary', size = 'md', href, disabled = false,
  loading = false, onClick, className = '', target, rel, download, type = 'button', ...props }: ButtonProps) {
  const unavailable = disabled || loading
  const classes = `sp-button sp-button--${variant} sp-button--${size}${loading ? ' is-loading' : ''} ${className}`.trim()
  const contents = <>{loading && <Icon name="loader" className="sp-spinner" />}<span>{children}</span></>
  if (href) {
    const { form: _form, formAction: _formAction, formEncType: _formEncType,
      formMethod: _formMethod, formNoValidate: _formNoValidate, formTarget: _formTarget,
      name: _name, value: _value, ...linkProps } = props
    return <a {...linkProps as AnchorHTMLAttributes<HTMLAnchorElement>} href={href} className={classes} target={target}
      rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)} download={download}
      aria-disabled={unavailable || undefined} aria-busy={loading || undefined}
      tabIndex={unavailable ? -1 : props.tabIndex}
      onClick={event => { if (unavailable) event.preventDefault(); else onClick?.(event) }}>
      {contents}
    </a>
  }
  return <button {...props} type={type} className={classes} disabled={unavailable}
    aria-busy={loading || undefined} onClick={onClick}>{contents}</button>
}

export function Badge({ children, tone = 'neutral', className = '' }: {
  children: ReactNode; tone?: 'neutral' | 'blue' | 'green' | 'amber'; className?: string
}) {
  return <span className={`sp-badge sp-badge--${tone} ${className}`.trim()}>{children}</span>
}

export function Container({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`sp-container ${className}`.trim()} style={style}>{children}</div>
}

export function Section({ children, id, className = '', label }: {
  children: ReactNode; id?: string; className?: string; label?: string
}) {
  return <section id={id} className={`sp-section ${className}`.trim()} aria-label={label}>{children}</section>
}

export type MediaProps = {
  src: string; alt: string; caption?: ReactNode; placeholder?: boolean; priority?: boolean
  className?: string; srcSet?: string; sizes?: string
}

export function Media({ src, alt, caption, placeholder = true, priority = false, className = '', srcSet, sizes }: MediaProps) {
  const [failed, setFailed] = useState(false)
  const derivedSrcSet = srcSet ?? (src.endsWith('.webp') ? `${src.replace(/\.webp$/, '-480.webp')} 480w, ${src} 1200w` : undefined)
  return <figure className={`sp-media ${failed ? 'sp-media--failed' : ''} ${className}`.trim()}>
    <div className="sp-media__image-wrap">
      {!failed ? <img src={src} srcSet={derivedSrcSet} sizes={sizes ?? '(min-width: 1400px) 1280px, calc(100vw - 40px)'} alt={alt} width="1200" height="800"
        loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}
        decoding="async" onError={() => setFailed(true)} />
        : <div className="sp-media__fallback"><Icon name="layout" size={32} /><p>Иллюстрация недоступна</p><span>{alt}</span></div>}
      {placeholder && <span className="sp-media__placeholder"><Icon name="layout" size={14} />Временная иллюстрация</span>}
    </div>
    {(caption || placeholder) && <figcaption>{caption ?? 'Временное изображение для композиции. Будет заменено материалами кейса.'}</figcaption>}
  </figure>
}

export type CaseCardProps = {
  slug: string; title: string; summary: string; category: string; role: string; status: string
  cover: string; coverAlt: string; placeholder?: boolean; index?: number; href: string
}

export function CaseCard({ slug, title, summary, category, role, status, cover, coverAlt,
  placeholder = true, index = 0, href }: CaseCardProps) {
  return <article className={`sp-case-card${index === 0 ? ' sp-case-card--featured' : ''}`} data-case={slug}>
    <a className="sp-case-card__link" href={href}>
      <div className="sp-case-card__art">
        <img src={cover} srcSet={cover.endsWith('.webp') ? `${cover.replace(/\.webp$/, '-480.webp')} 480w, ${cover} 1200w` : undefined}
          sizes={index === 0 ? '(min-width: 1000px) 720px, calc(100vw - 40px)' : '(min-width: 768px) 560px, calc(100vw - 40px)'}
          alt={coverAlt} width="1200" height="800" loading="lazy" decoding="async" />
        {placeholder && <span className="sp-media__placeholder"><Icon name="layout" size={14} />Временная иллюстрация</span>}
        <span className="sp-case-card__open"><Icon name="arrow-up-right" size={22} /></span>
      </div>
      <div className="sp-case-card__body">
        <div className="sp-case-card__meta"><span>{category}</span><span>{status}</span></div>
        <h3>{title}</h3>
        <p>{summary}</p>
        <div className="sp-case-card__footer"><span>{role}</span><span className="sp-case-card__cta">Читать кейс<Icon name="arrow-right" size={18} /></span></div>
      </div>
    </a>
  </article>
}

export function Header({ basePath, active = 'work' }: { basePath: string; active?: 'work' | 'about' | 'ds' }) {
  return <>
    <style data-portfolio-tokens dangerouslySetInnerHTML={{ __html: tokenCss }} />
    <a className="sp-skip-link" href="#main">Перейти к содержанию</a>
    <header className="sp-header">
      <Container className="sp-header__inner">
        <a className="sp-brand" href={hrefFor(basePath)} aria-label="Сергей Рыбалка — на главную">
          <span className="sp-brand__mark" aria-hidden="true">ср</span>
          <span className="sp-brand__name">Сергей Рыбалка<span>Product designer / Design lead</span></span>
        </a>
        <nav className="sp-nav" aria-label="Основная навигация">
          <a href={hrefFor(basePath, '#work')} aria-current={active === 'work' ? 'page' : undefined}>Работы</a>
          <a href={hrefFor(basePath, 'about/')} aria-current={active === 'about' ? 'page' : undefined}>Обо мне</a>
          <a href="mailto:serrybalka@gmail.com" className="sp-nav__contact">Написать<Icon name="arrow-up-right" size={18} /></a>
        </nav>
      </Container>
    </header>
  </>
}

export function Footer({ basePath }: { basePath: string }) {
  return <footer className="sp-footer" id="footer-contact">
    <Container>
      <div className="sp-footer__main">
        <div><p className="sp-eyebrow">Давайте познакомимся</p><h2>Обсудим ваш<br />продукт?</h2></div>
        <div className="sp-footer__contact"><a className="sp-footer__email" href="mailto:serrybalka@gmail.com">serrybalka@gmail.com<Icon name="arrow-up-right" size={30} /></a>
          <p>Сложные интерфейсы, дизайн-системы<br />и практическое руководство дизайном.</p>
          <div className="sp-footer__social"><a href="https://t.me/serrybalka" target="_blank" rel="noopener noreferrer">Telegram<Icon name="arrow-up-right" size={17} /></a><a href="https://www.linkedin.com/in/serrybalka/" target="_blank" rel="noopener noreferrer">LinkedIn<Icon name="arrow-up-right" size={17} /></a></div>
        </div>
      </div>
      <div className="sp-footer__bottom"><span>Сергей Рыбалка · Product Design</span><span>Москва · удалённо</span><a href={hrefFor(basePath, 'ds/')}>Дизайн-система<Icon name="arrow-up-right" size={14} /></a></div>
    </Container>
  </footer>
}
