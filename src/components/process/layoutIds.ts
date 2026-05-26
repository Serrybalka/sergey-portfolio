import type { ProcessExperienceId } from '../../types/content'

export function getProcessShellLayoutId(id: ProcessExperienceId) {
  return `process-shell-${id}`
}

export function getProcessIndexLayoutId(id: ProcessExperienceId) {
  return `process-index-${id}`
}

export function getProcessTitleLayoutId(id: ProcessExperienceId) {
  return `process-title-${id}`
}

export function getProcessSummaryLayoutId(id: ProcessExperienceId) {
  return `process-summary-${id}`
}

export function getProcessTagLayoutId(id: ProcessExperienceId, tagIndex: number) {
  return `process-tag-${id}-${tagIndex}`
}
