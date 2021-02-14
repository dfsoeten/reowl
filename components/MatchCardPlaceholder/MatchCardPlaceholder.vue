<template>
  <div class="match-card-placeholder">
    <div class="match-card-placeholder__inner"></div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_variables.scss';

@keyframes placeholder {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.match-card-placeholder {
  &__inner {
    animation: placeholder 1s infinite linear forwards;
    background-color: $gray-800;
    background-image: linear-gradient(
      to right,
      $gray-800 0%,
      darken($gray-800, 2%) 20%,
      $gray-800 40%,
      $gray-800 100%
    );
    background-repeat: no-repeat;
    border-radius: 8%/13%;
    box-shadow: 0 0 20px 0 rgba(#000, 0.3);

    // Aspect ratio
    &:after {
      content: '';
      display: block;
      padding-bottom: 62%;
    }
  }
}
</style>
