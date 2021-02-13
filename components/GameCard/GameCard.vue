<template>
  <div v-if="game" class="game-card">
    <nuxt-link
      ref="gameCardInner"
      :to="{
        name: 'game-id',
        params: { id: `${gameData.id}` }
      }"
      class="game-card__inner"
    >
      <div
        class="game-card__team"
        :style="`background-color: ${gameData.team1.colors.secondary};`"
      >
        <img v-if="gameData.team1.logo" :src="gameData.team1.logo" />
      </div>
      <div
        class="game-card__team"
        :style="`background-color: ${gameData.team2.colors.secondary};`"
      >
        <img v-if="gameData.team2.logo" :src="gameData.team2.logo" />
      </div>
      <div class="game-card__vs">
        {{ $t('game.vs') }}
      </div>
    </nuxt-link>

    <div class="game-card__footer">
      {{ $t('miscellaneous.thereIs') }} {{ humanizedDate }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IGame } from '~/types/game'

@Component
export default class GameCard extends Vue {
  @Prop({ type: Object, required: true })
  private game!: IGame

  private gameData!: IGame

  public $refs!: {
    gameCardInner: any
  }

  private get humanizedDate() {
    return formatDistanceToNow(this.game.publishedAt, { locale: fr })
  }

  @Watch('game', { immediate: true })
  private onGameChanged() {
    this.gameData = this.game
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.game-card {
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
