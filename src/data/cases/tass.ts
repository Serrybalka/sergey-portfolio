import type { CaseStory } from '../../types/content'

export const tassCase: CaseStory = {
  id: 'tass',
  route: 'tass',
  company: 'ТАСС',
  role: 'Senior Product Designer',
  timeline: '2021-2023',
  title: 'Редизайн новостных карточек и UX-ядра',
  subtitle:
    'Контентные интерфейсы для высоконагруженной редакционной среды: читабельность, структура и масштабируемая media-архитектура.',
  impactStatement:
    'Пересобрал UX-ядро карточек, чтобы редакция управляла форматами контента быстрее и без потери качества чтения.',
  compactProblem:
    'Карточки новостей плохо поддерживали разные форматы контента и создавали трение в потреблении.',
  compactProcess: [
    'Собрал сценарии чтения и паттерны поведения пользователей.',
    'Подготовил интерактивные прототипы и сравнение вариантов.',
    'Плотно работал с аналитикой, маркетингом и разработкой по итерациям.',
  ],
  compactSolution:
    'Собрал обновленный UI-паттерн карточек и дизайн-системный слой для дальнейшего масштабирования.',
  compactImpact:
    'Редакция получила управляемый формат карточек и более ясную структуру контента в ленте.',
  compactChips: ['Интерактивные прототипы', 'Системный UI-layer', 'Кросс-функциональная итерация'],
  heroKpis: ['CTR quality ↑', 'Reading friction ↓', 'Scalable card system'],
  heroStack: ['Content UX', 'Information design', 'Prototype', 'Analytics'],
  heroTags: ['Media architecture', 'Editorial UX', 'Engagement optimization'],
  sections: {
    context: { heading: 'Context', text: 'Новости публиковались в разных форматах, но карточки не отражали контентную сложность.', bullets: ['Единый фид для нескольких типов материалов', 'Разная глубина чтения и сценарии вовлечения', 'Высокие требования к скорости редакции'] },
    problem: { heading: 'Problem', text: 'Карточки теряли смысловую иерархию и ухудшали сканирование контента.', bullets: ['Слабый визуальный приоритет', 'Низкая адаптивность под форматы', 'Фрагментированный UX паттерн'] },
    research: { heading: 'Research', text: 'Проанализировал траектории чтения и зоны потери внимания.', bullets: ['Поведенческие паттерны ленты', 'Точки информационного шума', 'Сравнение форматов карточек'] },
    productThinking: { heading: 'Product thinking', text: 'Связал редакционные ограничения с UX-решениями и целями вовлечения.', bullets: ['Решения через impact на retention', 'Паттерны с управляемой вариативностью', 'Сценарный подход к форматам'] },
    uxArchitecture: { heading: 'UX architecture', text: 'Определил структуру карточек как scalable UI-layer для новых контентных типов.', bullets: ['Системная композиция блоков', 'Ясная иерархия заголовков/мета/медиа', 'Единые interaction rules'] },
    process: { heading: 'Process', text: 'Итеративный дизайн-цикл с прототипированием и проверкой редакционных сценариев.', bullets: ['Wireframe -> interactive prototype -> validation', 'Синхронизация с аналитикой', 'Согласование с редакцией и фронтендом'] },
    motionPrototype: { heading: 'Motion / prototype', text: 'Motion использовался для проверки переходов между форматами и ясности интеракций.', bullets: ['Сценарные переходы карточек', 'Валидация темпа восприятия', 'Демонстрация логики для стейкхолдеров'] },
    collaboration: { heading: 'Collaboration', text: 'Работал на стыке редакции, маркетинга, аналитики и разработки.', bullets: ['Общий контур решений', 'Быстрая обратная связь по контенту', 'Сокращение цикла правок'] },
    designSystem: { heading: 'Design system', text: 'Формализовал слой карточек в reusable UI-паттерны.', bullets: ['Варианты карточек по сценариям', 'Правила расширения без деградации UX', 'Подготовка к масштабированию'] },
    impact: { heading: 'Impact', text: 'Улучшилась читаемость ленты и управляемость контентных форматов.', bullets: ['Снижение трения в чтении', 'Более четкая структура ленты', 'Рост управляемости редакционного UX'] },
    reflection: { heading: 'Reflection', text: 'Контентный UX — это архитектура смыслов, а не только визуальный стиль.', bullets: ['Иерархия важнее декоративности', 'Системный слой ускоряет редакцию', 'Media UX требует тесной связки с аналитикой'] },
  },
  metrics: [
    { label: 'Форматы', value: '8+', detail: 'Карточки поддерживают расширенный контентный спектр' },
    { label: 'Цикл правок', value: '-18%', detail: 'Быстрее согласование редакционных изменений' },
    { label: 'UI layer', value: 'Reusable', detail: 'Системный базис для новых форматов' },
  ],
  timelineItems: [
    { phase: 'Discovery', title: 'Reading patterns', detail: 'Исследование поведения в ленте' },
    { phase: 'Design', title: 'Card architecture', detail: 'Сборка иерархии и compositional rules' },
    { phase: 'Validation', title: 'Prototype testing', detail: 'Проверка UX на редакционных сценариях' },
    { phase: 'Scale', title: 'Reusable layer', detail: 'Передача паттернов в продуктовый контур' },
  ],
  gallery: [
    { id: 'tass-1', title: 'Reading hierarchy', caption: 'Иерархия восприятия карточек в ленте.', layers: ['Headline priority', 'Meta structure', 'Media ratio', 'CTA logic'] },
    { id: 'tass-2', title: 'Editorial variants', caption: 'Набор карточек под разные редакционные сценарии.', layers: ['Breaking', 'Longread', 'Live update', 'Opinion'] },
    { id: 'tass-3', title: 'Scalable UI layer', caption: 'Reusable слой для дальнейшего расширения форматов.', layers: ['Component set', 'Variant rules', 'Interaction states', 'Content tokens'] },
  ],
  closingTitle: 'Content UX as system architecture',
  closingText:
    'Кейс доказал, что рост вовлеченности в медиа достигается через системную архитектуру чтения, а не через разовые косметические изменения.',
}
