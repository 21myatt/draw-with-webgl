import * as THREE from 'three'
import { fragmentShader, vertexShader } from './shaders'
import { createPointerInput, type PointerState } from './pointerInput'

type Uniforms = { [key: string]: THREE.IUniform }
type FlowerSceneCallbacks = { onActivity: () => void; onDrawingChange: (drawing: boolean) => void }

export class FlowerScene {
  private readonly renderer: THREE.WebGLRenderer
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10)
  private readonly shaderScene = new THREE.Scene()
  private readonly basicScene = new THREE.Scene()
  private readonly material: THREE.ShaderMaterial
  private readonly basicMaterial: THREE.MeshBasicMaterial
  private readonly targets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget]
  private readonly pointer: { state: PointerState; destroy: () => void }
  private readonly clock = new THREE.Clock()
  private readonly resizeHandler: () => void
  private raf = 0

  constructor(canvas: HTMLCanvasElement, callbacks: FlowerSceneCallbacks) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.targets = [this.createTarget(), this.createTarget()]
    const uniforms: Uniforms = {
      u_stop_time: { value: 0 }, u_point: { value: new THREE.Vector2(.5, .35) }, u_moving: { value: 0 },
      u_speed: { value: 0 }, u_stop_randomizer: { value: new THREE.Vector2(Math.random(), Math.random()) },
      u_clean: { value: 1 }, u_ratio: { value: window.innerWidth / window.innerHeight }, u_texture: { value: null }, u_palette: { value: 0 }, u_species: { value: 2 }, u_mode: { value: 0 }, u_wind: { value: new THREE.Vector2() },
    }
    this.material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
    this.basicMaterial = new THREE.MeshBasicMaterial()
    const geometry = new THREE.PlaneGeometry(2, 2)
    this.shaderScene.add(new THREE.Mesh(geometry, this.material)); this.basicScene.add(new THREE.Mesh(geometry, this.basicMaterial))
    this.pointer = createPointerInput(canvas, (drawing) => { this.pointer.state.moved = true; callbacks.onDrawingChange(drawing) }, callbacks.onActivity)
    this.resizeHandler = () => { this.clear(); this.resize() }
    window.addEventListener('resize', this.resizeHandler)
    window.setTimeout(() => { this.pointer.state.x = .7; this.pointer.state.y = .5; this.pointer.state.moved = true }, 400)
    this.resize(); this.render()
  }

  private createTarget() { return new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight) }
  private resize() { this.renderer.setSize(window.innerWidth, window.innerHeight); this.material.uniforms.u_ratio.value = window.innerWidth / window.innerHeight }
  clear() { this.material.uniforms.u_clean.value = 0; window.setTimeout(() => { this.material.uniforms.u_clean.value = 1 }, 50) }
  setPalette(index: number) { this.material.uniforms.u_palette.value = ((index % 4) + 4) % 4 }
  plant() { this.pointer.state.moved = true }
  setSpecies(index: number) { this.material.uniforms.u_species.value = Math.max(0, Math.min(4, index)); this.pointer.state.moved = true }
  setMode(index: number) { this.material.uniforms.u_mode.value = ((index % 5) + 5) % 5; this.pointer.state.moved = true }
  setWind(x: number, y: number) { this.material.uniforms.u_wind.value.set(x, y) }
  private render = () => {
    const state = this.pointer.state; const uniforms = this.material.uniforms
    uniforms.u_clean.value = uniforms.u_clean.value === 0 ? 0 : 1; uniforms.u_point.value.set(state.x, 1 - state.y); uniforms.u_texture.value = this.targets[0].texture; uniforms.u_speed.value = state.speed
    if (state.moved) { uniforms.u_moving.value = 1; uniforms.u_stop_randomizer.value.set(Math.random(), Math.random()); if (window.innerWidth < 650) uniforms.u_stop_randomizer.value.x = .8 + uniforms.u_stop_randomizer.value.x * .2; uniforms.u_stop_time.value = 0; state.moved = false } else uniforms.u_moving.value = 0
    uniforms.u_stop_time.value += this.clock.getDelta()
    this.renderer.setRenderTarget(this.targets[1]); this.renderer.render(this.shaderScene, this.camera); this.basicMaterial.map = this.targets[1].texture
    this.renderer.setRenderTarget(null); this.renderer.render(this.basicScene, this.camera)
    const old = this.targets[0]; this.targets[0] = this.targets[1]; this.targets[1] = old
    this.raf = requestAnimationFrame(this.render)
  }
  destroy() { cancelAnimationFrame(this.raf); window.removeEventListener('resize', this.resizeHandler); this.pointer.destroy(); this.material.dispose(); this.basicMaterial.dispose(); this.targets.forEach((target) => target.dispose()); this.renderer.dispose() }
}
