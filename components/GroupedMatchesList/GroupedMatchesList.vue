<template>
  <div class="match-list">
    <template v-for="(matchGroup, index) in groupedMatches">
      <div
        v-if="matchGroup.length > 0"
        :key="index"
        class="match-list__match-group"
      >
        <h3 class="match-list__match-group-title">
          {{ $t(`groupedMatches.${index}`) }}
        </h3>
        <div class="match-list__match-group-content">
          <b-row>
            <b-col v-for="match in matchGroup" :key="match.id" sm="6" lg="4">
              <MatchCard :match="match" lg />
            </b-col>
          </b-row>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Match } from '~/types/match'
import MatchCard from '~/components/MatchCard/MatchCard.vue'
import { groupMatches } from '~/helpers/match'

@Component({ components: { MatchCard } })
export default class GroupedMatchesList extends Vue {
  @Prop({ type: Array, required: true })
  private matches!: Match[]

  private matchesData!: Match[]

  private get groupedMatches() {
    return this.matchesData ? groupMatches(this.matchesData) : null
  }

  @Watch('matches', { immediate: true })
  private onmatchesChanged() {
    this.matchesData = this.matches
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.match-list {
  &__match-group {
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
