<script setup lang="ts">
import type { ICell } from '~/types/game.ts'

const $style = useCssModule()
const gameStore = useGameStore()

interface Props {
  cell: ICell
}
const props = defineProps<Props>()

const classList = computed(() => {
  return {
    [$style._single]: props.cell.required === 1,
    [$style._double]: props.cell.required === 2,
    [$style._inf]: !Number.isFinite(props.cell.required),
    [$style._satisfied]: Number.isFinite(props.cell.required) && props.cell.remaining === 0,
  }
})
</script>

<template>
  <div
    :class="[$style.GameCell, classList]"
  >
    <div :class="$style.inner">
      <div :class="$style.label">
        {{ gameStore.cellLabel(props.cell) }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
  .GameCell {
    width: 4.8rem;
    height: 4.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .6rem;
    box-shadow: 0 .1rem 0 rgba(0, 0, 0, .06);
    border: .1rem solid #e6e6e6;
    background: white;

    &._single {
      background: linear-gradient(180deg,#fef3c7,#fffde7);
    }

    &._double {
      background: linear-gradient(180deg,#fee2e2,#fff5f5);
    }

    &._inf {
      background: linear-gradient(180deg,#e6fffa,#f0fdfa);
    }

    &._satisfied {
      opacity: .5;
    }
  }

  .inner {
    text-align: center;
    font-size: 1.2rem;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    position: absolute;
    top: .4rem;
    left: .4rem;
    font-weight: 600;
    font-size: 1.2rem;
  }

  .player {
    position:absolute;
    bottom: .4rem;
    right: .4rem
  }
</style>
