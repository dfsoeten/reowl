<template>
  <div class="twitter-card">
    <div>
      <div class="twitter-card__icon">
        <TwitterIcon />
      </div>
    </div>
    <div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="twitter-card__body" v-html="$t('twitterCard.body')"></div>
      <div class="twitter-card__footer">
        <div>
          {{ $t('twitterCard.footer') }}
        </div>
        <b-button
          href="https://twitter.com/reowl_app"
          target="_blank"
          pill
          variant="light"
        >
          @reowl_app
        </b-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TwitterIcon from '~/assets/images/icons/twitter.svg?inline'

@Component({ components: { TwitterIcon } })
export default class TwitterCard extends Vue {}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.twitter-card {
  align-items: center;
  background-color: $gray-800;
  border-radius: 24px;
  display: flex;
  padding: 25px 30px;

  @include media-breakpoint-down(sm) {
    font-size: 14px;
  }

  > * {
    &:not(:last-child) {
      margin-right: 25px;
    }

    &:nth-child(1) {
      @include media-breakpoint-down(sm) {
        display: none;
      }
    }

    &:nth-child(2) {
      > *:not(:last-child) {
        margin-bottom: 15px;
      }
    }
  }

  &__footer {
    align-items: center;
    display: flex;

    > *:not(:last-child) {
      margin-right: 15px;
    }
  }

  &__icon {
    align-items: center;
    border: 3px solid #fff;
    border-radius: 500px;
    display: flex;
    height: 86px;
    justify-content: center;
    min-width: 86px;
    width: 86px;

    > svg {
      display: block;
      min-width: 60%;
      width: 60%;

      path {
        fill: #fff;
      }
    }
  }
}
</style>
