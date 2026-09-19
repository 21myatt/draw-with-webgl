import { shaderHeader } from './shared'

export const crystalsFragmentShader = `${shaderHeader}
  float crystalShard(vec2 p) {
    vec2 cell = fract(p * (7. + u_species * 2.)) - .5;
    float diamond = 1. - smoothstep(.18, .48, abs(cell.x) + abs(cell.y));
    float edge = 1. - smoothstep(.02, .08, abs(abs(cell.x) - abs(cell.y)));
    return max(diamond * edge, diamond * .55) * (1. - u_moving);
  }
  void main() {
    vec2 p = cursorPoint(); float crystal = crystalShard(p); vec3 base = texture2D(u_texture, vUv).xyz;
    vec3 facets = paletteColor() * crystal * vec3(1.2, .9, .65 + abs(p.x));
    gl_FragColor = vec4(clamp((base * (1. - crystal) + facets) * u_clean, vec3(0.), vec3(1.)), 1.);
  }
`
