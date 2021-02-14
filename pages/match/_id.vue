<template>
  <div
    class="match-page page-content"
    :class="{ 'sidebar-visible': sidebarVisible }"
  >
    <b-container>
      <b-row>
        <b-col sm="12" :lg="sidebarVisible ? 9 : 12" class="mb-4 mb-lg-0">
          <div v-if="match" class="match-page__main">
            <div class="match-page__header">
              <b-button
                :to="{
                  name: 'index'
                }"
                pill
                variant="outline-light"
                class="btn--icon"
              >
                <ArrowThinLeftIcon />
                <span>
                  {{ $t('miscellaneous.back') }}
                </span>
              </b-button>
              <div v-show="latestMatches.length > 0">
                <button
                  v-if="sidebarVisible"
                  :title="$t('miscellaneous.hide')"
                  class="match-page__btn-minimize-sidebar d-none d-lg-block"
                  @click="minimizeSidebar"
                >
                  <MinimizeIcon />
                </button>
                <button
                  v-else
                  :title="$t('miscellaneous.expand')"
                  class="match-page__btn-expand-sidebar d-none d-lg-block"
                  @click="expandSidebar"
                >
                  <MinimizeIcon />
                </button>
              </div>
            </div>
            <div class="match-page__subheader">
              <h1 class="match-page__title">
                {{ match.team1.name }} {{ $t('match.vs') }}
                {{ match.team2.name }}
              </h1>
            </div>
            <Player
              ref="player"
              :match="match"
              class="match-page__player mb-3 mb-lg-5"
            />
            <TwitterCard />
          </div>
        </b-col>
        <b-col sm="12" lg="3" :class="{ 'd-block d-lg-none': !sidebarVisible }">
          <div class="match-page__sidebar">
            <MatchFeed
              :title="$t('match.latestMatches')"
              :matches="latestMatches"
            />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import settings from '~/settings.json'
import { Match } from '~/types/match'
import { MatchService } from '~/services/match'
import MatchFeed from '~/components/MatchFeed/MatchFeed.vue'
import Player from '~/components/Player/Player.vue'
import TwitterCard from '~/components/TwitterCard/TwitterCard.vue'
import ArrowThinLeftIcon from '~/assets/images/icons/arrow-thin-left.svg?inline'
import MinimizeIcon from '~/assets/images/icons/minimize.svg?inline'

@Component({
  validate: ({ params }) => {
    return /^[\w-]+$/.test(params.id)
  },
  head() {
    // @ts-ignore
    const team1Name: string = this.match?.team1.name
    // @ts-ignore
    const team2Name: string = this.match?.team2.name

    return {
      title:
        (this.$t('global.websiteName') as string) +
        ' - ' +
        team1Name +
        ' ' +
        this.$t('match.vs') +
        ' ' +
        team2Name
    }
  },
  async asyncData(context) {
    const match: Match | null = await MatchService.getMatch(
      context.app.$axios,
      context.store,
      context.params.id
    )

    if (match) {
      const latestMatches:
        | Match[]
        | null = await MatchService.getLatestMatches(
        context.app.$axios,
        context.store,
        5,
        [match.id]
      )
      return { match, latestMatches }
    } else {
      context.error({
        statusCode: 404
      })
    }
  },
  components: {
    ArrowThinLeftIcon,
    MatchFeed,
    MinimizeIcon,
    Player,
    TwitterCard
  }
})
export default class MatchPage extends Vue {
  private sidebarVisible: boolean = true
  private sidebarVisibleLocalStorageKey: string = `${settings.localStoragePrefix}-match-page-sidebar-visible`
  private playTrackingInterval!: number

  public $refs!: {
    player: any
  }

  public latestMatches!: Match[]

  private created(): void {
    if (this.latestMatches.length === 0) {
      this.sidebarVisible = false
    } else {
      this.restoreSidebarVisibility()
    }
  }

  private mounted(): void {
    // Regularly (every 60 seconds) send an event to Google Analytics
    // to tell that the user is always active when he watching a video
    if (typeof window !== 'undefined') {
      this.playTrackingInterval = window.setInterval(this.trackPlaying, 60000)
    }
  }

  private destroyed() {
    if (typeof window !== 'undefined') {
      window.clearInterval(this.playTrackingInterval)
    }
  }

  /**
   * Send an event to Google Analytics
   * if the player is currently playing video
   */
  private async trackPlaying(): Promise<void> {
    if (this.$refs.player) {
      // eslint-disable-next-line no-undef
      const playerState: YT.PlayerState = await this.$refs.player.getPlayerState()

      // eslint-disable-next-line no-undef
      if (playerState === YT.PlayerState.PLAYING) {
        ;(this as any).$ga.event('player', 'playing', 'player-playing', true)
      }
    }
  }

  private minimizeSidebar(): void {
    this.sidebarVisible = false

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.sidebarVisibleLocalStorageKey, 'false')
    }
  }

  private expandSidebar(): void {
    this.sidebarVisible = true

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.sidebarVisibleLocalStorageKey, 'true')
    }

    // Trigger a resize event to auto resize match cards if needed
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      })
    }
  }

  /**
   * Show/hide sidebar depending on user's choice
   * getting from the local storage
   */
  private restoreSidebarVisibility(): void {
    if (typeof window === 'undefined') {
      return
    }

    const sidebarVisibleFromLocalStorage: string | null = localStorage.getItem(
      this.sidebarVisibleLocalStorageKey
    )

    if (sidebarVisibleFromLocalStorage) {
      this.sidebarVisible =
        localStorage.getItem(this.sidebarVisibleLocalStorageKey) === 'true'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.match-page {
  &__main {
    @include media-breakpoint-up(xl) {
      padding-right: 25px;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  &__title {
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.25em;
    margin-bottom: 10px;

    @include media-breakpoint-up(md) {
      font-size: 28px;
      margin-bottom: 15px;
    }

    @include media-breakpoint-up(xl) {
      font-size: 34px;
    }
  }

  &__player {
    > iframe {
      width: 100%;
      opacity: 0.2 !important;
    }
  }

  &__btn-minimize-sidebar,
  &__btn-expand-sidebar {
    align-items: center;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    display: flex;
    transition: transform $transition-duration;

    > svg {
      display: block;
      height: 26px;
      min-width: 26px;
      width: 26px;

      path {
        fill: #fff;
      }
    }

    @media (hover: hover) {
      &:hover {
        transform: scale(1.2);
      }
    }
  }

  &__btn-expand-sidebar > svg {
    transform: rotate(-180deg);
  }
}
</style>

<style lang="scss">
@import '~/assets/styles/_variables.scss';

.match-page {
  .player:not(.fullscreen) {
    iframe.youtube-player,
    .placeholder-player {
      height: 250px;

      @include media-breakpoint-up(sm) {
        height: 286px;
      }

      @include media-breakpoint-up(md) {
        height: 388px;
      }

      @include media-breakpoint-up(xl) {
        height: 534px;
      }
    }
  }

  &:not(.sidebar-visible) {
    .player:not(.fullscreen) {
      iframe.youtube-player,
      .placeholder-player {
        @include media-breakpoint-up(lg) {
          height: 520px;
        }

        @include media-breakpoint-up(xl) {
          height: 723px;
        }
      }
    }
  }
}
</style>
