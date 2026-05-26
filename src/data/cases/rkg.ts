import type { CaseStory } from '../../types/content'

export const rkgCase: CaseStory = {
  id: 'rkg',
  route: 'rkg',
  company: 'РКГ',
  role: 'Product Designer',
  timeline: '2020-2022',
  title: 'UX-оптимизация воронки для агентского сегмента',
  subtitle:
    'Оптимизация сложного агентского пути: от исследований и CJM до A/B-валидации ключевых решений.',
  impactStatement:
    'Переупаковал воронку в логичный сценарий и закрепил изменения данными, а не интуицией.',
  compactProblem:
    'Воронка теряла пользователей из-за сложных сценариев и неочевидных шагов регистрации/действия.',
  compactProcess: [
    'Провел исследования агентов недвижимости и pain points.',
    'Собрал UI-kit и сценарии для usability testing.',
    'Сформировал гипотезы и протестировал через A/B-тест.',
  ],
  compactSolution: 'Перестроил ключевые пользовательские потоки и навигационную логику принятия решения.',
  compactImpact: 'Завершение воронки выросло на +23% после внедрения и проверки гипотез.',
  compactChips: ['+23% completion', 'Usability testing', 'A/B validation'],
  heroKpis: ['+23% completion', 'Step friction ↓', 'Decision clarity ↑'],
  heroStack: ['CJM', 'Usability', 'A/B test', 'Flow redesign'],
  heroTags: ['Funnel optimization', 'Multi-step journeys', 'Conversion UX'],
  sections: {
    context: { heading: 'Context', text: 'Агентский сегмент работал в сложном многошаговом сценарии с высокой ценой ошибки.', bullets: ['Длинные пути принятия решения', 'Разные уровни цифровой зрелости пользователей', 'Сильная зависимость от ясности интерфейса'] },
    problem: { heading: 'Problem', text: 'На критических этапах пользователи теряли контекст и выпадали из сценария.', bullets: ['Сложная навигация', 'Избыточные поля и действия', 'Слабые сигналы прогресса'] },
    research: { heading: 'Research', text: 'Провел интервью и CJM для выделения узких мест и когнитивных барьеров.', bullets: ['Pain-point mapping', 'Анализ шагов оттока', 'Сегментация поведения агентов'] },
    productThinking: { heading: 'Product thinking', text: 'Сформировал приоритеты через влияние на completion и стоимость внедрения.', bullets: ['Hypothesis backlog', 'Приоритизация по impact', 'Контрольные метрики успеха'] },
    uxArchitecture: { heading: 'UX architecture', text: 'Пересобрал сценарий в последовательность с понятной логикой и сниженной нагрузкой.', bullets: ['Прозрачная структура шагов', 'Ясные состояния и подсказки', 'Снижение branching complexity'] },
    process: { heading: 'Process', text: 'Итеративный цикл: прототип -> тест -> A/B -> корректировка.', bullets: ['Usability-сессии', 'Вариантное тестирование', 'Проверка метрик до/после'] },
    motionPrototype: { heading: 'Motion / prototype', text: 'Motion-переходы использовались для объяснения прогресса в многошаговом пути.', bullets: ['Понятный feedback на действия', 'Снижение тревожности пользователя', 'Лучшее чтение состояния процесса'] },
    collaboration: { heading: 'Collaboration', text: 'Синхронизировал продукт, аналитику и разработку вокруг метрик воронки.', bullets: ['Общий план экспериментов', 'Единые критерии валидации', 'Быстрые релизные итерации'] },
    designSystem: { heading: 'Design system', text: 'Зафиксировал обновленные паттерны формы/шага в reusable UI-kit.', bullets: ['Повторное использование компонентов', 'Согласованность в сценариях', 'Быстрая адаптация под новые флоу'] },
    impact: { heading: 'Impact', text: 'Completion ключевого сценария вырос на +23% с подтверждением через A/B-проверку.', bullets: ['Рост завершения целевого пути', 'Снижение оттока на критических шагах', 'Повышение предсказуемости воронки'] },
    reflection: { heading: 'Reflection', text: 'На длинных воронках выигрывает не визуальная сложность, а ясность решений и ритм взаимодействия.', bullets: ['Сначала понять поведение, потом рисовать', 'Метрический цикл критичен', 'UX-архитектура напрямую влияет на бизнес'] },
  },
  metrics: [
    { label: 'Completion', value: '+23%', detail: 'Рост по целевому сценарию' },
    { label: 'Эксперименты', value: 'A/B', detail: 'Валидация гипотез на реальном трафике' },
    { label: 'Шаги', value: '-27%', detail: 'Сокращение лишних пользовательских действий' },
  ],
  timelineItems: [
    { phase: 'Research', title: 'CJM и интервью', detail: 'Фиксация ключевых зон оттока' },
    { phase: 'Hypotheses', title: 'Приоритизация решений', detail: 'Impact-first roadmap для воронки' },
    { phase: 'Design', title: 'Flow simplification', detail: 'Пересборка multi-step маршрута' },
    { phase: 'Validation', title: 'A/B verification', detail: 'Подтверждение роста completion' },
  ],
  gallery: [
    { id: 'rkg-1', title: 'Funnel breakdown', caption: 'Точки падения и влияние изменений на каждый шаг.', layers: ['Entry', 'Form stage', 'Decision stage', 'Completion'] },
    { id: 'rkg-2', title: 'Step simplification', caption: 'Сравнение старого и нового ритма сценария.', layers: ['Legacy route', 'New route', 'Progress cues', 'Error handling'] },
    { id: 'rkg-3', title: 'Validation dashboard', caption: 'Сигналы эффективности после релиза.', layers: ['Conversion', 'Drop-off', 'Session depth', 'Completion'] },
  ],
  closingTitle: 'Conversion is product clarity',
  closingText:
    'Главный результат кейса: когда пользовательский путь читается как система, а не как набор экранов, метрики растут прогнозируемо.',
}
