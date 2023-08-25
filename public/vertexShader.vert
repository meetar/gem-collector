  varying vec3 vNormal;
  // varying vec3 vTangent;
  // varying vec3 vBitangent;
  varying vec2 vUv;
  varying vec3 vViewPosition;


  // #define USE_TANGENT

  // attribute vec3 tangent;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    
    // // vTangent = orthogonal(vNormal);
    // // vBtangent = normalize(cross(tangent, normal));
    vViewPosition = -mvPosition.xyz;
    
    // // // Calculate tangent and bitangent in view space
    // // vTangent = normalize(normalMatrix * tangent);
    // // vBitangent = cross(normal, vTangent) * tangent.w; // Assuming tangent.w is the handedness (+1 or -1)

    // Calculate normal in view space
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }