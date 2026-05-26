const NBSP = '\u00A0'

const RU_SHORT_WORDS = [
  'а',
  'без',
  'бы',
  'в',
  'во',
  'для',
  'до',
  'же',
  'за',
  'и',
  'из',
  'к',
  'ко',
  'ли',
  'на',
  'не',
  'ни',
  'но',
  'о',
  'об',
  'обо',
  'от',
  'по',
  'под',
  'при',
  'про',
  'с',
  'со',
  'у',
]

const EN_SHORT_WORDS = ['a', 'an', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to']

const shortWordsPattern = [...RU_SHORT_WORDS, ...EN_SHORT_WORDS].join('|')

const shortWordsRegex = new RegExp(
  `(^|[\\s\\u00A0(«“„"'])(${shortWordsPattern})(\\s+)`,
  'gimu',
)

const numberUnitRegex = /(\d)\s+([%]|[A-Za-zА-Яа-яЁё]{1,5}\b)/gu
const numeroRegex = /(№)\s+(\d)/gu

export function nb(text: string): string {
  if (!text) {
    return text
  }

  return text
    .replace(shortWordsRegex, (_match, prefix: string, word: string) => `${prefix}${word}${NBSP}`)
    .replace(numeroRegex, `$1${NBSP}$2`)
    .replace(numberUnitRegex, `$1${NBSP}$2`)
}