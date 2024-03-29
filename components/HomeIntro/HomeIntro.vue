<template>
  <div class="home-intro">
    <h1 class="home-intro__title">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="descriptionPart1"></span>
      <button>
        <span>{{ $t('homeIntro.spoilerFree') }}</span>
        <HelpIcon />
        <div class="home-intro__spoiler-free-tooltip">
          {{ $t('homeIntro.spoilerFreeHelp') }}
        </div>
      </button>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="descriptionPart2"></span>
    </h1>
    <div class="home-intro__alerts">
      <div class="home-intro__alert home-intro__alert--no-hover">
        <div>
          <HelpIcon />
        </div>
        <div>{{ $t('homeIntro.spoilerFreeHelp') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import HelpIcon from '~/assets/images/icons/help.svg?inline'

@Component({ components: { HelpIcon } })
export default class HomeIntro extends Vue {
  private get descriptionPart1() {
    return (this.$t('homeIntro.description') as string).split(
      '[SPOILER-FREE]'
    )[0]
  }

  private get descriptionPart2() {
    return (this.$t('homeIntro.description') as string).split(
      '[SPOILER-FREE]'
    )[1]
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.home-intro {
  $self: &;

  &__title {
    color: #fff;
    font-size: 30px;
    font-weight: 800;
    line-height: 1.35em;
    margin: 0 auto;
    padding: 45px 0 35px 0;
    text-align: center;

    @include media-breakpoint-up(md) {
      font-size: 45px;
      padding: 80px 0;
    }

    @include media-breakpoint-up(xl) {
      font-size: 63px;
      max-width: 1280px;
      padding: 90px 0;
    }

    > button {
      align-items: center;
      background-color: transparent;
      border: 0;
      color: inherit;
      cursor: help;
      font-weight: inherit;
      display: inline-flex;
      padding: 0;
      position: relative;
      text-decoration: underline;

      > svg {
        display: none;
        height: 24px;
        margin-left: 5px;
        min-width: 24px;
        width: 24px;

        @include media-breakpoint-up(md) {
          height: 32px;
          margin-left: 8px;
          min-width: 32px;
          width: 32px;
        }

        @include media-breakpoint-up(xl) {
          height: 42px;
          margin-left: 10px;
          min-width: 42px;
          width: 42px;
        }

        path {
          fill: #fff;
        }

        @media (hover: hover) {
          display: block;
        }
      }

      #{$self}__spoiler-free-tooltip {
        border-radius: 12px;
        background-color: #fff;
        color: $gray-900;
        display: none;
        font-size: 15px;
        font-weight: 500;
        line-height: 1.35em;
        left: 0;
        padding: 15px 25px;
        position: absolute;
        top: 0;
        transform: translateY(-100%);

        &:after {
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid #fff;
          content: '';
          bottom: 1px;
          height: 0;
          left: 50%;
          position: absolute;
          transform: translate(-50%, 100%);
          width: 0;
        }
      }

      @media (hover: hover) {
        &:hover,
        &:focus {
          #{$self}__spoiler-free-tooltip {
            display: block;
          }
        }
      }
    }
  }

  &__alerts {
    align-items: center;
    display: flex;
    flex-direction: column;

    > * {
      margin-bottom: 20px;
      max-width: 500px;

      @include media-breakpoint-up(sm) {
        margin-bottom: 35px;
      }
    }
  }

  &__alert {
    align-items: center;
    border-radius: 12px;
    display: flex;
    font-size: 14px;

    @include media-breakpoint-up(md) {
      font-size: 16px;
    }

    > div {
      &:nth-child(1) {
        margin-right: 15px;

        > svg {
          height: 32px;
          min-width: 32px;
          width: 32px;

          path {
            fill: #fff;
          }
        }
      }
    }

    &--no-hover {
      @media (hover: hover) {
        display: none;
      }
    }
  }
}
</style>
