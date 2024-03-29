import settings from './settings.json'
import frLocales from './locales/fr.json'

export default {
  ssr: true,
  /*
   ** Headers of the page
   */
  head: {
    title: `${frLocales.global.websiteName} - ${frLocales.global.shortDescription}`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: frLocales.global.description },
      { property: 'og:title', content: frLocales.global.websiteName },
      { property: 'og:description', content: frLocales.global.description },
      {
        property: 'og:image',
        content: `${settings.websiteUrl}/og-image.jpg`
      }
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        href: '/app-icon.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: '/app-icon-152x152.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '167x167',
        href: '/app-icon-167x167.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/app-icon-180x180.png'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/styles/_custom-bootstrap.scss',
    '~/assets/styles/_global.scss',
    '~/assets/styles/_animations.scss',
    '~/assets/styles/_page-content.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/youtube.js', '~/plugins/focus-visible.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/analytics-module
    [
      '@nuxtjs/google-analytics',
      {
        id: settings.googleAnalytics.id
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/svg-module
    '@nuxtjs/svg',
    'nuxt-i18n'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Extend webpack config here
     */
    extend(config) {
      // HTML loader
      config.module.rules.push({
        test: /\.html$/,
        loader: 'html-loader'
      })
    },
    babel: { compact: true }
  },
  /**
   * Disable automatic inclusion
   * of Bootstrap and BootstrapVue pre-compiled CSS files
   */
  bootstrapVue: {
    css: false,
    bvCSS: false,
    icons: false,
    componentPlugins: ['ButtonPlugin', 'LayoutPlugin']
  },
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English'
      },
      {
        code: 'fr',
        name: 'Français'
      }
    ],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        fr: require('./locales/fr.json'),
        en: require('./locales/en.json')
      }
    }
  }
}
