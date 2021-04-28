<template>
  <div class="navbar">
    <b-container>
      <b-row class="text-center">
        <b-col>
          <nuxt-link
            :to="
              localePath({
                name: 'index'
              })
            "
          >
            <img
              src="~/assets/images/logos/reowl-white.svg"
              :title="$route.name !== 'index' ? $t('links.backToHome') : ''"
              :alt="`${$t('miscellaneous.logo')} ${$t('global.websiteName')}`"
              class="navbar__logo"
            />
          </nuxt-link>
          <div class="navbar__welcome-back">
            {{ $t('navbar.welcomeBack') }}
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Navbar extends Vue {}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.navbar {
  border-bottom: 1px solid rgba(#fff, 0.15);
  padding: 15px 0;

  @include media-breakpoint-up(md) {
    padding: 25px 0;
  }

  &__logo {
    transition: transform $transition-duration;
    height: 29px;
    width: 100px;

    @include media-breakpoint-up(md) {
      height: 41px;
      width: 140px;
    }

    @include media-breakpoint-up(xl) {
      height: 52px;
      width: 180px;
    }

    @media (hover: hover) {
      &:hover {
        transform: scale(1.05);
      }
    }
  }

  &__welcome-back {
    margin-top: 5px;

    @include media-breakpoint-up(md) {
      margin-top: 10px;
    }
  }
}
</style>
