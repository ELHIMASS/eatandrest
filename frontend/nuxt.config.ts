// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Nuxt Modules
  modules: ['@pinia/nuxt'],

  // Dev server settings
  devServer: {
    port: 5173
  },

  // Global CSS
  css: ['~/assets/css/main.css'],

  // App configurations
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Eat and Rest — Réservations Gastronomiques',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Réservez en ligne dans les meilleurs restaurants de Lyon.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // TypeScript configurations
  typescript: {
    strict: true
  }
})
