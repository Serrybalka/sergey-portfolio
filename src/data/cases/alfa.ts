import type { CaseStory } from '../../types/content'

export const alfaCase: CaseStory = {
  id: 'alfa-digital',
  route: 'alfa',
  company: 'ALFA DIGITAL',
  role: 'Product Designer',
  timeline: '2021-2022',
  title: 'Редизайн digital-витрины для IT-аудитории',
  subtitle:
    'Переупаковка digital-опыта для инженерной аудитории: структурный storytelling, UX-стратегия и конверсионный фокус.',
  impactStatement:
    'Сделал UX-витрину, которая транслирует технологическую зрелость и лучше конвертирует релевантных IT-специалистов.',
  compactProblem:
    'Сайт слабо конвертировал IT-специалистов и не транслировал инженерную зрелость команды.',
  compactProcess: [
    'Построил новую архитектуру страниц и wireframes.',
    'Собрал UI-kit и motion-механику ключевых блоков.',
    'Согласовал креатив и функциональные ограничения с разработкой.',
  ],
  compactSolution:
    'Запустил визуально сильный и структурно ясный опыт, ориентированный на релевантную аудиторию.',
  compactImpact:
    'Сайт лучше поддерживает рекрутинг-задачи и укрепляет digital-позиционирование направления.',
  compactChips: ['Wireframes + UI-kit', 'Motion storytelling', 'Audience-focused structure'],
  heroKpis: ['Audience fit ↑', 'Intent conversion ↑', 'Story clarity ↑'],
  heroStack: ['UX strategy', 'Wireframing', 'Motion presentation', 'Content structure'],
  heroTags: ['IT audience', 'Conversion', 'Engineering storytelling'],
  sections: {
    context: { heading: 'Context', text: 'Платформе нужен был новый digital-язык для общения с инженерной аудиторией.', bullets: ['Высокая конкуренция за IT-таланты', 'Сложный контент без структуры', 'Недостаточная выразительность ценности'] },
    problem: { heading: 'Problem', text: 'Старый интерфейс не формировал доверие и не вел пользователя к целевым действиям.', bullets: ['Слабая иерархия сообщений', 'Разрыв между брендом и UX', 'Низкая предсказуемость пути'] },
    research: { heading: 'Research', text: 'Изучил ожидания IT-аудитории и паттерны восприятия инженерных продуктов.', bullets: ['Анализ конкурентных витрин', 'Сегментация пользовательских мотивов', 'Приоритетные сценарии конверсии'] },
    productThinking: { heading: 'Product thinking', text: 'Собрал структуру сайта как продуктовый путь с четкими целевыми действиями.', bullets: ['Переход от “витрины” к сценариям', 'Сигналы инженерной зрелости', 'Гипотезы по конверсионным блокам'] },
    uxArchitecture: { heading: 'UX architecture', text: 'Перестроил информационную архитектуру и навигационный ритм страниц.', bullets: ['Сценарные маршруты по сегментам', 'Четкая композиция контентных блоков', 'Ускоренное сканирование информации'] },
    process: { heading: 'Process', text: 'Прошел через wireframes, прототипы и итерации с командой разработки.', bullets: ['Быстрая проверка гипотез', 'Согласование сложности реализации', 'Постепенное усиление storytelling'] },
    motionPrototype: { heading: 'Motion / prototype', text: 'Motion стал инструментом раскрытия ценности и последовательности повествования.', bullets: ['Акценты на ключевых блоках', 'Плавный ритм чтения', 'Снижение “визуального шума”'] },
    collaboration: { heading: 'Collaboration', text: 'Скоординировал креативный и технический контур внедрения.', bullets: ['Совместная приоритизация с продуктом', 'Синхронизация с фронтендом', 'Контроль качества на релизе'] },
    designSystem: { heading: 'Design system', text: 'Сформировал UI-kit и паттерны для дальнейшего расширения витрины.', bullets: ['Масштабируемые компоненты', 'Единые правила композиции', 'Быстрое добавление новых модулей'] },
    impact: { heading: 'Impact', text: 'Digital-витрина стала точнее работать на привлечение нужной аудитории.', bullets: ['Усилено позиционирование', 'Рост качества входящих откликов', 'Более ясный продуктовый нарратив'] },
    reflection: { heading: 'Reflection', text: 'Для IT-аудитории критична честная архитектура ценности: структура важнее декоративных эффектов.', bullets: ['Прозрачный UX повышает доверие', 'Motion должен усиливать смысл', 'Стратегия контента = стратегия конверсии'] },
  },
  metrics: [
    { label: 'Story depth', value: 'Structured', detail: 'Последовательный narrative по сценариям аудитории' },
    { label: 'UX tempo', value: 'Faster', detail: 'Пользователь быстрее достигает целевых зон' },
    { label: 'Scalability', value: 'UI-kit', detail: 'База для дальнейших итераций без хаоса' },
  ],
  timelineItems: [
    { phase: 'Audit', title: 'Current funnel analysis', detail: 'Диагностика слабых зон витрины' },
    { phase: 'Design', title: 'IA + wireframes', detail: 'Перестройка структуры и сценариев' },
    { phase: 'Motion', title: 'Narrative rhythm', detail: 'Сборка динамики и визуальных акцентов' },
    { phase: 'Launch', title: 'Production handoff', detail: 'Релиз и закрепление паттернов' },
  ],
  gallery: [
    { id: 'alfa-1', title: 'Audience pathways', caption: 'Сценарии перехода для разных IT-сегментов.', layers: ['Backend', 'Frontend', 'Data', 'Product'] },
    { id: 'alfa-2', title: 'Narrative blocks', caption: 'Структура продуктового storytelling в интерфейсе.', layers: ['Value hook', 'Proof blocks', 'Culture layer', 'CTA'] },
    { id: 'alfa-3', title: 'Motion accents', caption: 'Motion-ритм ключевых секций витрины.', layers: ['Reveal', 'Depth', 'Parallax', 'Focus'] },
  ],
  closingTitle: 'Experience as positioning engine',
  closingText:
    'Кейс показал, что digital-витрина становится инструментом роста только когда UX-структура и narrative работают как единая продуктовая система.',
}
