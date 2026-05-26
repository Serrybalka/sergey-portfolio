import type { CaseStory } from '../../types/content'

export const russkiySvetCase: CaseStory = {
  id: 'russkiy-svet',
  route: 'russkiy-svet',
  company: 'РУССКИЙ СВЕТ B2B',
  role: 'Senior Product Designer',
  timeline: '2023-2024',
  title: 'Сокращение пути регистрации юридических лиц',
  subtitle:
    'B2B onboarding редизайн: устранение трения в длинной регистрации и рост конверсии через системную UX-оптимизацию.',
  impactStatement:
    'Сократил путь регистрации с длинного сценария до одного управляемого шага и подтвердил рост конверсии.',
  compactProblem:
    'Регистрация занимала до 20 кликов, пользователи терялись до завершения процесса.',
  compactProcess: [
    'Картировал критические точки падения в воронке.',
    'Сократил шаги через сценарий одного модального окна.',
    'Провел совместные итерации с продуктом и разработкой.',
  ],
  compactSolution:
    'Перепроектировал registration-flow в короткий сценарий с фокусом на ключевое действие.',
  compactImpact: 'Конверсия регистрации юрлиц выросла на +18%.',
  compactChips: ['20 кликов > 1 модальное окно', '+18% CVR', 'B2B onboarding optimization'],
  heroKpis: ['+18% CVR', '20 -> 1 step', 'Friction ↓'],
  heroStack: ['Funnel analysis', 'B2B UX', 'Onboarding redesign', 'Validation'],
  heroTags: ['B2B onboarding', 'Friction reduction', 'Conversion growth'],
  sections: {
    context: { heading: 'Context', text: 'Сложная B2B-регистрация создавала барьер входа и снижала активацию новых клиентов.', bullets: ['Длинная форма с множеством шагов', 'Сложные юридические требования', 'Высокий отток на ранних этапах'] },
    problem: { heading: 'Problem', text: 'Пользовательский путь был перегружен и не давал ясности по прогрессу и цели.', bullets: ['До 20 кликов', 'Много точек сомнения', 'Низкая завершенность'] },
    research: { heading: 'Research', text: 'Провел funnel-разбор и карту трения по каждому этапу регистрации.', bullets: ['Drop-off анализ', 'Критичные поля и блокеры', 'Приоритеты по impact'] },
    productThinking: { heading: 'Product thinking', text: 'Определил главный продуктовый принцип: минимизировать время до первого подтвержденного действия.', bullets: ['Сфокусированный onboarding', 'Снижение шагоемкости', 'Метрики эффективности по этапам'] },
    uxArchitecture: { heading: 'UX architecture', text: 'Перестроил маршрут в логичный single-window сценарий с ясным приоритетом действий.', bullets: ['Один контур взаимодействия', 'Явные подсказки и статусы', 'Снижение ошибок ввода'] },
    process: { heading: 'Process', text: 'Итеративно проверял гипотезы вместе с продуктом, аналитикой и разработкой.', bullets: ['Согласование с legal-ограничениями', 'Быстрые прототипы', 'Контроль метрик после внедрения'] },
    motionPrototype: { heading: 'Motion / prototype', text: 'Использовал микро-динамику для усиления ощущения прогресса и уверенности.', bullets: ['Пошаговый feedback', 'Снижение неопределенности', 'Прозрачная реакция системы'] },
    collaboration: { heading: 'Collaboration', text: 'Собрал единый контур коммуникации между бизнесом, продуктом и engineering.', bullets: ['Общий roadmap улучшений', 'Приоритизация по conversion impact', 'Стабильный темп релизов'] },
    designSystem: { heading: 'Design system', text: 'Закрепил обновленный onboarding как reusable паттерн B2B-флоу.', bullets: ['Шаблоны форм и ошибок', 'Единые validation states', 'Масштабирование на смежные сценарии'] },
    impact: { heading: 'Impact', text: 'Регистрация юрлиц стала короче и понятнее, конверсия выросла на +18%.', bullets: ['Существенное снижение трения', 'Рост завершения ключевого пути', 'Быстрее time-to-value'] },
    reflection: { heading: 'Reflection', text: 'B2B UX выигрывает, когда сложность бизнеса упакована в простой пользовательский ритм.', bullets: ['Сокращение пути дает быстрый эффект', 'Архитектура важнее косметики', 'Системные паттерны усиливают рост'] },
  },
  metrics: [
    { label: 'Conversion', value: '+18%', detail: 'Рост конверсии регистрации юридических лиц' },
    { label: 'Steps', value: '20 -> 1', detail: 'Ключевая оптимизация сценария' },
    { label: 'Drop-off', value: '↓', detail: 'Снижение оттока на критичных шагах' },
  ],
  timelineItems: [
    { phase: 'Analysis', title: 'Funnel deconstruction', detail: 'Выделение зон трения в регистрации' },
    { phase: 'Design', title: 'Single-window flow', detail: 'Переупаковка сценария в один контур' },
    { phase: 'Validation', title: 'Iteration loop', detail: 'Проверка с аналитикой и продуктом' },
    { phase: 'Result', title: 'Conversion uplift', detail: 'Фиксация +18% и стандартизация паттерна' },
  ],
  gallery: [
    { id: 'rs-1', title: 'Legacy flow vs new flow', caption: 'Сравнение сложного и оптимизированного сценария регистрации.', layers: ['20-step legacy', 'Single window', 'Priority actions', 'Completion'] },
    { id: 'rs-2', title: 'Friction map', caption: 'Карта зон оттока и блокеров до редизайна.', layers: ['Field overload', 'Decision delay', 'Validation errors', 'Drop-off'] },
    { id: 'rs-3', title: 'Onboarding pattern', caption: 'Reusable B2B-паттерн для смежных маршрутов.', layers: ['Entry', 'Identity', 'Confirmation', 'Activation'] },
  ],
  closingTitle: 'Less friction, more growth',
  closingText:
    'Этот кейс показал, что даже в сложных B2B-процессах системная UX-оптимизация дает быстрый и измеримый рост ключевых метрик.',
}
