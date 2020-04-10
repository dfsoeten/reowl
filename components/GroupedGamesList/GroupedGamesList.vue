<template>
  <div class="game-list">
    <template v-for="(gameGroup, index) in groupedGames">
      <div
        v-if="gameGroup.length > 0"
        :key="index"
        class="game-list__game-group"
      >
        <h3 class="game-list__game-group-title">
          {{ $t(`groupedGames.${index}`) }}
        </h3>
        <div class="game-list__game-group-content">
          <b-row>
            <b-col v-for="game in gameGroup" :key="game.id" sm="6" lg="4">
              <GameCard :game="game" lg />
            </b-col>
          </b-row>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { IGame } from '~/types/game'
import GameCard from '~/components/GameCard/GameCard.vue'
import { groupGames } from '~/helpers/game'

@Component({ components: { GameCard } })
export default class GroupedGamesList extends Vue {
  @Prop({ type: Array, required: true })
  private games!: IGame[]

  private gamesData!: IGame[]

  private get groupedGames() {
    return this.gamesData ? groupGames(this.gamesData) : null
  }

  @Watch('games', { immediate: true })
  private ongamesChanged() {
    this.gamesData = this.games
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.game-list {
  &__game-group {
    &-title {
      color: #fff;
      font-size: 20px;
      font-weight: 700;

      @include media-breakpoint-up(md) {
        font-size: 22px;
      }

      @include media-breakpoint-up(xl) {
        font-size: 26px;
      }
    }

    &-content {
      margin-top: 15px;

      @include media-breakpoint-up(md) {
        margin-top: 20px;
      }

      @include media-breakpoint-up(xl) {
        margin-top: 30px;
      }

      .row {
        margin-bottom: -10px;

        @include media-breakpoint-up(md) {
          margin-bottom: -25px;
        }

        @include media-breakpoint-up(xl) {
          margin-bottom: -35px;
        }

        > * {
          margin-bottom: 15px;

          @include media-breakpoint-up(md) {
            margin-bottom: 25px;
          }

          @include media-breakpoint-up(xl) {
            margin-bottom: 35px;
          }
        }
      }
    }

    &:not(:last-child) {
      margin-bottom: 25px;

      @include media-breakpoint-up(md) {
        margin-bottom: 35px;
      }

      @include media-breakpoint-up(xl) {
        margin-bottom: 50px;
      }
    }
  }
}
</style>
