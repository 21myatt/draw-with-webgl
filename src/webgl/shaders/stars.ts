import { shaderHeader } from './shared'

export const starsFragmentShader = `${shaderHeader}
  float starburst(vec2 p) {
    float angle = atan(p.y, p.x); float rays = abs(cos(angle * (4. + u_species)));
    float radius = length(p) * (7. + u_stop_randomizer.x * 14.);
    float burst = 1. - smoothstep(0., rays * (1.2 + u_speed * .6), radius);
    float points = pow(max(0., rays), 6.) * (1. - smoothstep(.1, 1.2, length(p)));
    return (burst + points) * (1. - u_moving);
  }
  void main() {
    vec2 p = cursorPoint(); float star = starburst(p); float streak = exp(-abs(p.y + p.x * u_wind.x) * 35.) * u_speed * .25;
    vec3 base = texture2D(u_texture, vUv).xyz; vec3 mark = paletteColor() * (star + streak);
    gl_FragColor = vec4(clamp((base * (1. - star) + mark) * u_clean, vec3(0.), vec3(1.)), 1.);
  }
`
