uniform float _steps;
uniform float _height;
uniform float _scale;
uniform sampler2D _texture;
varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    varying vec3 vPosition;
		varying vec3 vViewPosition;

vec3 viewDir; vec2 offset; vec4 color; 

			vec2 parallaxMap( in vec3 V , in float offset) {

				float initialHeight = texture2D( _texture, vUv * _scale ).r;

		// No Offset Limitting: messy, floating output at grazing angles.
		vec2 texCoordOffset = _height * offset * V.xy / V.z * initialHeight;

		// Offset Limiting
				// vec2 texCoordOffset = _height * V.xy * initialHeight;
        return vUv - texCoordOffset;

// return vUv;
			}


		vec2 perturbUv( vec3 surfPosition, vec3 surfNormal, vec3 viewPosition, float offset ) {

 			vec2 texDx = dFdx( vUv );
			vec2 texDy = dFdy( vUv );

			vec3 vSigmaX = dFdx( surfPosition );
			vec3 vSigmaY = dFdy( surfPosition );
			vec3 vR1 = cross( vSigmaY, surfNormal );
			vec3 vR2 = cross( surfNormal, vSigmaX );
			float fDet = dot( vSigmaX, vR1 );

			vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );
			vec3 vProjVtex;
			vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;
			vProjVtex.z = dot( surfNormal, viewPosition );

			return parallaxMap( vProjVtex , offset);

		}

void main() {
    
      // Calculate the vector from the current fragment to the camera
      // vec3 viewDirection = normalize(cameraPosition - vPosition); // not quite

      // Calculate the vector from the current fragment to the camera
      // vec3 viewDirection = normalize(cameraPosition - vec3(vUv, -1.0));

      vec2 uv = vUv;
      vec3 viewDir = normalize(vec3(vNormal.x, vNormal.y, vNormal.z));
      vec3 sampleDir = viewDir;
      float lum;

			// vec2 mapUv = perturbUv( -vViewPosition, normalize( vNormal ), normalize( vViewPosition ), offset );

float offset;

  for (float i = _steps + 1.; i >= 0.; i--) {
    float percent = (1. / _steps) * i;
    float next = (1. / _steps) * (i + 1.);

    offset = ( percent);
    // offset = ( _height * percent) + mapUv * _scale;
    vec2 mapUv = perturbUv( -vViewPosition, normalize( vNormal ), normalize( vViewPosition ), offset);



    lum = ( texture2D( _texture, mapUv  * _scale) ).r; // 
    // lum = ( texture2D( _texture, offset ) ).r; // 
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