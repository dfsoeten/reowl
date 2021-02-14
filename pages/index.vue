<template>
  <div class="page-content pt-0" :class="{ 'pb-0': !matches }">
    <b-container>
      <b-row>
        <b-col>
          <HomeIntro />
          <GroupedMatchesList
            v-if="matches.length > 0 || loading"
            :matches="matches"
          />
          <div v-else class="pb-5 text-center">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p v-html="$t('error.matchesNotFound')"></p>
            <b-button
              href="https://twitter.com/reowl_fr"
              target="_blank"
              pill
              variant="light"
            >
              @reowl_fr
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Match } from '~/types/match'
import { MatchService } from '~/services/match'
import HomeIntro from '~/components/HomeIntro/HomeIntro.vue'
import GroupedMatchesList from '~/components/GroupedMatchesList/GroupedMatchesList.vue'

@Component({
  head() {
    return {
      title: ((this.$t('global.websiteName') as string) +
        ' - ' +
        this.$t('global.shortDescription')) as string,
      meta: [
        {
          name: 'description',
          content: this.$t('global.description') as string
        }
      ]
    }
  },
  components: { HomeIntro, GroupedMatchesList }
})
export default class IndexPage extends Vue {
  public matches: Match[] = []

  public loading = true

  async created() {
    try {
      this.matches = await MatchService.getLatestMatches(this.$axios, 24)
    } catch (error) {}

    this.loading = false
  }
}
</script>
