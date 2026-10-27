# Портфолио Сергея Рыбалки · v2

Рабочая версия портфолио Senior Product Designer / Design Lead в ветке `portfolio/pages-v2-20261027`: десять статических страниц, общий UI и живая дизайн-система `/ds/`. Текст доступен в HTML до выполнения клиентского JavaScript.

Фактические результаты и ожидания — в [PLAN.md](PLAN.md) и [матрице приёмки](docs/portfolio-v2/acceptance.json). Подготовленный workflow не означает проверенную публикацию, DNS или HTTPS.

## Запуск и проверка

Node.js **22.12 или новее**; CI использует Node.js 24. Один менеджер пакетов — npm; версии закреплены `package-lock.json`.

```bash
npm ci
npm run dev
```

```bash
npm run build
npm run check:pages
npm run preview
```

`build` проверяет TypeScript, собирает клиент Vite и предварительно рендерит HTML через официальный Vite SSR API и `react-dom/server`. `check:pages` проверяет готовый `dist/`: страницы, метаданные, локальные ссылки, ресурсы, изображения, sitemap и состав публикации. Это не замена браузерной, визуальной или DNS-проверке.

## Состав и исходники

Главная, About, каталог, пять кейсов, `/ds/` и `404.html`. Сложная платформа и дизайн-система — два фокуса текущей работы, а не две компании. ТАСС и две явно обозначенные концепции — СберЗдоровье и Alfa Digital. Обложки временные, лицензированные и маркированы; они не являются интерфейсами проектов или доказательствами результатов. PDF пока не утверждён: вместо фиктивного скачивания работает запрос резюме по email.

React, Vite и TypeScript сохранены. Новый entry использует `src/portfolio/`; прежние Three.js, R3F, GSAP, Lenis и motion-компоненты остаются в legacy, но не импортируются новой реализацией. Backend, CMS, аналитика, записи сессий, мониторинг и Storybook не подключены.

| Задача | Источник |
| --- | --- |
| Опыт, факты и кейсы | `src/portfolio/content.json` |
| Типы и проверка контента | `src/portfolio/data.ts` |
| Страницы и композиции | `src/portfolio/App.tsx` |
| Общие компоненты | `src/portfolio/ui.tsx` |
| Токены и семантические роли | `src/portfolio/tokens.ts` |
| Стили и адаптивность | `src/portfolio/portfolio.css` |
| Маршруты и метаданные | `src/portfolio/entry-server.tsx` |
| Сборка / проверка HTML | `scripts/build-pages.mjs`, `scripts/check-pages.mjs` |

`dist/` — результат сборки, `.prerender/` — промежуточный SSR-модуль и отчёты. Не редактировать их вместо исходников. В публикацию не входят архивы, настройки агента, внутренние материалы кейсов и оригиналы медиа.

## Адреса и noindex

По умолчанию: `PUBLIC_BASE_PATH=/`, canonical не создаётся без `SITE_URL`, страницы получают **noindex**. Для проектного адреса Pages:

```bash
PUBLIC_BASE_PATH=/sergey-portfolio/ SITE_URL=https://serrybalka.github.io PUBLIC_INDEXABLE=false npm run build
npm run check:pages
```

Это POSIX-синтаксис; в PowerShell задайте соответствующие `$env:PUBLIC_BASE_PATH`, `$env:SITE_URL`, `$env:PUBLIC_INDEXABLE` перед командой npm.

- `PUBLIC_BASE_PATH`: `/` для собственного домена или `/sergey-portfolio/` для проектного адреса Pages.
- `SITE_URL`: подтверждённый HTTP(S) origin без пути, query и hash. Это публичная настройка, не секрет.
- `PUBLIC_INDEXABLE=true`: явное включение индексирования проверенного HTTPS-релиза. Отдельной переменной `NOINDEX` нет.
- `/ds/`, `404.html` и кейсы со статусом `preview` остаются `noindex`. `draft` не входит в маршруты и карточки. `/ds/` исключается из sitemap.

`noindex` не защищает страницу от просмотра. Закрытые материалы исключаются из сборки.

## Публикация и прежний сайт

[pages-v2.yml](.github/workflows/pages-v2.yml) проверяет новую ветку; из pull request ничего не публикуется. Deploy использует проверенный Pages-артефакт, штатный `GITHUB_TOKEN` и OIDC. Подготовленный адрес: `https://serrybalka.github.io/sergey-portfolio/`. Он считается действующим только после успешного deploy и проверки страниц.

Публикация дополнительно закрыта repository variable `PORTFOLIO_PAGES_ENABLED`: только строка `true` разрешает deploy. Отсутствующее или другое значение оставляет сборку/проверку без публикации. После настройки **Settings → Pages → Source: GitHub Actions** и разрешения ветки в environment `github-pages` включите переменную в **Settings → Secrets and variables → Actions → Variables**, затем запустите workflow. Это обычная настройка GitHub Actions, не секрет и не клиентская переменная сайта.

На текущей проверке подключение GitHub подтвердило административный доступ к репозиторию, но браузер GitHub показывает **Sign in**. Source Pages и правила environment через UI не подтверждены; вход и завершение настройки ещё требуются. Это не действующая публикация.

**Не сливать в `main` ради preview.** Прежний `main` автоматически публикуется в Yandex Object Storage. Домен, DNS и старый хостинг сохраняются до проверки нового релиза и готовности отката. Настройки Pages, REG.RU, HTTPS, обновление и откат — в [DEPLOY.md](docs/portfolio-v2/DEPLOY.md).

Исходный README сохранён без изменений в [README-LEGACY.md](docs/portfolio-v2/README-LEGACY.md). Это исторический документ, не инструкция новой версии: его описание безопасного удаления расходится с фактическим старым workflow. Перед legacy-deploy проверять выполняемую команду, а не только runbook.

## Правила и сопровождение

- [AGENTS.md](AGENTS.md) — инструкции проекта и границы изменений.
- [Сохранённый навык](docs/portfolio-v2/knowledge/ui-ux-portfolio-platform/SKILL.md) и [полный план](docs/portfolio-v2/knowledge/ui-ux-portfolio-platform/references/portfolio-platform-extended.md) — база знаний для соответствующего этапа. Три исходных файла архива сохранены; контрольные суммы в [манифесте](docs/portfolio-v2/knowledge/archive-manifest.json). Текущие инструкции владельца имеют приоритет.
- [DS-RULES.md](docs/portfolio-v2/DS-RULES.md) — контракты UI и матрица реальных потребителей.
- [CONTENT.md](docs/portfolio-v2/CONTENT.md) — факты, NDA и замена временных изображений.
- [LICENSES.md](docs/portfolio-v2/LICENSES.md) — готовые решения, версии и происхождение медиа.

Редактировать общий источник, обновлять пример `/ds/`, выполнять сборку и затронутые проверки. SHA проверенного релиза и реальные результаты записывать в PLAN. Откат — новый commit, возвращающий проверенные файлы, и повторная публикация; без force-push и удаления старого сайта.
