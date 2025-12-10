<script setup lang="ts">
const gameStore = useGameStore()

const computedStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${gameStore.state.cols}, 4.8rem)`,
  }
})

const playerStyle = computed(() => {
  return {
    top: (gameStore.state.player.y * 5.2 - 2.8) + 'rem',
    left: (gameStore.state.player.x * 5.2 - 1.6) + 'rem',
  }
})
</script>

<template>
  <div
    :class="$style.GameGrid"
    :style="computedStyle"
  >
    <GameCell
      v-for="(cell, idx) in gameStore.flatCells"
      :key="'cell-'+idx"
      :cell="cell"
    />
    <GamePlayer
      :class="$style.player"
      :style="playerStyle"
    />
  </div>
</template>

<style lang="scss" module>
  .GameGrid {
    position: relative;
    display: grid;
    gap: .4rem;
  }

  .player {
    position: absolute;
  }
</style>
