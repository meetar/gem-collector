varying vec2 vUv;
varying vec3 vViewDir; // Varying for the view direction
varying vec3 vNormal; // Varying for the face normal
varying vec3 vBitangent;
varying vec3 vViewPosition;
varying vec3 vWorldViewPosition;
varying mat4 vModelMatrix;
varying mat4 vModelViewMatrix;
varying vec3 vPosition;

attribute vec4 tangent;

// uniform vec3 cameraPosition;

void main() {
  vec4 modelViewPos = modelViewMatrix * vec4(position, 1.0);
  vUv = uv;


  vModelMatrix = modelMatrix;
  vModelViewMatrix = modelViewMatrix;
  vPosition = position;

  vNormal = normalize(normalMatrix * normal);
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  vViewDir = -modelViewPosition.xyz; // Pointing from the fragment to the camera
  // vViewDir = normalize(cameraPosition - vPosition);

  vViewPosition = -modelViewPosition.xyz;


  // // Calculate the dot product between view direction and uv orientation
  // float dotProduct = dot(normalize(vViewDir), vec3(vUv, 0.0));
      
  // // Calculate the angle in radians
  // float angle = acos(dotProduct);
  // // vWorldViewPosition = dot(vViewPosition, vec3(0., 0., -1));

  gl_Position = projectionMatrix * modelViewPosition;
}