<script setup lang="ts">
</script>

<template>
  <button :class="$style.UiButton">
    <div :class="$style.inner">
      <slot />
    </div>
  </button>
</template>

<style lang="scss" module>
.UiButton {
  position: relative;
  cursor: pointer;
  background-color: $blue-light;

  &:hover {
    .inner {
      transform: translate(0, 0);
    }
  }
}

.inner {
  font-size: 1.6rem;
  background-color: $blue;
  color: $white;
  font-weight: bold;
  padding: 1.2rem 2.4rem;
  transform: translate(-.4rem, -.4rem);
  pointer-events: none;
  will-change: transform;
  transition: transform $default-transition;
}
</style>
