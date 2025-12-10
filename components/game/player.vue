<script setup lang="ts">
const $style = useCssModule()

const gameStore = useGameStore()

const classList = computed(() => {
  return {
    [$style['_' + gameStore.state.player.state]]: true,
    [$style['_' + gameStore.state.player.facing]]: true,
  }
})
</script>

<template>
  <div :class="[$style.GamePlayer, classList]" />
</template>

<style lang="scss" module>
  $idle-frames: 4;
  $run-frames: 6;
  $frame-width: 8rem;

  @mixin player-animation($state, $frames, $duration) {
    &._#{$state} {
      background-image: url('~/public/img/player/player_#{$state}.png');
      background-size: #{$frames * $frame-width} auto;
      animation: #{$state} #{$frames * $duration} steps(#{$frames}) infinite;
    }
  }

  .GamePlayer {
    width: 8rem;
    height: 8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    background-position-x: 0;
    --facing-scale: 1;
    transform: scaleX(var(--facing-scale)) scale(1) rotate(0deg);
    transition: top .2s linear, left .2s linear;
    @include player-animation('idle', $idle-frames, 0.15s);
    @include player-animation('run', $run-frames, 0.08s);

    &._left {
      --facing-scale: -1;
    }

    &._right {
      --facing-scale: 1;
    }
  }

  @keyframes idle {
    from { background-position-x: 0; }
    to { background-position-x: -#{$frame-width * ($idle-frames)}; }
  }

  @keyframes run {
    from { background-position-x: 0; }
    to { background-position-x: -#{$frame-width * ($run-frames)}; }
  }
</style>
