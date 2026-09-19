import { shaderHeader } from './shared'

export const flowersFragmentShader = `${shaderHeader}
  float petals(vec2 p) {
    float n = 3. + u_species;
    float angle = atan(p.y, p.x) + noise(vUv * 24.) * .2 / (1. + u_stop_time * 20.);
    float sector = abs(sin(angle * n * .5)) + .5;
    float radius = length(p) * (5. + 16. * u_stop_randomizer.x);
    float bloom = 1. / min(20000. * u_stop_time, 1.);
    return (1. - smoothstep(0., sector, radius * bloom)) * (1. - u_moving) * (1. - step(1., u_stop_time));
  }
  void main() {
    vec2 p = cursorPoint(); float flower = petals(p); float center = petals(p * .22);
    vec3 mark = paletteColor() * flower + vec3(-.5) * center;
    vec3 base = texture2D(u_texture, vUv).xyz;
    gl_FragColor = vec4(clamp((base * (1. - flower) + mark) * u_clean, vec3(0.), vec3(1.)), 1.);
  }
`
