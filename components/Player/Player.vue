<template>
  <div class="player" :class="{ loading: loading }">
    <div class="player__video">
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
    <div class="player__actions">
      <div>
        <button class="player__btn-back-start" @click="backToStart">
          <span>
            {{ $t('player.backToStart') }}
          </span>
        </button>
      </div>
      <div>
        <div>
          <button @click="move(-300)">
            <ArrowRightX3Icon class="horizontal-mirror" />
            <span>-5 min</span>
          </button>
        </div>
        <div>
          <button @click="move(-60)">
            <ArrowRightX2Icon class="horizontal-mirror" />
            <span>-1 min</span>
          </button>
        </div>
        <div>
          <button @click="move(-15)">
            <ArrowRightIcon class="horizontal-mirror" />
            <span>-15 sec</span>
          </button>
        </div>
        <div v-if="!isPlaying" class="player__btn-play">
          <button @click="playVideo">
            <PlayIcon />
          </button>
        </div>
        <div v-else class="player__btn-pause">
          <button @click="pauseVideo">
            <PauseIcon />
          </button>
        </div>
        <div>
          <button @click="move(15)">
            <ArrowRightIcon />
            <span>+15 sec</span>
          </button>
        </div>
        <div>
          <button @click="move(60)">
            <ArrowRightX2Icon />
            <span>+1 min</span>
          </button>
        </div>
        <div>
          <button @click="move(300)">
            <ArrowRightX3Icon />
            <span>+5 min</span>
          </button>
        </div>
      </div>
      <div>
        <div class="player__volume">
          <button @click="handleVolumeMuteToggling">
            <VolumeIconMute v-if="volume === 0" />
            <VolumeIcon v-else />
          </button>
          <vue-slider
            ref="volumeSlider"
            v-model="volume"
            @change="handleVolumeChange"
          />
        </div>
        <button @click="toggleFullscreen">
          <FullscreenIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/// <reference types="youtube" />

import { Vue, Component, Prop } from 'vue-property-decorator'
import canAutoPlay from 'can-autoplay'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { IGame } from '~/types/game'
import PlayIcon from '~/assets/images/icons/play.svg?inline'
import PauseIcon from '~/assets/images/icons/pause.svg?inline'
import ArrowRightIcon from '~/assets/images/icons/arrow-right.svg?inline'
import ArrowRightX2Icon from '~/assets/images/icons/arrow-right-x2.svg?inline'
import ArrowRightX3Icon from '~/assets/images/icons/arrow-right-x3.svg?inline'
import VolumeIcon from '~/assets/images/icons/volume.svg?inline'
import VolumeIconMute from '~/assets/images/icons/volume-mute.svg?inline'
import FullscreenIcon from '~/assets/images/icons/fullscreen.svg?inline'

@Component({
  components: {
    VueSlider,
    PlayIcon,
    PauseIcon,
    ArrowRightIcon,
    ArrowRightX2Icon,
    ArrowRightX3Icon,
    VolumeIcon,
    VolumeIconMute,
    FullscreenIcon
  }
})
export default class GamePage extends Vue {
  @Prop({ type: Object, required: true })
  private game!: IGame

  private loading: boolean = true
  private isPlaying: boolean = false
  private volume: number = 100
  private currentTime: number = 0
  private currentTimeInterval!: number

  public $refs!: {
    volumeSlider: any
    youtube: any
  }

  public async getPlayerState() {
    return await this.player.getPlayerState()
  }

  private playerVars: YT.PlayerVars = {
    controls: 0,
    rel: 0
  }

  private get player(): YT.Player {
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
      this.currentTime = await this.player.getCurrentTime()
    }, 200)

    // Check if autoplay is allowed
    canAutoPlay.video().then(({ result }) => {
      if (result && result === true) {
        // Autoplay
        this.playVideo()
      }
    })
  }

  private destroyed() {
    window.clearInterval(this.currentTimeInterval)
  }

  private playVideo() {
    this.player.playVideo()
  }

  private pauseVideo() {
    this.player.pauseVideo()
  }

  private backToStart() {
    this.player.seekTo(0, true)
  }

  private async move(offset: number) {
    const currentTime = await this.player.getCurrentTime()

    this.player.seekTo(currentTime + offset, true)
  }

  private handleVolumeChange(): void {
    this.player.setVolume(this.volume)
  }

  private handleVolumeMuteToggling(): void {
    this.$refs.volumeSlider.setValue(this.volume > 0 ? 0 : 100)
  }

  private async toggleFullscreen(): Promise<void> {
    const iframe = await this.player.getIframe()

    iframe.requestFullscreen()
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.player {
  $self: &;

  &__video {
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

  &__actions {
    display: flex;

    @include media-breakpoint-down(md) {
      flex-wrap: wrap;
    }

    > div {
      align-items: center;
      display: flex;
      justify-content: center;

      @include media-breakpoint-down(xs) {
        &:nth-child(2) {
          flex-wrap: wrap;

          > * {
            display: flex;
            width: 1/3 * 100%;
            justify-content: center;

            &#{$self}__btn-play,
            &#{$self}__btn-pause {
              margin: 5px 0;
              width: 100%;
            }
          }
        }
      }

      @include media-breakpoint-down(md) {
        &:nth-child(1) {
          order: 2;
          width: 50%;
        }

        &:nth-child(2) {
          border-bottom: 1px solid rgba(#fff, 0.15);
          order: 1;
          margin-bottom: 10px;
          padding-bottom: 15px;
          width: 100%;
        }

        &:nth-child(3) {
          order: 3;
          width: 50%;
        }
      }

      @include media-breakpoint-up(md) {
        > *:not(:last-child) {
          margin-right: 5px;
        }

        &:nth-child(2) {
          flex: 1;
        }
      }

      @include media-breakpoint-up(xl) {
        > *:not(:last-child) {
          margin-right: 15px;
        }
      }
    }

    button,
    #{$self}__volume {
      > svg {
        transition: transform $transition-duration transform 0;
      }

      @media (hover: hover) {
        &:hover {
          > svg {
            transform: scale(1.2);

            &.horizontal-mirror {
              transform: scale(1.2) rotate(-180deg);
            }
          }
        }
      }
    }

    button {
      align-items: center;
      background-color: transparent;
      border: 0;
      height: 56px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 56px;
      padding: 0 6px;
      user-select: none;
      width: 56px;

      > svg {
        display: block;
        min-width: 60%;
        width: 60%;

        path {
          fill: #fff;
        }
      }

      > span {
        color: #fff;
        font-size: 12px;
      }

      &#{$self}__btn-back-start {
        > span {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.35em;
        }
      }
    }

    #{$self}__btn-play,
    #{$self}__btn-pause {
      button {
        border: 3px solid #fff;
        border-radius: 500px;
      }
    }

    #{$self}__btn-play {
      button > svg {
        left: 2px;
        position: relative;
        top: 0;
      }
    }

    #{$self}__volume {
      align-items: center;
      display: flex;

      > svg {
        cursor: pointer;
        display: block;
        height: 32px;
        min-width: 32px;
        width: 32px;

        path {
          fill: #fff;
        }
      }

      .vue-slider {
        flex: 1;
        margin-left: 15px;
        min-width: 50px;
      }
    }
  }
}

.horizontal-mirror {
  transform: rotate(-180deg);
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

  .vue-slider-process {
    background-color: $primary;
  }

  .vue-slider-dot-tooltip-inner {
    background-color: #fff;
    border: 0;
    border-color: #fff;
    color: $gray-900;
    line-height: 1em;
    padding-top: 3px;
  }

  .vue-slider-dot-tooltip-inner-top::after {
    border-width: 7px;
    top: calc(100% - 1px);
  }

  &.loading iframe.youtube-player {
    height: 0;
  }
}
</style>
