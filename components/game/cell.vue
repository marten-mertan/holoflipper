<script setup lang="ts">
import type { ICell } from '~/types/game.ts'

const $style = useCssModule()
const gameStore = useGameStore()

interface Props {
  cell: ICell
}
const props = defineProps<Props>()

const status = computed(() => {
  if (!Number.isFinite(props.cell.required)) {
    return 'inf'
  }
  else if (props.cell.remaining === 2 || (props.cell.remaining === 1 && gameStore.state.player.x === props.cell.x && gameStore.state.player.y === props.cell.y)) {
    return 'double'
  }
  else if (props.cell.remaining === 1 || (props.cell.remaining === 0 && gameStore.state.player.x === props.cell.x && gameStore.state.player.y === props.cell.y)) {
    return 'single'
  }
  else {
    return 'satisfied'
  }
})

const classList = computed(() => {
  return {
    [$style['_' + status.value]]: true,
  }
})
</script>

<template>
  <div
    :class="[$style.GameCell, classList]"
  >
    <div :class="$style.inner" />
  </div>
</template>

<style lang="scss" module>
  .GameCell {
    width: 5.2rem;
    height: 5.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    opacity: 1;
    transition: opacity .5s ease, transform .5s ease, background-color .5s ease, border .5s ease;

    &._single {
      background: #556b78;
      border:#2d3c44 solid .2rem;
      box-shadow: 0 0 0.4rem #a3c7d4, 0 0 0.2rem #a3c7d4 inset;
    }

    &._double {
      background:  #394a54;
      border:#1c262c solid .2rem;
      box-shadow: 0 0 0.5rem #7f9ea8, 0 0 0.3rem #7f9ea8 inset;
    }

    &._inf {
      background: #246c8f;
      border:#123946 solid .2rem;
      box-shadow: 0 0 0.5rem #53b3da, 0 0 0.3rem #53b3da inset;
    }

    &._satisfied {
      background: #556b78;
      border:#2d3c44 solid .2rem;
      opacity: 0;
      transform: translateY(1.4rem) scale(0.6) rotate(60deg);
    }
  }

  .inner {
    text-align: center;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
