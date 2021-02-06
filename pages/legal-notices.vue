<template>
  <div class="legal-notices-page page-content">
    <b-container>
      <b-row>
        <b-col>
          <h1 class="page-content__title">
            {{ $t('links.legalNotices') }}
          </h1>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-if="pageContent" v-html="pageContent"></div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  head() {
    return {
      title: ((this.$t('global.websiteName') as string) +
        ' - ' +
        this.$t('links.legalNotices')) as string
    }
  }
})
export default class LegalNoticesPage extends Vue {
  private pageContent: string | null = null

  private created() {
    // Load page content from locales
    try {
      this.pageContent = require(`~/locales/html/${this.$i18n.locale}/legal-notices.html`)
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
}
</script>
