<script setup lang="ts">
import { COUNTER_KEYS } from '~~/shared/constants/dashboard'
import { toPercentage } from '~~/shared/utils/number'
import type { DashboardState } from '~~/shared/schemas/dashboard'

const props = defineProps<{
  state: DashboardState | null
}>()

const { t, locale } = useI18n()

const localeCode = computed(() => (locale.value === 'ru' ? 'ru-RU' : 'en-US'))

const counterItems = computed(() => COUNTER_KEYS.map((key) => ({
  key,
  label: t(`counters.${key}`),
  value: props.state?.counters[key] ?? 0
})))

const conversionItems = computed(() => {
  const base = props.state?.counters.applications ?? 0

  return [
    {
      key: 'replies',
      step: 1,
      label: t('counters.replies'),
      value: props.state?.counters.replies ?? 0,
      rate: props.state?.conversions.replyRate ?? 0,
      base
    },
    {
      key: 'interviews',
      step: 2,
      label: t('counters.interviews'),
      value: props.state?.counters.interviews ?? 0,
      rate: props.state?.conversions.interviewRate ?? 0,
      base
    },
    {
      key: 'offers',
      step: 3,
      label: t('counters.offers'),
      value: props.state?.counters.offers ?? 0,
      rate: props.state?.conversions.offerRate ?? 0,
      base
    }
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
    return t('mockup.justNow')
  }

  if (diffMinutes < 60) {
    return t('mockup.minutesAgo', { count: diffMinutes })
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return t('mockup.hoursAgo', { count: diffHours })
  }

  const diffDays = Math.round(diffHours / 24)
  return t('mockup.daysAgo', { count: diffDays })
})

function progressWidth(rate: number, base: number) {
  if (!base) {
    return '0%'
  }

  return `${Math.max(0, Math.min(100, toPercentage(rate)))}%`
}
</script>

<template>
  <section class="mockup-showcase" :aria-label="t('mockup.sectionAria')">
    <div class="mockup-showcase__canvas">
      <div class="mockup-showcase__watercolor mockup-showcase__watercolor--left" aria-hidden="true" />
      <div class="mockup-showcase__watercolor mockup-showcase__watercolor--right" aria-hidden="true" />

      <div class="mockup-showcase__grid">
        <div class="mockup-showcase__item mockup-showcase__item--square">
          <article class="mockup-card mockup-card--square">
            <header class="mockup-card__header mockup-card__header--square">
              <div>
                <div class="mockup-card__brand-row">
                  <svg class="mockup-card__logo" viewBox="0 0 58 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M4 8C14 2 25 2 36 8C43 12 49 12 54 10" />
                    <path d="M4 18C14 12 25 12 36 18C43 22 49 22 54 20" />
                    <path d="M4 28C14 22 25 22 36 28C43 32 49 32 54 30" />
                  </svg>
                  <h2 class="mockup-card__brand">FlowRate</h2>
                </div>
                <p class="mockup-card__subtitle">{{ t('snapshot.subtitle') }}</p>
              </div>

              <p class="mockup-card__meta mockup-card__meta--inline">
                <span class="mockup-card__meta-dot" />
                <span>{{ t('app.updated') }} {{ updatedMeta }}</span>
              </p>
            </header>

            <div class="mockup-card__counter-grid">
              <article
                v-for="item in counterItems"
                :key="`square-${item.key}`"
                class="mockup-counter"
                :class="`mockup-counter--${item.key}`"
              >
                <div class="mockup-counter__icon">
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

                <div class="mockup-counter__copy">
                  <p class="mockup-counter__label">{{ item.label }}</p>
                  <p class="mockup-counter__value">{{ item.value }}</p>
                </div>
              </article>
            </div>

            <div class="mockup-card__metrics mockup-card__metrics--stack">
              <article
                v-for="item in conversionItems"
                :key="`square-metric-${item.key}`"
                class="mockup-metric mockup-metric--row"
                :class="`mockup-metric--${item.key}`"
              >
                <div class="mockup-metric__head">
                  <div class="mockup-metric__title">
                    <span class="mockup-metric__step">{{ item.step }}</span>
                    <span>{{ item.label }}</span>
                  </div>
                  <span class="mockup-metric__percent">{{ toPercentage(item.rate) }}%</span>
                  <span class="mockup-metric__ratio">{{ item.value }}/{{ item.base }}</span>
                </div>
                <div class="mockup-metric__track">
                  <div class="mockup-metric__fill" :style="{ width: progressWidth(item.rate, item.base) }" />
                </div>
              </article>
            </div>
          </article>

          <p class="mockup-showcase__caption">{{ t('mockup.squareCaption') }}</p>
        </div>

        <div class="mockup-showcase__item mockup-showcase__item--rectangle">
          <article class="mockup-card mockup-card--rectangle">
            <header class="mockup-card__header mockup-card__header--rectangle">
              <div class="mockup-card__brand-block">
                <div class="mockup-card__brand-row">
                  <svg class="mockup-card__logo" viewBox="0 0 58 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M4 8C14 2 25 2 36 8C43 12 49 12 54 10" />
                    <path d="M4 18C14 12 25 12 36 18C43 22 49 22 54 20" />
                    <path d="M4 28C14 22 25 22 36 28C43 32 49 32 54 30" />
                  </svg>
                  <h2 class="mockup-card__brand">FlowRate</h2>
                </div>

                <div class="mockup-card__meta-row">
                  <span class="mockup-card__meta-group">{{ dateLabel }}</span>
                  <span class="mockup-card__meta-bullet">•</span>
                  <span class="mockup-card__meta-group">
                    <span class="mockup-card__meta-dot" />
                    <span>{{ t('app.updated') }} {{ updatedMeta }}</span>
                  </span>
                </div>
              </div>
            </header>

            <div class="mockup-card__rectangle-body">
              <div class="mockup-card__sidebar">
                <article
                  v-for="item in counterItems"
                  :key="`rectangle-${item.key}`"
                  class="mockup-sidebar-row"
                  :class="`mockup-sidebar-row--${item.key}`"
                >
                  <div class="mockup-sidebar-row__main">
                    <div class="mockup-counter__icon mockup-counter__icon--compact">
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

                    <span class="mockup-sidebar-row__label">{{ item.label }}</span>
                  </div>
                  <span class="mockup-sidebar-row__value">{{ item.value }}</span>
                </article>
              </div>

              <div class="mockup-card__story">
                <div class="mockup-card__flow">
                  <template v-for="(item, index) in counterItems" :key="`flow-${item.key}`">
                    <div class="mockup-stage">
                      <div class="mockup-stage__node" :class="`mockup-stage__node--${item.key}`">{{ item.value }}</div>
                      <p class="mockup-stage__label">{{ item.label }}</p>
                    </div>
                    <span v-if="index < counterItems.length - 1" class="mockup-stage__arrow" aria-hidden="true">→</span>
                  </template>
                </div>

                <div class="mockup-card__divider" />

                <div class="mockup-card__section-title">{{ t('snapshot.conversionLabel') }}</div>

                <div class="mockup-card__metrics mockup-card__metrics--row">
                  <article
                    v-for="item in conversionItems"
                    :key="`rectangle-metric-${item.key}`"
                    class="mockup-metric mockup-metric--card"
                    :class="`mockup-metric--${item.key}`"
                  >
                    <div class="mockup-metric__title">
                      <span class="mockup-metric__step">{{ item.step }}</span>
                      <span>{{ item.label }}</span>
                    </div>
                    <p class="mockup-metric__hero">{{ toPercentage(item.rate) }}%</p>
                    <p class="mockup-metric__ratio mockup-metric__ratio--centered">{{ item.value }}/{{ item.base }}</p>
                    <div class="mockup-metric__track">
                      <div class="mockup-metric__fill" :style="{ width: progressWidth(item.rate, item.base) }" />
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </article>

          <p class="mockup-showcase__caption">{{ t('mockup.rectangleCaption') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mockup-showcase {
  position: relative;
}

.mockup-showcase__canvas {
  position: relative;
  overflow: hidden;
  border-radius: 40px;
  padding: 48px 34px 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(246, 250, 253, 0.96)),
    radial-gradient(circle at 10% 8%, rgba(198, 224, 243, 0.32), transparent 24%),
    radial-gradient(circle at 88% 90%, rgba(84, 184, 255, 0.18), transparent 28%);
  border: 1px solid rgba(214, 228, 239, 0.9);
}

.mockup-showcase__watercolor {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(2px);
}

.mockup-showcase__watercolor--left {
  inset: 12px auto auto -120px;
  width: 420px;
  height: 280px;
  background:
    radial-gradient(circle at 60% 50%, rgba(220, 233, 244, 0.75), rgba(220, 233, 244, 0) 72%),
    radial-gradient(circle at 35% 42%, rgba(198, 222, 240, 0.38), rgba(198, 222, 240, 0) 68%);
}

.mockup-showcase__watercolor--right {
  inset: auto -110px -135px auto;
  width: 520px;
  height: 340px;
  background:
    radial-gradient(circle at 40% 40%, rgba(140, 205, 255, 0.55), rgba(140, 205, 255, 0) 72%),
    radial-gradient(circle at 58% 55%, rgba(197, 226, 246, 0.72), rgba(197, 226, 246, 0) 68%);
}

.mockup-showcase__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(320px, 0.78fr) minmax(0, 1.42fr);
  gap: 36px;
  align-items: start;
}

.mockup-showcase__item {
  display: grid;
  gap: 20px;
}

.mockup-showcase__item--square {
  align-self: center;
  padding-top: 32px;
}

.mockup-showcase__caption {
  margin: 0;
  text-align: center;
  font-size: 0.95rem;
  color: #47637d;
}

.mockup-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(252, 253, 255, 0.96));
  border: 1px solid rgba(221, 230, 238, 0.95);
  box-shadow:
    0 24px 48px rgba(27, 61, 93, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.mockup-card::before {
  content: '';
  position: absolute;
  inset: -16% auto auto 18%;
  width: 58%;
  height: 42%;
  background: radial-gradient(circle, rgba(255, 246, 238, 0.7), rgba(255, 246, 238, 0) 72%);
  pointer-events: none;
}

.mockup-card--square {
  padding: 34px 28px 26px;
  border-radius: 30px;
  aspect-ratio: 1 / 1;
}

.mockup-card--rectangle {
  padding: 34px 38px 28px;
  border-radius: 30px;
  aspect-ratio: 16 / 9;
}

.mockup-card__header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 18px;
}

.mockup-card__header--square {
  align-items: flex-start;
}

.mockup-card__brand-block {
  display: grid;
  gap: 10px;
}

.mockup-card__brand-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mockup-card__logo {
  width: 44px;
  height: 28px;
  stroke: #2f9be8;
  stroke-width: 3.1;
  stroke-linecap: round;
}

.mockup-card__brand {
  margin: 0;
  font-size: clamp(2rem, 1.3rem + 2vw, 3.2rem);
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: -0.055em;
  color: #102b59;
}

.mockup-card__subtitle {
  margin: 10px 0 0;
  font-size: 0.95rem;
  color: #5f758a;
}

.mockup-card__meta,
.mockup-card__meta-row {
  color: #63788e;
  font-size: 0.94rem;
}

.mockup-card__meta--inline,
.mockup-card__meta-group {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.mockup-card__meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.mockup-card__meta-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #2f9be8;
  box-shadow: 0 0 0 4px rgba(47, 155, 232, 0.12);
}

.mockup-card__meta-bullet {
  color: #8295a8;
}

.mockup-card__counter-grid {
  position: relative;
  z-index: 1;
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.mockup-counter {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 112px;
  padding: 18px 20px;
  border-radius: 18px;
  border: 1px solid rgba(220, 231, 240, 0.96);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 254, 0.96));
  box-shadow: 0 10px 22px rgba(20, 58, 88, 0.05);
}

.mockup-counter__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  border-radius: 18px;
  background: linear-gradient(180deg, #edf5ff, #dfeeff);
}

.mockup-counter__icon--compact {
  width: 46px;
  height: 46px;
  flex-basis: 46px;
  border-radius: 16px;
}

.mockup-counter__icon svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: #216fe0;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mockup-counter--replies .mockup-counter__icon,
.mockup-sidebar-row--replies .mockup-counter__icon {
  background: linear-gradient(180deg, #e6f8f6, #daf1ef);
}

.mockup-counter--replies .mockup-counter__icon svg,
.mockup-counter--offers .mockup-counter__icon svg,
.mockup-sidebar-row--replies .mockup-counter__icon svg,
.mockup-sidebar-row--offers .mockup-counter__icon svg {
  stroke: #1a9aa6;
}

.mockup-counter--offers .mockup-counter__icon,
.mockup-sidebar-row--offers .mockup-counter__icon {
  background: linear-gradient(180deg, #edf9f5, #dff1e9);
}

.mockup-counter__copy {
  display: grid;
  gap: 8px;
}

.mockup-counter__label {
  margin: 0;
  font-size: 0.96rem;
  color: #334f6f;
}

.mockup-counter__value {
  margin: 0;
  font-size: clamp(2rem, 1.6rem + 1.3vw, 3.3rem);
  line-height: 0.95;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #102a59;
}

.mockup-card__metrics {
  position: relative;
  z-index: 1;
}

.mockup-card__metrics--stack {
  margin-top: 20px;
  display: grid;
  gap: 16px;
  padding: 20px 18px 14px;
  border: 1px solid rgba(224, 233, 240, 0.96);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.85);
}

.mockup-metric--row {
  display: grid;
  gap: 12px;
}

.mockup-metric__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 12px;
  align-items: center;
}

.mockup-metric__title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #304d6e;
  font-size: 0.95rem;
}

.mockup-metric__step {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 0.92rem;
  font-weight: 700;
  background: #2178dc;
  box-shadow: 0 8px 18px rgba(33, 120, 220, 0.18);
}

.mockup-metric--interviews .mockup-metric__step,
.mockup-metric--offers .mockup-metric__step {
  background: #2aafb3;
  box-shadow: 0 8px 18px rgba(42, 175, 179, 0.18);
}

.mockup-metric__percent {
  color: #2178dc;
  font-size: clamp(1.45rem, 1.1rem + 1vw, 2.05rem);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.mockup-metric--interviews .mockup-metric__percent,
.mockup-metric--offers .mockup-metric__percent {
  color: #239da6;
}

.mockup-metric__ratio {
  color: #4f6580;
  font-size: 0.95rem;
}

.mockup-metric__ratio--centered {
  text-align: center;
  margin: 0;
}

.mockup-metric__track {
  position: relative;
  overflow: hidden;
  height: 10px;
  border-radius: 999px;
  background: #edf1f5;
}

.mockup-metric__fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1876e6, #2b8ef0);
}

.mockup-metric--interviews .mockup-metric__fill,
.mockup-metric--offers .mockup-metric__fill {
  background: linear-gradient(90deg, #1da6b0, #34c3be);
}

.mockup-card__rectangle-body {
  position: relative;
  z-index: 1;
  margin-top: 30px;
  display: grid;
  grid-template-columns: minmax(260px, 0.62fr) minmax(0, 1.38fr);
  gap: 28px;
  min-height: calc(100% - 118px);
}

.mockup-card__sidebar {
  display: grid;
  align-content: start;
  border-right: 1px solid #dfe8ef;
  padding-right: 28px;
}

.mockup-sidebar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 0;
}

.mockup-sidebar-row + .mockup-sidebar-row {
  border-top: 1px solid #e8eef3;
}

.mockup-sidebar-row__main {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.mockup-sidebar-row__label {
  color: #456079;
  font-size: 0.97rem;
}

.mockup-sidebar-row__value {
  font-size: clamp(2.1rem, 1.55rem + 1.4vw, 3.5rem);
  line-height: 0.92;
  font-weight: 700;
  letter-spacing: -0.05em;
  color: #102a59;
}

.mockup-card__story {
  display: grid;
  align-content: start;
  gap: 24px;
}

.mockup-card__flow {
  display: grid;
  grid-template-columns: repeat(7, auto);
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.mockup-stage {
  display: grid;
  justify-items: center;
  gap: 10px;
}

.mockup-stage__node {
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  border-radius: 999px;
  font-size: 2rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.05em;
  background: rgba(255, 255, 255, 0.92);
  color: #1f6fd6;
  border: 2px solid rgba(94, 151, 234, 0.62);
}

.mockup-stage__node--replies,
.mockup-stage__node--offers {
  color: #20979f;
  border-color: rgba(89, 193, 193, 0.68);
}

.mockup-stage__label {
  margin: 0;
  color: #334f6f;
  font-size: 0.94rem;
}

.mockup-stage__arrow {
  align-self: center;
  color: #7b8ea0;
  font-size: 2.25rem;
  line-height: 1;
}

.mockup-card__divider {
  height: 1px;
  background: #e2e9ef;
}

.mockup-card__section-title {
  color: #36577a;
  font-size: 0.98rem;
}

.mockup-card__metrics--row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.mockup-metric--card {
  display: grid;
  align-content: start;
  gap: 14px;
  min-height: 188px;
  padding: 18px 18px 16px;
  border-radius: 18px;
  border: 1px solid rgba(221, 231, 239, 0.96);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 254, 0.96));
}

.mockup-metric__hero {
  margin: 0;
  text-align: center;
  color: #2178dc;
  font-size: clamp(2rem, 1.6rem + 1vw, 2.9rem);
  line-height: 0.95;
  font-weight: 700;
  letter-spacing: -0.05em;
}

.mockup-metric--interviews .mockup-metric__hero,
.mockup-metric--offers .mockup-metric__hero {
  color: #239da6;
}

@media (max-width: 1280px) {
  .mockup-showcase__grid {
    grid-template-columns: 1fr;
  }

  .mockup-showcase__item--square {
    padding-top: 0;
  }
}

@media (max-width: 980px) {
  .mockup-card--rectangle {
    aspect-ratio: auto;
  }

  .mockup-card__rectangle-body {
    grid-template-columns: 1fr;
  }

  .mockup-card__sidebar {
    border-right: 0;
    border-bottom: 1px solid #dfe8ef;
    padding-right: 0;
    padding-bottom: 18px;
  }

  .mockup-card__flow,
  .mockup-card__metrics--row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 720px) {
  .mockup-showcase__canvas {
    padding: 24px 16px 18px;
    border-radius: 28px;
  }

  .mockup-card--square,
  .mockup-card--rectangle {
    padding: 22px 18px 20px;
    border-radius: 24px;
  }

  .mockup-card--square {
    aspect-ratio: auto;
  }

  .mockup-card__header,
  .mockup-card__meta-row,
  .mockup-metric__head {
    grid-template-columns: 1fr;
    display: grid;
  }

  .mockup-card__counter-grid,
  .mockup-card__metrics--row,
  .mockup-card__flow {
    grid-template-columns: 1fr;
  }

  .mockup-stage__arrow {
    transform: rotate(90deg);
    justify-self: center;
  }

  .mockup-counter {
    min-height: 96px;
  }
}
</style>
