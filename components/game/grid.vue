<script setup lang="ts">
const gameStore = useGameStore()

const computedStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${gameStore.state.cols}, 5.2rem)`,
  }
})

const playerStyle = computed(() => {
  return {
    top: (gameStore.state.player.y * 5.2 - 2.8) + 'rem',
    left: (gameStore.state.player.x * 5.2 - 1.4) + 'rem',
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
  }

  .player {
    position: absolute;
  }
</style>
