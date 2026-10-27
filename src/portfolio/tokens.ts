/** Shared source of truth for the portfolio and /ds. No analytics or account data. */
export const tokens = {
  colors: {
    ink: '#102126',
    paper: '#F5F5F1',
    white: '#FFFFFF',
    cobalt: '#2155FF',
    cobaltHover: '#1742D1',
    navy: '#102126',
    muted: '#59686C',
    line: '#D9DFDC',
    blueTint: '#E7EDFF',
    greenTint: '#E5EFE7',
    greenInk: '#245336',
    amberTint: '#FFF0CF',
    amberInk: '#6A4B12',
    danger: '#A92B35',
    dangerTint: '#FCEAEC',
    inverseMuted: '#B9C9CD',
    inverseLine: '#42565C',
  },
  fonts: {
    body: "'Manrope', 'Segoe UI', Arial, sans-serif",
    mono: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
  },
  radius: { small: '8px', medium: '16px', large: '24px', pill: '999px' },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96, 32: 128 },
  layout: { page: '1280px', prose: '760px', gutter: 'clamp(20px, 4.5vw, 72px)' },
  motion: { duration: '180ms', easing: 'cubic-bezier(.2,.65,.3,1)' },
} as const

export const semanticTokens = [
  { name: '--sp-color-text', label: 'Основной текст', value: tokens.colors.ink, description: 'Заголовки, текст и содержательные иконки.' },
  { name: '--sp-color-muted', label: 'Вторичный текст', value: tokens.colors.muted, description: 'Метаданные и подписи; не для отключённых действий.' },
  { name: '--sp-color-page', label: 'Фон страницы', value: tokens.colors.paper, description: 'Основная светлая поверхность.' },
  { name: '--sp-color-surface', label: 'Поверхность', value: tokens.colors.white, description: 'Вложенный контент и демонстрации компонентов.' },
  { name: '--sp-color-accent', label: 'Акцент', value: tokens.colors.cobalt, description: 'Основные действия, ссылки и focus-visible.' },
  { name: '--sp-color-accent-hover', label: 'Акцент при наведении', value: tokens.colors.cobaltHover, description: 'Hover и active основного действия.' },
  { name: '--sp-color-border', label: 'Граница', value: tokens.colors.line, description: 'Разделение блоков и нейтральных контролов.' },
  { name: '--sp-color-inverse', label: 'Инверсная поверхность', value: tokens.colors.navy, description: 'Контактный блок в завершении страницы.' },
  { name: '--sp-color-on-inverse', label: 'Текст на инверсной поверхности', value: tokens.colors.white, description: 'Основное содержимое тёмного блока.' },
  { name: '--sp-color-on-inverse-muted', label: 'Вторичный инверсный текст', value: tokens.colors.inverseMuted, description: 'Подписи в тёмном блоке.' },
] as const

export const typeScale = [
  { name: 'Display', token: '--sp-type-display', size: 'clamp(52px, 6.6vw, 96px)', lineHeight: '1.02', weight: 600 },
  { name: 'Title', token: '--sp-type-title', size: 'clamp(36px, 4.3vw, 64px)', lineHeight: '1.08', weight: 600 },
  { name: 'Section', token: '--sp-type-section', size: 'clamp(28px, 3vw, 42px)', lineHeight: '1.16', weight: 600 },
  { name: 'Card', token: '--sp-type-card', size: 'clamp(24px, 2.1vw, 30px)', lineHeight: '1.2', weight: 600 },
  { name: 'Lead', token: '--sp-type-lead', size: 'clamp(20px, 2vw, 24px)', lineHeight: '1.5', weight: 400 },
  { name: 'Body', token: '--sp-type-body', size: '18px', lineHeight: '1.65', weight: 400 },
  { name: 'Small', token: '--sp-type-small', size: '14px', lineHeight: '1.5', weight: 400 },
] as const

export const spacingScale = Object.entries(tokens.space).map(([step, value]) => ({ name: `space-${step}`, value }))

const aliases: Record<string, string> = {
  '--sp-color-text': 'ink', '--sp-color-muted': 'muted', '--sp-color-page': 'paper',
  '--sp-color-surface': 'white', '--sp-color-accent': 'cobalt', '--sp-color-accent-hover': 'cobaltHover',
  '--sp-color-border': 'line', '--sp-color-inverse': 'navy', '--sp-color-on-inverse': 'white',
  '--sp-color-on-inverse-muted': 'inverseMuted',
}

/** Emitted once by Header, and reused by the static renderer through the same component. */
export const tokenCss = `:root{${[
  ...Object.entries(tokens.colors).map(([name, value]) => `--sp-palette-${name}:${value}`),
  ...semanticTokens.map(({ name }) => `${name}:var(--sp-palette-${aliases[name]})`),
  ...Object.entries(tokens.space).map(([name, value]) => `--sp-space-${name}:${value}px`),
  ...Object.entries(tokens.radius).map(([name, value]) => `--sp-radius-${name}:${value}`),
  ...typeScale.map(({ token, size }) => `${token}:${size}`),
  `--sp-font-body:${tokens.fonts.body}`, `--sp-font-mono:${tokens.fonts.mono}`,
  `--sp-width-page:${tokens.layout.page}`, `--sp-width-prose:${tokens.layout.prose}`,
  `--sp-gutter:${tokens.layout.gutter}`, `--sp-motion-duration:${tokens.motion.duration}`,
  `--sp-motion-easing:${tokens.motion.easing}`,
].join(';')}}`
