<template>
  <b-row class="text-center">
    <b-col>
      <b-button
        :href="`https://www.youtube.com/channel/${owlFrYoutubeChannelId}`"
        target="_blank"
        pill
        variant="outline-light"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="$t('links.seeMoreOnYoutube')"></span>
      </b-button>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import settings from '~/settings.json'

@Component
export default class SeeMoreOnYoutube extends Vue {
  private owlFrYoutubeChannelId: string = settings.owlFrYoutubeChannelId
}
</script>
