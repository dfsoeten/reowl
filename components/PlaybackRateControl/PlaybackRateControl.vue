<template>
  <button
    v-click-outside="handleClickOutside"
    class="playback-rate-control"
    :class="{ open: open }"
    @click="handleDropdownToggling"
  >
    <slot></slot>
    <div class="playback-rate-control__dropdown">
      <ul>
        <li
          v-for="(availablePlaybackRate, index) in availablePlaybackRates"
          :key="index"
          :class="{ active: availablePlaybackRate === playbackRate }"
          @click="$emit('playbackRateChanged', availablePlaybackRate)"
        >
          {{ availablePlaybackRate }}
        </li>
      </ul>
    </div>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ClickOutside from 'vue-click-outside'

@Component({ directives: { ClickOutside } })
export default class PlaybackRateControl extends Vue {
  @Prop({ type: Array, required: true })
  private availablePlaybackRates!: number[]

  @Prop({ type: Number, required: true })
  private playbackRate!: number

  private open: boolean = false

  private handleDropdownToggling(): void {
    this.open = !this.open
  }

  private handleClickOutside(): void {
    this.open = false
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.playback-rate-control {
  $self: &;

  position: relative;

  &__dropdown {
    cursor: default;
    display: none;
    position: absolute;
    top: 0;
    transform: translateY(-100%);

    > ul {
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 0 10px 0 rgba(#000, 0.4);
      margin: 0;
      overflow: hidden;
      padding: 0;

      > li {
        cursor: pointer;
        list-style: none;
        padding: 5px 15px;
        text-align: left;

        &:hover,
        &.active {
          background-color: $primary;
          color: #fff;
        }
      }
    }
  }

  &.open {
    #{$self}__dropdown {
      display: block;
    }
  }
}
</style>
