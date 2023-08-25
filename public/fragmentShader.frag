uniform sampler2D _texture;
uniform float _steps;
uniform float _height;
uniform float _scale;
varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    varying vec3 vPosition;
    uniform sampler2D someTexture;

vec3 viewDir; vec2 offset; vec4 color; 

void main() {
    
      vec2 uv = vUv;
      // offset to rotate around the center of the uvs
      uv = uv - vec2(.5);
    
      // Calculate the model's up vector in world space
      vec3 modelUp = normalize((vModelMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
      // Calculate the model's up vector in view space
      vec3 modelViewUp = normalize((vModelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);

      // Calculate the rotation angle (in radians) about the Z-axis
      float angleRadians = -atan(modelUp.y, modelUp.x);
      // float angleRadians = -atan(modelViewUp.y, modelViewUp.x);
      // float angleRadians = -atan(vNormal.y, vNormal.x);

      mat2 rotationVector = mat2(
        cos(angleRadians), -sin(angleRadians),
        sin(angleRadians), cos(angleRadians)
      );
      // Use the angle to rotate the UV coordinates
      vec2 rotatedUV = rotationVector * uv; // vUv needs to be passed from the vertex shader

      rotatedUV = rotatedUV + vec2(.5);





  float facingRatio = dot(vNormal, vec3(0., 0., 1.));
  // viewDir = normalize(vec3(vNormal.x * (facingRatio), vNormal.y, vNormal.z * facingRatio));

        vec3 viewDir = normalize(vec3(vNormal.x, vNormal.y, vNormal.z));


  vec3 sampleDir = viewDir;
float lum;
  for (float i = _steps + 1.; i >= 0.; i--) {
    float percent = (1. / _steps) * i;
    float next = (1. / _steps) * (i + 1.);

    offset = ( _height * percent * sampleDir.xy / sampleDir.z ) + rotatedUV * _scale;

    lum = ( texture2D( _texture, offset ) ).r; // 
    // if the value of the sampled texture is less than the sampling distance, use it --
    // this pulls in dim values from nearby and bright values from further away
    if (lum >= percent && lum < next) {
      color += vec4(lum);
      break;
    }
  }

  gl_FragColor = vec4(color.rgb, 1.);

//   // if (lum > .1) {
//   //   gl_FragColor.r = 1.0;
//   // }

//   // gl_FragColor = vec4(vec3(0.), 1.);      
//   // float test = .6;
//   // float range = .2;
//   // if (uv.x > test - range && uv.x < test + range) {
//   //   gl_FragColor.g += 1.;
//   // }
//   // if (uv.y > test - range && uv.y < test + range) {
//   //   gl_FragColor.r += 1.;
//   // }
//   // // gl_FragColor.rgb = vNormal;
//   // uv = fract(uv * 10.);
//   // gl_FragColor = vec4(uv.x, uv.y, 0., 1.);

// gl_FragColor.a = 1.;
//   gl_FragColor.rgb = vNormal; 
  // gl_FragColor.rgb = normalize(cameraPosition); 
  // gl_FragColor.rgb = vViewDir * vNormal; 
  // gl_FragColor.rgb = normalize(vViewDir * vNormal);
  // gl_FragColor.rgb = normalize(normalize(vViewDir) * normalize(vNormal));
  // gl_FragColor.rgb = vec3(rotatedUV, 0.);
}