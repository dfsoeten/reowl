<template>
  <div class="game-feed">
    <h3 v-if="title" class="game-feed__title">
      {{ title }}
    </h3>
    <b-row class="game-feed__content">
      <b-col v-for="game in games" :key="game.id" xs="12" sm="6" lg="12">
        <GameCard :game="game" />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GameCard from '~/components/GameCard/GameCard.vue'
import { IGame } from '~/types/game'

@Component({ components: { GameCard } })
export default class GameFeed extends Vue {
  @Prop({ type: String })
  private title!: string

  @Prop({ type: Array, required: true })
  private games!: IGame[]
}
</script>

<style lang="scss" scoped>
.game-feed {
  &__title {
    color: #fff;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.25em;
    margin-bottom: 20px;
  }

  &__content {
    > *:not(:last-child) {
      margin-bottom: 20px;
    }
  }
}
</style>
