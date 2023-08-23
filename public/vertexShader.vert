varying vec2 vUv;
varying vec3 vViewDir; // Varying for the view direction
varying vec3 vNormal; // Varying for the face normal
varying vec3 vBitangent;
varying vec3 vViewPosition;

attribute vec4 tangent;

void main() {
  vec4 modelViewPos = modelViewMatrix * vec4(position, 1.0);
  vUv = uv;

  vNormal = normalize(normalMatrix * normal);
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  vViewDir = -modelViewPosition.xyz; // Pointing from the fragment to the camera

  vViewPosition = -modelViewPosition.xyz;

  gl_Position = projectionMatrix * modelViewPosition;
}