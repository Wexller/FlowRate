<script setup lang="ts">
import { COUNTER_KEYS } from '~~/shared/constants/dashboard'
import { toPercentage } from '~~/shared/utils/number'

const { t, locale, locales, setLocale } = useI18n()
const { state, pending, refresh, increment, decrement } = useDashboard()
const actionError = ref('')
const snapshotVariant = ref<'rectangle' | 'square'>('rectangle')

await refresh()

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
        <div class="hero-head">
          <div>
            <h1 class="hero-title">{{ t('app.snapshot') }}</h1>
            <p class="hero-meta">{{ t('app.rule') }}</p>
            <p v-if="state" class="hero-meta">{{ t('app.updated') }}: {{ new Date(state.updatedAt).toLocaleString() }}</p>
          </div>
          <div class="hero-switch" role="group" :aria-label="t('snapshot.variantAria')">
            <UButton size="sm" :variant="snapshotVariant === 'rectangle' ? 'solid' : 'outline'" @click="snapshotVariant = 'rectangle'">
              {{ t('snapshot.rectangle') }}
            </UButton>
            <UButton size="sm" :variant="snapshotVariant === 'square' ? 'solid' : 'outline'" @click="snapshotVariant = 'square'">
              {{ t('snapshot.square') }}
            </UButton>
          </div>
        </div>
      </section>

      <section class="section-grid">
        <DashboardSnapshotCard :state="state" :variant="snapshotVariant" />
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
