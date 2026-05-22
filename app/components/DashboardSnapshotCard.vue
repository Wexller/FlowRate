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

const { t } = useI18n()

const counterItems = computed(() => COUNTER_KEYS.map((key, index) => ({
  key,
  label: t(`counters.${key}`),
  value: props.state?.counters[key] ?? 0,
  step: index + 1
})))

const conversionItems = computed(() => {
  if (!props.state) {
    return [
      { key: 'replies', label: t('counters.replies'), rate: 0, value: 0, base: 0 },
      { key: 'interviews', label: t('counters.interviews'), rate: 0, value: 0, base: 0 },
      { key: 'offers', label: t('counters.offers'), rate: 0, value: 0, base: 0 }
    ]
  }

  const base = props.state.counters.applications
  return [
    { key: 'replies', label: t('counters.replies'), rate: props.state.conversions.replyRate, value: props.state.counters.replies, base, step: 1 },
    { key: 'interviews', label: t('counters.interviews'), rate: props.state.conversions.interviewRate, value: props.state.counters.interviews, base, step: 2 },
    { key: 'offers', label: t('counters.offers'), rate: props.state.conversions.offerRate, value: props.state.counters.offers, base, step: 3 }
  ]
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
      <div>
        <p class="snapshot__brand">FlowRate</p>
        <p class="snapshot__subtitle">{{ t('snapshot.subtitle') }}</p>
      </div>
      <p class="snapshot__updated">
        {{ t('app.updated') }}:
        {{ state ? new Date(state.updatedAt).toLocaleString() : t('snapshot.loading') }}
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
          <div class="snapshot__counter-copy">
            <p class="snapshot__counter-label">{{ item.label }}</p>
            <p class="snapshot__counter-step">0{{ item.step }}</p>
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
          <p class="snapshot__counter-label">{{ item.label }}</p>
          <p class="snapshot__counter-value">{{ item.value }}</p>
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
              <p class="snapshot__metric-ratio">{{ item.value }} / {{ item.base }}</p>
            </div>
          </div>
          <div class="snapshot__metric-side">
            <p class="snapshot__metric-percent">{{ toPercentage(item.rate) }}%</p>
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
