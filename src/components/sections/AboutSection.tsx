import { nb } from '../../utils/typography'
import { Section } from '../layout/Section'

export function AboutSection() {
  return (
    <Section id="about" subtitle="About" title="Сильный дизайн там, где интерфейс — только вершина айсберга">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <p className="rounded-2xl border border-white/10 bg-[#0a121f] p-7 text-lg leading-relaxed text-slate-200/90">
          {nb(
            'Проектирую сложные цифровые продукты, где интерфейс это результат глубокой системной работы. Его ключевая ценность в балансе CX/UX, бизнес-метрик и технической реализуемости, который позволяет командам запускать решения быстрее и масштабировать их без потери качества.',
          )}
        </p>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#080f19] p-7">
          <h3 className="text-lg font-semibold text-white">{nb('Фокус в работе')}</h3>
          <ul className="space-y-3 text-sm leading-relaxed text-slate-300/90">
            <li className="before:mr-2 before:text-blue-300 before:content-['•']">{nb('Сложные продуктовые контуры и многоролевые UX-сценарии')}</li>
            <li className="before:mr-2 before:text-blue-300 before:content-['•']">{nb('Дизайн-системы как инфраструктура скорости и качества')}</li>
            <li className="before:mr-2 before:text-blue-300 before:content-['•']">{nb('Лидерство в связке продукт, бизнес, аналитика, разработка')}</li>
            <li className="before:mr-2 before:text-blue-300 before:content-['•']">{nb('Результат через измеримые продуктовые эффекты')}</li>
          </ul>
        </div>
      </div>
    </Section>
  )
}