<template>
  <div class="page-content">
    <b-container>
      <b-row>
        <b-col>
          <h1 class="page-content__title">
            <template v-if="error.statusCode === 404">
              {{ $t('error.pageNotFound') }}
            </template>
            <template v-else>
              {{ $t('error.errorOccurred') }}
            </template>
          </h1>
          <nuxt-link to="/">
            {{ $t('links.backToHome') }}
          </nuxt-link>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ErrorPage extends Vue {
  @Prop({ type: Object, required: true })
  private error: any
}
</script>
