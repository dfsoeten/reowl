<template>
  <div v-if="!consent" class="cookie-consent-bar">
    <b-container>
      <b-row>
        <b-col>
          <div class="cookie-consent-bar__inner">
            <div>
              <span>
                {{ $t('cookieConsent.description') }}
                <nuxt-link
                  :to="{
                    name: 'legal-notices',
                    hash: '#cookies'
                  }"
                >
                  {{ $t('miscellaneous.readMore') }}
                </nuxt-link>
              </span>
            </div>
            <div>
              <b-button pill size="sm" variant="light" @click="giveConsent">
                {{ $t('cookieConsent.allowCookies') }}
              </b-button>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { subscribe, Subscription } from 'subscribe-ui-event'
import { differenceInDays } from 'date-fns'
import settings from '~/settings.json'

@Component
export default class CookieConsentBar extends Vue {
  private consent: boolean = false
  private consentStorageKey: string = `${settings.localStoragePrefix}-cookie-consent`
  private consentDuration: number = 365 // days
  private scrollOffset: number = 300 // Distance to scroll to consent (px)
  private scrollSubscription!: Subscription
  private initialScrollY!: number

  /**
   * Get the consent from local storage
   */
  private created(): void {
    // Consent exists
    if (localStorage.getItem(this.consentStorageKey)) {
      // Remove it if given too long ago
      if (
        differenceInDays(
          new Date(),
          new Date(localStorage.getItem(this.consentStorageKey) || '')
        ) >= this.consentDuration
      ) {
        localStorage.removeItem(this.consentStorageKey)
      }
      // Is valid
      else {
        this.consent = true
      }
    }
  }

  private mounted(): void {
    if (!this.consent) {
      this.initialScrollY = window.scrollY
      this.scrollSubscription = subscribe('scroll', this.handleScrollingConsent)
    }
  }

  private destroyed(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe()
    }
  }

  /**
   * Consent usage of cookies
   * on button click, scroll & page change
   */
  @Watch('$route')
  private giveConsent(): void {
    // Exit if consent already given
    if (this.consent) {
      return
    }

    this.consent = true
    localStorage.setItem(this.consentStorageKey, new Date().toString())
    this.scrollSubscription.unsubscribe()
  }

  private handleScrollingConsent(): void {
    if (
      window.scrollY > this.initialScrollY + this.scrollOffset ||
      window.scrollY < this.initialScrollY - this.scrollOffset
    ) {
      this.giveConsent()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.cookie-consent-bar {
  background-color: darken($gray-900, 4);
  bottom: 0;
  box-shadow: 0 -3px 20px 0 rgba(#000, 0.3);
  left: 0;
  position: fixed;
  width: 100%;

  &__inner {
    display: flex;
    padding: 10px 0;

    > * {
      align-items: center;
      display: flex;
      font-size: 12px;
      line-height: 1.25em;

      @include media-breakpoint-up(sm) {
        font-size: 14px;
      }

      &:first-child {
        flex: 1;
      }

      &:nth-child(2) {
        @include media-breakpoint-down(xs) {
          max-width: 150px;
        }
      }

      &:not(:last-child) {
        margin-right: 10px;

        @include media-breakpoint-up(sm) {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
