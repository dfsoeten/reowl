<template>
  <div v-show="consent !== true" class="cookie-consent-bar">
    <b-container>
      <b-row>
        <b-col>
          <div class="cookie-consent-bar__inner">
            <div>
              <span>
                {{ $t('cookieConsent.description') }}
                <nuxt-link
                  :to="
                    localePath({
                      name: 'legal-notices',
                      hash: '#cookies'
                    })
                  "
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
import { Vue, Component } from 'vue-property-decorator'
import { differenceInDays } from 'date-fns'
import settings from '~/settings.json'

@Component
export default class CookieConsentBar extends Vue {
  private consent: boolean = true
  private consentStorageKey: string = `${settings.localStoragePrefix}-cookie-consent`
  private consentDuration: number = 365 // days

  /**
   * Get the consent from local storage
   */
  private created(): void {
    // Consent exists
    if (typeof window !== 'undefined') {
      if (localStorage.getItem(this.consentStorageKey)) {
        // Remove it if given too long ago
        if (
          differenceInDays(
            new Date(),
            new Date(localStorage.getItem(this.consentStorageKey) || '')
          ) >= this.consentDuration
        ) {
          localStorage.removeItem(this.consentStorageKey)
          this.consent = false
        }
      } else {
        this.consent = false
      }
    }
  }

  /**
   * Consent usage of cookies on button click
   */
  private giveConsent(): void {
    // Exit if consent already given
    if (this.consent) {
      return
    }

    this.consent = true
    localStorage.setItem(this.consentStorageKey, new Date().toString())
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
  z-index: 5;

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
