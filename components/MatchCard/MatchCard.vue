<template>
  <div v-if="match" class="match-card">
    <nuxt-link
      ref="matchCardInner"
      :to="{
        name: 'match-id',
        params: { id: `${matchData.id}` }
      }"
      :title="`${matchData.team1.name} ${$t('match.vs')} ${
        matchData.team2.name
      }`"
      class="match-card__inner"
    >
      <div
        class="match-card__team"
        :style="`background-color: ${matchData.team1.colors.secondary};`"
      >
        <img v-if="matchData.team1.logo" :src="matchData.team1.logo" />
      </div>
      <div
        class="match-card__team"
        :style="`background-color: ${matchData.team2.colors.secondary};`"
      >
        <img v-if="matchData.team2.logo" :src="matchData.team2.logo" />
      </div>
      <div class="match-card__vs">
        {{ $t('match.vs') }}
      </div>
    </nuxt-link>

    <div class="match-card__footer">
      {{ $t('miscellaneous.thereIs') }} {{ humanizedDate }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Match } from '~/types/match'

@Component
export default class MatchCard extends Vue {
  @Prop({ type: Object, required: true })
  private match!: Match

  private matchData!: Match

  public $refs!: {
    matchCardInner: any
  }

  private get humanizedDate() {
    return formatDistanceToNow(this.match.publishedAt, { locale: fr })
  }

  @Watch('match', { immediate: true })
  private onMatchChanged() {
    this.matchData = this.match
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.match-card {
  $self: &;

  > a {
    // Aspect ratio
    &:after {
      content: '';
      padding-bottom: 62%;
    }
  }

  &__inner {
    border-radius: 8%/13%;
    box-shadow: 0 0 20px 0 rgba(#000, 0.3);
    display: flex;
    overflow: hidden;
    position: relative;
    transition: box-shadow $transition-duration, transform $transition-duration;

    @media (hover: hover) {
      &:hover {
        box-shadow: 0 0 20px 5px rgba(#000, 0.6);
        transform: scale(1.05);
      }
    }
  }

  &__team {
    align-items: center;
    display: flex;
    flex: 50%;
    justify-content: center;
    padding: 15px 30px;

    > img {
      max-width: 100%;
    }
  }

  &__vs {
    background-color: #fff;
    border-radius: 100px;
    color: $gray-900;
    font-size: 17px;
    font-weight: 700;
    padding: 5px 10px;
    left: 50%;
    line-height: 1em;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &__footer {
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    margin-top: 8px;

    @include media-breakpoint-up(md) {
      margin-top: 10px;
    }
  }

  &[lg] {
    #{$self}__footer {
      @include media-breakpoint-up(xl) {
        margin-top: 15px;
        font-size: 17px;
      }
    }
  }
}
</style>
