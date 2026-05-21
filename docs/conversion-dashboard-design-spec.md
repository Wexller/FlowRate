# Дизайн-спека: Conversion Dashboard

## 1. Цель документа

Этот документ описывает визуальный и UX-дизайн для MVP conversion dashboard, который задан в [docs/conversion-dashboard-mvp-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-mvp-spec.md).

Документ фиксирует:
- визуальное направление;
- композицию экрана;
- библиотечную основу;
- поведение ключевых блоков;
- responsive-адаптацию;
- цветовую систему, типографику и motion;
- критерии качества реализации.

Техническая логика, API, storage и data model здесь не дублируются и берутся из основного MVP-спека.

## 2. Продуктовый контекст

Dashboard нужен для очень быстрого ручного ведения воронки:
- `applications`
- `replies`
- `interviews`
- `offers`

Их изменение должно сразу отражаться в:
- conversion cards;
- counters block;
- aggregate/trend block;
- визуальной pipeline-индикации.

Главная цель дизайна: сделать экран, который можно считать за 3-5 секунд, а редактировать без напряжения и без ощущения "админки из таблицы".

## 3. Визуальная концепция

### 3.1 Образ

Интерфейс должен ощущаться как спокойная, дорогая и очень читаемая аналитическая панель:
- не CRM;
- не бухгалтерская таблица;
- не "игрушечный" glassmorphism;
- не перегруженный enterprise UI.

Визуальная метафора: `ocean telemetry`.

Это означает:
- лазурно-океаническая палитра;
- воздушные светлые поверхности;
- ощущение глубины через слои, тени и прозрачные tint-overlays;
- большие цифры, мягкие границы, аккуратная сетка;
- минимум визуального шума;
- один явный фокус: конверсии.

### 3.2 Дизайн-принципы

1. `Glanceable first`
   Экран должен читаться сверху вниз без необходимости "разбирать интерфейс".

2. `Conversions are the hero`
   Процентные метрики являются главным акцентом, counters являются инструментом управления.

3. `Calm editing`
   Изменение чисел должно выглядеть безопасно, предсказуемо и почти тактильно.

4. `One palette, many depths`
   Цвет строится на одном океаническом синем семействе с лёгкими бирюзовыми сдвигами, а не на наборе случайных accent colors.

5. `Library-native, not Frankenstein`
   Используем готовые компоненты, но приводим их к единому token-layer. Нельзя смешивать визуальные стили библиотек "как есть".

## 4. Библиотечная стратегия

### 4.1 Основной стек UI

Рекомендуемая основа:
- `Nuxt UI` как основной дизайн-слой, layout-слой и базовый набор компонентов;
- `PrimeVue` точечно для компонентов, где нужна особенно удобная числовая работа или richer data viz;
- `Tailwind CSS` через токены и semantic classes;
- `@nuxt/fonts` для контролируемой типографики.

### 4.2 Как использовать библиотеки

#### База

Основной UI должен строиться на `Nuxt UI`, потому что он лучше подходит под Nuxt-приложение и даёт:
- сильную shell/layout-модель;
- хорошие доступные form-компоненты;
- предсказуемую theming-модель;
- удобные dashboard primitives.

#### Точечные исключения

`PrimeVue` допустимо использовать адресно:
- для `InputNumber`, если нужен наиболее удобный режим stepper-editing;
- для `Chart`, если aggregate section будет реализован на готовой диаграмме;
- для `MeterGroup`, если понадобится библиотечный pipeline-бар.

### 4.3 Правило смешивания

Если проект использует и `Nuxt UI`, и `PrimeVue`, то:
- shell, card, tabs, badge, actions, alerts и overlays должны выглядеть как единая система;
- у PrimeVue-компонентов переопределяются radius, spacing, color tokens и focus-ring под общий стиль;
- визуально пользователь не должен понимать, что экран собран из двух библиотек.

### 4.4 Предпочтительная карта компонентов

| Зона | Предпочтение |
|---|---|
| App shell | `Nuxt UI` |
| Cards / badges / buttons / tabs / alerts | `Nuxt UI` |
| Numeric editing | `Nuxt UI InputNumber` или `PrimeVue InputNumber` |
| Charts | `PrimeVue Chart` при необходимости |
| Forms / validation shell | `Nuxt UI` |
| Toast / modal / slideover | `Nuxt UI` |

## 5. Информационная архитектура экрана

Экран должен быть одноэкранным, без левого sidebar в MVP.

Это важное решение: для текущего продукта sidebar только ухудшит фокус. Dashboard должен ощущаться как single-purpose cockpit.

### 5.1 Порядок блоков

1. Top bar
2. Hero summary
3. Conversion cards
4. Counters editor
5. Pipeline visual
6. Aggregates / trends
7. Empty, loading, validation and sync states

### 5.2 Desktop layout

Использовать 12-column grid с max-width `1280-1440px`.

Рекомендуемая структура:
- top bar: full width;
- hero summary: full width;
- conversion cards: 3 cards в ряд;
- второй пояс: `counters editor 7/12` + `pipeline visual 5/12`;
- нижний пояс: aggregates full width.

### 5.3 Tablet layout

- conversion cards: 3 в ряд, если ширина позволяет, иначе `2 + 1`;
- counters и pipeline переходят в stack;
- actions и status не должны ломать top bar.

### 5.4 Mobile layout

- full-width stack;
- conversion cards идут вертикально;
- counters block становится главным рабочим блоком сразу после summary;
- действия `+` и `-` остаются крупными и легко нажимаемыми;
- aggregate chart допускается ниже первого экрана.

## 6. Экранная композиция

### 6.1 Top bar

Назначение:
- показать, что это один конкретный dashboard;
- дать ощущение статуса и контроля;
- не занимать много вертикального места.

Состав:
- слева: `FlowRate` / `Conversion Dashboard`;
- подзаголовок: короткое пояснение вроде `Manual funnel tracking`;
- справа:
  - language switch `RU / EN`;
  - badge с `Updated X min ago`;
  - secondary action `Refresh`, если нужен ручной reread;
  - индикатор статуса сохранения: `Saved`, `Saving`, `Sync error`.

Визуально:
- высота `72-84px`;
- полупрозрачный светлый фон;
- мягкая нижняя граница;
- sticky при скролле.

### 6.2 Hero summary

Это не отдельная KPI-плитка ради декора, а короткое введение в текущую сессию.

Состав:
- заголовок: `Today’s funnel snapshot` / `Срез воронки на сегодня`;
- вспомогательная строка:
  - всего applications;
  - дата последнего обновления;
  - короткое правило вида `Replies <= Applications`.

Фон:
- мягкий azure gradient;
- еле заметные radial highlights;
- карточный контейнер с большим radius.

Задача hero-блока:
- сразу задать настроение;
- визуально отделить аналитическую часть от "формы ввода";
- дать экрану премиальность без лишних украшений.

### 6.3 Conversion cards

Это главный блок экрана.

Нужно 3 большие карточки:
- Replies
- Interviews
- Offers

Содержимое каждой карточки:
- label;
- основной процент;
- ratio строка `12 / 50`;
- маленькое пояснение `from applications`;
- micro-indicator состояния: `updating`, `empty base`, `valid`.

#### Визуальная иерархия карточки

1. Крупный процент `36-48px`
2. Ratio строка моноширинным или semi-mono стилем
3. Label и helper text
4. Очень деликатный progress/meter слой на фоне

#### Визуальные особенности

- каждая карточка имеет собственный tonal tint внутри синей палитры;
- карточка не должна быть пёстрой;
- процент обязан быть самым крупным элементом на экране после hero title;
- ratio не прячется в footer и не теряет контраст.

#### Цветовое различие внутри одной палитры

- Replies: светлый azure;
- Interviews: ocean cyan;
- Offers: deep marine blue.

#### Состояние `applications = 0`

Карточка должна показывать:
- `0%`
- `0 / 0`
- helper text вроде `No base volume yet`

Это состояние не должно выглядеть как ошибка. Это neutral empty state.

### 6.4 Counters editor

Это второй по важности блок.

Он отвечает за ручное управление абсолютными значениями и должен быть максимально удобным.

Состав блока:
- заголовок `Counters`;
- короткое описание: `Update values manually, conversions recalculate instantly`;
- 4 editable rows/cards:
  - Applications
  - Replies
  - Interviews
  - Offers

Для каждой строки:
- иконка или короткий marker;
- label;
- helper text;
- текущее значение;
- control cluster:
  - minus button;
  - numeric input;
  - plus button.

#### Рекомендуемая механика

- поддержка ручного ввода числа;
- поддержка кнопок `-` и `+`;
- шаг `1`;
- невозможность уйти в отрицательные значения;
- визуальная подсветка ошибки порядка;
- при нарушении иерархии показывать inline hint, а не только toast.

#### Лучший паттерн

Редактор должен выглядеть не как таблица, а как набор крупных операционных rows внутри одной card-section:
- row height `64-72px`;
- input area визуально отделена;
- значение легко считывается боковым зрением;
- действия доступны как мышью, так и клавиатурой.

### 6.5 Pipeline visual

Этот блок делает интерфейс "очень хорошим", а не просто функциональным.

Нужно визуально показать глубину воронки:
- Applications = 100% base rail
- Replies = share of applications
- Interviews = share of applications
- Offers = share of applications

Формат:
- 4 горизонтальные полосы или meter rows;
- каждая полоса подписана;
- длина полосы привязана к `applications`;
- справа можно показать абсолютное число.

Почему это важно:
- пользователь видит не только числа, но и форму воронки;
- снижается когнитивная нагрузка;
- экран выглядит как аналитический продукт, а не просто counter editor.

Если используется готовый компонент, допустим `PrimeVue MeterGroup` или кастомный progress stack на базе `Nuxt UI`.

### 6.6 Aggregates / trends

Этот блок вторичен по отношению к текущим counters, но важен для ощущения "dashboard".

Состав:
- заголовок `History`;
- tabs:
  - Daily
  - Weekly
  - Monthly
- chart area;
- optional summary chips;
- legend.

#### Рекомендуемая диаграмма

Для MVP достаточно одного из двух вариантов:
- line chart для conversion trends;
- grouped bar chart для counters by period.

Лучший вариант для первого релиза:
- line chart с тремя линиями:
  - replyRate
  - interviewRate
  - offerRate
- над ним компактные summary chips периода.

#### Важные ограничения

- chart не должен быть самым ярким блоком;
- chart не должен перетягивать внимание у conversion cards;
- на mobile график может быть горизонтально скроллируемым, но не должен ломать layout.

## 7. Wireframe

### 7.1 Desktop

```text
+----------------------------------------------------------------------------------+
| FlowRate                         Today’s funnel snapshot        RU/EN  Saved      |
| Manual funnel tracking           50 applications · updated 2m ago                 |
+----------------------------------------------------------------------------------+
| Hero card with soft azure gradient and short context                               |
+--------------------------+--------------------------+-----------------------------+
| Replies                  | Interviews               | Offers                      |
| 24%                      | 18%                      | 6%                          |
| 12 / 50                  | 9 / 50                   | 3 / 50                      |
+--------------------------+--------------------------+-----------------------------+
| Counters editor (7/12)                               | Pipeline visual (5/12)      |
| Applications [ - ] [ 50 ] [ + ]                     | Applications  ███████████   |
| Replies      [ - ] [ 12 ] [ + ]                     | Replies       ████          |
| Interviews   [ - ] [  9 ] [ + ]                     | Interviews    ███           |
| Offers       [ - ] [  3 ] [ + ]                     | Offers        █             |
+----------------------------------------------------------------------------------+
| History                                                                     Tabs  |
| Daily | Weekly | Monthly                                                        |
| Line chart for replyRate / interviewRate / offerRate                           |
+----------------------------------------------------------------------------------+
```

### 7.2 Mobile

```text
+--------------------------------------+
| FlowRate                RU/EN Saved  |
+--------------------------------------+
| Hero summary                         |
+--------------------------------------+
| Replies                              |
| 24%                                  |
| 12 / 50                              |
+--------------------------------------+
| Interviews                           |
| 18%                                  |
| 9 / 50                               |
+--------------------------------------+
| Offers                               |
| 6%                                   |
| 3 / 50                               |
+--------------------------------------+
| Counters                             |
| Applications  [-] [50] [+]           |
| Replies       [-] [12] [+]           |
| Interviews    [-] [ 9] [+]           |
| Offers        [-] [ 3] [+]           |
+--------------------------------------+
| Pipeline                             |
+--------------------------------------+
| History                              |
+--------------------------------------+
```

## 8. Цветовая система

### 8.1 Основная палитра

Нужен светлый режим как основной сценарий MVP.

Базовая океаническая шкала:

| Token | Color |
|---|---|
| `ocean-50` | `#F0FAFF` |
| `ocean-100` | `#DDF5FF` |
| `ocean-200` | `#B8EBFF` |
| `ocean-300` | `#7EDBFF` |
| `ocean-400` | `#39C8FF` |
| `ocean-500` | `#129FE6` |
| `ocean-600` | `#0B7FC2` |
| `ocean-700` | `#0D679A` |
| `ocean-800` | `#114E73` |
| `ocean-900` | `#12354D` |

Дополнительный бирюзовый акцент:

| Token | Color |
|---|---|
| `seafoam-400` | `#35D6C7` |
| `seafoam-500` | `#18B8AA` |
| `seafoam-600` | `#0E9189` |

Нейтрали:

| Token | Color |
|---|---|
| `ink-950` | `#0B1724` |
| `ink-800` | `#1C2C3B` |
| `ink-600` | `#4D6275` |
| `ink-400` | `#7D93A8` |
| `line-200` | `#D7E6F1` |
| `line-100` | `#EAF3F8` |
| `surface` | `#FFFFFF` |
| `surface-soft` | `#F7FBFE` |
| `surface-tint` | `#F3FAFF` |

### 8.2 Семантическое использование

- `primary`: `ocean-500`
- `primary-hover`: `ocean-600`
- `primary-soft`: `ocean-100`
- `accent`: `seafoam-500`
- `text-strong`: `ink-950`
- `text-muted`: `ink-600`
- `border`: `line-200`
- `page-bg`: смесь `surface-soft` и very-light gradient

### 8.3 Фон приложения

Не использовать плоский белый фон на весь экран.

Нужен мягкий layered background:
- основной фон `#F7FBFE`;
- сверху еле заметный радиальный azure glow;
- локальные секции на чистом белом;
- hero card с выразительным, но светлым градиентом.

Пример направления:

```css
background:
  radial-gradient(circle at top left, rgba(57, 200, 255, 0.10), transparent 28%),
  radial-gradient(circle at top right, rgba(24, 184, 170, 0.08), transparent 22%),
  linear-gradient(180deg, #f5fbff 0%, #f7fbfe 100%);
```

## 9. Типографика

### 9.1 Шрифтовая пара

Рекомендуется:
- основной UI-шрифт: `Manrope`
- числовой/ratio-акцент: `IBM Plex Mono`

Причины:
- `Manrope` хорошо выглядит в продуктовых dashboard-интерфейсах;
- у него хороший рисунок цифр и сильная современная пластика;
- `IBM Plex Mono` отлично подчёркивает ratio и operational data.

### 9.2 Иерархия

- Hero title: `32/38`, `700`
- Section title: `20/26`, `700`
- Card title: `14/20`, `600`
- Main metric: `36-48px`, `700`
- Ratio: `15/22`, `500`, mono or semi-mono
- Body: `14/22`
- Helper text: `12/18`

### 9.3 Правила

- не использовать слишком много кеглей;
- в интерфейсе достаточно 5-6 уровней;
- числа должны быть slightly tighter и контрастнее обычного текста;
- uppercase использовать только для micro-labels и очень дозированно.

## 10. Компоненты и их поведение

### 10.1 Card language

Все card-компоненты должны иметь:
- radius `20-24px`;
- border `1px` с мягким оттенком;
- тень низкой контрастности;
- увеличенный inner padding;
- лёгкий hover-lift только там, где это уместно.

### 10.2 Buttons

Кнопки `+` и `-`:
- квадратные или rounded-square;
- размер не меньше `40x40` на desktop и `44x44` на mobile;
- secondary tinted style;
- clear hover/focus/active states.

Primary buttons, если появляются:
- solid ocean fill;
- white text;
- мягкая, но заметная focus ring.

### 10.3 Numeric input

Требования:
- крупное читаемое число;
- центрированное или right-aligned значение;
- клавиатурная доступность;
- мгновенная локальная валидация;
- невозможность визуально "сломать" layout длинным числом.

Если используется `PrimeVue InputNumber`, настроить:
- `min=0`;
- integer mode;
- адекватный focus ring;
- унификацию border radius и padding под общий стиль.

### 10.4 Tabs

Tabs для aggregates:
- pill-style;
- soft background;
- active tab с ocean tint;
- не использовать слишком тяжёлые underline-tabs.

### 10.5 Badges and status chips

Использовать для:
- `Saved`
- `Saving`
- `Validation issue`
- `Updated 2m ago`
- `Daily/Weekly/Monthly summary`

Стиль:
- compact rounded pills;
- низкий визуальный шум;
- статусный цвет без кислотности.

## 11. Состояния интерфейса

### 11.1 Loading

При первой загрузке:
- skeleton вместо conversion cards;
- skeleton rows для counters;
- приглушённый chart skeleton;
- layout не должен прыгать.

### 11.2 Saving

Когда пользователь меняет значение:
- обновление conversion cards должно ощущаться мгновенным;
- статус `Saving...` показывается спокойно, без агрессивных loaders;
- после завершения меняется на `Saved`.

### 11.3 Validation error

Если нарушен порядок:
- проблемная строка подсвечивается;
- сверху блока появляется inline alert;
- error copy объясняет правило простым языком.

Пример:
- `Replies cannot exceed applications`
- `Offers cannot be greater than interviews`

### 11.4 Empty state

Если всё по нулям:
- hero и cards остаются полноценными;
- pipeline показывает пустые rails;
- history block может показывать `No trend data yet`.

Это должен быть "чистый старт", а не "сломанный экран".

### 11.5 Sync failure

Если сохранение не удалось:
- status chip меняется на error;
- показывается toast;
- пользователь понимает, сохранилось ли локальное изменение или нужно повторить.

## 12. Motion

Motion нужен, но он должен быть зрелым и тихим.

### 12.1 Общие правила

- hover/focus transitions: `120-160ms`
- card/filter/tab transitions: `180-220ms`
- number refresh animation: короткий fade/translate, без "одометра"
- не использовать bounce и flashy easing

### 12.2 Что анимировать

- появление cards при mount;
- hover elevation у interactive elements;
- смену активного tab;
- аккуратное обновление progress/pipeline bars.

### 12.3 Что не анимировать

- весь layout целиком;
- большие фоновые градиенты;
- chart с чрезмерной анимацией при каждом изменении counters.

## 13. Accessibility

Обязательные требования:
- контраст текста и controls не ниже WCAG AA;
- кнопки `+` и `-` доступны с клавиатуры;
- numeric inputs имеют label и aria semantics;
- status changes не должны быть только цветом;
- ошибки валидности дублируются текстом;
- tab order предсказуем и короток;
- на mobile hit area не меньше `44x44`.

## 14. Responsive-поведение

### 14.1 Breakpoints

Рекомендуемая логика:
- `sm`: mobile stack
- `md`: 2-column transitional
- `lg`: full dashboard composition
- `xl`: комфортные внутренние отступы и чуть более широкий chart

### 14.2 Что важно на малых экранах

- conversion cards не должны терять размер процента;
- counters block должен оставаться выше history;
- pipeline может упрощаться;
- status chips могут схлопываться в одну строку или переноситься.

## 15. Контент и tone of voice

Тон интерфейса:
- спокойный;
- ясный;
- без офисного жаргона;
- без технической перегруженности.

RU-примеры:
- `Конверсии`
- `Счётчики`
- `Обновлено 2 мин назад`
- `Нет базового объёма`
- `Значение не может быть отрицательным`

EN-примеры:
- `Conversions`
- `Counters`
- `Updated 2 min ago`
- `No base volume yet`
- `Value cannot be negative`

## 16. Критерии хорошей реализации

Дизайн считается удачным, если:
- экран выглядит как современный analytics product, а не как CRUD-форма;
- главный акцент безошибочно уходит на conversion cards;
- counters удобно менять даже серией быстрых кликов;
- интерфейс красив в состоянии нулевых данных;
- синяя палитра ощущается дорогой и свежей, а не корпоративно-скучной;
- Nuxt UI и PrimeVue не конфликтуют стилистически;
- mobile-версия остаётся такой же чистой и понятной.

## 17. Антипаттерны

Нельзя делать:
- тяжёлый sidebar ради одного экрана;
- ярко-синие заливки на всех карточках сразу;
- тёмный dashboard по умолчанию;
- таблицу вместо counters editor;
- кислотные charts;
- glassmorphism с плохим контрастом;
- смесь из трёх разных button styles;
- слишком мелкие числа в conversion cards;
- серый скучный SaaS-шаблон без визуального характера.

## 18. Рекомендуемая реализация по блокам

| Блок | Рекомендация |
|---|---|
| Shell | `Nuxt UI App + Container + Card` |
| Header/status | `Nuxt UI Badge, Button, Separator` |
| Conversion cards | `Nuxt UI Card` с кастомными tint backgrounds |
| Counters editor | `Nuxt UI Card + FormField + InputNumber` или `PrimeVue InputNumber` |
| Inline validation | `Nuxt UI Alert` |
| Pipeline | кастомный block на progress bars или `PrimeVue MeterGroup` |
| Aggregates tabs | `Nuxt UI Tabs` |
| Aggregates chart | `PrimeVue Chart` при наличии history в MVP-реализации |
| Toast/sync feedback | `Nuxt UI Toast` |

## 19. Дизайн-решение по умолчанию

Если команде нужно одно базовое решение без дополнительных обсуждений, принять такой default:
- основной UI-слой: `Nuxt UI`;
- charts: `PrimeVue Chart`;
- numeric editing: начать с `Nuxt UI InputNumber`, перейти на `PrimeVue InputNumber` только если stepper UX окажется лучше;
- шрифт: `Manrope`;
- палитра: `ocean + seafoam`;
- layout: single-page dashboard без sidebar;
- визуальный акцент: conversion cards + pipeline.

## 20. Источники библиотечной основы

Официальные материалы, на которые можно опираться при реализации:
- [Nuxt UI](https://ui.nuxt.com/)
- [Nuxt UI Components](https://ui.nuxt.com/docs/components/)
- [PrimeVue InputNumber](https://primevue.org/inputnumber)
- [PrimeVue Chart](https://primevue.org/chart/)
- [PrimeVue MeterGroup](https://v3.primevue.org/metergroup/)
