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

			vec2 parallaxMap( in vec3 V ) {

				float initialHeight = texture2D( _texture, vUv * _scale ).r;

		// No Offset Limitting: messy, floating output at grazing angles.
		// vec2 texCoordOffset = .2 * V.xy / V.z * initialHeight;

		// Offset Limiting
				vec2 texCoordOffset = _height * V.xy * initialHeight;
        return vUv - texCoordOffset;

// return vUv;
			}


		vec2 perturbUv( vec3 surfPosition, vec3 surfNormal, vec3 viewPosition ) {

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

			return parallaxMap( vProjVtex );

		}

		void main() {

			vec2 mapUv = perturbUv( -vViewPosition, normalize( vNormal ), normalize( vViewPosition ) );
			gl_FragColor += texture2D( _texture, mapUv * _scale );
      // gl_FragColor = vec4(vUv, 0., 1.);
			// gl_FragColor = texture2D( _texture, vUv );
      // gl_FragColor = vec4(0., 1., 0., 1.);

		}
