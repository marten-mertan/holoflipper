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

const label = computed(() => {
  return gameStore.cellLabel(props.cell)
})
</script>

<template>
  <div
    :class="[$style.GameCell, classList]"
  >
    <div :class="$style.inner">
      {{ label }}
    </div>
  </div>
</template>

<style lang="scss" module>
  .GameCell {
    width: 5.2rem;
    height: 5.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $white;
    opacity: 1;
    transition: opacity .5s ease, transform .5s ease, background-color .5s ease, border .5s ease;

    &._single {
      background: $blue;
      border: $blue-light solid .2rem;
      box-shadow: $cell-shadow;
    }

    &._double {
      background: $green;
      border: $green-light solid .2rem;
      box-shadow: $cell-shadow;
    }

    &._inf {
      background: $orange;
      border: $orange-light solid .2rem;
      box-shadow: $cell-shadow;
    }

    &._satisfied {
      background: $blue;
      border: $blue-light solid .2rem;
      opacity: 0;
      transform: translateY(1.4rem) scale(0.6) rotate(60deg);
    }
  }

  .inner {
    text-align: center;
    position: relative;
    font-size: 2rem;
    font-weight: bold;
    color: $white;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
