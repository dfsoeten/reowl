<template>
  <div class="default-layout">
    <Favicon />
    <BackgroundPage />
    <div class="default-layout__inner">
      <Navbar />
      <nuxt />
      <Footer />
      <CookieConsentBar />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BackgroundPage from '~/components/BackgroundPage/BackgroundPage.vue'
import CookieConsentBar from '~/components/CookieConsentBar/CookieConsentBar.vue'
import Footer from '~/components/Footer/Footer.vue'
import Navbar from '~/components/Navbar/Navbar.vue'
import Favicon from '~/components/Favicon/Favicon.vue'

@Component({
  components: { BackgroundPage, CookieConsentBar, Footer, Navbar, Favicon }
})
export default class DefautlLayout extends Vue {}
</script>

<style lang="scss" scoped>
.default-layout__inner {
  position: relative;
  z-index: 1;
}
</style>
