export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
  ],

  devtools: { enabled: true },

  app: {
    baseURL: '/holoflipper/',
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'HoloFlipper',

      /**
       * Метатеги, фавиконки и т.п
       * Для генерации фавиконок - https://realfavicongenerator.net/
       */
      meta: [
        {
          charset: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'title',
          content: 'HoloFlipper',
        },
        {
          name: 'description',
          content: 'HoloFlipper description',
        },
        {
          name: 'author',
          content: 'Mertan',
        },
        {
          name: 'msapplication-TileColor',
          content: '#e7609e',
        },
        {
          name: 'theme-color',
          content: '#ffffff',
        },
      ],
      link: [
        /* Favicons */
        { rel: 'icon', type: 'image/x-icon', href: '/holoflipper/favicons/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/holoflipper/favicons/favicon-96x96.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/holoflipper/favicons/web-app-manifest-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/holoflipper/favicons/web-app-manifest-512x512.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/holoflipper/favicons/apple-touch-icon.png' },
        { rel: 'manifest', href: '/holoflipper/favicons/site.webmanifest' },
      ],
    },
  },

  css: [
    '~/assets/scss/vendors.scss',
    '~/assets/scss/common.scss',
  ],

  compatibilityDate: '2025-03-09',

  /* Миксины и переменные доступны во всех компонентах и во всех scss файлах */
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/shared.scss" as *;',
        },
      },
    },

    /* Настройки для обработки .vue-файлов с TypeScript */
    vue: {
      script: {
        defineModel: true, // Поддержка defineModel для TS
        propsDestructure: true, // Поддержка деструктуризации пропсов
      },
    },

    /* Оптимизация обработки TypeScript */
    esbuild: {
      target: 'esnext', // Устанавливаем цель для TS
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true, // Если используем декораторы
        },
      },
    },
  },

  /* Добавляем настройки TypeScript */
  typescript: {
    strict: true,
    shim: false,
    typeCheck: true,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
