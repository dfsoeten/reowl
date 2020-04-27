<template>
  <div ref="playerControls" class="player-controls">
    <div>
      <button
        class="player-controls__btn-back-start"
        @click="$emit('backToStart')"
      >
        <span>
          {{ $t('player.backToStart') }}
        </span>
      </button>
      <div>
        <PlaybackRateControl
          v-if="availablePlaybackRates.length > 0"
          :available-playback-rates="availablePlaybackRates"
          :playback-rate="playbackRate"
          @playbackRateChanged="
            (playbackRate) => $emit('playbackRateChanged', playbackRate)
          "
        >
          <SpeedIcon />
          <span v-if="playbackRate !== 1">x{{ playbackRate }}</span>
        </PlaybackRateControl>
      </div>
    </div>
    <div>
      <div>
        <button @click="$emit('moved', -300)">
          <ArrowRightX3Icon class="horizontal-mirror" />
          <span>-5 min</span>
        </button>
      </div>
      <div>
        <button @click="$emit('moved', -60)">
          <ArrowRightX2Icon class="horizontal-mirror" />
          <span>-1 min</span>
        </button>
      </div>
      <div>
        <button @click="$emit('moved', -15)">
          <ArrowRightIcon class="horizontal-mirror" />
          <span>-15 sec</span>
        </button>
      </div>
      <div v-if="!isPlaying" class="player-controls__btn-play">
        <button @click="$emit('playing')">
          <PlayIcon />
        </button>
      </div>
      <div v-else class="player-controls__btn-pause">
        <button @click="$emit('paused')">
          <PauseIcon />
        </button>
      </div>
      <div>
        <button @click="$emit('moved', 15)">
          <ArrowRightIcon />
          <span>+15 sec</span>
        </button>
      </div>
      <div>
        <button @click="$emit('moved', 60)">
          <ArrowRightX2Icon />
          <span>+1 min</span>
        </button>
      </div>
      <div>
        <button @click="$emit('moved', 300)">
          <ArrowRightX3Icon />
          <span>+5 min</span>
        </button>
      </div>
    </div>
    <div>
      <div class="player-controls__volume">
        <button @click="handleVolumeMuteToggling">
          <VolumeIconMute v-if="volumeSliderValue === 0" />
          <VolumeIcon v-else />
        </button>
        <vue-slider
          ref="volumeSlider"
          v-model="volumeSliderValue"
          @change="$emit('volumeChanged', volumeSliderValue)"
        />
      </div>
      <button v-if="fullscreenEnabled" @click="$emit('fullscreenToggled')">
        <FullscreenIcon />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import screenfull from 'screenfull'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import PlaybackRateControl from '~/components/PlaybackRateControl/PlaybackRateControl.vue'
import SpeedIcon from '~/assets/images/icons/speed.svg?inline'
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
    PlaybackRateControl,
    VueSlider,
    SpeedIcon,
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
export default class PlayerControls extends Vue {
  @Prop({ type: Boolean, required: true })
  private isPlaying: boolean = false

  @Prop({ type: Array, required: true })
  private availablePlaybackRates!: number[]

  @Prop({ type: Number, required: true })
  private playbackRate!: number

  @Prop({ type: Number, required: true })
  private volume: number = 100

  public $refs!: {
    playerControls: any
    volumeSlider: any
  }

  private volumeSliderValue: number = this.volume
  private fullscreenEnabled: boolean = screenfull.isEnabled

  private handleVolumeMuteToggling(): void {
    this.$refs.volumeSlider.setValue(this.volumeSliderValue > 0 ? 0 : 100)
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.player-controls {
  $self: &;

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
        flex: 100%;
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

  &__btn-play,
  &__btn-pause {
    button {
      border: 3px solid #fff;
      border-radius: 500px;
    }
  }

  &__btn-play {
    button > svg {
      left: 2px;
      position: relative;
      top: 0;
    }
  }

  &__volume {
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
      min-width: 35px;

      @media (min-width: 350px) {
        min-width: 50px;
      }
    }
  }

  &.fullscreen-mode {
    background-color: #fff;
    border-radius: 32px;
    box-shadow: 0 0 20px 0 rgba(#000, 0.6);
    padding: 15px;

    > div {
      @include media-breakpoint-down(md) {
        &:nth-child(2) {
          border-bottom-color: $gray-900;
        }
      }
    }

    button {
      > svg path {
        fill: $gray-900;
      }

      > span {
        color: $gray-900;
      }
    }

    #{$self}__btn-play,
    #{$self}__btn-pause {
      button {
        border-color: $gray-900;
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

.player-controls {
  .playback-rate-control {
    z-index: 1;
  }

  .vue-slider {
    margin-right: 7px;
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

  &.fullscreen-mode {
    .vue-slider-dot-tooltip-inner {
      background-color: $gray-900;
      border-color: $gray-900;
      color: #fff;
    }
  }
}
</style>
