export type IGameConfig = {
  initRows: number
  initCols: number
  moveDurationMs: number
}

export type IGameState = {
  settingsRows: number
  settingsCols: number
  rows: number
  cols: number
  grid: ICell[][]
  player: {
    x: number
    y: number
    facing: 'left' | 'right'
    state: 'idle' | 'run'
    runTimer: number | null
  }
  moves: number
  solution: {
    x: number
    y: number
  }[]
  showSolution: boolean
}

export type ICell = {
  x: number
  y: number
  required: number
  remaining: number
  visits: number
}
export type IPosition = {
  x: number
  y: number
}
export type IDirection = 'up' | 'down' | 'left' | 'right'
