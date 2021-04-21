import settings from './settings.json'
import frLocales from './locales/fr.json'

export default {
  target: "static",
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'icon',
        href: '/favicon.png',
        type: 'image/png'
      },
      {
        rel: 'icon',
        sizes: '64x64',
        href: '/favicon-64.png',
        type: 'image/png'
      },
      {
        rel: 'icon',
        sizes: '96x96',
        href: '/favicon-96.png',
        type: 'image/png'
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
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/youtube.js',
    '~/plugins/focus-visible.js'
  ],
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
    '@nuxtjs/svg'
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
  }
}
