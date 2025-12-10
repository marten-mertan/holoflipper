import { defineStore } from 'pinia'
import type { IGameConfig, IGameState, IPosition, IDirection, ICell } from '~/types/game.ts'

export const useGameStore = defineStore('gameStore', () => {
  const CONFIG: IGameConfig = {
    initRows: 7,
    initCols: 9,
    moveDurationMs: 200,
  }
  const state = ref<IGameState>({
    settingsRows: CONFIG.initRows,
    settingsCols: CONFIG.initCols,
    rows: CONFIG.initRows,
    cols: CONFIG.initCols,
    grid: [],
    player: { x: 0, y: 0, facing: 'right', state: 'idle', runTimer: null },
    moves: 0,
    solution: [],
    showSolution: false,
  })

  const flatCells = computed(() => state.value.grid.flat())

  function initEmptyGrid(r: number, c: number) {
    const arr = []
    for (let y = 0; y < r; y++) {
      const row = []
      for (let x = 0; x < c; x++) {
        row.push({ x, y, required: Infinity, remaining: Infinity, visits: 0 })
      }
      arr.push(row)
    }
    state.value.grid = arr
  }

  // generate a solvable grid by producing a random walk that covers all cells at least once.
  function generate() {
    state.value.rows = state.value.settingsRows
    state.value.cols = state.value.settingsCols
    initEmptyGrid(state.value.rows, state.value.cols)
    const walk = producePartialWalk(state.value.rows, state.value.cols)
    state.value.solution = [...walk]

    // compute visit counts
    const counts = Array.from({ length: state.value.rows }, () => Array(state.value.cols).fill(0))
    for (const p of walk) counts[p.y][p.x]++

    for (let y = 0; y < state.value.rows; y++) {
      for (let x = 0; x < state.value.cols; x++) {
        const v = counts[y][x]
        const cell = state.value.grid[y][x]
        cell.visits = v
        if (v > 2) {
          cell.required = Infinity
          cell.remaining = Infinity
        }
        else {
          cell.required = v
          cell.remaining = v
        }
      }
    }

    // place player at first walk position
    const start = walk[0]
    stepOnCell(start.x, start.y)

    state.value.player.x = start.x
    state.value.player.y = start.y
    state.value.moves = 0
    state.value.showSolution = false
  }

  function producePartialWalk(R: number, C: number, targetFraction: number = 0.8): IPosition[] {
    // targetFraction: fraction of total cells to cover in the walk
    // e.g., 0.5 means cover half the cells at least once
    const total = R * C
    const targetLength = Math.max(1, Math.floor(total * targetFraction))

    const sx = Math.floor(Math.random() * C)
    const sy = Math.floor(Math.random() * R)

    const visited = Array.from({ length: R }, () => Array(C).fill(false))
    const walk: IPosition[] = [{ x: sx, y: sy }]
    visited[sy][sx] = true

    let length = 1
    let attempts = 0

    while (length < targetLength && attempts < 50000) {
      const cur = walk[walk.length - 1]
      const neighbors = shuffle(neighborsOf(cur.x, cur.y, C, R))

      // priority to unvisited neighbors
      let chosen = neighbors.find(n => !visited[n.y][n.x])
      if (!chosen) {
        // if all neighbors visited, pick random
        chosen = neighbors[Math.floor(Math.random() * neighbors.length)]
      }

      walk.push(chosen)
      if (!visited[chosen.y][chosen.x]) {
        visited[chosen.y][chosen.x] = true
      }

      length++
      attempts++
    }

    // add some extra random steps to increase complexity
    const extraSteps = Math.floor(Math.random() * (targetLength / 3))
    for (let i = 0; i < extraSteps; i++) {
      const cur = walk[walk.length - 1]
      const neighbors = neighborsOf(cur.x, cur.y, C, R)
      const chosen = neighbors[Math.floor(Math.random() * neighbors.length)]
      walk.push(chosen)
    }

    return walk
  }

  function neighborsOf(x: number, y: number, C: number, R: number): IPosition[] {
    const arr = []
    if (x > 0) arr.push({ x: x - 1, y })
    if (x < C - 1) arr.push({ x: x + 1, y })
    if (y > 0) arr.push({ x, y: y - 1 })
    if (y < R - 1) arr.push({ x, y: y + 1 })
    return arr
  }

  function shuffle(p: IPosition[]): IPosition[] {
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]]
    }
    return p
  }

  function move(dir: IDirection) {
    const nx = state.value.player.x + (dir === 'left' ? -1 : dir === 'right' ? 1 : 0)
    const ny = state.value.player.y + (dir === 'up' ? -1 : dir === 'down' ? 1 : 0)

    if (dir === 'left') {
      state.value.player.facing = 'left'
    }
    else if (dir === 'right') {
      state.value.player.facing = 'right'
    }

    // check bounds first — do not change state if move won't happen
    if (nx < 0 || ny < 0 || nx >= state.value.cols || ny >= state.value.rows) return

    // prevent moving onto cell with no remaining visits
    const target = state.value.grid[ny][nx]
    if (Number.isFinite(target.remaining) && target.remaining <= 0) {
      return // movement blocked
    }

    // perform move: set running state, update coords and visits
    state.value.player.state = 'run'

    state.value.player.x = nx
    state.value.player.y = ny
    state.value.moves++
    stepOnCell(nx, ny)

    // clear previous timer and schedule returning to idle after moveDurationMs
    if (state.value.player.runTimer) {
      clearTimeout(state.value.player.runTimer)
      state.value.player.runTimer = null
    }
    state.value.player.runTimer = window.setTimeout(() => {
      state.value.player.state = 'idle'
      state.value.player.runTimer = null
    }, CONFIG.moveDurationMs)
  }

  function stepOnCell(x: number, y: number) {
    const cell = state.value.grid[y][x]
    // if remaining is finite and >0, decrement
    if (Number.isFinite(cell.remaining) && cell.remaining > 0) {
      cell.remaining--
    }
  }

  function resetPlayer() {
    if (state.value.solution.length) {
      const start = state.value.solution[0]
      state.value.player.x = start.x
      state.value.player.y = start.y
    }
    else {
      state.value.player.x = 0
      state.value.player.y = 0
    }
    state.value.moves = 0
    // reset remaining
    for (const c of flatCells.value) {
      c.remaining = Number.isFinite(c.required) ? c.required : Infinity
    }
    stepOnCell(state.value.player.x, state.value.player.y)
    // clear any running timer and ensure idle state
    if (state.value.player.runTimer) {
      clearTimeout(state.value.player.runTimer)
      state.value.player.runTimer = null
    }
    state.value.player.state = 'idle'
  }

  const remainingNeeded = computed(() => {
    let count = 0
    for (const c of flatCells.value) {
      if (Number.isFinite(c.required) && c.remaining > 0) count++
    }
    return count
  })

  function cellLabel(cell: ICell): string {
    if (!Number.isFinite(cell.required)) return '∞'
    return String(cell.remaining)
  }

  // keyboard controls
  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') move('up')
    if (e.key === 'ArrowDown') move('down')
    if (e.key === 'ArrowLeft') move('left')
    if (e.key === 'ArrowRight') move('right')
  }

  function toggleShowSolution() {
    state.value.showSolution = !state.value.showSolution
  }

  return {
    state,
    generate,
    onKey,
    resetPlayer,
    flatCells,
    remainingNeeded,
    cellLabel,
    move,
    toggleShowSolution,
  }
})
