uniform sampler2D _texture;
uniform float _steps;
uniform float _height;
uniform float _scale;
varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

vec3 viewDir; vec2 offset; vec4 color; 

void main() {
  vec3 viewDir = vNormal;
  vec2 uv = vUv;
    
  float facingRatio = dot(vNormal, vec3(0., 0., 1.));
  // viewDir = normalize(vec3(vNormal.x * (facingRatio), vNormal.y, vNormal.z * facingRatio));

  // negate Y so it works with the crystal meshes. I don't know why
  viewDir = normalize(vec3(vNormal.x * (facingRatio), -vNormal.y, vNormal.z * facingRatio));


  vec3 sampleDir = viewDir;
float lum;
  for (float i = _steps + 1.; i >= 0.; i--) {
    float percent = (1. / _steps) * i;
    float next = (1. / _steps) * (i + 1.);

    offset = ( _height * percent * sampleDir.xy / sampleDir.z ) + vUv * _scale;

    lum = ( texture2D( _texture, offset ) ).r; // 
    // if the value of the sampled texture is less than the sampling distance, use it --
    // this pulls in dim values from nearby and bright values from further away
    if (lum >= percent && lum < next) {
      color += vec4(lum);
      break;
    }
  }

  gl_FragColor = vec4(color.rgb, 1.);

  // if (lum > .1) {
  //   gl_FragColor.r = 1.0;
  // }

  // gl_FragColor = vec4(vec3(0.), 1.);      
  // float test = .6;
  // float range = .2;
  // if (uv.x > test - range && uv.x < test + range) {
  //   gl_FragColor.g += 1.;
  // }
  // if (uv.y > test - range && uv.y < test + range) {
  //   gl_FragColor.r += 1.;
  // }
  // // gl_FragColor.rgb = vNormal;
  // uv = fract(uv * 10.);
  // gl_FragColor = vec4(uv.x, uv.y, 0., 1.);
}