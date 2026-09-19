export const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.); }`

export const shaderHeader = `
  #define PI 3.14159265359
  uniform float u_ratio;
  uniform float u_moving;
  uniform float u_stop_time;
  uniform float u_speed;
  uniform vec2 u_stop_randomizer;
  uniform float u_clean;
  uniform vec2 u_point;
  uniform sampler2D u_texture;
  uniform float u_palette;
  uniform float u_species;
  uniform vec2 u_wind;
  varying vec2 vUv;
  float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
  float noise(vec2 n) {
    vec2 b = floor(n), f = smoothstep(vec2(0.), vec2(1.), fract(n));
    return mix(mix(rand(b), rand(b + vec2(1., 0.)), f.x), mix(rand(b + vec2(0., 1.)), rand(b + vec2(1.)), f.x), f.y);
  }
  vec3 paletteColor() {
    vec3 spring = vec3(.9, .35 + u_stop_randomizer.y * .35, 1.5);
    vec3 summer = vec3(.25, 1., .75 + u_stop_randomizer.x * .4);
    vec3 autumn = vec3(1.6, .35 + u_stop_randomizer.y * .25, .08);
    vec3 winter = vec3(.7, .9, 1.8 + u_stop_randomizer.x * .5);
    return u_palette < .5 ? spring : u_palette < 1.5 ? summer : u_palette < 2.5 ? autumn : winter;
  }
  vec2 cursorPoint() { vec2 point = vUv - u_point; point.x *= u_ratio; return point + u_wind * .08; }
`
