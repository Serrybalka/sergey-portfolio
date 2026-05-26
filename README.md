# Sergey Rybalka Portfolio

Премиальный motion-first лендинг-портфолио для Senior / Lead Product Designer.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion
- GSAP + ScrollTrigger
- Lenis smooth scroll
- Three.js + React Three Fiber

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

## Deploy (Yandex Cloud + GitHub Actions)

Канонический pipeline:
- `.github/workflows/deploy.yml`

Триггеры:
- `push` в `main` (автодеплой production)
- `workflow_dispatch` (ручной deploy/rollback, input `target_environment`)

Обязательные GitHub Secrets:
- `YC_BUCKET`
- `YC_ACCESS_KEY_ID`
- `YC_SECRET_ACCESS_KEY`
- `YC_REGION`

Что делает pipeline:
1. Собирает Vite-бандл в GitHub Runner (`npm ci`, `npm run build`).
2. Валидирует `dist/` и `dist/index.html`.
3. Сохраняет build artifact на 14 дней для rollback.
4. Публикует `assets/*` с immutable-cache и безопасным `--delete` только в `assets`.
5. Публикует root-файлы без удаления чужих объектов.
6. Публикует `index.html` последним с `no-cache`.
7. Выполняет MIME hardening pass и post-deploy проверку сайта.

Полная эксплуатационная документация:
- [`docs/deploy/yandex-cloud.md`](docs/deploy/yandex-cloud.md)

## Где редактировать контент

- Основной контент и метрики: `src/data/portfolio.ts`
- Типы контента: `src/types/content.ts`

## Архитектура

- `src/app` — app shell и композиция секций
- `src/components/hero` — hero + WebGL сцена
- `src/components/sections` — все секции лендинга
- `src/components/common` — cursor, кнопки, reveal/count-up
- `src/hooks` — Lenis, motion hooks, reduced-motion
- `src/context` — состояние кастомного курсора

## Accessibility и performance

- Fallback при `prefers-reduced-motion`
- Lazy loading heavy-блоков (R3F сцена и секция кейсов)
- Оптимизированный scroll sync для Lenis + ScrollTrigger
