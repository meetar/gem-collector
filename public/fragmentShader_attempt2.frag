uniform sampler2D _texture;
uniform float _steps;
uniform float _height;
uniform float _scale;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vViewPosition;
varying vec3 vWorldNormal;
varying vec2 vRotatedUv;

vec3 viewDir;
vec2 offset;
vec4 color;

void main() {
  vec3 viewDir = vViewDir;
  // vec3 viewDir = vWorldNormal;
  // vec3 normal = vNormal;
  vec3 normal = vNormal;
  vec2 uv = vUv;
  // vec2 uv = vRotatedUv;

  vec3 viewDirection = normalize(vViewPosition - vec3(vUv, 0.0));
  // Rotate the UV coordinates based on the view direction
  vec2 rotatedUv = mat2(viewDirection.x, -viewDirection.y, viewDirection.y, viewDirection.x) * vUv * _scale;
  uv = rotatedUv;


  float facingRatio = dot(vNormal, vec3(0., 0., 1.));
  // float radianAngle = atan2(vWorldNormal.z, vWorldNormal.x);

  // negate Y so it works with the crystal meshes. I don't know why
  viewDir = normalize(vec3(normal.x * (facingRatio), -normal.y, normal.z * facingRatio));

  vec3 sampleDir = viewDir;
  float lum;
  for(float i = _steps + 1.; i >= 0.; i--) {
    float percent = (1. / _steps) * i;
    float next = (1. / _steps) * (i + 1.);

    offset = (_height * percent * sampleDir.xy / sampleDir.z) + uv * _scale;

    lum = (texture2D(_texture, offset)).r; // 
    // if the value of the sampled texture is less than the sampling distance, use it --
    // this pulls in dim values from nearby and bright values from further away
    if(lum >= percent && lum < next) {
      color += vec4(lum);
      break;
    }
  }

  gl_FragColor = vec4(color.rgb, 1.);

  // if(lum > .1) {
  //   gl_FragColor.r = 1.0;
  // }

  // gl_FragColor = vec4(vec3(0.), 1.);      
  // if (uv.x > .49 && uv.x < .51) {
  //   gl_FragColor.g += 1.;
  // }
  // if (uv.y > .49 && uv.y < .51) {
  //   gl_FragColor.r += 1.;
  // }
  // gl_FragColor.rgb = vNormal;
  // gl_FragColor.rgb = vWorldNormal;
  // gl_FragColor.rgb = vViewDir;
  // gl_FragColor.rgb = vUv.xyx;
  // gl_FragColor.rgb = vRotatedUv.xyx;
}