<template>
  <div class="footer">
    <b-container>
      <b-row>
        <b-col md="6" class="mb-2 mb-md-0">
          <nuxt-link
            :to="
              localePath({
                name: 'legal-notices'
              })
            "
          >
            {{ $t('links.legalNotices') }}
          </nuxt-link>
          <div class="footer__lang-switcher">
            <nuxt-link
              v-for="locale in availableLocales"
              :key="locale.code"
              :to="switchLocalePath(locale.code)"
            >
              <img
                :src="getLocaleSvgFlag(locale.code)"
                :alt="`${$t('miscellaneous.localeFlag')} ${locale.name}`"
                :title="`${$t('miscellaneous.changeLocale', locale.code)} ${
                  locale.name
                }`"
              />
            </nuxt-link>
          </div>
        </b-col>
        <b-col md="6" class="text-center text-md-right">
          {{ $t('miscellaneous.developpedWithLoveBy') }}
          <a href="https://www.kevinpainchaud.fr" target="_blank">
            Kévin Painchaud
          </a>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getLocaleSvgFlag } from '~/utils/flag'

@Component
export default class Footer extends Vue {
  private created() {
    console.log(this.$t('miscellaneous.changeLocale', 'en'))
  }

  private get availableLocales() {
    return (this.$i18n.locales as { code: string; name: string }[]).filter(
      (locale) => locale.code !== this.$i18n.locale
    )
  }

  private getLocaleSvgFlag(locale: string) {
    return getLocaleSvgFlag(locale)
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.footer {
  border-top: 1px solid rgba(#fff, 0.15);
  padding: 15px 0;

  @include media-breakpoint-up(md) {
    padding: 25px 0;
  }

  @include media-breakpoint-up(xl) {
    padding: 40px 0;
  }

  .row > div:first-child {
    display: flex;
    margin: -15px;

    @include media-breakpoint-down(sm) {
      justify-content: center;
    }

    > * {
      margin: 15px;
    }
  }

  &__lang-switcher {
    > a img {
      height: 24px;
      width: 24px;
    }
  }
}
</style>
