import { useEffect, useRef } from 'react'
import { FlowerScene } from '../webgl/FlowerScene'

type FlowerCanvasProps = { onReady: (actions: { clear: () => void; plant: () => void; setMode: (index: number) => void; setPalette: (index: number) => void; setSpecies: (index: number) => void; setWind: (x: number, y: number) => void }) => void; onActivity: () => void; onDrawingChange: (drawing: boolean) => void }

export function FlowerCanvas({ onReady, onActivity, onDrawingChange }: FlowerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    const scene = new FlowerScene(canvasRef.current, { onActivity, onDrawingChange })
    onReady({ clear: () => scene.clear(), plant: () => scene.plant(), setMode: (index) => scene.setMode(index), setPalette: (index) => scene.setPalette(index), setSpecies: (index) => scene.setSpecies(index), setWind: (x, y) => scene.setWind(x, y) })
    return () => scene.destroy()
  }, [onReady])
  return <canvas ref={canvasRef} aria-label="Interactive WebGL flower canvas" />
}
