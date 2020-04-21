<template>
  <div
    ref="player"
    class="player"
    :class="{
      loading: loading,
      fullscreen: fullscreen,
      'user-is-active': userIsActive
    }"
  >
    <div
      v-if="fullscreen"
      class="player__overlay"
      @mousemove="handleOverlayMousemove"
      @click="handleOverlayClick"
    ></div>
    <div class="player__video-wrapper" @click="handleOverlayClick">
      <div v-show="loading" class="placeholder-player"></div>
      <youtube
        ref="youtube"
        :video-id="game.video.id"
        :player-vars="playerVars"
        class="youtube-player"
        @ready="loading = false"
        @playing="isPlaying = true"
        @paused="isPlaying = false"
      />
      <div class="player__timer">
        <span>
          {{ currentTimeFormatted }}
        </span>
      </div>
    </div>
    <PlayerActions
      v-show="!fullscreen || userIsActive"
      ref="playerActions"
      :is-playing="isPlaying"
      :volume="volume"
      :class="{
        'white-bg': fullscreen
      }"
      @playing="playVideo"
      @paused="pauseVideo"
      @moved="move"
      @backToStart="backToStart"
      @volumeChanged="handleVolumeChange"
      @fullscreenToggled="toggleFullscreen"
      @mouseover.native="handlePlayerActionsMouseover"
    />
  </div>
</template>

<script lang="ts">
/// <reference types="youtube" />

import { Vue, Component, Prop } from 'vue-property-decorator'
import canAutoPlay from 'can-autoplay'
import screenfull from 'screenfull'
import { IGame } from '~/types/game'
import PlayerActions from '~/components/PlayerActions/PlayerActions.vue'

@Component({
  components: {
    PlayerActions
  }
})
export default class GamePage extends Vue {
  @Prop({ type: Object, required: true })
  private game!: IGame

  public $refs!: {
    player: any
    playerActions: any
    youtube: any
  }

  private loading: boolean = true
  private fullscreen: boolean = false
  private userIsActive: boolean = false
  private overlayMousemoveTimeout!: number
  private touchscreen: boolean = 'ontouchstart' in document.documentElement
  private fullscreenEnabled: boolean = screenfull.isEnabled
  private isPlaying: boolean = false
  private volume: number = 100
  private currentTime: number = 0
  private currentTimeInterval!: number
  private playerVars: YT.PlayerVars = {
    controls: 0,
    rel: 0,
    playsinline: 1
  }

  public async getPlayerState() {
    return await this.youtubePlayer.getPlayerState()
  }

  private get youtubePlayer(): YT.Player {
    return this.$refs.youtube.player
  }

  private get iframe() {
    return this.$refs.youtube
  }

  private get currentTimeFormatted(): string {
    return new Date(this.currentTime * 1000).toISOString().substr(11, 8)
  }

  private mounted() {
    // Set interval for the current time indicator
    this.currentTimeInterval = window.setInterval(async () => {
      this.currentTime = await this.youtubePlayer.getCurrentTime()
    }, 200)

    // Check if autoplay is allowed
    canAutoPlay.video().then(({ result }) => {
      if (result && result === true) {
        // Autoplay
        this.playVideo()
      }
    })

    // Store fullscreen state into data
    if (this.fullscreenEnabled) {
      ;(screenfull as any).on('change', this.handleScreenfullChange)
    }

    // Spacebar keyup
    document.addEventListener('keyup', this.handleSpacebarKeyup)
  }

  private handleScreenfullChange(): void {
    this.fullscreen = (screenfull as any).isFullscreen
  }

  /**
   * Play/pause on spacebar keyup on fullscreen
   */
  private handleSpacebarKeyup(event: any): void {
    if (
      this.fullscreenEnabled &&
      (screenfull as any).isFullscreen &&
      event.keyCode === 32 &&
      // Check no player action button is focus
      this.$refs.playerActions.querySelectorAll('button:focus').length === 0
    ) {
      this.toggleVideo()
    }
  }

  private destroyed() {
    window.clearInterval(this.currentTimeInterval)
    ;(screenfull as any).off('change', this.handleScreenfullChange)
    document.removeEventListener('keyup', this.handleSpacebarKeyup)
  }

  private async toggleVideo() {
    const playerState: YT.PlayerState = await this.getPlayerState()

    // eslint-disable-next-line no-undef
    if (playerState === YT.PlayerState.PLAYING) {
      this.youtubePlayer.pauseVideo()
    } else {
      this.youtubePlayer.playVideo()
    }
  }

  private playVideo() {
    this.youtubePlayer.playVideo()
  }

  private pauseVideo() {
    this.youtubePlayer.pauseVideo()
  }

  private backToStart() {
    this.youtubePlayer.seekTo(0, true)
  }

  private async move(offset: number) {
    const currentTime = await this.youtubePlayer.getCurrentTime()

    this.youtubePlayer.seekTo(currentTime + offset, true)
  }

  private handleVolumeChange(volume: number): void {
    this.youtubePlayer.setVolume(volume)
  }

  private toggleFullscreen(): void {
    if (screenfull.isEnabled) {
      if (!this.fullscreen) {
        screenfull.request(this.$refs.player)
        this.userIsActive = false // Prevent player actions to be shown
        this.$refs.playerActions.blurButtons() // Blur all player action buttons
      } else {
        screenfull.exit()
      }
    }
  }

  private handleOverlayMousemove(): void {
    if (!this.touchscreen) {
      if (this.overlayMousemoveTimeout) {
        clearTimeout(this.overlayMousemoveTimeout)
      }

      this.userIsActive = true

      this.overlayMousemoveTimeout = window.setTimeout(
        () => (this.userIsActive = false),
        1000
      )
    }
  }

  private handleOverlayClick(): void {
    if (this.touchscreen) {
      this.userIsActive = !this.userIsActive
    } else {
      this.toggleVideo()
    }
  }

  /**
   * Mouseover the player actions
   */
  private handlePlayerActionsMouseover(): void {
    // Keep user as active
    if (!this.touchscreen) {
      if (this.overlayMousemoveTimeout) {
        clearTimeout(this.overlayMousemoveTimeout)
      }

      this.userIsActive = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.player {
  $self: &;

  &__video-wrapper {
    margin-bottom: 25px;

    .placeholder-player {
      background-color: $gray-900;
    }
  }

  &__timer {
    display: flex;
    justify-content: center;

    > span {
      background-color: #fff;
      border-radius: 0 0 8px 8px;
      color: $gray-900;
      display: inline-block;
      font-weight: 700;
      line-height: 1em;
      padding: 3px 8px;
      text-align: center;
    }
  }

  &.fullscreen {
    #{$self}__overlay {
      background-color: $gray-900;
      background: linear-gradient(
        0deg,
        rgba($gray-900, 1) 0%,
        rgba($gray-900, 0.5) 60%
      );
      content: '';
      display: block;
      height: 100%;
      left: 0;
      opacity: 0;
      position: absolute;
      top: 0;
      transition: opacity $transition-duration;
      width: 100%;
      z-index: 2;
    }

    &.user-is-active {
      #{$self}__overlay {
        opacity: 0.8;
      }
    }
  }
}
</style>

<style lang="scss">
@import '~/assets/styles/_variables.scss';

.player {
  iframe.youtube-player,
  .placeholder-player {
    display: block;
    height: 480px;
    width: 100%;
  }

  &.loading {
    iframe.youtube-player {
      height: 0;
    }
  }

  &.fullscreen {
    iframe.youtube-player {
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }

    .player-actions {
      bottom: 35px;
      left: 50%;
      max-width: 325px;
      position: absolute;
      transform: translateX(-50%);
      width: calc(100% - 30px);
      z-index: 3;

      @include media-breakpoint-up(sm) {
        max-width: 1000px;
        padding: 15px 25px;
      }

      @include media-breakpoint-up(lg) {
        bottom: 100px;
      }
    }
  }
}
</style>
