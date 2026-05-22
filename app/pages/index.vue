<script setup lang="ts">
import { COUNTER_KEYS } from '~~/shared/constants/dashboard'
import { toPercentage } from '~~/shared/utils/number'

const { t, locale, locales, setLocale } = useI18n()
const { state, pending, refresh, increment, decrement } = useDashboard()
const actionError = ref('')

await refresh()

const conversionCards = computed(() => {
  if (!state.value) return []

  return [
    { key: 'replies', rate: state.value.conversions.replyRate, tone: 'tone-replies' },
    { key: 'interviews', rate: state.value.conversions.interviewRate, tone: 'tone-interviews' },
    { key: 'offers', rate: state.value.conversions.offerRate, tone: 'tone-offers' }
  ] as const
})

function pipelineValue(key: 'applications' | 'replies' | 'interviews' | 'offers') {
  if (!state.value) return 0
  const base = state.value.counters.applications
  if (!base) return 0
  return key === 'applications' ? 100 : toPercentage(state.value.counters[key] / base)
}

async function handleAdjust(counterKey: (typeof COUNTER_KEYS)[number], direction: 'inc' | 'dec') {
  actionError.value = ''
  try {
    if (direction === 'inc') await increment(counterKey)
    else await decrement(counterKey)
  } catch (error: any) {
    actionError.value = error?.data?.statusMessage || error?.statusMessage || 'Validation error'
  }
}
</script>

<template>
  <UApp>
    <div class="dashboard-shell">
      <header class="topbar panel">
        <div>
          <p class="brand-title">{{ t('app.title') }}</p>
          <p class="brand-subtitle">{{ t('app.subtitle') }}</p>
        </div>
        <div class="toolbar">
          <UButton
            v-for="entry in locales"
            :key="entry.code"
            size="xs"
            :variant="locale === entry.code ? 'solid' : 'outline'"
            @click="setLocale(entry.code)"
          >{{ entry.code.toUpperCase() }}</UButton>
          <UBadge color="info" variant="subtle">{{ t('app.saved') }}</UBadge>
          <UButton size="xs" :loading="pending" @click="refresh">{{ t('app.refresh') }}</UButton>
        </div>
      </header>

      <section class="hero panel">
        <h1 class="hero-title">{{ t('app.snapshot') }}</h1>
        <p class="hero-meta">{{ t('app.rule') }}</p>
        <p v-if="state" class="hero-meta">{{ t('app.updated') }}: {{ new Date(state.updatedAt).toLocaleString() }}</p>
      </section>

      <section class="section-grid conversion-grid">
        <article v-for="card in conversionCards" :key="card.key" class="conversion-card panel" :class="card.tone">
          <p class="metric-label">{{ t(`counters.${card.key}`) }}</p>
          <p class="metric-value">{{ toPercentage(card.rate) }}%</p>
          <p class="metric-ratio">{{ state?.counters[card.key] ?? 0 }} / {{ state?.counters.applications ?? 0 }}</p>
          <p class="metric-helper">{{ state?.counters.applications ? t('cards.fromApplications') : t('cards.emptyBase') }}</p>
        </article>
      </section>

      <section class="lower-grid">
        <div class="section-card panel">
          <h2 class="section-title">{{ t('counters.title') }}</h2>
          <p class="section-subtitle">{{ t('counters.description') }}</p>

          <div v-for="counterKey in COUNTER_KEYS" :key="counterKey" class="counter-row">
            <div>
              <p class="counter-name">{{ t(`counters.${counterKey}`) }}</p>
              <p class="counter-key">{{ counterKey }}</p>
            </div>
            <div class="counter-controls">
              <UButton size="sm" variant="outline" :disabled="pending" @click="handleAdjust(counterKey, 'dec')">−</UButton>
              <div class="counter-value">{{ state?.counters[counterKey] ?? 0 }}</div>
              <UButton size="sm" :disabled="pending" @click="handleAdjust(counterKey, 'inc')">+</UButton>
            </div>
          </div>

          <p v-if="actionError" class="validation-hint">{{ actionError }}</p>
        </div>

        <div class="section-card panel">
          <h2 class="section-title">{{ t('pipeline.title') }}</h2>
          <p class="section-subtitle">{{ t('pipeline.progress') }}</p>

          <div v-for="counterKey in COUNTER_KEYS" :key="`pipe-${counterKey}`" class="pipeline-row">
            <div class="pipeline-head">
              <span>{{ t(`counters.${counterKey}`) }}</span>
              <span>{{ state?.counters[counterKey] ?? 0 }}</span>
            </div>
            <div class="pipeline-track">
              <div class="pipeline-fill" :style="{ width: `${pipelineValue(counterKey)}%` }" />
            </div>
          </div>
        </div>
      </section>

      <section class="history-card panel">
        <h2 class="section-title">{{ t('aggregates.title') }}</h2>
        <DashboardAggregates />
      </section>
    </div>
  </UApp>
</template>
