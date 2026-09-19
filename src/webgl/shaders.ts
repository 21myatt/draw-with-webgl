export const vertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.); }
`

export const fragmentShader = `
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
  uniform float u_mode;
  uniform vec2 u_wind;
  varying vec2 vUv;

  float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
  float noise(vec2 n) {
    const vec2 d = vec2(0., 1.);
    vec2 b = floor(n), f = smoothstep(vec2(0.), vec2(1.), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
  }
  float flower_shape(vec2 point, float size, float outline, float tickniess, float noise_power, float angle_offset) {
    float random_by_uv = noise(vUv);
    float petals_thickness = .5;
    float petals_number = 3. + u_species + floor(u_stop_randomizer[0] * .7);
    float angle_animated_offset = .7 * (random_by_uv - .5) / (1. + 30. * u_stop_time);
    float flower_angle = atan(point.y, point.x) - angle_animated_offset;
    float sectoral_shape = abs(sin(flower_angle * .5 * petals_number + angle_offset)) + tickniess * petals_thickness;
    vec2 size_range = vec2(4., 18.);
    float radial_shape = length(point) * (size_range[0] + size_range[1] * u_stop_randomizer[0]);
    radial_shape += noise_power * sin(flower_angle * 13. + 15. * random_by_uv);
    float radius_grow = 1. / min(20000. * u_stop_time, 1.);
    float shape = 1. - smoothstep(0., size * sectoral_shape, outline * radius_grow * radial_shape);
    shape *= (1. - u_moving) * (1. - step(1., u_stop_time));
    return shape;
  }
  float star_shape(vec2 point) {
    float angle = atan(point.y, point.x);
    float rays = abs(cos(angle * (4. + u_species)));
    float radius = length(point) * (7. + u_stop_randomizer.x * 9.);
    return (1. - smoothstep(0., rays * 1.4, radius)) * (1. - u_moving);
  }
  float smoke_shape(vec2 point) {
    float cloud = noise(point * 18. + u_stop_randomizer * 8.) + noise(point * 42.) * .35;
    float radius = length(point) * (5. + u_stop_randomizer.x * 4.);
    return (1. - smoothstep(.1, 1. + cloud, radius)) * (1. - u_moving);
  }
  float crystal_shape(vec2 point) {
    vec2 grid = abs(fract(point * (10. + u_species * 2.)) - .5);
    float shard = 1. - smoothstep(.18, .5, grid.x + grid.y);
    return shard * (1. - smoothstep(.01, .8, length(point))) * (1. - u_moving);
  }
  float halo_shape(vec2 point) {
    float ring = abs(length(point) - (.12 + u_stop_randomizer.x * .18));
    return (1. - smoothstep(.008, .035 + u_speed * .02, ring)) * (1. - u_moving);
  }
  void main() {
    vec3 base = texture2D(u_texture, vUv).xyz;
    vec2 cursor = vUv - u_point.xy;
    cursor.x *= u_ratio;
    cursor += u_wind * .08;
    vec3 stem_color = vec3(0., 2., 1.5);
    float stem_radius = .003 * u_speed * u_moving;
    float stem_shape = 1. - pow(smoothstep(0., stem_radius, dot(cursor, cursor)), .03);
    vec3 stem = stem_shape * stem_color;
    vec3 spring = vec3(.9, .35 + u_stop_randomizer[1] * .35, 1.5);
    vec3 summer = vec3(.25, 1.0, .75 + u_stop_randomizer[0] * .4);
    vec3 autumn = vec3(1.6, .35 + u_stop_randomizer[1] * .25, .08);
    vec3 winter = vec3(.7, .9, 1.8 + u_stop_randomizer[0] * .5);
    vec3 flower_color = u_palette < .5 ? spring : u_palette < 1.5 ? summer : u_palette < 2.5 ? autumn : winter;
    vec3 flower = flower_color * flower_shape(cursor, 1., .96, 1., .15, 0.);
    vec3 mask = 1. - vec3(flower_shape(cursor, 1.05, 1.07, 1., .15, 0.));
    vec3 middle = vec3(-.6) * flower_shape(cursor, .15, 1., 2., .1, 1.9);
    float star = star_shape(cursor);
    float smoke = smoke_shape(cursor);
    float crystal = crystal_shape(cursor);
    float halo = halo_shape(cursor);
    vec3 artistic_mark = u_mode < .5 ? (flower + middle + stem) :
      u_mode < 1.5 ? vec3(.7, .85, 1.3) * star :
      u_mode < 2.5 ? vec3(.2, .65, .55) * smoke :
      u_mode < 3.5 ? vec3(1.1, .75, .35) * crystal :
      vec3(1.2, .55, .2) * halo;
    float mark_mask = u_mode < .5 ? 1. - flower_shape(cursor, 1.05, 1.07, 1., .15, 0.) : max(star, max(smoke, max(crystal, halo)));
    vec3 color = base * (1. - mark_mask) + artistic_mark;
    color *= u_clean;
    gl_FragColor = vec4(clamp(color, vec3(0.), vec3(1., 1., .4)), 1.);
  }
`
