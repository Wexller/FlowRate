export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/i18n'],
  ui: {
    fonts: false
  },
  css: ['~/assets/css/main.css'],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'ru', file: 'ru.json' }
    ],
    defaultLocale: 'ru',
    lazy: true,
    langDir: 'locales'
  }
})
