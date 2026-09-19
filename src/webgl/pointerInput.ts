export type PointerState = { x: number; y: number; moved: boolean; speed: number; drawingAllowed: boolean }

export function createPointerInput(canvas: HTMLCanvasElement, onClick: (drawing: boolean) => void, onMove: () => void) {
  const state: PointerState = { x: .5, y: .65, moved: false, speed: 0, drawingAllowed: true }
  const move = (event: PointerEvent) => {
    if (!state.drawingAllowed) return
    const nextX = event.clientX / window.innerWidth; const nextY = event.clientY / window.innerHeight
    const dx = 12 * (nextX - state.x); const dy = 12 * (nextY - state.y)
    state.x = nextX; state.y = nextY; state.speed = Math.min(2, dx ** 2 + dy ** 2); state.moved = true
    onMove()
  }
  const click = () => { state.drawingAllowed = !state.drawingAllowed; if (state.drawingAllowed) state.moved = true; onClick(state.drawingAllowed) }
  const touch = (event: TouchEvent) => {
    const point = event.touches[0]; if (!point) return
    const nextX = point.clientX / window.innerWidth; const nextY = point.clientY / window.innerHeight
    const dx = 5 * (nextX - state.x); const dy = 5 * (nextY - state.y)
    state.x = nextX; state.y = nextY; state.speed = Math.min(2, 20 * (dx ** 2 + dy ** 2)); state.moved = true
  }
  canvas.addEventListener('pointermove', move); canvas.addEventListener('click', click); window.addEventListener('touchmove', touch, { passive: true })
  const destroy = () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('click', click); window.removeEventListener('touchmove', touch) }
  return { state, destroy }
}
