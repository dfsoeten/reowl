<template>
  <div class="footer">
    <b-container>
      <b-row>
        <b-col md="6" class="mb-2 mb-md-0 text-center text-md-left">
          <nuxt-link
            :to="{
              name: 'legal-notices'
            }"
          >
            {{ $t('links.legalNotices') }}
          </nuxt-link>
        </b-col>
        <b-col md="6" class="text-center text-md-right">
          {{ $t('miscellaneous.developpedWithLoveBy') }}
          <a href="https://www.kevinpainchaud.fr" target="_blank">
            Kévin Painchaud
          </a>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

.footer {
  border-top: 1px solid rgba(#fff, 0.15);
  padding: 15px 0;

  @include media-breakpoint-up(md) {
    padding: 25px 0;
  }

  @include media-breakpoint-up(xl) {
    padding: 40px 0;
  }
}
</style>
