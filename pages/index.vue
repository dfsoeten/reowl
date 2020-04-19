<template>
  <div class="page-content pt-0" :class="{ 'pb-0': !games }">
    <b-container>
      <b-row>
        <b-col>
          <HomeIntro />
          <GroupedGamesList v-if="games" :games="games" />
          <SeeMoreOnYoutube v-if="games" class="see-more-on-youtube" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { IGame } from '~/types/game'
import { Game } from '~/services/game'
import HomeIntro from '~/components/HomeIntro/HomeIntro.vue'
import GroupedGamesList from '~/components/GroupedGamesList/GroupedGamesList.vue'
import SeeMoreOnYoutube from '~/components/SeeMoreOnYoutube/SeeMoreOnYoutube.vue'

@Component({
  head() {
    return {
      title: ((this.$t('global.websiteName') as string) +
        ' - ' +
        this.$t('game.theLatestGames')) as string,
      meta: [
        {
          name: 'description',
          content: this.$t('global.description') as string
        }
      ]
    }
  },
  async asyncData(context) {
    const games: IGame[] | null = await Game.getLatestGames(context.app.$axios)

    return { games }
  },
  components: { HomeIntro, GroupedGamesList, SeeMoreOnYoutube }
})
export default class IndexPage extends Vue {}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.see-more-on-youtube {
  margin: 20px 0 5px 0;

  @include media-breakpoint-up(md) {
    margin-top: 30px;
  }

  @include media-breakpoint-up(xl) {
    margin: 55px 0 25px 0;
  }
}
</style>
