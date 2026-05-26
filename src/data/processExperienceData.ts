import type { ProcessChapter, ProcessExperienceId } from '../types/content'

export const processChapters: ProcessChapter[] = [
  {
    id: 'research',
    index: '01',
    title: 'Research',
    summary: 'Собираю сигналы рынка, аудитории и продукта, чтобы увидеть системные причины проблем.',
    role: 'Senior / Lead Product Designer',
    approach: 'Continuous Discovery + Product Telemetry',
    timeline: 'Discovery cycle: 2-4 недели',
    heroKicker: 'Product discovery для сложных цифровых сервисов',
    heroImpact: 'Перевожу хаос входящих сигналов в приоритезированную карту возможностей и рисков.',
    tags: ['JTBD', 'Opportunity Solution Tree', 'Service Blueprint', 'Signal Analysis'],
    methodology: ['Mixed methods', 'Qual + Quant synthesis', 'AI-assisted research', 'Stakeholder alignment'],
    metricHighlights: [
      { label: 'Signals', value: '120+', detail: 'Сигналы из интервью, аналитики и телеметрии' },
      { label: 'Clusters', value: '14', detail: 'Кластеры проблем для решений' },
      { label: 'Clarity', value: 'x2', detail: 'Скорость согласования приоритетов' },
    ],
    timelineMarkers: ['Discovery', 'Signal clustering', 'Insight map', 'Decision brief'],
    phases: [
      { phase: '01', title: 'Signal intake', detail: 'Собираю поведенческие и качественные сигналы в единый backlog.' },
      { phase: '02', title: 'Pattern detection', detail: 'Кластеризую сигналы по мотивациям, трениям и системным ограничениям.' },
      { phase: '03', title: 'Insight mapping', detail: 'Связываю пользовательские боли с бизнес-эффектом и операционными рисками.' },
      { phase: '04', title: 'Alignment', detail: 'Формирую артефакты для product, design, analytics и engineering.' },
    ],
    artifacts: [
      {
        title: 'Research signal map',
        description: 'Карта сигналов с приоритетом по частоте, риску и влиянию на воронку.',
        tags: ['Telemetry', 'Replay', 'Interviews'],
      },
      {
        title: 'Opportunity tree',
        description: 'Дерево возможностей от North Star до UX-гипотез.',
        tags: ['OST', 'KPI', 'Hypotheses'],
      },
      {
        title: 'Stakeholder brief',
        description: 'Единый документ решений: что проверяем, почему и как измеряем.',
        tags: ['Alignment', 'Decision log', 'Risk map'],
      },
    ],
    sections: {
      context: {
        heading: 'Context',
        text: 'Работаю с сервисами, где у продукта несколько ролей, разные контуры данных и высокий риск ошибок в приоритизации.',
        bullets: [
          'Исследование охватывает пользовательские сценарии, продуктовые метрики и технические ограничения.',
          'Фокус на системных причинах проблем, а не на локальных симптомах интерфейса.',
        ],
      },
      problem: {
        heading: 'Problem',
        text: 'Без структурированного discovery команды принимают решения по интуиции, а не по валидным сигналам.',
        bullets: [
          'Слабая связь между UX-болями и P&L метриками.',
          'Потеря фокуса на критичных сценариях из-за перегруженного backlog.',
        ],
      },
      discovery: {
        heading: 'Discovery / Thinking',
        text: 'Использую смешанный контур: интервью, поведенческую аналитику, session replay и telemetry.',
        bullets: [
          'JTBD и CX mapping фиксируют реальные задачи пользователя.',
          'AI-assisted кластеризация ускоряет поиск повторяющихся паттернов.',
          'Insight synthesis превращает сигналы в гипотезы с измеримым эффектом.',
        ],
      },
      processTimeline: {
        heading: 'Process timeline',
        text: 'Discovery работает как регулярный цикл, а не как разовая активность.',
        bullets: [
          'Weekly signal review с product и analytics.',
          'Bi-weekly hypothesis shaping и risk review.',
          'Monthly decision checkpoint по бизнес-эффекту.',
        ],
      },
      architecture: {
        heading: 'System architecture',
        text: 'Строю карту зависимостей между ролями, каналами входа и критичными состояниями системы.',
        bullets: [
          'Service blueprint показывает, где UX-решение упирается в платформенные ограничения.',
          'Ролевые сценарии связываются с объектной моделью продукта.',
        ],
      },
      frameworks: {
        heading: 'Key frameworks',
        text: 'Framework stack подбирается под уровень неопределенности и зрелость команды.',
        bullets: [
          'Opportunity Solution Tree для выбора зоны роста.',
          'Continuous Discovery habits для регулярного потока инсайтов.',
          'Signal clustering + causality notes для приоритизации.',
        ],
      },
      outcomes: {
        heading: 'Metrics / outcomes',
        text: 'На выходе команда получает ясный backlog и подтвержденные зоны продуктового роста.',
        bullets: [
          'Сокращается число спорных решений без данных.',
          'Ускоряется переход к гипотезам, которые реально можно проверить.',
        ],
      },
      collaboration: {
        heading: 'Cross-functional collaboration',
        text: 'Discovery синхронизируется с аналитикой, продуктом и разработкой через единый decision framework.',
        bullets: [
          'Каждая гипотеза имеет owner, риск и критерий успеха.',
          'Стейкхолдеры видят связь между UX-изменениями и бизнес-метрикой.',
        ],
      },
      result: {
        heading: 'Final system result',
        text: 'Неопределенность превращается в последовательность решений, где каждое действие привязано к метрике и риску.',
        bullets: [
          'Продуктовые команды работают с единой картой проблем.',
          'Дизайн становится источником системных решений, а не только визуальных изменений.',
        ],
      },
      cta: {
        heading: 'CTA',
        text: 'Готов перевести ваш discovery из набора мнений в управляемую продуктовую систему.',
        bullets: ['Синхронизировать команды', 'Собрать карту решений', 'Запустить цикл проверяемых гипотез'],
      },
    },
  },
  {
    id: 'hypotheses',
    index: '02',
    title: 'Hypotheses',
    summary: 'Формирую проверяемые гипотезы с целевыми метриками и критерием успеха.',
    role: 'Senior / Lead Product Designer',
    approach: 'Lean experimentation + KPI decomposition',
    timeline: 'Experiment cycle: 1-3 спринта',
    heroKicker: 'Гипотезы как связка UX и продуктовой экономики',
    heroImpact: 'Преобразую qualitative insights в measurable hypotheses с понятным ROI.',
    tags: ['HEART', 'North Star', 'ICE/RICE', 'Causal reasoning'],
    methodology: ['Experiment design', 'Behavioral economics', 'Product analytics', 'AI-assisted hypothesis generation'],
    metricHighlights: [
      { label: 'Hypotheses', value: '30+', detail: 'Проверяемые гипотезы в квартал' },
      { label: 'Success rate', value: '42%', detail: 'Доля гипотез с подтвержденным эффектом' },
      { label: 'Lead time', value: '-28%', detail: 'Время от идеи до валидации' },
    ],
    timelineMarkers: ['Insight', 'Hypothesis', 'Prioritization', 'Experiment', 'Decision'],
    phases: [
      { phase: '01', title: 'KPI decomposition', detail: 'Декомпозирую North Star в управляемые UX и бизнес-показатели.' },
      { phase: '02', title: 'Hypothesis shaping', detail: 'Формулирую гипотезы по формуле изменение -> поведение -> метрика.' },
      { phase: '03', title: 'Prioritization', detail: 'Приоритизирую backlog через ICE/RICE и риск внедрения.' },
      { phase: '04', title: 'Experiment plan', detail: 'Определяю дизайн эксперимента и критерии stop/go.' },
    ],
    artifacts: [
      {
        title: 'Hypothesis board',
        description: 'Доска гипотез с метриками, owner и статусом проверки.',
        tags: ['ICE', 'RICE', 'HEART'],
      },
      {
        title: 'Causal map',
        description: 'Карта причинно-следственных связей между UX-изменением и KPI.',
        tags: ['Causality', 'Risk', 'North Star'],
      },
      {
        title: 'Experiment protocol',
        description: 'Протокол запуска: критерии успеха, guardrails и план анализа.',
        tags: ['A/B', 'Metrics', 'Decision'],
      },
    ],
    sections: {
      context: {
        heading: 'Context',
        text: 'В сложных продуктах важно не просто предлагать идеи, а строить систему проверяемых решений.',
        bullets: ['Гипотеза должна быть измеримой.', 'Каждое решение должно иметь прогнозируемый эффект.'],
      },
      problem: {
        heading: 'Problem',
        text: 'Без экспериментального контура UX-решения теряют связь с бизнес-метриками и масштабируются на уровне мнений.',
        bullets: ['Сложно доказать вклад дизайна в рост продукта.', 'Приоритеты формируются реактивно.'],
      },
      discovery: {
        heading: 'Discovery / Thinking',
        text: 'Собираю входящие инсайты, перевожу их в behavioral statements и связываю с KPI.',
        bullets: ['Qualitative signals конвертирую в measurable outcomes.', 'HEART и North Star задают контур эффективности.'],
      },
      processTimeline: {
        heading: 'Process timeline',
        text: 'Гипотезы проходят короткий цикл от формулировки до решения о масштабировании.',
        bullets: ['Hypothesis sprint planning.', 'Experiment launch + monitoring.', 'Decision review и следующий цикл.'],
      },
      architecture: {
        heading: 'System architecture',
        text: 'Гипотезы встраиваются в roadmap как продуктовые эпики с ясными зависимостями.',
        bullets: ['Связка UX, аналитики и разработки.', 'Guardrails защищают продукт от рискованных изменений.'],
      },
      frameworks: {
        heading: 'Key frameworks',
        text: 'Использую Lean experimentation и поведенческую экономику, чтобы формулировать реалистичные изменения поведения.',
        bullets: ['ICE/RICE для порядка в backlog.', 'HEART для контроля UX-качества.', 'Causal notes для корректной интерпретации результата.'],
      },
      outcomes: {
        heading: 'Metrics / outcomes',
        text: 'Команда видит прозрачный путь: почему запускаем именно эту гипотезу и чего ожидаем на метриках.',
        bullets: ['Уменьшается число инициатив без измеримой цели.', 'Растет скорость принятия решений на данных.'],
      },
      collaboration: {
        heading: 'Cross-functional collaboration',
        text: 'Синхронизирую приоритизацию с product lead, аналитикой и engineering, чтобы быстро запускать и интерпретировать эксперименты.',
        bullets: ['Единый decision log.', 'Прозрачные критерии масштабирования.'],
      },
      result: {
        heading: 'Final system result',
        text: 'UX-гипотезы становятся инструментом управляемого роста, а не набором креативных предложений.',
        bullets: ['Продукт получает прогнозируемую экспериментальную культуру.', 'Дизайн напрямую влияет на KPI.'],
      },
      cta: {
        heading: 'CTA',
        text: 'Соберу для вашей команды гипотезный контур, который масштабируется и дает measurable impact.',
        bullets: ['Гипотезы с метриками', 'Приоритизация по impact', 'Быстрые циклы проверки'],
      },
    },
  },
  {
    id: 'flows',
    index: '03',
    title: 'Flows',
    summary: 'Проектирую сценарии, роли и архитектуру взаимодействий для ключевых путей.',
    role: 'Senior / Lead Product Designer',
    approach: 'Enterprise IA + multi-role orchestration',
    timeline: 'Flow architecture: 2-6 недель',
    heroKicker: 'Multi-role UX для сложных сервисных экосистем',
    heroImpact: 'Упрощаю сложные пути без потери бизнес-логики и контролей доступа.',
    tags: ['Information Architecture', 'Permissions logic', 'Enterprise UX', 'Scalable navigation'],
    methodology: ['Role decomposition', 'System state mapping', 'Edge-case design', 'Cross-platform journey'],
    metricHighlights: [
      { label: 'Roles', value: '10+', detail: 'Роли в единой архитектуре сценариев' },
      { label: 'Drop-off', value: '-19%', detail: 'Снижение потерь в критичных шагах' },
      { label: 'Time-to-task', value: '-24%', detail: 'Скорость прохождения ключевого сценария' },
    ],
    timelineMarkers: ['Role map', 'Flow map', 'State logic', 'Validation'],
    phases: [
      { phase: '01', title: 'Role map', detail: 'Декомпозирую роли, права, контексты и ответственность.' },
      { phase: '02', title: 'Scenario graph', detail: 'Строю граф сценариев с точками перехода и зависимостями.' },
      { phase: '03', title: 'State model', detail: 'Определяю состояния системы, ошибки и fallback логики.' },
      { phase: '04', title: 'Navigation model', detail: 'Собираю масштабируемую навигацию для cross-platform среды.' },
    ],
    artifacts: [
      { title: 'Role-permission matrix', description: 'Матрица ролей и доступов для сценариев B2B/B2G/MedTech.', tags: ['RBAC', 'Security', 'Compliance'] },
      { title: 'Flow atlas', description: 'Атлас критических маршрутов с edge-case ветками.', tags: ['Onboarding', 'Fallback', 'Errors'] },
      { title: 'State transitions', description: 'Карта переходов состояний и системных ограничений.', tags: ['State machine', 'System logic', 'Scalability'] },
    ],
    sections: {
      context: {
        heading: 'Context',
        text: 'Работаю с продуктами, где один интерфейс обслуживает разные роли и бизнес-процессы.',
        bullets: ['Высокая связность сущностей.', 'Многошаговые и кросс-платформенные маршруты.'],
      },
      problem: {
        heading: 'Problem',
        text: 'Без архитектурного подхода multi-role сценарии быстро накапливают когнитивную нагрузку и ошибки навигации.',
        bullets: ['Пользователь теряет контекст между шагами.', 'Команды дублируют паттерны и усложняют поддержку.'],
      },
      discovery: {
        heading: 'Discovery / Thinking',
        text: 'Сначала проектирую логику системы, а затем UI-слой, чтобы интерфейс выражал архитектуру.',
        bullets: ['Role-based journey mapping.', 'Service orchestration для связанных сценариев.'],
      },
      processTimeline: {
        heading: 'Process timeline',
        text: 'Flow архитектура проходит через серию верификаций с продуктом и разработкой.',
        bullets: ['IA workshop.', 'Flow simulation.', 'Edge-case review.', 'Implementation alignment.'],
      },
      architecture: {
        heading: 'System architecture',
        text: 'Создаю единый navigational backbone: роли, доступы, статусы и переходы описаны как часть системы.',
        bullets: ['Permissions logic встроена в сценарии.', 'Состояния интерфейса согласованы с backend моделью.'],
      },
      frameworks: {
        heading: 'Key frameworks',
        text: 'Использую архитектурные фреймворки, чтобы снизить cognitive load и ускорить адаптацию пользователей.',
        bullets: ['Information architecture.', 'System state mapping.', 'Scalable navigation patterns.'],
      },
      outcomes: {
        heading: 'Metrics / outcomes',
        text: 'Ускоряется прохождение ключевых потоков и падает число операционных ошибок.',
        bullets: ['Сценарии становятся предсказуемыми.', 'Снижается стоимость доработок и поддержки.'],
      },
      collaboration: {
        heading: 'Cross-functional collaboration',
        text: 'Синхронизирую flow-архитектуру с backend, QA и support, чтобы убрать разрыв между дизайном и production.',
        bullets: ['Единая терминология состояний.', 'Прозрачный handoff с архитектурными артефактами.'],
      },
      result: {
        heading: 'Final system result',
        text: 'Интерфейс работает как оркестратор сложной системы, а не набор несвязанных экранов.',
        bullets: ['Пользователь быстрее достигает цели.', 'Команда масштабирует продукт без хаоса в UX.'],
      },
      cta: {
        heading: 'CTA',
        text: 'Проектирую multi-role архитектуру, которая выдерживает рост продукта и команд.',
        bullets: ['Ролевые сценарии', 'Системная навигация', 'Масштабируемые потоки'],
      },
    },
  },
  {
    id: 'prototype',
    index: '04',
    title: 'Prototype',
    summary: 'Собираю интерактивный прототип, чтобы рано снять продуктовые и технические риски.',
    role: 'Senior / Lead Product Designer',
    approach: 'Motion prototyping as decision tool',
    timeline: 'Prototype sprint: 3-10 дней',
    heroKicker: 'Prototype как инструмент выравнивания команды',
    heroImpact: 'Показываю логику продукта через интеракции до этапа дорогой реализации.',
    tags: ['Figma advanced', 'Motion storytelling', 'Simulation', 'Usability-driven'],
    methodology: ['Prototype-as-alignment', 'State transitions', 'Scenario simulation', 'Stakeholder validation'],
    metricHighlights: [
      { label: 'Risks removed', value: '70%', detail: 'Критичные продуктовые риски сняты до dev-фазы' },
      { label: 'Alignment', value: 'x1.8', detail: 'Скорость согласования между стейкхолдерами' },
      { label: 'Rework', value: '-31%', detail: 'Снижение доработок после старта разработки' },
    ],
    timelineMarkers: ['Concept', 'Interaction logic', 'Validation', 'Handoff'],
    phases: [
      { phase: '01', title: 'Interaction blueprint', detail: 'Определяю критичные состояния и переходы.' },
      { phase: '02', title: 'Motion narrative', detail: 'Добавляю motion как язык объяснения сложной логики.' },
      { phase: '03', title: 'Scenario simulation', detail: 'Прогоняю end-to-end сценарии для команд и бизнеса.' },
      { phase: '04', title: 'Decision sync', detail: 'Фиксирую решения и ограничения до старта production.' },
    ],
    artifacts: [
      { title: 'Interactive state map', description: 'Прототип состояния интерфейса с fallback и error ветками.', tags: ['State', 'Fallback', 'Logic'] },
      { title: 'Motion blueprint', description: 'Набор motion-принципов для критичных сценариев.', tags: ['Motion', 'Timing', 'Clarity'] },
      { title: 'Stakeholder demo flow', description: 'Сценарий демонстрации, который ускоряет согласование решений.', tags: ['Demo', 'Alignment', 'Decision'] },
    ],
    sections: {
      context: {
        heading: 'Context',
        text: 'В сложных продуктах статичные макеты не показывают поведение системы и не снижают риски реализации.',
        bullets: ['Нужна ранняя симуляция сценариев.', 'Важно согласовать ожидания команды до кода.'],
      },
      problem: {
        heading: 'Problem',
        text: 'Без интерактивного прототипа команды по-разному интерпретируют логику продукта, что приводит к rework.',
        bullets: ['Разные трактовки состояний.', 'Скрытые риски всплывают слишком поздно.'],
      },
      discovery: {
        heading: 'Discovery / Thinking',
        text: 'Использую прототип как инструмент product thinking: проверяю не визуал, а поведение системы и принятие решений.',
        bullets: ['Сценарии проходят validation до development.', 'Motion объясняет причинно-следственные связи интерфейса.'],
      },
      processTimeline: {
        heading: 'Process timeline',
        text: 'Сначала фиксируем ключевые состояния, затем добавляем интерактивность и проводим demo-review.',
        bullets: ['State definition.', 'Interactive assembly.', 'Stakeholder playback.', 'Decision lock.'],
      },
      architecture: {
        heading: 'System architecture',
        text: 'Прототип включает ролевую логику, системные ограничения и сценарии отказа.',
        bullets: ['Прототип связан с backend состояниями.', 'UI-решения проверяются на масштабируемость.'],
      },
      frameworks: {
        heading: 'Key frameworks',
        text: 'Комбинирую motion prototyping и usability-driven validation для управляемых решений.',
        bullets: ['Figma advanced prototyping.', 'Interaction storytelling.', 'Decision-oriented demo framework.'],
      },
      outcomes: {
        heading: 'Metrics / outcomes',
        text: 'Сокращается число поздних изменений и ускоряется принятие решений по критичным фичам.',
        bullets: ['Меньше неоднозначности между командами.', 'Выше предсказуемость релиза.'],
      },
      collaboration: {
        heading: 'Cross-functional collaboration',
        text: 'Прототип синхронизирует product, engineering, QA и бизнес в едином представлении будущего решения.',
        bullets: ['Общее понимание сценариев.', 'Быстрый feedback loop.'],
      },
      result: {
        heading: 'Final system result',
        text: 'Прототип становится управленческим артефактом, который снижает риски и ускоряет delivery.',
        bullets: ['Решения принимаются быстрее.', 'Реализация ближе к изначальному product intent.'],
      },
      cta: {
        heading: 'CTA',
        text: 'Соберу интерактивный прототип, который выровняет команду и ускорит выход в production.',
        bullets: ['Сложные сценарии', 'Motion-объяснение', 'Decision-ready прототип'],
      },
    },
  },
  {
    id: 'test',
    index: '05',
    title: 'Test',
    summary: 'Провожу usability и A/B-валидацию, чтобы закрепить решения данными.',
    role: 'Senior / Lead Product Designer',
    approach: 'Validation culture + experiment analytics',
    timeline: 'Validation loop: continuous',
    heroKicker: 'Проверяю решения до масштабирования',
    heroImpact: 'Снижаю продуктовые риски через системную валидацию и метрики поведения.',
    tags: ['Usability', 'A/B', 'Heuristics', 'Retention diagnostics'],
    methodology: ['Moderated/unmoderated testing', 'Funnel diagnostics', 'Telemetry analysis', 'Accessibility QA'],
    metricHighlights: [
      { label: 'Completion', value: '+23%', detail: 'Рост завершения критичных сценариев' },
      { label: 'Conversion', value: '+18%', detail: 'Рост конверсии в B2B onboarding' },
      { label: 'Risk', value: '-35%', detail: 'Снижение вероятности регрессивных решений' },
    ],
    timelineMarkers: ['Test design', 'Execution', 'Analysis', 'Decision'],
    phases: [
      { phase: '01', title: 'Test design', detail: 'Формирую план: гипотеза, аудитория, критерии успеха.' },
      { phase: '02', title: 'Execution', detail: 'Провожу moderated/unmoderated сценарии и A/B проверки.' },
      { phase: '03', title: 'Evidence synthesis', detail: 'Собираю qualitative и quantitative evidence в единый вывод.' },
      { phase: '04', title: 'Rollout decision', detail: 'Принимаю решение: масштабировать, доработать или отклонить.' },
    ],
    artifacts: [
      { title: 'Validation board', description: 'Доска проверок с outcome и confidence level.', tags: ['Evidence', 'Confidence', 'Decision'] },
      { title: 'Funnel diagnostics report', description: 'Отчет по точкам потерь и причинам drop-off.', tags: ['Funnel', 'Telemetry', 'Retention'] },
      { title: 'Accessibility checklist', description: 'Проверка доступности критичных сценариев до релиза.', tags: ['A11y', 'WCAG', 'Quality'] },
    ],
    sections: {
      context: {
        heading: 'Context',
        text: 'Валидация — это не финальная проверка, а постоянная часть продуктового цикла.',
        bullets: ['Тестируется не только UI, но и продуктовая гипотеза.', 'Решения принимаются на доказательной базе.'],
      },
      problem: {
        heading: 'Problem',
        text: 'Без validation culture даже сильные идеи могут масштабировать неправильные сценарии.',
        bullets: ['Рост ошибок после релиза.', 'Потеря доверия к продуктовым решениям.'],
      },
      discovery: {
        heading: 'Discovery / Thinking',
        text: 'Комбинирую usability, A/B и поведенческую аналитику, чтобы измерить реальный эффект UX-изменений.',
        bullets: ['Сопоставляю наблюдаемое поведение и метрику.', 'Фиксирую confidence для каждого вывода.'],
      },
      processTimeline: {
        heading: 'Process timeline',
        text: 'Тестовый цикл встроен в delivery и повторяется на каждом значимом релизе.',
        bullets: ['Pre-release validation.', 'Post-release monitoring.', 'Iteration with updated hypotheses.'],
      },
      architecture: {
        heading: 'System architecture',
        text: 'Validation слой связан с аналитической инфраструктурой и продуктовой телеметрией.',
        bullets: ['События и метрики проектируются до запуска.', 'Guardrails защищают от ложных выводов.'],
      },
      frameworks: {
        heading: 'Key frameworks',
        text: 'Использую методологии, которые дают воспроизводимые и сравнимые результаты.',
        bullets: ['Heuristic analysis.', 'Experiment analytics.', 'Behavioral metrics tracking.'],
      },
      outcomes: {
        heading: 'Metrics / outcomes',
        text: 'Команда получает уверенность в решениях и понятный план масштабирования.',
        bullets: ['Снижаются регрессии.', 'Растет конверсия в приоритетных потоках.'],
      },
      collaboration: {
        heading: 'Cross-functional collaboration',
        text: 'Валидация проходит в связке с аналитикой, QA, разработкой и product owner.',
        bullets: ['Общий язык доказательств.', 'Быстрое принятие решений по результатам.'],
      },
      result: {
        heading: 'Final system result',
        text: 'Команда внедряет только те изменения, которые прошли проверку на пользователях и данных.',
        bullets: ['Повышается predictability delivery.', 'UX становится управляемым рычагом роста.'],
      },
      cta: {
        heading: 'CTA',
        text: 'Построю validation-контур, который снижает риски и подтверждает impact каждого решения.',
        bullets: ['Usability + A/B', 'Доказательная аналитика', 'Быстрые циклы улучшений'],
      },
    },
  },
  {
    id: 'systemize',
    index: '06',
    title: 'Systemize',
    summary: 'Перевожу решения в системный слой компонентов и правил масштабирования.',
    role: 'Senior / Lead Product Designer',
    approach: 'Design system as platform layer',
    timeline: 'Systemization cycle: ongoing',
    heroKicker: 'От решений к масштабируемой платформе',
    heroImpact: 'Превращаю product decisions в устойчивую систему компонентов, токенов и governance.',
    tags: ['Design systems', 'Ant Design', 'Storybook', 'Token architecture'],
    methodology: ['Multi-theme system', 'Component governance', 'DesignOps', 'Handoff protocol'],
    metricHighlights: [
      { label: 'Components', value: '120+', detail: 'Компоненты в управляемой библиотеке' },
      { label: 'Themes', value: '2+', detail: 'Внешние и внутренние продуктовые темы' },
      { label: 'UI debt', value: '-37%', detail: 'Снижение компонентного долга' },
    ],
    timelineMarkers: ['Audit', 'Token model', 'Library', 'Governance', 'Scale'],
    phases: [
      { phase: '01', title: 'System audit', detail: 'Фиксирую рассинхронизацию паттернов и зону технического долга.' },
      { phase: '02', title: 'Token architecture', detail: 'Определяю semantic tokens и правила multi-theme слоя.' },
      { phase: '03', title: 'Component layer', detail: 'Собираю библиотеку компонентов с документацией и контракторами.' },
      { phase: '04', title: 'Governance', detail: 'Запускаю регламент изменений и quality gates для команд.' },
    ],
    artifacts: [
      { title: 'Ant Design adaptation map', description: 'Слой адаптации Ant Design под брендовые и доменные ограничения.', tags: ['Ant Design', 'Brand', 'Domain rules'] },
      { title: 'Token registry', description: 'Реестр design tokens с semantic алиасами и темизацией.', tags: ['Tokens', 'Themes', 'Semantics'] },
      { title: 'Handoff protocol', description: 'Единый протокол передачи решений из дизайна в разработку.', tags: ['Storybook', 'DesignOps', 'Governance'] },
    ],
    sections: {
      context: {
        heading: 'Context',
        text: 'Когда продукт растет, разрозненные решения тормозят delivery и увеличивают стоимость изменений.',
        bullets: ['Нужен единый системный слой.', 'Важно обеспечить масштабирование без потери качества.'],
      },
      problem: {
        heading: 'Problem',
        text: 'Без систематизации интерфейс распадается на локальные паттерны, а команда тратит время на повторение решений.',
        bullets: ['Рост UI-долга.', 'Несогласованность между продуктами и ролями.'],
      },
      discovery: {
        heading: 'Discovery / Thinking',
        text: 'Сначала фиксирую системные принципы и контракты, затем строю компонентную платформу.',
        bullets: ['Анализ паттернов и анти-паттернов.', 'Определение правил change management.'],
      },
      processTimeline: {
        heading: 'Process timeline',
        text: 'Систематизация внедряется итеративно: audit -> tokens -> components -> governance.',
        bullets: ['Пилот на критичных сценариях.', 'Расширение на другие контуры.', 'Регулярные quality reviews.'],
      },
      architecture: {
        heading: 'System architecture',
        text: 'Архитектура строится на semantic tokens, reusable components и мульти-темах.',
        bullets: ['Ant Design адаптируется под бренд-системы.', 'Storybook выступает source of truth для frontend-команд.'],
      },
      frameworks: {
        heading: 'Key frameworks',
        text: 'Использую платформенный подход к design system: governance, DesignOps и системный handoff.',
        bullets: ['Token architecture.', 'Component governance.', 'Multi-theme orchestration.'],
      },
      outcomes: {
        heading: 'Metrics / outcomes',
        text: 'Команда ускоряет delivery и снижает риск UI-регрессий при росте продукта.',
        bullets: ['Меньше дублирования компонент.', 'Выше консистентность интерфейсов.'],
      },
      collaboration: {
        heading: 'Cross-functional collaboration',
        text: 'Системный слой поддерживается совместно дизайном, фронтендом и продуктом.',
        bullets: ['Единый backlog дизайн-системы.', 'Понятный процесс принятия изменений.'],
      },
      result: {
        heading: 'Final system result',
        text: 'Продукт получает платформу, где UI-решения масштабируются предсказуемо и экономически эффективно.',
        bullets: ['Сокращение time-to-market.', 'Повышение качества релизов и устойчивости интерфейса.'],
      },
      cta: {
        heading: 'CTA',
        text: 'Запущу системный слой, который удержит рост продукта без потери скорости и качества.',
        bullets: ['Токены и темы', 'Governance', 'Scalable components'],
      },
    },
  },
  {
    id: 'ship',
    index: '07',
    title: 'Ship',
    summary: 'Довожу до релиза и оцениваю impact по продуктовым метрикам и качественным сигналам.',
    role: 'Senior / Lead Product Designer',
    approach: 'Delivery orchestration + impact loop',
    timeline: 'Release cycle: sprint-based + post-launch',
    heroKicker: 'Довожу решения до measurable product impact',
    heroImpact: 'Связываю дизайн-решения с delivery pipeline, метриками роста и операционной устойчивостью.',
    tags: ['Product delivery', 'Release orchestration', 'Design QA', 'Growth loops'],
    methodology: ['Cross-functional leadership', 'Post-release analytics', 'Iteration loops', 'Business alignment'],
    metricHighlights: [
      { label: 'Predictability', value: '+32%', detail: 'Улучшение прогнозируемости релизов' },
      { label: 'Iteration speed', value: '+27%', detail: 'Ускорение цикла улучшений после запуска' },
      { label: 'Impact visibility', value: '100%', detail: 'Каждый релиз имеет KPI и post-mortem разбор' },
    ],
    timelineMarkers: ['Pre-ship QA', 'Release', 'Monitoring', 'Iteration'],
    phases: [
      { phase: '01', title: 'Pre-ship readiness', detail: 'Проверяю consistency, accessibility, telemetry и handoff completeness.' },
      { phase: '02', title: 'Release orchestration', detail: 'Синхронизирую запуск между product, engineering, analytics и support.' },
      { phase: '03', title: 'Impact monitoring', detail: 'Отслеживаю поведение, метрики и аномалии после релиза.' },
      { phase: '04', title: 'Iteration loop', detail: 'Возвращаю инсайты в backlog для следующего цикла роста.' },
    ],
    artifacts: [
      { title: 'Release scorecard', description: 'Карта готовности релиза: UX, метрики, риски, владельцы.', tags: ['QA', 'Readiness', 'Risk'] },
      { title: 'Impact dashboard', description: 'Дашборд продуктового эффекта с KPI и guardrail метриками.', tags: ['KPI', 'North Star', 'Telemetry'] },
      { title: 'Iteration brief', description: 'Пост-релизный бриф для следующего цикла улучшений.', tags: ['Insights', 'Backlog', 'Growth'] },
    ],
    sections: {
      context: {
        heading: 'Context',
        text: 'Качество дизайна измеряется не в макетах, а в том, как решение работает в production.',
        bullets: ['Релиз — это начало измерений, а не финальная точка.', 'Нужна связка delivery и impact.'],
      },
      problem: {
        heading: 'Problem',
        text: 'Без release orchestration и post-launch цикла даже сильные решения теряют эффект на этапе внедрения.',
        bullets: ['Разрыв между design intent и production.', 'Отсутствие системной пост-оценки impact.'],
      },
      discovery: {
        heading: 'Discovery / Thinking',
        text: 'Планирую релиз как продуктовую операцию: критерии готовности, мониторинг, цикл итераций.',
        bullets: ['Каждый релиз имеет метрику успеха.', 'Guardrails фиксируют риски до запуска.'],
      },
      processTimeline: {
        heading: 'Process timeline',
        text: 'Цикл ship включает pre-ship QA, запуск, мониторинг и возврат инсайтов в roadmap.',
        bullets: ['Release readiness review.', '48h post-launch monitoring.', 'Iteration planning по факту данных.'],
      },
      architecture: {
        heading: 'System architecture',
        text: 'Delivery pipeline связывает дизайн-систему, продуктовую аналитику и процессы команды.',
        bullets: ['Design QA встроен в релизный чек-лист.', 'Метрики и события готовы до выката.'],
      },
      frameworks: {
        heading: 'Key frameworks',
        text: 'Использую product operations подход, где дизайн участвует в полном жизненном цикле решения.',
        bullets: ['Release orchestration.', 'Impact measurement.', 'Growth loops и iterative delivery.'],
      },
      outcomes: {
        heading: 'Metrics / outcomes',
        text: 'Релизы становятся предсказуемыми, а их влияние измеряется в продуктовых и бизнес-сигналах.',
        bullets: ['Быстрее реакция на реальные данные.', 'Стабильный рост ценности для пользователя и бизнеса.'],
      },
      collaboration: {
        heading: 'Cross-functional collaboration',
        text: 'Руководствуюсь shared ownership: команда принимает решения на языке метрик и системного эффекта.',
        bullets: ['Согласованные KPI между функциями.', 'Единый post-release ritual.'],
      },
      result: {
        heading: 'Final system result',
        text: 'Дизайн становится частью операционной модели роста продукта: от идеи до измеримого эффекта в проде.',
        bullets: ['Сильная продуктовая дисциплина.', 'Повторяемый delivery pipeline с measurable impact.'],
      },
      cta: {
        heading: 'CTA',
        text: 'Готов довести ваши решения до production и показать измеримый рост по ключевым метрикам.',
        bullets: ['Release orchestration', 'Impact analytics', 'Системные итерации роста'],
      },
    },
  },
]

export const processChapterById = new Map<ProcessExperienceId, ProcessChapter>(
  processChapters.map((chapter) => [chapter.id, chapter]),
)

export const processChapterIdSet = new Set<ProcessExperienceId>(
  processChapters.map((chapter) => chapter.id),
)
