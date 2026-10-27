# Готовые решения и происхождение ресурсов

Версии прочитаны из установленных `node_modules/*/package.json`; воспроизводимую установку задаёт `package-lock.json`. Это основные инструменты новой реализации, не полный список транзитивных зависимостей и не лицензия старых проектных материалов.

| Решение | Версия / лицензия | Назначение | Официальный источник |
| --- | --- | --- | --- |
| React | 19.2.5 · MIT | Общие компоненты и интерактивные состояния; сохранённый стек | [facebook/react](https://github.com/facebook/react) |
| React DOM | 19.2.5 · MIT | Гидратация и `renderToString` для статического HTML | [API](https://react.dev/reference/react-dom/server/renderToString), [исходники](https://github.com/facebook/react/tree/main/packages/react-dom) |
| Vite | 8.0.10 · MIT | Сборка клиента и официальный SSR API; проектный адаптер не заменяет bundler | [vitejs/vite](https://github.com/vitejs/vite), [SSR](https://vite.dev/guide/ssr) |
| TypeScript | 6.0.3 · Apache-2.0 | Проверка типов перед сборкой, не runtime-сервис | [microsoft/TypeScript](https://github.com/microsoft/TypeScript) |
| Lucide React | 1.62.0 · ISC | Готовые иконки одного набора вместо самодельных пиктограмм | [lucide-icons/lucide](https://github.com/lucide-icons/lucide), [лицензия](https://lucide.dev/license) |

GSAP, Lenis, Three.js, R3F и Framer Motion сохранены для восстановления legacy, но не импортируются новой клиентской точкой входа. Перед их повторным включением проверить реальную потребность, текущую лицензию и размер сборки. Версии и лицензии официальных GitHub Actions описаны в [DEPLOY.md](DEPLOY.md).

## Первичные уведомления

При распространении соответствующего кода сохранять LICENSE и third-party notices правообладателей, не удаляя их при копировании примера. Первичные файлы установленных пакетов:

- `react/LICENSE`, `react-dom/LICENSE` — Meta Platforms, Inc. and affiliates; MIT.
- `vite/LICENSE.md` — Vite contributors; MIT и уведомления о включённых решениях.
- `typescript/LICENSE.txt` — Microsoft Corporation; Apache License 2.0.
- `lucide-react/LICENSE` — Lucide contributors; ISC.

Пути указаны относительно `node_modules/`. Таблица не заменяет первичные тексты. При обновлении сверять установленную версию, лицензию и уведомления. Лицензия библиотеки не разрешает раскрытие макетов и материалов NDA.

## Временные фотографии

Пять редакционных фотографий используются по **Unsplash License**, не public domain. Они показывают композицию портфолио, не результаты проектов Сергея. Полные URL, дата проверки, размеры и SHA-256 хранятся в [media-manifest.json](../../public/media/placeholders/media-manifest.json); обработка и атрибуция — в [README медиа](../../public/media/placeholders/README.md).

| Производная | Автор | Источник |
| --- | --- | --- |
| `architecture.webp` | Étienne Beauregard-Riverin | [Стеклянное здание](https://unsplash.com/photos/architectural-photography-of-blue-glass-building-yA-WIoC-wiA) |
| `glass.webp` | Simone Hutsch | [Стеклянный фасад](https://unsplash.com/photos/modern-glass-building-against-a-clear-sky-xaWHf0SczK4) |
| `workshop.webp` | Ben Spray | [Инструменты](https://unsplash.com/photos/workshop-tools-are-scattered-on-a-work-table-f0T-eGanP_4) |
| `paper.webp` | Bharath Kumar | [Белые криволинейные формы](https://unsplash.com/photos/abstract-white-paper-curves-creating-a-flowing-pattern-UsR7efHDjW4) |
| `curves.webp` | Pawel Czerwinski | [Абстрактные белые формы](https://unsplash.com/photos/abstract-shapes-of-white-paper-gently-curving-yKVBAM-gKJo) |

Лицензия источника: [unsplash.com/license](https://unsplash.com/license). Атрибуцию сохраняем в проекте и подписях. Оригиналы находятся вне публичного каталога; в `public/` только WebP-производные. При замене кейс-артефактами источник и разрешение фиксируются заново по [CONTENT.md](CONTENT.md).

## Шрифты и материалы владельца

Новая версия использует локальный sans-serif стек с системными fallback. Чужой файл шрифта или внешний шрифтовой загрузчик не переносится. Для будущего самохостинга добавить конкретный файл/пакет, версию и лицензионное уведомление до публикации.

Текст, логотипы и макеты не становятся открыто лицензированными по факту соседства с MIT/ISC-кодом. ТАСС и Электронная Москва остаются под NDA; рабочие материалы не входят в сборку. Фото, отзывы и проектные ресурсы Дмитрия Рыбалки не используются. Сохранённый рабочий навык — база знаний, не SDK и не передача чьей-либо авторизованной сессии.
