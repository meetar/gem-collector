uniform float _steps;
uniform float _height;
uniform float _scale;
uniform float _opacity;
uniform sampler2D _texture;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

vec3 viewDir; vec2 offset; vec4 color;

vec2 parallaxMap( in vec3 V , in float offset) {

  // float initialHeight = texture2D( _texture, vUv * _scale ).r;
  float initialHeight = 1.;

  // No Offset Limitting: messy, floating output at grazing angles.
  vec2 texCoordOffset = _height * offset * V.xy / V.z * initialHeight;

  // Offset Limiting
  // vec2 texCoordOffset = _height * V.xy * initialHeight;
  return vUv - texCoordOffset;

}


// This function is used for perturbing UV coordinates based on the Parallax Mapping technique, which simulates a 3D effect on a 2D surface by displacing texture coordinates.
		vec2 perturbUv( vec3 surfPosition, vec3 surfNormal, vec3 viewPosition, float offset ) {
    // surfPosition: This is the world-space position of the current point on the surface being rendered.
    // surfNormal: This is the world-space normal vector at the current point on the surface.
    // viewPosition: This is the world-space position of the camera or viewer.
    // offset: This is the offset factor that determines the depth of the parallax effect. It controls how far the texture appears to be displaced.

      // dFdx and dFdy are built-in GLSL functions that calculate the partial derivatives of a variable with respect to the screen-space x and y coordinates, respectively. They are used to compute the rate of change of the texture coordinates in screen space.

      // partial derivatives of the texture coordinates (vUv) with respect to the screen-space x and y coordinates.
 			vec2 texDx = dFdx( vUv );
			vec2 texDy = dFdy( vUv );

      // partial derivatives of surfPosition with respect to screen-space x and y coordinates. They represent the change in the world-space position along the x and y axes in screen space.
			vec3 vSigmaX = dFdx( surfPosition );
			vec3 vSigmaY = dFdy( surfPosition );

      // vR1 and vR2 are tangent vectors used to build the TBN (tangent, bitangent, normal) matrix, which is used to transform vectors from tangent space to view space.
			vec3 vR1 = cross( vSigmaY, surfNormal );
			vec3 vR2 = cross( surfNormal, vSigmaX );
      // fDet is the determinant of the TBN matrix. It's used as part of the transformation process.
			float fDet = dot( vSigmaX, vR1 );

      // vProjVscr is a 2D vector that contains the projected view vector onto the tangent plane of the surface. It's calculated using the tangent vectors and the view position.
			vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );

      // vProjVtex is a 3D vector that contains the perturbed view vector in texture space. It's calculated by transforming the projected view vector in screen space back into texture space using the partial derivatives of the UV coordinates.
			vec3 vProjVtex;
			vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;
			vProjVtex.z = dot( surfNormal, viewPosition );

      // return vProjVtex.xy;

      // parallaxMap performs the actual parallax mapping calculation. It takes the perturbed view vector and the offset as arguments to return the new UV coordinates after applying the parallax effect.
			return parallaxMap( vProjVtex , offset);

		}

void main() {
float lum;
// vec4 color = vec4(.5, 1., .5, 1.);
vec4 color = vec4(0., 1., 0., 0.);
float offset;

for (float i = _steps + 1.; i >= 0.; i--) {
  float percent = (1. / _steps) * i;
  float next = (1. / _steps) * (i + 1.);

  offset = ( percent);
  // offset = ( _height * percent) + mapUv * _scale;
  vec2 mapUv = perturbUv( -vViewPosition, normalize( vNormal ), normalize( vViewPosition ), offset);

  gl_FragColor = vec4(mapUv, 0., 1.);

  lum = texture2D( _texture, mapUv  * _scale ).r; //
  // lum = ( texture2D( _texture, offset ) ).r; //
  // if the value of the sampled texture is less than the sampling distance, use it --
  // this pulls in dim values from nearby and bright values from further away
    // color += vec4(lum);

  if (lum > percent && lum <= next) {
  // if (lum > percent) {
    color.a = 1.;
    // color.a = lum;
    break;
    // if (lum > 0.) {
    //   // color.a = lum - 1.;
    //   break;
    } else {
      color.a = 0.;
    }
  }

  // if (lum < 0.1) {color = vec4(1., 0., 0., 1.);}
  // color = vec4(lum, lum, lum, 1.);
// }

gl_FragColor = color;
}