import { shaderHeader } from './shared'

export const halosFragmentShader = `${shaderHeader}
  float haloRings(vec2 p) {
    float radius = length(p); float pulse = fract(u_stop_time * .25 + u_stop_randomizer.x * .5);
    float ringA = 1. - smoothstep(.008, .035 + u_speed * .02, abs(radius - (.08 + pulse * .35)));
    float ringB = 1. - smoothstep(.008, .028, abs(radius - (.18 + pulse * .22)));
    float flare = pow(max(0., 1. - abs(sin(atan(p.y, p.x) * 8.))), 8.) * (1. - smoothstep(.02, .8, radius));
    return (ringA + ringB + flare) * (1. - u_moving);
  }
  void main() {
    vec2 p = cursorPoint(); float halo = haloRings(p); vec3 base = texture2D(u_texture, vUv).xyz;
    vec3 mark = paletteColor() * halo * (1. + u_speed * .35);
    gl_FragColor = vec4(clamp((base * (1. - min(halo, 1.)) + mark) * u_clean, vec3(0.), vec3(1.)), 1.);
  }
`
