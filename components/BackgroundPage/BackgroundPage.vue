<template>
  <div
    class="background-page"
    :class="{
      loading: loading,
      dark: darkMode,
      'background-page--image': !showVideo,
      'background-page--video': showVideo
    }"
  >
    <template v-if="showVideo">
      <div class="background-page__video-wrapper">
        <video muted autoplay loop playsinline>
          <source :src="videoSrc" type="video/mp4" />
        </video>
      </div>
    </template>
    <template v-else>
      <div class="background-page__image"></div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { subscribe, Subscription } from 'subscribe-ui-event'
import canAutoPlay from 'can-autoplay'
import backgroundPageVideo from '~/assets/videos/background-page.mp4'

@Component
export default class BackgroundPage extends Vue {
  private loading: boolean = true
  private showVideo: boolean = false
  private darkMode: boolean = false
  private resizeSubscription!: Subscription
  private videoSrc: string = backgroundPageVideo

  private mounted() {
    // Check if autoplay is allowed
    canAutoPlay.video({ muted: true, inline: true }).then(({ result }) => {
      if (result && result === true) {
        // Determine if video must be shown
        this.setIfVideoMustBeShown()
        this.resizeSubscription = subscribe(
          'resize',
          this.setIfVideoMustBeShown
        )
      } else {
        this.loading = false
      }
    })

    // Toggle dark mode depending of the current page
    this.toggleDarkMode()
  }

  private destroyed(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe()
    }
  }

  /**
   * Show video if is home & large screen
   */
  @Watch('$route')
  private setIfVideoMustBeShown(): void {
    const screenIsLargeEnough: boolean =
      window?.matchMedia('(min-width: 992px)').matches ?? false

    const mustBeShow: boolean =
      this.$route.name === `index___${this.$i18n.locale}` && screenIsLargeEnough

    // Show a transition on image to video change
    if (mustBeShow && mustBeShow !== this.showVideo) {
      this.loading = true

      setTimeout(() => {
        this.loading = false
      }, 100)
    } else {
      this.loading = false
    }

    this.showVideo = mustBeShow
  }

  /**
   * Toggle dark mode if page is not index
   * (Dark mode: darker background to make the page content more readable)
   */
  @Watch('$route')
  private toggleDarkMode(): void {
    this.darkMode = this.$route.name !== `index___${this.$i18n.locale}`
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.background-page {
  height: 600px;
  left: 0;
  max-height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: opacity 1s;
  width: 100%;

  @include media-breakpoint-up(md) {
    height: 850px;
  }

  @include media-breakpoint-up(lg) {
    &--video {
      height: 550px;
    }
  }

  @include media-breakpoint-up(xl) {
    height: 1100px;

    &--video {
      height: 850px;
    }
  }

  @media (min-width: 1900px) {
    height: 1100px;
  }

  // Gradient overlay
  &:after {
    background: $gray-900;
    background: linear-gradient(
      0deg,
      rgba($gray-900, 1) 20%,
      rgba($gray-900, 0.8) 80%
    );
    content: '';
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 0;
  }

  &__image {
    background-image: url(../../assets/images/backgrounds/background-page-sm.jpg);
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    @include media-breakpoint-up(md) {
      background-image: url(../../assets/images/backgrounds/background-page.jpg);
      background-position: center center;
    }
  }

  &__video-wrapper {
    video {
      bottom: 0;
      min-width: 100%;
      min-height: 100%;
      position: absolute;
      right: 0;
      z-index: -100;
    }
  }

  &.loading {
    opacity: 0;
  }

  &.dark:after {
    // Darken gradient overlay
    background: linear-gradient(
      0deg,
      rgba($gray-900, 1) 20%,
      rgba($gray-900, 0.9) 80%
    );
  }
}
</style>
