# ТЗ на MVP приложения конверсий без дизайн-спека

## Summary
- Переосмыслить текущий `Jobflow` как простое Nuxt 4 приложение для ручного ведения counters и мгновенного расчёта конверсий.
- Это ТЗ фиксирует только продуктовую и техническую часть MVP.
- Визуальный дизайн, композиция экрана, типографика, цветовая система, motion и wireframes выносятся в отдельное ТЗ и здесь не описываются.
- В `docs` должны появиться как минимум два документа:
  - `docs/conversion-dashboard-mvp-spec.md` — это основное ТЗ на приложение
  - `docs/conversion-dashboard-design-spec.md` — отдельное ТЗ на дизайн

## Product Behavior
- Источник правды MVP: ручные counters, а не список вакансий.
- Обязательные counters:
  - `applications`
  - `replies`
  - `interviews`
  - `offers`
- Обязательные конверсии:
  - `replyRate = replies / applications`
  - `interviewRate = interviews / applications`
  - `offerRate = offers / applications`
- Главный блок конверсий обязан показывать:
  - процент конверсии;
  - числитель из counter;
  - знаменатель из базового counter.
- Формат отображения метрик в conversion block:
  - `Replies: 24%`
  - `12 / 50`
  - аналогично для `interviews` и `offers`.
- Отдельный counters block остаётся обязательным и служит для ручного изменения абсолютных значений.
- Конверсии пересчитываются в реальном времени при любом изменении counters.
- Поведение при `applications = 0`:
  - все конверсии показываются как `0%`;
  - дробь отображается как `0 / 0` или `0 / applications`, без `NaN`, `Infinity` и ошибок.
- Правила целостности counters:
  - все значения целые и неотрицательные;
  - `applications >= replies >= interviews >= offers`.
- Языки интерфейса:
  - `ru`
  - `en`
- Все пользовательские тексты идут через i18n.

## Data Model, Storage, API
- Формат хранения: JSON.
- Базовая директория данных: `data/jobflow/`.
- Runtime override: `JOBFLOW_DATA_DIR`.
- Основной файл текущего состояния:
  - `data/jobflow/current.json`
- Рекомендуемая структура `current.json`:
```json
{
  "updatedAt": "2026-05-21T12:00:00.000Z",
  "counters": {
    "applications": 0,
    "replies": 0,
    "interviews": 0,
    "offers": 0
  },
  "conversions": {
    "replyRate": 0,
    "interviewRate": 0,
    "offerRate": 0
  }
}
```
- История хранится отдельными derived-файлами:
```text
data/jobflow/
  current.json
  aggregates/
    daily/
      2026-05-21.json
    weekly/
      2026-W21.json
    monthly/
      2026-05.json
```
- Смысл history-файлов: `activity-based`, то есть хранение срезов и итогов по изменениям counters за период, а не восстановление полноценного состояния CRM.
- Серверная часть: Nuxt Nitro API.
- Обязательные API endpoints:
  - `GET /api/dashboard/current`
  - `PUT /api/dashboard/current`
  - `POST /api/dashboard/counters/:counterKey/increment`
  - `POST /api/dashboard/counters/:counterKey/decrement`
  - `GET /api/dashboard/aggregates?period=daily|weekly|monthly&from=YYYY-MM-DD&to=YYYY-MM-DD`
- `counterKey` ограничить enum-значениями:
  - `applications`
  - `replies`
  - `interviews`
  - `offers`
- `PUT /api/dashboard/current` принимает полный набор counters и возвращает пересчитанное состояние.
- Increment/decrement endpoints меняют только один counter за запрос и возвращают пересчитанное состояние.
- Сервер валидирует:
  - типы;
  - неотрицательность;
  - порядок counters;
  - допустимые ключи period и counterKey.
- Запись файлов делать атомарно через temp file + rename.
- Для write-операций использовать process-local mutex, чтобы избежать порчи JSON при параллельных обновлениях.

## Implementation Changes
- Убрать из MVP-зависимости на текущий CRM-flow как на продуктовую основу.
- Сохранить Nuxt 4, TypeScript, i18n и серверную часть.
- Не использовать Postgres и Google Sheets в MVP-сценарии текущего dashboard.
- Добавить новый typed server module для `dashboard/current` и `dashboard/aggregates`.
- Добавить отдельные Zod-схемы для:
  - `DashboardCounters`
  - `DashboardConversions`
  - `DashboardState`
  - `DashboardAggregatePoint`
- Обновить home data flow так, чтобы экран читал новое состояние dashboard, а не текущий `jobflow snapshot`.
- В основном ТЗ явно зафиксировать, что visual design и layout-решения описываются в отдельном design-spec и не должны смешиваться с API/storage/domain частью.

## Test Plan
- Unit tests:
  - расчёт `replyRate`, `interviewRate`, `offerRate`;
  - поведение при `applications = 0`;
  - запрет отрицательных значений;
  - запрет нарушения порядка counters;
  - period bucketing для daily/weekly/monthly.
- API tests:
  - `GET /api/dashboard/current` возвращает корректный state;
  - `PUT /api/dashboard/current` сохраняет файл и пересчитывает конверсии;
  - increment/decrement endpoints обновляют нужный counter и не ломают порядок;
  - `GET /api/dashboard/aggregates` возвращает корректный typed response.
- UI behavior tests:
  - conversion block показывает и проценты, и числа из counters;
  - отдельный counters block изменяет значения и триггерит мгновенный пересчёт;
  - zero-state отображается корректно;
  - i18n тексты переключаются между `ru` и `en`.
- Regression checks:
  - приложение запускается без Postgres;
  - приложение запускается без Google Sheets;
  - локальное файловое хранение создаётся автоматически при первом сохранении.

## Assumptions And Defaults
- Принят полный pivot в приложение конверсий.
- Принята counters-first модель.
- Принят JSON как формат хранения.
- Принята activity-based history модель.
- Conversion block обязан содержать и проценты, и абсолютные числа.
- Дизайн намеренно вынесен в отдельное ТЗ и не описывается в этом документе.

