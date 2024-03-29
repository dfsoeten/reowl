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
      v-show="fullscreen"
      class="player__fullscreen-overlay"
      @mousemove="handleFullscreenOverlayMousemove"
      @click="handleFullscreenOverlayClick"
      @dblclick="toggleFullscreen"
    ></div>
    <div class="player__video-wrapper">
      <div v-show="loading" class="placeholder-player"></div>
      <youtube
        ref="youtube"
        :video-id="youtubeVideo.id"
        :player-vars="playerVars"
        class="youtube-player"
        @ready="handleYoutubePlayerReady"
        @playing="isPlaying = true"
        @paused="isPlaying = false"
      />
      <div
        v-show="!fullscreen"
        class="player__minimized-overlay"
        @click="toggleVideo"
        @dblclick="toggleFullscreen"
      ></div>
      <div
        :class="{ active: movingBackward }"
        class="player__move player__move--backward"
      >
        <div>
          <ArrowRightIcon />
        </div>
      </div>
      <div
        :class="{ active: movingForward }"
        class="player__move player__move--forward"
      >
        <div>
          <ArrowRightIcon />
        </div>
      </div>
    </div>
    <div class="player__timer">
      <span>
        {{ currentTimeFormatted }}
      </span>
    </div>
    <PlayerControls
      v-show="!fullscreen || userIsActive"
      ref="playerControls"
      :is-playing="isPlaying"
      :available-playback-rates="availablePlaybackRates"
      :playback-rate="playbackRate"
      :volume="volume"
      :fullscreen="fullscreen"
      @playing="playVideo"
      @paused="pauseVideo"
      @moved="move"
      @backToStart="backToStart"
      @playbackRateChanged="handlePlaybackRateChange"
      @volumeChanged="handleVolumeChange"
      @fullscreenToggled="toggleFullscreen"
      @mouseover.native="handlePlayerControlsMouseover"
    />
  </div>
</template>

<script lang="ts">
/// <reference types="youtube" />

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import canAutoPlay from 'can-autoplay'
import screenfull from 'screenfull'
import { isTouchScreen } from '~/utils/touchscreen'
import { YoutubeVideo } from '~/types/youtube-video'
import PlayerControls from '~/components/PlayerControls/PlayerControls.vue'
import ArrowRightIcon from '~/assets/images/icons/arrow-right.svg?inline'

@Component({
  components: {
    PlayerControls,
    ArrowRightIcon
  }
})
export default class Player extends Vue {
  @Prop({ type: Object, required: true })
  private youtubeVideo!: YoutubeVideo

  public $refs!: {
    player: any
    playerControls: any
    youtube: any
  }

  private loading: boolean = true
  private fullscreen: boolean = false
  private userIsActive: boolean = false
  private userIsActiveTimeout!: number
  private isPlaying: boolean = false
  private availablePlaybackRates: number[] = []
  private playbackRate: number = 1
  private volume: number = 100
  private currentTime: number = 0
  private currentTimeInterval!: number
  private movingBackward = false
  private movingForward = false
  private movingTimer!: number
  // eslint-disable-next-line no-undef
  private playerVars: YT.PlayerVars = {
    controls: 0,
    playsinline: 1,
    rel: 0
  }

  // eslint-disable-next-line no-undef
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
    if (typeof window !== 'undefined') {
      this.currentTimeInterval = window.setInterval(async () => {
        this.currentTime = (await this.youtubePlayer.getCurrentTime()) || 0
      }, 100)
    }

    // Check if autoplay is allowed
    canAutoPlay.video().then(({ result }) => {
      if (result && result === true) {
        // Autoplay
        this.playVideo()
      }
    })

    // Store fullscreen state into data
    if (screenfull.isEnabled) {
      screenfull.on('change', this.handleFullscreenChange)
    }

    // Keyup
    if (typeof document !== 'undefined') {
      document.addEventListener('keyup', this.handleKeyup)
    }
  }

  private destroyed() {
    if (typeof window !== 'undefined') {
      window.clearInterval(this.currentTimeInterval)
    }

    if (screenfull.isEnabled) {
      screenfull.off('change', this.handleFullscreenChange)
    }

    if (typeof document !== 'undefined') {
      document.removeEventListener('keyup', this.handleKeyup)
    }
  }

  public async getPlayerState() {
    return await this.youtubePlayer.getPlayerState()
  }

  private async handleYoutubePlayerReady(): Promise<void> {
    this.loading = false

    // Get available playback rates (speed)
    this.availablePlaybackRates = await this.youtubePlayer.getAvailablePlaybackRates()
  }

  @Watch('youtubeVideo')
  private handleYoutubeVideoChange() {
    // Autoplay video
    setTimeout(this.playVideo)
  }

  private async toggleVideo() {
    // eslint-disable-next-line no-undef
    const playerState: YT.PlayerState = await this.getPlayerState()

    // eslint-disable-next-line no-undef
    if (playerState === YT.PlayerState.PLAYING) {
      this.pauseVideo()
    } else {
      this.playVideo()
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

    // Useful for arrow icon animation on the player
    this.movingBackward = false
    this.movingForward = false

    if (this.movingTimer) {
      clearTimeout(this.movingTimer)
    }

    window.setTimeout(() => {
      if (offset < 0) {
        this.movingBackward = true
      } else if (offset > 0) {
        this.movingForward = true
      }

      this.movingTimer = window.setTimeout(() => {
        this.movingBackward = false
        this.movingForward = false
      }, 500)
    }, 50)

    this.youtubePlayer.seekTo(currentTime + offset, true)
  }

  private handlePlaybackRateChange(playbackRate: number): void {
    this.playbackRate = playbackRate
  }

  @Watch('playbackRate')
  private handleYoutubePlayerPlaybackRateChange(): void {
    this.youtubePlayer.setPlaybackRate(this.playbackRate)
  }

  private handleVolumeChange(volume: number): void {
    this.volume = volume
  }

  @Watch('volume')
  private handleYoutubePlayerVolumeChange(): void {
    this.youtubePlayer.setVolume(this.volume)
  }

  private handleFullscreenChange(): void {
    this.fullscreen = (screenfull as any).isFullscreen
  }

  /**
   * Toggle fullscreen mode
   */
  private toggleFullscreen(): void {
    // Enter fullscreen
    if (!this.fullscreen) {
      ;(screenfull as any).request(this.$refs.player)

      // Prevent player controls to be shown
      // on enter to the fullscreen mode
      this.userIsActive = false
    } else {
      // Exit fullscreen
      ;(screenfull as any).exit()
    }
  }

  /**
   * Handle key up
   */
  private handleKeyup(event: any): void {
    // Play/pause on spacebar key up when fullscreen
    if (
      screenfull.isEnabled &&
      screenfull.isFullscreen &&
      event.keyCode === 32 &&
      // Check no player control button is focus
      this.$refs.playerControls.$el.querySelectorAll('button:focus').length ===
        0
    ) {
      this.toggleVideo()
    }

    // Move forward/backward on arrow key up
    if (event.keyCode === 37) {
      this.move(-15)
    } else if (event.keyCode === 39) {
      this.move(15)
    }
  }

  /**
   * Mouseover the fullscreen overlay
   */
  private handleFullscreenOverlayMousemove(): void {
    if (!isTouchScreen()) {
      if (this.userIsActiveTimeout) {
        clearTimeout(this.userIsActiveTimeout)
      }

      this.userIsActive = true

      // The user is considered inactive 1 second
      // after having stopped moving his mouse
      if (typeof window !== 'undefined') {
        this.userIsActiveTimeout = window.setTimeout(
          () => (this.userIsActive = false),
          1000
        )
      }
    }
  }

  /**
   * Click the fullscreen overlay
   */
  private handleFullscreenOverlayClick(): void {
    if (isTouchScreen()) {
      // User is active = show fullscreen overlay + player controls
      this.userIsActive = !this.userIsActive
    } else {
      // Pause/play video
      this.toggleVideo()
    }
  }

  /**
   * Mouseover the player controls
   */
  private handlePlayerControlsMouseover(): void {
    // Keep user as active when he hovers the player controls
    // and so we let display these
    if (!isTouchScreen()) {
      if (this.userIsActiveTimeout) {
        clearTimeout(this.userIsActiveTimeout)
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
    .placeholder-player {
      background-color: $gray-900;
    }
  }

  &__minimized-overlay {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  &__move {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 20%;

    > div {
      opacity: 0;

      > svg {
        display: block;
        fill: #fff;
        height: 100%;
        min-width: 100%;
        width: 100%;

        > path {
          filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
        }
      }
    }

    &--backward {
      left: 15%;

      svg {
        transform: rotate(-180deg);
      }
    }

    &--forward {
      right: 15%;
    }

    &.active > div {
      animation: pulse 0.5s;
    }
  }

  &__timer {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;

    > span {
      background-color: #fff;
      border-radius: 0 0 8px 8px;
      color: $gray-900;
      display: inline-block;
      font-weight: 700;
      line-height: 1em;
      padding: 3px 8px;
      text-align: center;

      // Fix strange padding on xs screen (related to the font)
      @include media-breakpoint-down(sm) {
        padding-bottom: 1px;

        // Specific to iOS devices
        @supports (-webkit-touch-callout: none) {
          padding-bottom: 0;
          padding-top: 5px;
        }
      }
    }
  }

  &:not(.fullscreen) {
    #{$self}__video-wrapper {
      position: relative;
    }
  }

  &.fullscreen {
    #{$self}__fullscreen-overlay,
    #{$self}__timer {
      opacity: 0;
      position: absolute;
      top: 0;
      transition: opacity $transition-duration;
    }

    #{$self}__fullscreen-overlay {
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
      width: 100%;
      z-index: 1;
    }

    #{$self}__timer {
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
    }

    &:not(.user-is-active) {
      cursor: none;
    }

    &.user-is-active {
      #{$self}__fullscreen-overlay {
        opacity: 0.8;
      }

      #{$self}__timer {
        opacity: 1;
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
      height: 0 !important;
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

    .player-controls {
      bottom: 35px;
      left: 50%;
      max-width: 325px;
      position: absolute;
      transform: translateX(-50%);
      width: calc(100% - 30px);
      z-index: 2;

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
