import { useEffect, useRef } from 'react'
import { FlowerCanvas } from './components/FlowerCanvas'
import { GlassOverlay } from './components/GlassOverlay'
import { useState } from 'react'

export default function App() {
  const clearRef = useRef<() => void>(() => undefined)
  const [started, setStarted] = useState(false)
  const [drawing, setDrawing] = useState(true)
  const [seasonIndex, setSeasonIndex] = useState(0)
  const [modeIndex, setModeIndex] = useState(0)
  const actionsRef = useRef<{ clear: () => void; plant: () => void; setMode: (index: number) => void; setPalette: (index: number) => void; setSpecies: (index: number) => void; setWind: (x: number, y: number) => void }>({ clear: () => undefined, plant: () => undefined, setMode: () => undefined, setPalette: () => undefined, setSpecies: () => undefined, setWind: () => undefined })
  const seasons = ['spring', 'summer', 'autumn', 'winter']
  const modes = ['flowers', 'stars', 'smoke', 'crystals', 'halos']

  useEffect(() => {
    const clear = () => clearRef.current()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === ' ') { event.preventDefault(); actionsRef.current.plant() }
      if (event.key.toLowerCase() === 'r') clear()
      if (event.key.toLowerCase() === 'c') setSeasonIndex((current) => { const next = (current + 1) % 4; actionsRef.current.setPalette(next); return next })
      if (event.key.toLowerCase() === 'm') setModeIndex((current) => { const next = (current + 1) % 5; actionsRef.current.setMode(next); return next })
      const species = Number(event.key) - 1
      if (species >= 0 && species < 5) actionsRef.current.setSpecies(species)
      const wind = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key]
      if (wind) { event.preventDefault(); actionsRef.current.setWind(wind[0], wind[1]) }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [])

  return <main className="flower-app">
    <FlowerCanvas onReady={(actions) => { actionsRef.current = actions; clearRef.current = actions.clear }} onActivity={() => setStarted(true)} onDrawingChange={setDrawing} />
    <GlassOverlay started={started} drawing={drawing} mode={modes[modeIndex]} season={seasons[seasonIndex]} onModeChange={() => { const next = (modeIndex + 1) % 5; setModeIndex(next); actionsRef.current.setMode(next) }} onSeasonChange={() => { const next = (seasonIndex + 1) % 4; setSeasonIndex(next); actionsRef.current.setPalette(next) }} onClear={() => clearRef.current()} />
  </main>
}
