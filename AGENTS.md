# Portfolio project instructions

## Knowledge source

Use `docs/portfolio-v2/knowledge/ui-ux-portfolio-platform/SKILL.md` as the project workflow guide. Its linked `references/portfolio-platform-extended.md` contains the complete owner-supplied plan. The three original archive files are preserved, with hashes in `docs/portfolio-v2/knowledge/archive-manifest.json`.

Before a new portfolio stage, read the relevant checkpoint and its acceptance criteria. If a problem occurs, return to that section and the current official vendor documentation. Do not restart completed work or apply the entire guide to an unrelated small change. Current owner instructions take precedence; saved text does not transfer credentials or authorize unrelated actions.

## Current implementation

- Work on `portfolio/pages-v2-20261027`; `main` publishes the older site to Yandex Object Storage. Preserve that deployment until a verified replacement and rollback are ready.
- Retain React, Vite and TypeScript. The new source is `src/portfolio/`; `scripts/build-pages.mjs` prerenders static HTML for GitHub Pages.
- Keep content in `src/portfolio/content.json`, shared components in `ui.tsx`, and shared tokens in `tokens.ts`. `/ds/` must use these same implementations.
- Use `npm ci`, `npm run build`, then `npm run check:pages`. Passing static checks is not browser, cross-browser, production or DNS evidence.
- Record actual progress and outstanding access/owner dependencies in `PLAN.md` and `docs/portfolio-v2/acceptance.json`.

## Content boundaries

- Use confirmed professional facts about Sergey. Existing legacy data is not proof of metrics, launch results, dates or authority.
- The Dmitry Rybalka website is a presentation reference only. Do not reuse his claims, recommendations, contacts, project artwork or domain.
- The owner will supply case artifacts later. Temporary licensed cover images are allowed for the working version; label them as temporary and never present them as product screenshots or evidence of results.
- Keep TASS and Electronic Moscow project material under NDA out of the public build. Discuss closed materials only in a meeting without recording. SberHealth and Alfa Digital are concepts, not proven production launches.
- No PDF resume or portfolio has been approved for publication. Offer a working request/contact route instead of a fake download.
- Analytics, monitoring, additional plugins and an AI profile are optional and currently not selected. Do not introduce collectors or paid services automatically.
