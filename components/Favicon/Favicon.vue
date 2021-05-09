<template>
  <div v-show="false"></div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Favicon extends Vue {
  public darkColorScheme = false

  public get faviconBaseName(): string {
    return `favicon${this.darkColorScheme ? '-reversed' : ''}`
  }

  public head() {
    return {
      link: [
        {
          rel: 'shortcut icon',
          type: 'image/x-icon',
          href: `/${this.faviconBaseName}.ico`
        },
        {
          rel: 'icon',
          href: `/${this.faviconBaseName}.png`,
          type: 'image/png'
        },
        {
          rel: 'icon',
          sizes: '64x64',
          href: `/${this.faviconBaseName}-64x64.png`,
          type: 'image/png'
        },
        {
          rel: 'icon',
          sizes: '96x96',
          href: `/${this.faviconBaseName}-96x96.png`,
          type: 'image/png'
        },
        {
          rel: 'icon',
          sizes: '128x128',
          href: `/${this.faviconBaseName}-128x128.png`,
          type: 'image/png'
        }
      ]
    }
  }

  public mounted() {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme:dark)').matches
    ) {
      this.darkColorScheme = true
    }
  }
}
</script>
