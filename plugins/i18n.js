import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export const i18nConfiguration = new VueI18n({
  locale: 'fr',
  messages: {
    fr: require('~/locales/fr.json')
  }
})

export default ({ app }) => (app.i18n = i18nConfiguration)
