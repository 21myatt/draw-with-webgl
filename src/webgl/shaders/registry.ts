import type { LucideIcon } from 'lucide-react'
import { Circle, Flower2, Gem, Sparkles, Waves } from 'lucide-react'
import { flowersFragmentShader } from './flowers'
import { starsFragmentShader } from './stars'
import { smokeFragmentShader } from './smoke'
import { crystalsFragmentShader } from './crystals'
import { halosFragmentShader } from './halos'

export type ShaderModeId = 'flowers' | 'stars' | 'smoke' | 'crystals' | 'halos'
export type ShaderMode = { id: ShaderModeId; label: string; fragmentShader: string; icon: LucideIcon }

export const shaderModes: readonly ShaderMode[] = [
  { id: 'flowers', label: 'flowers', fragmentShader: flowersFragmentShader, icon: Flower2 },
  { id: 'stars', label: 'stars', fragmentShader: starsFragmentShader, icon: Sparkles },
  { id: 'smoke', label: 'smoke', fragmentShader: smokeFragmentShader, icon: Waves },
  { id: 'crystals', label: 'crystals', fragmentShader: crystalsFragmentShader, icon: Gem },
  { id: 'halos', label: 'halos', fragmentShader: halosFragmentShader, icon: Circle },
]

export function getShaderMode(id: ShaderModeId) { return shaderModes.find((mode) => mode.id === id) ?? shaderModes[0] }
