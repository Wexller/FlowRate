<script setup lang="ts">
import { COUNTER_KEYS } from '~~/shared/constants/dashboard'
import { toPercentage } from '~~/shared/utils/number'
import type { DashboardState } from '~~/shared/schemas/dashboard'

type SnapshotVariant = 'rectangle' | 'square'

const props = withDefaults(defineProps<{
  state: DashboardState | null
  variant?: SnapshotVariant
}>(), {
  variant: 'rectangle'
})

const { t, locale } = useI18n()

const localeCode = computed(() => (locale.value === 'ru' ? 'ru-RU' : 'en-US'))

const counterItems = computed(() => COUNTER_KEYS.map((key) => ({
  key,
  label: t(`counters.${key}`),
  value: props.state?.counters[key] ?? 0
})))

const conversionItems = computed(() => {
  if (!props.state) {
    return [
      { key: 'replies', label: t('counters.replies'), rate: 0, value: 0, base: 0, step: 1 },
      { key: 'interviews', label: t('counters.interviews'), rate: 0, value: 0, base: 0, step: 2 },
      { key: 'offers', label: t('counters.offers'), rate: 0, value: 0, base: 0, step: 3 }
    ]
  }

  const base = props.state.counters.applications
  return [
    { key: 'replies', label: t('counters.replies'), rate: props.state.conversions.replyRate, value: props.state.counters.replies, base, step: 1 },
    { key: 'interviews', label: t('counters.interviews'), rate: props.state.conversions.interviewRate, value: props.state.counters.interviews, base, step: 2 },
    { key: 'offers', label: t('counters.offers'), rate: props.state.conversions.offerRate, value: props.state.counters.offers, base, step: 3 }
  ]
})

const dateLabel = computed(() => {
  if (!props.state) {
    return t('snapshot.loading')
  }

  return new Intl.DateTimeFormat(localeCode.value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(props.state.updatedAt))
})

const updatedMeta = computed(() => {
  if (!props.state) {
    return t('snapshot.loading')
  }

  const now = Date.now()
  const updatedAt = new Date(props.state.updatedAt).getTime()
  const diffMinutes = Math.max(0, Math.round((now - updatedAt) / 60000))

  if (diffMinutes < 1) {
    return t('snapshot.justNow')
  }

  if (diffMinutes < 60) {
    return t('snapshot.minutesAgo', { count: diffMinutes })
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return t('snapshot.hoursAgo', { count: diffHours })
  }

  const diffDays = Math.round(diffHours / 24)
  return t('snapshot.daysAgo', { count: diffDays })
})

function progressWidth(rate: number, base: number): string {
  if (base === 0) {
    return '0%'
  }

  return `${Math.max(0, Math.min(100, toPercentage(rate)))}%`
}
</script>

<template>
  <section class="snapshot panel" :class="`snapshot--${variant}`">
    <header class="snapshot__header">
      <div class="snapshot__brand-block">
        <div class="snapshot__brand-row">
          <svg class="snapshot__logo" viewBox="0 0 58 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 8C14 2 25 2 36 8C43 12 49 12 54 10" />
            <path d="M4 18C14 12 25 12 36 18C43 22 49 22 54 20" />
            <path d="M4 28C14 22 25 22 36 28C43 32 49 32 54 30" />
          </svg>
          <p class="snapshot__brand">FlowRate</p>
        </div>
        <p class="snapshot__subtitle">{{ t('snapshot.subtitle') }}</p>
        <div v-if="variant === 'rectangle'" class="snapshot__meta-row">
          <span class="snapshot__meta-group">{{ dateLabel }}</span>
          <span class="snapshot__meta-bullet">•</span>
          <span class="snapshot__meta-group">
            <span class="snapshot__meta-dot" />
            <span>{{ t('app.updated') }} {{ updatedMeta }}</span>
          </span>
        </div>
      </div>
      <p v-if="variant === 'square'" class="snapshot__updated">
        <span class="snapshot__meta-dot" />
        <span>{{ t('app.updated') }} {{ updatedMeta }}</span>
      </p>
    </header>

    <div v-if="variant === 'rectangle'" class="snapshot__body snapshot__body--rectangle">
      <div class="snapshot__counters snapshot__counters--stack">
        <article
          v-for="item in counterItems"
          :key="`rect-${item.key}`"
          class="snapshot__counter-item snapshot__counter-item--stack"
          :class="`snapshot__counter-item--${item.key}`"
        >
          <div class="snapshot__counter-main">
            <div class="snapshot__counter-icon">
              <svg v-if="item.key === 'applications'" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M8 3.5H14.5L18.5 7.5V20A1.5 1.5 0 0 1 17 21.5H8A1.5 1.5 0 0 1 6.5 20V5A1.5 1.5 0 0 1 8 3.5Z" />
                <path d="M14 3.5V8H18.5" />
                <path d="M9.5 11.25H15.5" />
                <path d="M9.5 15H15.5" />
              </svg>
              <svg v-else-if="item.key === 'replies'" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M5 6.5H19A1.5 1.5 0 0 1 20.5 8V15A1.5 1.5 0 0 1 19 16.5H11L7 19.5V16.5H5A1.5 1.5 0 0 1 3.5 15V8A1.5 1.5 0 0 1 5 6.5Z" />
                <path d="M8 10.5H12" />
                <path d="M14.5 10.5H16" />
              </svg>
              <svg v-else-if="item.key === 'interviews'" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M8 11A3 3 0 1 0 8 5A3 3 0 0 0 8 11Z" />
                <path d="M16 12A2.5 2.5 0 1 0 16 7A2.5 2.5 0 0 0 16 12Z" />
                <path d="M3.5 18.5C3.5 15.7 5.7 13.5 8.5 13.5H9.5C12.3 13.5 14.5 15.7 14.5 18.5" />
                <path d="M13 18.5C13 16.4 14.7 14.7 16.8 14.7H17.2C19.3 14.7 21 16.4 21 18.5" />
              </svg>
              <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 3.5L14.7 8.6L20.5 9.4L16.2 13.5L17.2 19.3L12 16.5L6.8 19.3L7.8 13.5L3.5 9.4L9.3 8.6L12 3.5Z" />
              </svg>
            </div>
            <div class="snapshot__counter-copy">
              <p class="snapshot__counter-label">{{ item.label }}</p>
            </div>
          </div>
          <p class="snapshot__counter-value">{{ item.value }}</p>
        </article>
      </div>

      <div class="snapshot__story">
        <div class="snapshot__stage-row" aria-label="Funnel stages">
          <template v-for="(item, index) in counterItems" :key="`stage-${item.key}`">
            <article class="snapshot__stage">
              <div class="snapshot__stage-node" :class="`snapshot__stage-node--${item.key}`">
                <span>{{ item.value }}</span>
              </div>
              <p class="snapshot__stage-label">{{ item.label }}</p>
            </article>
            <span v-if="index < counterItems.length - 1" class="snapshot__stage-connector" aria-hidden="true">→</span>
          </template>
        </div>

        <div class="snapshot__story-divider" />

        <div class="snapshot__story-copy">
          <p class="snapshot__story-label">{{ t('snapshot.conversionLabel') }}</p>
          <p class="snapshot__story-subtitle">{{ t('snapshot.conversionSubtitle') }}</p>
        </div>

        <div class="snapshot__metrics snapshot__metrics--row">
          <article
            v-for="item in conversionItems"
            :key="`rect-m-${item.key}`"
            class="snapshot__metric snapshot__metric--card"
            :class="`snapshot__metric--${item.key}`"
          >
            <div class="snapshot__metric-badge">{{ item.step }}</div>
            <p class="snapshot__metric-label">{{ item.label }}</p>
            <p class="snapshot__metric-percent">{{ toPercentage(item.rate) }}%</p>
            <p class="snapshot__metric-ratio">{{ item.value }} / {{ item.base }}</p>
            <div class="snapshot__metric-bar">
              <div class="snapshot__metric-fill" :style="{ width: progressWidth(item.rate, item.base) }" />
            </div>
            <p class="snapshot__metric-helper">{{ item.base ? t('cards.fromApplications') : t('cards.emptyBase') }}</p>
          </article>
        </div>
      </div>
    </div>

    <div v-else class="snapshot__body snapshot__body--square">
      <div class="snapshot__counters snapshot__counters--grid">
        <article
          v-for="item in counterItems"
          :key="`sq-${item.key}`"
          class="snapshot__counter-item snapshot__counter-item--grid"
          :class="`snapshot__counter-item--${item.key}`"
        >
          <div class="snapshot__counter-icon">
            <svg v-if="item.key === 'applications'" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 3.5H14.5L18.5 7.5V20A1.5 1.5 0 0 1 17 21.5H8A1.5 1.5 0 0 1 6.5 20V5A1.5 1.5 0 0 1 8 3.5Z" />
              <path d="M14 3.5V8H18.5" />
              <path d="M9.5 11.25H15.5" />
              <path d="M9.5 15H15.5" />
            </svg>
            <svg v-else-if="item.key === 'replies'" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 6.5H19A1.5 1.5 0 0 1 20.5 8V15A1.5 1.5 0 0 1 19 16.5H11L7 19.5V16.5H5A1.5 1.5 0 0 1 3.5 15V8A1.5 1.5 0 0 1 5 6.5Z" />
              <path d="M8 10.5H12" />
              <path d="M14.5 10.5H16" />
            </svg>
            <svg v-else-if="item.key === 'interviews'" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 11A3 3 0 1 0 8 5A3 3 0 0 0 8 11Z" />
              <path d="M16 12A2.5 2.5 0 1 0 16 7A2.5 2.5 0 0 0 16 12Z" />
              <path d="M3.5 18.5C3.5 15.7 5.7 13.5 8.5 13.5H9.5C12.3 13.5 14.5 15.7 14.5 18.5" />
              <path d="M13 18.5C13 16.4 14.7 14.7 16.8 14.7H17.2C19.3 14.7 21 16.4 21 18.5" />
            </svg>
            <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 3.5L14.7 8.6L20.5 9.4L16.2 13.5L17.2 19.3L12 16.5L6.8 19.3L7.8 13.5L3.5 9.4L9.3 8.6L12 3.5Z" />
            </svg>
          </div>
          <div class="snapshot__counter-copy">
            <p class="snapshot__counter-label">{{ item.label }}</p>
            <p class="snapshot__counter-value">{{ item.value }}</p>
          </div>
        </article>
      </div>

      <div class="snapshot__story snapshot__story--square">
        <div class="snapshot__story-copy snapshot__story-copy--square">
          <p class="snapshot__story-label">{{ t('snapshot.conversionLabel') }}</p>
          <p class="snapshot__story-subtitle">{{ t('snapshot.conversionSubtitle') }}</p>
        </div>

        <article
          v-for="item in conversionItems"
          :key="`sq-m-${item.key}`"
          class="snapshot__metric snapshot__metric--row"
          :class="`snapshot__metric--${item.key}`"
        >
          <div class="snapshot__metric-inline">
            <div class="snapshot__metric-badge">{{ item.step }}</div>
            <div>
              <p class="snapshot__metric-label">{{ item.label }}</p>
            </div>
          </div>
          <div class="snapshot__metric-side">
            <p class="snapshot__metric-percent">{{ toPercentage(item.rate) }}%</p>
            <p class="snapshot__metric-ratio">{{ item.value }} / {{ item.base }}</p>
            <div class="snapshot__metric-bar">
              <div class="snapshot__metric-fill" :style="{ width: progressWidth(item.rate, item.base) }" />
            </div>
            <p class="snapshot__metric-helper">{{ item.base ? t('cards.fromApplications') : t('cards.emptyBase') }}</p>
          </div>
        </article>

        <div class="snapshot__stage-strip" aria-hidden="true">
          <template v-for="(item, index) in counterItems" :key="`sq-stage-${item.key}`">
            <span class="snapshot__stage-strip-value">{{ item.value }}</span>
            <span v-if="index < counterItems.length - 1" class="snapshot__stage-strip-connector">→</span>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
