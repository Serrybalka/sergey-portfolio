import { useState } from 'react'
import { content, email, getCase, visibleCases } from './data'
import { Badge, Button, CaseCard, Footer, Header, Icon, Media, hrefFor } from './ui'
import { semanticTokens, spacingScale, typeScale } from './tokens'

type Props = { path: string; basePath: string }

export function CopyEmailButton() {
  const [state, setState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')
  async function copy() {
    setState('copying')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(email)
      setState('copied')
    } catch {
      setState('error')
    }
  }
  return <div className="sp-copy-contact">
    <Button variant="secondary" loading={state === 'copying'} onClick={copy}>
      <Icon name={state === 'copied' ? 'check' : 'copy'} />
      {state === 'copied' ? 'Email скопирован' : state === 'copying' ? 'Копирую…' : 'Скопировать email'}
    </Button>
    <span className="sp-copy-feedback" role="status" aria-live="polite">{state === 'copied' ? 'Адрес можно вставить в письмо.' : ''}</span>
    {state === 'error' && <label className="sp-field">Скопируйте адрес вручную
      <input className="sp-input" aria-label="Email для ручного копирования" readOnly value={email} onFocus={event => event.currentTarget.select()} />
    </label>}
  </div>
}

function ContactSection() {
  return <section className="sp-contact-section sp-container" id="contact" aria-labelledby="contact-title">
    <div><p className="sp-eyebrow">Следующий проект — вместе</p><h2 id="contact-title">Есть сложная задача?<br />Давайте разберёмся.</h2><p>Открыт к роли Senior Product Designer / Design Lead и отдельным проектам с понятным результатом.</p></div>
    <div className="sp-contact-actions"><Button href={`mailto:${email}`}>Написать мне <Icon name="arrow-up-right" /></Button><CopyEmailButton /><a className="sp-text-link" href={content.resume.href}>Резюме по запросу <Icon name="arrow-up-right" /></a></div>
  </section>
}

function Cards({ basePath, all = true }: { basePath: string; all?: boolean }) {
  return <div className="sp-case-grid">{(all ? visibleCases : visibleCases.slice(0, 2)).map((item, index) => <CaseCard key={item.slug}
    slug={item.slug} title={item.title} summary={item.summary} category={item.confidentiality === 'nda' ? 'Профессиональная работа · NDA' : 'Проектная концепция'}
    role={item.role} status={item.projectStatus} cover={hrefFor(basePath, item.media.src)} coverAlt={item.media.alt}
    placeholder={item.media.kind === 'placeholder'} index={index} href={hrefFor(basePath, `/work/${item.slug}/`)} />)}</div>
}

function Home({ basePath }: { basePath: string }) {
  return <>
    <section className="sp-hero sp-container" aria-labelledby="hero-title">
      <div className="sp-hero-copy"><p className="sp-eyebrow">Senior Product Designer / Design Lead</p>
        <h1 className="sp-hero-title" id="hero-title">Сложные продукты.<br /><em>Ясные решения.</em></h1>
        <p className="sp-hero-lead">{content.home.description}</p>
        <div className="sp-actions"><Button href="#work">Посмотреть работы <Icon name="arrow-up-right" /></Button><Button variant="ghost" href="#contact">Обсудить задачу</Button></div>
      </div>
      <aside className="sp-hero-aside" aria-label="Мой подход к дизайну">
        <span className="sp-aside-index">UX / UI / AI</span>
        <div className="sp-orbit-art" aria-hidden="true"><span /><span /><span /><b>Системно.<br />В деталях.</b></div>
        <p>Сам проектирую.<br />Помогаю команде делать сильнее.</p>
      </aside>
      <div className="sp-hero-bottom">{content.home.proofs.map((proof, index) => <div key={proof.label}><span className="sp-item-index">0{index + 1}</span><strong>{proof.label}</strong><p>{proof.text}</p></div>)}</div>
    </section>
    <section className="sp-section sp-container" id="work" aria-labelledby="work-title">
      <div className="sp-section-heading"><div><p className="sp-eyebrow">Избранная работа</p><h2 id="work-title">От сценария —<br />до общей системы.</h2></div><p>Корпоративные продукты, дизайн-системы и концепции. В каждом проекте — моя роль и принятые решения.</p></div>
      <Cards basePath={basePath} />
      <p className="sp-media-note">Обложки пока временные: они показывают композицию сайта, а не интерфейсы проектов.</p>
    </section>
    <section className="sp-section sp-container sp-split" aria-labelledby="approach-title">
      <div><p className="sp-eyebrow">Практическое руководство</p><h2 id="approach-title">Не терять целое.<br />Доводить детали.</h2><Button variant="secondary" href={hrefFor(basePath, '/about/')}>Больше обо мне <Icon name="arrow-up-right" /></Button></div>
      <div className="sp-steps">{[
        ['Разобраться в задаче', 'Вместе с аналитиками уточняю сценарии, ограничения и контекст пользователя.'],
        ['Собрать общую основу', 'Создаю UI Kit, темы, токены и переиспользуемые паттерны. Фиксирую договорённости.'],
        ['Проверить и довести', 'Провожу ревью, подключаюсь к сложным решениям и помогаю команде пройти согласование.'],
        ['Ускорить поиск с AI', 'Ставлю задачи агентам и собираю HTML-прототипы. Финальное решение и проверка — на мне.'],
      ].map(([title, text], index) => <div className="sp-step" key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
    </section>
    <ContactSection />
  </>
}

function About() {
  return <>
    <section className="sp-section sp-container sp-about-intro"><p className="sp-eyebrow">Обо мне</p><h1>Проектирую сам.<br /><em>Усиливаю команду.</em></h1><p className="sp-intro-text">{content.about.intro}</p><div className="sp-split"><div><Badge tone="blue">Senior / Lead</Badge></div><div className="sp-prose">{content.about.paragraphs.map(text => <p key={text}>{text}</p>)}</div></div></section>
    <section className="sp-section sp-container"><div className="sp-section-heading"><div><p className="sp-eyebrow">Профессиональный путь</p><h2>Опыт работы</h2></div><p>Штатная работа и проектная практика — в хронологическом порядке.</p></div><div className="sp-experience-list">{content.experience.map(item => <article className="sp-experience-row" key={item.company}><p className="sp-period">{item.period}</p><div><h3>{item.company}</h3><p className="sp-role">{item.role}</p></div><p>{item.summary}</p></article>)}</div></section>
    <section className="sp-section sp-container"><div className="sp-section-heading"><h2>Чем буду полезен</h2><p>{content.about.workPreference}</p></div><div className="sp-capability-grid">{[
      ['layers', 'Системное проектирование', 'Реестры, карточки сущностей, сложные сценарии и единые паттерны.'],
      ['users', 'Команда и качество', 'Постановка задач, помощь в проектировании и финальные ревью.'],
      ['sparkles', 'AI как рабочий инструмент', 'Концепции и HTML-прототипы для обсуждения с аналитиками.'],
    ].map(([icon, title, text]) => <article key={title}><Icon name={icon as 'layers' | 'users' | 'sparkles'} /><h3>{title}</h3><p>{text}</p></article>)}</div></section><ContactSection />
  </>
}

export function ArticleBlock({ title, text }: { title: string; text: string }) {
  return <section className="sp-article-section"><h2>{title}</h2><p>{text}</p></section>
}

function CasePage({ slug, basePath }: { slug: string; basePath: string }) {
  const item = getCase(slug)
  if (!item) return <NotFound basePath={basePath} />
  const next = visibleCases[(visibleCases.indexOf(item) + 1) % visibleCases.length]
  return <>
    <section className="sp-case-hero sp-container">
      <a className="sp-text-link" href={hrefFor(basePath, '/work/')}>← Все работы</a>
      <div className="sp-badge-row"><Badge tone={item.kind === 'concept' ? 'green' : 'blue'}>{item.kind === 'concept' ? 'Проектная концепция' : 'Профессиональная работа'}</Badge>{item.confidentiality === 'nda' && <Badge><Icon name="lock" /> NDA</Badge>}</div>
      <h1>{item.title}</h1><p className="sp-case-summary">{item.summary}</p>
      <dl className="sp-case-facts"><div><dt>Моя роль</dt><dd>{item.role}</dd></div>{item.period && <div><dt>Период</dt><dd>{item.period}</dd></div>}<div><dt>Стадия проекта</dt><dd>{item.projectStatus}</dd></div></dl>
      <Media src={hrefFor(basePath, item.media.src)} alt={item.media.alt} caption={item.media.caption} placeholder={item.media.kind === 'placeholder'} priority />
    </section>
    <div className="sp-container sp-article-body"><aside className="sp-article-aside"><p className="sp-eyebrow">В фокусе</p>{item.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}</aside><article className="sp-prose">
      {item.confidentiality === 'nda' && <div className="sp-notice"><Icon name="lock" /><p>Рабочие материалы и подробности проекта — только на встрече без записи.</p></div>}
      {item.sections.map(section => <ArticleBlock key={section.heading} title={section.heading} text={section.text} />)}
      <Button href={`mailto:${email}?subject=${encodeURIComponent(item.cta + ': ' + item.title)}`}>{item.cta} <Icon name="arrow-up-right" /></Button>
    </article></div>
    <section className="sp-container sp-next-case"><p className="sp-eyebrow">Следующая работа</p><a href={hrefFor(basePath, `/work/${next.slug}/`)}><h2>{next.title}</h2><Icon name="arrow-up-right" /></a></section>
  </>
}

function ResponsivePreview({ basePath }: { basePath: string }) {
  const [width, setWidth] = useState(390)
  const [route, setRoute] = useState('/')
  return <div className="sp-responsive-preview">
    <div className="sp-ds-preview">
      {[390, 768, 1280].map(value => <Button key={value} variant="secondary" size="sm" aria-pressed={width === value} onClick={() => setWidth(value)}>{value} px</Button>)}
      <label className="sp-field">Страница<select className="sp-input" value={route} onChange={event => setRoute(event.currentTarget.value)}><option value="/">Главная</option><option value="/about/">Обо мне</option><option value="/work/platform/">Кейс</option></select></label>
    </div>
    <p className="sp-media-note">Вложенный viewport: {width} CSS px. Это проверка адаптива в текущем браузере, а не физического устройства.</p>
    <div className="sp-responsive-scroll"><iframe title={`Адаптивная версия: ${width} px`} src={hrefFor(basePath, route)} width={width} height="680" loading="lazy" /></div>
  </div>
}

function DesignSystem({ basePath }: { basePath: string }) {
  const demo = visibleCases[0]
  return <div className="sp-ds-layout sp-container"><div className="sp-section-heading"><div><p className="sp-eyebrow">Живая библиотека · v0.1</p><h1>Основа интерфейса</h1></div><p>Те же компоненты и CSS-токены, что на сайте. Страница исключена из индексации.</p></div>
    <nav className="sp-ds-nav" aria-label="Разделы дизайн-системы">{[['colors', 'Цвета'], ['type', 'Типографика'], ['space', 'Сетка'], ['controls', 'Контролы'], ['cards', 'Карточки'], ['article', 'Статья']].map(([id, title]) => <a href={`#${id}`} key={id}>{title}</a>)}</nav>
    <section className="sp-ds-section" id="colors"><h2>Цвета и семантические роли</h2><p>Компоненты используют роли, а не независимые локальные цвета.</p><div className="sp-ds-swatch-grid">{semanticTokens.map(({ name, value }) => <div className="sp-ds-swatch" key={name}><span style={{ background: `var(${name})` }} /><strong>{name}</strong><code>{String(value)}</code></div>)}</div></section>
    <section className="sp-ds-section" id="type"><h2>Типографика</h2><p>Системный стек sans-serif. Без внешних загрузчиков шрифтов; базовый текст 18 px.</p><div className="sp-ds-type-list">{typeScale.map(({ name, size: value }) => <div key={name}><code>{name}: {String(value)}</code><p style={{ fontSize: typeof value === 'number' ? `${value}px` : String(value) }}>Ясные решения в сложных продуктах</p></div>)}</div></section>
    <section className="sp-ds-section" id="space"><h2>Сетка и интервалы</h2><p>Единые контейнеры, адаптивная сетка. Карточки переходят в одну колонку на узком экране.</p><div className="sp-ds-space-grid">{spacingScale.map(({ name, value }) => <div key={name}><code>{name} · {String(value)}</code><span style={{ width: typeof value === 'number' ? `${value}px` : String(value) }} /></div>)}</div></section>
    <section className="sp-ds-section" id="controls"><h2>Действия и состояния</h2><p>Ссылка — для перехода, кнопка — для действия. Наведение, нажатие и клавиатурный фокус работают на настоящих экземплярах.</p><div className="sp-ds-preview"><Button href={hrefFor(basePath, '/work/')}>Открыть работы <Icon name="arrow-up-right" /></Button><Button variant="secondary">Вторичное действие</Button><Button variant="ghost">Текстовое действие</Button><Button disabled>Недоступно</Button><Button loading>Обработка</Button></div><h3>Копирование контакта</h3><p>Успех показывается только после ответа Clipboard API. При отказе появляется поле для ручного копирования.</p><CopyEmailButton /><div className="sp-badge-row"><Badge>Профессиональная работа</Badge><Badge tone="blue">NDA</Badge><Badge tone="green">Концепция</Badge><Badge tone="amber">Временная иллюстрация</Badge></div></section>
    <section className="sp-ds-section" id="cards"><h2>Карточка кейса и медиа</h2><p>Используется на главной и в каталоге. Обложки для сборки композиции явно отмечены как временные.</p><div className="sp-case-grid"><CaseCard slug={demo.slug} title={demo.title} summary={demo.summary} category="Профессиональная работа · NDA" role={demo.role} status={demo.projectStatus} cover={hrefFor(basePath, demo.media.src)} coverAlt={demo.media.alt} placeholder index={0} href={hrefFor(basePath, `/work/${demo.slug}/`)} /></div></section>
    <section className="sp-ds-section" id="responsive"><h2>Адаптивные композиции</h2><p>Отображается настоящая страница сайта с её компонентами и media queries.</p><ResponsivePreview basePath={basePath} /></section>
    <section className="sp-ds-section" id="article"><h2>Блок статьи</h2><div className="sp-prose"><ArticleBlock title={demo.sections[0].heading} text={demo.sections[0].text} /></div><h3>Доступность и движение</h3><p>Основной контент виден без анимаций. При reduced-motion переходы отключаются. Нативные ссылки, видимый focus-ring, семантические заголовки и текстовые альтернативы сохраняются.</p></section>
  </div>
}

function NotFound({ basePath }: { basePath: string }) {
  return <section className="sp-container sp-empty-state"><p className="sp-eyebrow">404</p><h1>Такой страницы нет.</h1><p>Возможно, адрес изменился. Работы и контакты доступны на главной.</p><Button href={hrefFor(basePath, '/')}>На главную <Icon name="arrow-up-right" /></Button></section>
}

export function PortfolioApp({ path, basePath }: Props) {
  const caseSlug = path.match(/^\/work\/([^/]+)\/?$/)?.[1]
  const isDS = path === '/ds/' || path === '/ds'
  const isAbout = path === '/about/' || path === '/about'
  const isWork = path === '/work/' || path === '/work'
  const body = path === '/' ? <Home basePath={basePath} /> : isAbout ? <About /> : isWork ? <section className="sp-section sp-container"><p className="sp-eyebrow">Портфолио</p><h1>Работы и решения</h1><p className="sp-intro-text">{content.mediaNotice}</p><Cards basePath={basePath} /></section> : isDS ? <DesignSystem basePath={basePath} /> : caseSlug ? <CasePage slug={caseSlug} basePath={basePath} /> : <NotFound basePath={basePath} />
  return <div className="sp-site"><Header basePath={basePath} active={isDS ? 'ds' : isAbout ? 'about' : 'work'} /><main id="main">{body}</main><Footer basePath={basePath} /></div>
}
