import type { CaseRouteSlug, CaseStory, CaseStudyId } from '../../types/content'
import { alfaCase } from './alfa'
import { moscowCase } from './moscow'
import { rkgCase } from './rkg'
import { russkiySvetCase } from './russkiy-svet'
import { sberCase } from './sber'
import { tassCase } from './tass'

export const caseStories: CaseStory[] = [
  moscowCase,
  tassCase,
  rkgCase,
  sberCase,
  alfaCase,
  russkiySvetCase,
]

export const caseStoryById = new Map<CaseStudyId, CaseStory>(caseStories.map((item) => [item.id, item]))
export const caseStoryByRoute = new Map<CaseRouteSlug, CaseStory>(
  caseStories.map((item) => [item.route, item]),
)
