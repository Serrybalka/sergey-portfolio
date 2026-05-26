import type { CaseStory } from '../../types/content'

export const sberCase: CaseStory = {
  id: 'sber-health',
  route: 'sber',
  company: 'СБЕР ЗДОРОВЬЕ',
  role: 'Senior Product Designer',
  timeline: '2021-2024',
  title: 'Medtech mobile app с ИИ-помощником',
  subtitle:
    'Сложный медицинский UX для мобильного продукта: доверие, точность сценариев и модульная архитектура интерфейса.',
  impactStatement:
    'Собрал понятный пользовательский путь для медицинских сценариев и интеграции ИИ-помощника без потери доверия.',
  compactProblem:
    'Требовалось упростить сложные медицинские сценарии без потери точности и доверия пользователя.',
  compactProcess: [
    'Разложил пользовательские маршруты по этапам принятия решения.',
    'Спроектировал сложные компоненты карточки врача и ассистентных блоков.',
    'Использовал motion presentation для выравнивания стейкхолдеров.',
  ],
  compactSolution:
    'Собрал модульную мобильную архитектуру интерфейса и сценариев взаимодействия с ИИ-помощником.',
  compactImpact:
    'Продукт получил более понятный сценарий выбора и коммуникации, пригодный к масштабированию.',
  compactChips: ['Mobile-first architecture', 'AI-assistant UX', 'Complex component library'],
  heroKpis: ['Trust signals ↑', 'Decision time ↓', 'Modular mobile UI'],
  heroStack: ['Medtech UX', 'AI interaction', 'Mobile design', 'Component logic'],
  heroTags: ['Complex medical UX', 'AI-assisted interaction', 'Trust design'],
  sections: {
    context: { heading: 'Context', text: 'Пользователю нужно быстро принимать решения в чувствительной медицинской среде.', bullets: ['Высокая цена недопонимания', 'Многофакторные сценарии выбора', 'Ограничения mobile интерфейса'] },
    problem: { heading: 'Problem', text: 'Существующий UX перегружал пациента деталями и усложнял переход к целевому действию.', bullets: ['Фрагментированная карточка врача', 'Слабая роль ассистента в сценарии', 'Непрозрачность следующего шага'] },
    research: { heading: 'Research', text: 'Исследовал тревожные точки пользователя и факторы доверия в медицинских сценариях.', bullets: ['Journey до записи/консультации', 'Ключевые вопросы пациента', 'Сигналы уверенности и прозрачности'] },
    productThinking: { heading: 'Product thinking', text: 'Соединил UX-решения с продуктовой целью: увеличить завершение сценариев и вовлеченность.', bullets: ['North-star для ключевого пути', 'Приоритеты через user risk', 'Метрики доверия и completion'] },
    uxArchitecture: { heading: 'UX architecture', text: 'Собрал архитектуру шагов и состояний, где ИИ помогает, а не отвлекает от решения задачи.', bullets: ['Четкая структура карточки врача', 'Понятная оркестрация действий', 'Устойчивый mobile flow'] },
    process: { heading: 'Process', text: 'Работал итеративно: гипотеза -> прототип -> валидирующий цикл со стейкхолдерами.', bullets: ['Быстрые циклы проработки сценариев', 'Согласование с меддоменом', 'Передача в dev через компонентный слой'] },
    motionPrototype: { heading: 'Motion / prototype', text: 'Motion-демо использовались для объяснения поведения сложных состояний и коммуникации ИИ.', bullets: ['Сценарные transition-кейсы', 'Проверка читаемости состояния', 'Ускорение согласований'] },
    collaboration: { heading: 'Collaboration', text: 'Синхронизировал product, engineering и доменных экспертов.', bullets: ['Единые продуктовые критерии', 'Прозрачные компромиссы по сложности', 'Стабильный delivery-контур'] },
    designSystem: { heading: 'Design system', text: 'Собрал reusable mobile-паттерны для сложных медкомпонентов.', bullets: ['Модульные карточки', 'Системные состояния компонентов', 'Ускорение дальнейших релизов'] },
    impact: { heading: 'Impact', text: 'Сценарии стали предсказуемее, а коммуникация с ИИ-помощником — понятнее и полезнее.', bullets: ['Рост ясности ключевого пути', 'Снижение когнитивной перегрузки', 'База для масштабирования продукта'] },
    reflection: { heading: 'Reflection', text: 'В medtech UX доверие строится через прозрачную логику интерфейса и корректный ритм решений.', bullets: ['Точность важнее визуального шума', 'AI должен поддерживать выбор', 'Системные паттерны ускоряют развитие'] },
  },
  metrics: [
    { label: 'Mobile UX', value: 'Modular', detail: 'Компонентная архитектура сценариев пациента' },
    { label: 'AI layer', value: 'Assistive', detail: 'ИИ-помощник встроен в ключевые decision-points' },
    { label: 'Flow clarity', value: '↑', detail: 'Снижение неопределенности в сценарии выбора' },
  ],
  timelineItems: [
    { phase: 'Research', title: 'Patient journey mapping', detail: 'Точки тревоги и принятия решения' },
    { phase: 'Design', title: 'Card + assistant model', detail: 'Новая структура карточки врача и подсказок' },
    { phase: 'Prototype', title: 'Motion walkthroughs', detail: 'Проверка сложных состояний и переходов' },
    { phase: 'Delivery', title: 'Modular rollout', detail: 'Передача и масштабирование решений' },
  ],
  gallery: [
    { id: 'sber-1', title: 'Doctor card architecture', caption: 'Иерархия медицинских сигналов в карточке врача.', layers: ['Profile', 'Credentials', 'Availability', 'Action state'] },
    { id: 'sber-2', title: 'AI-assisted flow', caption: 'Сценарии взаимодействия с ассистентом в критичных точках.', layers: ['Prompt', 'Recommendation', 'Clarification', 'Confirmation'] },
    { id: 'sber-3', title: 'Mobile state system', caption: 'Состояния компонентов для сложного медконтекста.', layers: ['Normal', 'Warning', 'Critical', 'Resolved'] },
  ],
  closingTitle: 'Trust-driven product design',
  closingText:
    'Кейс подтвердил, что в медицинских продуктах системная ясность интерфейса напрямую влияет на уверенность пользователя и качество решения.',
}
