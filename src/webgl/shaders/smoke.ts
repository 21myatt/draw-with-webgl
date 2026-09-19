import { shaderHeader } from './shared'

export const smokeFragmentShader = `${shaderHeader}
  float smokeCloud(vec2 p) {
    vec2 flow = p + u_wind * u_stop_time * .08;
    float field = noise(flow * 7. + u_stop_randomizer * 5.) * .65 + noise(flow * 18.) * .25 + noise(flow * 40.) * .1;
    float cloud = 1. - smoothstep(.05, .95 + field * .4, length(flow) * (3.5 + u_stop_randomizer.x * 2.));
    return cloud * (1. - u_moving);
  }
  void main() {
    vec2 p = cursorPoint(); float smoke = smokeCloud(p); vec3 base = texture2D(u_texture, vUv).xyz;
    vec3 mark = paletteColor() * smoke * (.7 + noise(p * 20.) * .5);
    gl_FragColor = vec4(clamp((base * (1. - smoke * .7) + mark) * u_clean, vec3(0.), vec3(1.)), 1.);
  }
`
