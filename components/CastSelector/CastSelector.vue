<template>
  <div class="cast-selector">
    <ul v-if="casts">
      <li v-for="(cast, castIndex) in reorderedCasts" :key="castIndex">
        <span
          :class="{
            disabled: !cast.available,
            active: cast.slug === activeCastSlug
          }"
          @click="cast.available ? $emit('castSelected', cast) : null"
        >
          <img
            v-if="$i18n.locale === 'en'"
            :src="getSvgFlag(cast.slug)"
            :alt="`${$t('match.cast')} ${cast.slug.toUpperCase()}`"
          />
          <span>
            {{ $t('match.cast') }}
          </span>
          <img
            v-if="$i18n.locale !== 'en'"
            :src="getSvgFlag(cast.slug)"
            :alt="`${$t('match.cast')} ${cast.slug.toUpperCase()}`"
          />
          <span v-if="!cast.available" class="cast-selector__available-soon">
            ({{ $t('cast.availableSoon') }})
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Cast } from '~/types/cast'
import { getCastSvgFlag } from '~/utils/flag'

@Component
export default class CastSelector extends Vue {
  @Prop({ type: Array, required: true })
  private casts!: Cast[]

  @Prop({ type: String })
  private activeCastSlug!: string

  /**
   * Set locale related cast at first position
   */
  private get reorderedCasts() {
    const reorderedCasts = JSON.parse(JSON.stringify(this.casts))
    const localeRelatedCast = this.casts.find(
      (cast) => cast.slug === (this.$i18n.locale === 'fr' ? 'fr-fr' : 'en-us')
    )

    if (localeRelatedCast) {
      reorderedCasts.splice(this.casts.indexOf(localeRelatedCast), 1)
      reorderedCasts.unshift(localeRelatedCast)
    }

    return reorderedCasts
  }

  private getSvgFlag(castSlug: string) {
    return getCastSvgFlag(castSlug)
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/_variables.scss';

.cast-selector {
  $self: &;

  ul {
    display: flex;
    margin: -5px;
    padding: 0;

    @include media-breakpoint-up(sm) {
      margin: -10px;
    }

    li {
      list-style: none;
      margin: 5px;

      @include media-breakpoint-up(sm) {
        margin: 10px;
      }

      > span {
        align-items: center;
        border: 1px solid #fff;
        border-radius: 6px;
        display: flex;
        font-size: 14px;
        font-weight: 500;
        height: 100%;
        line-height: 1em;
        padding: 5px 10px;

        > *:not(:last-child) {
          margin-right: 8px;
        }

        img {
          height: 24px;
          width: 24px;
        }

        #{$self}__available-soon {
          font-size: 12px;
          position: relative;
          top: 1px;
        }

        &:not(.disabled) {
          cursor: pointer;
        }

        &.disabled {
          background-color: $gray-700;
          border-color: $gray-400;
          color: $gray-400;
          cursor: not-allowed;
        }

        &:not(.disabled):hover,
        &.active {
          background-color: #fff;
          color: $gray-900;
        }
      }
    }
  }
}
</style>
