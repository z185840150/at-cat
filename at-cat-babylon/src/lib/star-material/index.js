import * as BABYLON from 'babylonjs'

BABYLON.Effect.ShadersStore['starVertexShader'] = `
  precision highp float;
  // Attributes
  attribute vec3 position;
  attribute vec2 uv;
  
  // Uniforms
  uniform mat4 worldViewProjection;
  
  // Varying
  varying vec2 vUV;
  
  void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.);
    vUV = uv;
  }
`
BABYLON.Effect.ShadersStore['starPixelShader'] = `
  precision highp float;

  uniform float time;

  uniform sampler2D textureSampler;

  varying vec2 vUV;

  const float tau = 6.28318530717958647692;

  // Gamma correction
  #define GAMMA (2.2)

  vec3 ToLinear(in vec3 col) {
    // simulate a monitor, converting colour values into light values
    return pow(col, vec3(GAMMA));
  }

  vec3 ToGamma(in vec3 col) {
    // convert back into colour values, so the correct light will come out of the monitor
    return pow(col, vec3(1.0 / GAMMA));
  }

  vec4 Noise(in ivec2 x) {
    return texture2D(textureSampler, (vec2(x) + 0.5) / 256.0, -100.0);
  }

  vec4 Rand( in int x ) {
    vec2 uv;
    uv.x = (float(x) + 0.5) / 256.0;
    uv.y = (floor(uv.x) + 0.5) / 256.0;
    return texture2D(textureSampler, uv, -100.0);
  }

  void main(void) {
    vec3 ray;
    ray.x = vUV.x;
    ray.y = vUV.y;
    ray.xy = 2.0*(vUV.xy - vec2(1).xy*.5)/1.;
    ray.z = 1.0;

    float offset = time * 0.5;
    float speed2 = (cos(offset) + 1.0) * 2.0;
    float speed = speed2 + .1;
    offset += sin(offset) * .96;
    offset *= 2.0;

    vec3 col = vec3(0);

    vec3 stp = ray / max(abs(ray.x), abs(ray.y));

    vec3 pos = 2.0 * stp + .5;
    for (int i = 0; i < 10; i++) {
      float z = Noise(ivec2(pos.xy)).x;
      z = fract(z - offset);
      float d = 50.0 * z - pos.z;
      float w = pow(max(0.0, 1.0 - 8.0 * length(fract(pos.xy)- .5)), 2.0);
      vec3 c = max(vec3(0), vec3(1.0 - abs(d + speed2 * .5) / speed, 1.0 - abs(d) / speed, 1.0 - abs(d - speed2 * .5) / speed));
      col += 1.5 * (1.0 - z) * c * w;
      pos += stp;
    }

    gl_FragColor = vec4(ToGamma(col), 1.);
    //gl_FragColor = vec4(ray.g, 0, 0, 1.);
  }
`

function StarMaterial (name, scene) {
  return new BABYLON.ShaderMaterial('shader', scene, {
    vertex: 'star', fragment: 'star'
  }, {
    attributes: ['position', 'normal', 'uv'],
    uniforms: [ 'world', 'worldView', 'worldViewProjection', 'view', 'projection', 'time', 'direction' ]
  })
}

BABYLON.StarMaterial = StarMaterial
