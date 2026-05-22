<script setup lang="ts">
import type { DashboardAggregatePoint } from '~~/shared/schemas/dashboard'

const { t } = useI18n()
const period = ref<'daily' | 'weekly' | 'monthly'>('daily')
const from = ref(new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10))
const to = ref(new Date().toISOString().slice(0, 10))

const { data, refresh, pending } = await useAsyncData(
  'aggregates',
  () => $fetch<DashboardAggregatePoint[]>('/api/dashboard/aggregates', { query: { period: period.value, from: from.value, to: to.value } }),
  { watch: [period, from, to] }
)
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center gap-2">
      <USelect v-model="period" :items="[{ label: t('aggregates.daily'), value: 'daily' }, { label: t('aggregates.weekly'), value: 'weekly' }, { label: t('aggregates.monthly'), value: 'monthly' }]" class="w-40" />
      <UInput v-model="from" type="date" />
      <UInput v-model="to" type="date" />
      <UButton size="xs" :loading="pending" @click="refresh">{{ t('app.refresh') }}</UButton>
    </div>

    <div v-if="!data?.length" class="text-sm text-gray-500">{{ t('aggregates.empty') }}</div>
    <div v-else class="space-y-2">
      <div v-for="point in data" :key="`${point.period}-${point.key}`" class="flex items-center justify-between rounded-lg border border-slate-200 p-2 text-sm">
        <span>{{ point.key }}</span>
        <span class="font-mono">{{ point.counters.offers }} / {{ point.counters.applications }}</span>
      </div>
    </div>
  </div>
</template>
