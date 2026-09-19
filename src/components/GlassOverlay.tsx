import { MousePointer2, Pause, Sparkles, Trash2 } from 'lucide-react'

type GlassOverlayProps = { started: boolean; drawing: boolean; mode: string; season: string; onClear: () => void; onModeChange: () => void; onSeasonChange: () => void }

export function GlassOverlay({ started, drawing, mode, season, onClear, onModeChange, onSeasonChange }: GlassOverlayProps) {
  const Icon = !started ? MousePointer2 : drawing ? Sparkles : Pause
  const message = !started ? 'move to draw' : drawing ? 'drawing' : 'paused · click to resume'
  return <aside className={`glass-overlay ${started ? 'is-started' : ''} ${drawing ? 'is-drawing' : 'is-paused'}`} aria-live="polite">
    <div className="overlay-mark"><Icon size={15} strokeWidth={1.7} aria-hidden="true" /></div>
    <strong className="overlay-message">{message}</strong>
    <span className="dock-divider" aria-hidden="true" />
    <button className="season-button" type="button" onClick={onModeChange}>{mode}</button>
    <span className="dock-divider" aria-hidden="true" />
    <button className="season-button" type="button" onClick={onSeasonChange}>{season}</button>
    <button className="clear-icon" type="button" aria-label="Clear flowers" title="Clear flowers" onClick={onClear}><Trash2 size={15} strokeWidth={1.7} /></button>
  </aside>
}
