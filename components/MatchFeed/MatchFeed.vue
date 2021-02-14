<template>
  <div class="match-feed">
    <h3 v-if="title" class="match-feed__title">
      {{ title }}
    </h3>
    <b-row class="match-feed__content">
      <b-col
        v-for="match in matches"
        :key="`${match.cast}_${match.id}`"
        xs="12"
        sm="6"
        lg="12"
      >
        <MatchCard :match="match" />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import MatchCard from '~/components/MatchCard/MatchCard.vue'
import { Match } from '~/types/match'

@Component({ components: { MatchCard } })
export default class MatchFeed extends Vue {
  @Prop({ type: String })
  private title!: string

  @Prop({ type: Array, required: true })
  private matches!: Match[]
}
</script>

<style lang="scss" scoped>
.match-feed {
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
