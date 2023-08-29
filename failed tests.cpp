// simple, no

    void main() {
      // Calculate view direction from fragment to camera
      vec3 viewDirection = normalize(cameraPosition - vec3(vUv, 0.0));
      
      // Offset UVs up from the view's perspective
      vec2 offsetUv = vUv + viewDirection.xy * 1.; // Adjust the offset amount
      
      // Use the offset uv for texture lookup
      gl_FragColor = texture2D(someTexture, offsetUv);
      // gl_FragColor = vec4(1., 1., 0., 1.);
    }

// complex, no

  const vertexShader = `
    varying vec2 vUv;
    varying mat4 vModelMatrix;

    void main() {
      vModelMatrix = modelMatrix;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying mat4 vModelMatrix ;
    // uniform vec3 cameraPosition; // Provided by Three.js
    uniform sampler2D someTexture;
    uniform mat4 modelMatrix; // Model matrix for transforming normals
    
    void main() {
      // Calculate view direction from fragment to camera
      vec3 viewDirection = normalize(cameraPosition - vec3(vUv, 0.0));
      
      // Calculate the model's up vector in world space
      vec3 modelUp = normalize((vModelMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
      
      // Calculate the offset direction based on the camera's up vector
      vec3 offsetDirection = cross(viewDirection, modelUp);
      
      // Offset UVs up from the view's perspective
      vec2 offsetUv = vUv + offsetDirection.xy * 1.; // Adjust the offset amount
      
      // Use the offset uv for texture lookup
      gl_FragColor = texture2D(someTexture, offsetUv);
      // gl_FragColor = vec4(.5, 1., .5, 1.);
    }
  `;


// more complex, no

 const vertexShader = `
    varying vec2 vUv;
    varying mat4 vModelMatrix;
    varying mat4 vModelViewMatrix;

    void main() {
      vModelMatrix = modelMatrix;
      vModelViewMatrix = modelViewMatrix;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    // uniform vec3 cameraPosition; // Provided by Three.js
    uniform sampler2D someTexture;
    
    void main() {
      // Calculate view direction from fragment to camera
      vec3 viewDirection = normalize(cameraPosition - vec3(vUv, 0.0));
    
      // Calculate the camera's up vector in view space
      vec3 cameraUpView = normalize((vModelViewMatrix * vec4(.0, .0, -1.0, 1.0)).xyz);
    
      // Calculate the offset direction based on the camera's up vector
      vec3 offsetDirection = cross(viewDirection, cameraUpView);
    
      // Offset UVs up from the view's perspective
      vec2 offsetUv = vUv + offsetDirection.xy * 1.; // Adjust the offset amount
          
      // Use the offset uv for texture lookup
      gl_FragColor = texture2D(someTexture, offsetUv);
      // gl_FragColor = vec4(.5, 1., .5, 1.);
    }
  `;


// viewangle, no

    varying vec2 vUv;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    // uniform vec3 cameraPosition; // Provided by Three.js
    uniform sampler2D someTexture;
    
    void main() {
      // Calculate the vector from the current fragment to the camera
      vec3 viewDirection = normalize(cameraPosition - vec3(vUv, 0.0));
  
      // // Calculate the view angle based on the x-component of the view direction
      float viewAngle = atan(viewDirection.x, viewDirection.z);
  
      // // Calculate the offset based on the view angle
      vec2 offset = normalize(vec2(viewAngle, 0.0)) * 0.5; // Adjust the multiplier as needed
  
      // // Apply the offset to the UV coordinates
      vec2 uv = vUv - offset;
  
      // // Clamp the UV coordinates to avoid going outside the texture bounds
      // uv = clamp(uv, 0.0, 1.0);
  
      // // Sample the texture at the modified UV coordinates
      vec4 color = texture2D(someTexture, uv);
  
      gl_FragColor = color;
      // gl_FragColor = vec4(0., 1., 0., 1.);  
    }

// no idea

    varying vec2 vUv;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    // uniform vec3 cameraPosition; // Provided by Three.js
    uniform sampler2D someTexture;
    
    void main() {
      // Calculate the vector from the current fragment to the camera
      vec3 viewDirection = normalize(cameraPosition - vec3(vUv, -1.0));
  
      // Calculate the view angle based on the x and y components of the view direction
      float viewAngleX = atan(viewDirection.x, viewDirection.z);
      float viewAngleY = atan(viewDirection.y, viewDirection.z);

      // Calculate the angle between the face normal and the view direction
      float angle = acos(dot(vNormal, viewDirection));
    
  
      // Calculate the offset based on both view angles
      vec2 offset = normalize(vec2(viewAngleX, viewAngleY)) * 0.05; // Adjust the multiplier as needed
    
      // // Apply the offset to the UV coordinates
      vec2 uv = vUv - offset;
  
      // // Clamp the UV coordinates to avoid going outside the texture bounds
      // uv = clamp(uv, 0.0, 1.0);
  
      // // Sample the texture at the modified UV coordinates
      vec4 color = texture2D(someTexture, uv);
  
      gl_FragColor = color;
      // gl_FragColor = vec4(0., 1., 0., 1.);  
    }

// uv viewdirs, hmm

    varying vec2 vUv;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    varying vec3 vNormal;
    uniform sampler2D someTexture;
    
    void main() {
      // Calculate the vector from the current fragment to the camera
      vec3 viewDirection = normalize(cameraPosition - vec3(vUv, -1.0));
  
      // Calculate the angle between the face normal and the view direction
      float angle = acos(dot(vNormal, viewDirection));
    
      // Calculate the angle between the face normal and the view direction
      vec3 normalToView = normalize(vNormal - viewDirection) * .5 + .5;
    
      // Convert the direction vector to spherical angles (per-axis)
      float angleX = atan(normalToView.y, normalToView.z);
      float angleY = atan(normalToView.x, normalToView.z);
      float angleZ = atan(normalToView.y, normalToView.x);
    
          // gl_FragColor = color;
      // gl_FragColor = vec4(0., 1., 0., 1.);  
      gl_FragColor = vec4(normalToView, 1.);  
      // gl_FragColor = vec4(angleX, angleY, angleZ, 1.);  
      // gl_FragColor = vec4(vUv, 0., 1.);  
    }

// rotation matrix? we're getting somewhere

    varying vec2 vUv;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    varying vec3 vNormal;
    uniform sampler2D someTexture;
    
    void main() {
      // Calculate the vector from the current fragment to the camera
      vec3 viewDirection = normalize(cameraPosition - vec3(vUv, -1.0));
  
      // Calculate the rotation axis by taking the cross product of camera's up vector and the face normal
      vec3 rotationAxis = cross(viewDirection, vNormal);
    
      // Calculate the angle of rotation (in radians) based on the dot product of camera's up vector and the face normal
      float angle = acos(dot(viewDirection, vNormal));
    
      // Construct the rotation matrix
      mat3 rotationMatrix = mat3(cos(angle) + rotationAxis.x * rotationAxis.x * (1.0 - cos(angle)),
                                 rotationAxis.x * rotationAxis.y * (1.0 - cos(angle)) - rotationAxis.z * sin(angle),
                                 rotationAxis.x * rotationAxis.z * (1.0 - cos(angle)) + rotationAxis.y * sin(angle),
    
                                 rotationAxis.y * rotationAxis.x * (1.0 - cos(angle)) + rotationAxis.z * sin(angle),
                                 cos(angle) + rotationAxis.y * rotationAxis.y * (1.0 - cos(angle)),
                                 rotationAxis.y * rotationAxis.z * (1.0 - cos(angle)) - rotationAxis.x * sin(angle),
    
                                 rotationAxis.z * rotationAxis.x * (1.0 - cos(angle)) - rotationAxis.y * sin(angle),
                                 rotationAxis.z * rotationAxis.y * (1.0 - cos(angle)) + rotationAxis.x * sin(angle),
                                 cos(angle) + rotationAxis.z * rotationAxis.z * (1.0 - cos(angle)));
    
      // Convert the 2D UV coordinates to a 3D vector with a depth of 0
      vec3 uv3d = vec3(vUv.xy, 0.0);
                               
      // Rotate the UV coordinates by applying the rotation matrix
      vec3 rotatedUV = rotationMatrix * uv3d;

      // // Sample the texture at the rotated UV coordinates
      vec4 color = texture2D(someTexture, rotatedUV.xy);    

      // gl_FragColor = vec4(normalToView, 1.);  
      gl_FragColor = color;  
      // gl_FragColor = vec4(vUv, 0., 1.);  
    }

// weird - sigh

    varying vec2 vUv;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform sampler2D someTexture;
    
    void main() {
      // Calculate the vector from the current fragment to the camera
      vec3 viewDirection = normalize(cameraPosition - vPosition);

      // Calculate the camera's up vector in view space
      vec3 cameraUp = normalize((vModelViewMatrix * vec4(.0, .0, -1.0, 1.0)).xyz);
    
      // Calculate the rotation axis by taking the cross product of the face normal and the camera's up vector
      vec3 rotationAxis1 = cross(vNormal, cameraUp); //
    
      // Calculate the rotation angle (in radians) based on the dot product of the face normal and the camera's up vector
      float angle1 = acos(dot(vNormal, cameraUp));
    
      // Construct the first rotation matrix around the face normal
      mat3 rotationMatrix1 = mat3(
        cos(angle1) + rotationAxis1.x * rotationAxis1.x * (1.0 - cos(angle1)),
        rotationAxis1.x * rotationAxis1.y * (1.0 - cos(angle1)) - rotationAxis1.z * sin(angle1),
        rotationAxis1.x * rotationAxis1.z * (1.0 - cos(angle1)) + rotationAxis1.y * sin(angle1),
        
        rotationAxis1.y * rotationAxis1.x * (1.0 - cos(angle1)) + rotationAxis1.z * sin(angle1),
        cos(angle1) + rotationAxis1.y * rotationAxis1.y * (1.0 - cos(angle1)),
        rotationAxis1.y * rotationAxis1.z * (1.0 - cos(angle1)) - rotationAxis1.x * sin(angle1),
        
        rotationAxis1.z * rotationAxis1.x * (1.0 - cos(angle1)) - rotationAxis1.y * sin(angle1),
        rotationAxis1.z * rotationAxis1.y * (1.0 - cos(angle1)) + rotationAxis1.x * sin(angle1),
        cos(angle1) + rotationAxis1.z * rotationAxis1.z * (1.0 - cos(angle1))
      );
    
      // Calculate the rotation axis for the second rotation based on the camera's up vector
      vec3 rotationAxis2 = cameraUp;
    
      // Calculate the rotation angle (in radians) based on the dot product of the view direction and the camera's up vector
      float angle2 = acos(dot(viewDirection, cameraUp));
    
      // Construct the second rotation matrix around the camera's up vector
      mat3 rotationMatrix2 = mat3(
        cos(angle2) + rotationAxis2.x * rotationAxis2.x * (1.0 - cos(angle2)),
        rotationAxis2.x * rotationAxis2.y * (1.0 - cos(angle2)) - rotationAxis2.z * sin(angle2),
        rotationAxis2.x * rotationAxis2.z * (1.0 - cos(angle2)) + rotationAxis2.y * sin(angle2),
        
        rotationAxis2.y * rotationAxis2.x * (1.0 - cos(angle2)) + rotationAxis2.z * sin(angle2),
        cos(angle2) + rotationAxis2.y * rotationAxis2.y * (1.0 - cos(angle2)),
        rotationAxis2.y * rotationAxis2.z * (1.0 - cos(angle2)) - rotationAxis2.x * sin(angle2),
        
        rotationAxis2.z * rotationAxis2.x * (1.0 - cos(angle2)) - rotationAxis2.y * sin(angle2),
        rotationAxis2.z * rotationAxis2.y * (1.0 - cos(angle2)) + rotationAxis2.x * sin(angle2),
        cos(angle2) + rotationAxis2.z * rotationAxis2.z * (1.0 - cos(angle2))
      );
    
      // Combine the two rotation matrices
      mat3 combinedRotationMatrix = rotationMatrix2 * rotationMatrix1;    
    
      // Convert the 2D UV coordinates to a 3D vector with a depth of 0
      vec3 uv3d = vec3(vUv.xy, 0.0);
                               
      // Rotate the UV coordinates by applying the combined rotation matrix
      vec3 rotatedUV = combinedRotationMatrix * uv3d;
    
      // Sample the texture at the rotated UV coordinates
      vec4 color = texture2D(someTexture, rotatedUV.xy);    

      // gl_FragColor = vec4(normalToView, 1.);  
      gl_FragColor = color;  
      // gl_FragColor = vec4(vUv, 0., 1.);  
    }

// another fail
    varying vec2 vUv;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform sampler2D someTexture;
    
    void main() {
      // // Calculate the vector from the current fragment to the camera
      // vec3 viewDirection = normalize(cameraPosition - vec3(vUv, -1.0));

      // Calculate the normalized view direction
      vec3 viewDirection = normalize(cameraPosition - vPosition); // vPosition needs to be passed from the vertex shader
    
    
      // Calculate the cosine of the angle between the face normal and the view direction
      float cosineAngle = dot(vNormal, viewDirection);

      // Calculate the angle in radians using the arccosine function
      float angle = acos(cosineAngle);

      // Calculate the camera's up vector in view space
      vec3 cameraUp = normalize((vModelViewMatrix * vec4(.0, .0, -1.0, 1.0)).xyz);
    
      // Calculate the rotation axis by taking the cross product of the face normal and the camera's up vector
      // vec3 rotationAxis1 = cross(vNormal, cameraUp); //

      vec2 uv = vUv;
      
      // Calculate the rotation axis by taking the cross product of camera's up vector and the face normal
      vec3 rotationAxis = cross(viewDirection, vNormal);
    
      // // Calculate the angle of rotation (in radians) based on the dot product of camera's up vector and the face normal
      // float angle = acos(dot(viewDirection, vNormal));


      // Use the angle to rotate the UV coordinates
      vec2 rotatedUV = mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
      ) * vUv; // vUv needs to be passed from the vertex shader
    
    
      // uv.xy -=0.5;
      // float s = sin ( angle );
      // float c = cos ( angle );
      // mat2 rotationMatrix = mat2( c, -s, s, c);
      // rotationMatrix *=0.5;
      // rotationMatrix +=0.5;
      // rotationMatrix = rotationMatrix * 2.-1.;
      // uv.xy = uv.xy * rotationMatrix;
      // uv.xy += 0.5;
    
      // // // Sample the texture at the rotated UV coordinates
      // // vec4 color = texture2D(someTexture, uv.xy);    

      // Sample the texture at the rotated UV coordinates
      vec4 color = texture2D(someTexture, rotatedUV);    

      // // // gl_FragColor = vec4(normalToView, 1.);  
      gl_FragColor = color;  
      // gl_FragColor = vec4(vUv, 0., 1.);  
    }

// despair

    varying vec2 vUv;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform sampler2D someTexture;
    
    void main() {
      // Calculate the normalized view direction
      // vec3 viewDirection = normalize(cameraPosition - vPosition); // vPosition needs to be passed from the vertex shader
    
    
      // // Sample the texture at the rotated UV coordinates
      // vec4 color = texture2D(someTexture, vUv);
    
      // Calculate the model's up vector in world space
      vec3 modelUp = normalize((vModelMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
      // Calculate the model's up vector in view space
      vec3 modelViewUp = normalize((vModelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);

      // Calculate the rotation angle (in radians) about the Z-axis
      float angleRadians = -atan(modelUp.y, modelUp.x);

      // Use the angle to rotate the UV coordinates
      vec2 rotatedUV = mat2(
        cos(angleRadians), -sin(angleRadians),
        sin(angleRadians), cos(angleRadians)
      ) * vUv; // vUv needs to be passed from the vertex shader

      // // Sample the texture at the rotated UV coordinates
      vec4 color = texture2D(someTexture, rotatedUV);


      // // // gl_FragColor = vec4(normalToView, 1.);  
      gl_FragColor = color;  
      // gl_FragColor = vec4(vUv, 0., 1.);  
      // gl_FragColor = vec4(modelUp, 1.);  
      gl_FragColor *= vec4(modelUp, 1.);
      
    }

// holy shit progress

  const vertexShader = `
    varying vec2 vUv;
    varying mat4 vModelMatrix;
    varying mat4 vModelViewMatrix;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vModelMatrix = modelMatrix;
      vModelViewMatrix = modelViewMatrix;
      vUv = uv;
      vNormal = normal;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying mat4 vModelMatrix ;
    varying mat4 vModelViewMatrix ;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform sampler2D someTexture;
    
    void main() {
      vec2 uv = vUv;
      // offset to rotate around the center of the uvs
      uv = uv - vec2(.5);
    
      // Calculate the model's up vector in world space
      vec3 modelUp = normalize((vModelMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
      // Calculate the model's up vector in view space
      vec3 modelViewUp = normalize((vModelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);

      // Calculate the rotation angle (in radians) about the Z-axis
      // float angleRadians = -atan(modelViewUp.y, modelViewUp.x);
      float angleRadians = -atan(modelUp.y, modelUp.x);

      // Use the angle to rotate the UV coordinates
      vec2 rotatedUV = mat2(
        cos(angleRadians), -sin(angleRadians),
        sin(angleRadians), cos(angleRadians)
      ) * uv; // vUv needs to be passed from the vertex shader

      rotatedUV = rotatedUV + vec2(.5);

      // // Sample the texture at the rotated UV coordinates
      vec4 color = texture2D(someTexture, rotatedUV);

      gl_FragColor = color;  
    }

    //  pretty close

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
    
      // Calculate the vector from the current fragment to the camera
      // vec3 viewDirection = normalize(cameraPosition - vPosition); // not quite

      // Calculate the vector from the current fragment to the camera
      // vec3 viewDirection = normalize(cameraPosition - vec3(vUv, -1.0));

      vec2 uv = vUv;
      float uvoffset = .5;
      // offset to rotate around the center of the uvs
      uv = uv - vec2(uvoffset);
    
      // Calculate the model's up vector in world space
      vec3 modelUp = normalize((vModelMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
      // // Calculate the model's up vector in view space
      vec3 modelViewUp = normalize((vModelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
      // Calculate the model's up vector in view space
      // vec3 modelViewUp = normalize((vModelMatrix * vec4(-viewDirection, 0.0)).xyz);
      // vec3 modelViewUp = normalize((vModelViewMatrix * vec4(viewDirection, 0.0)).xyz);

      // Calculate the rotation angle (in radians) about the Z-axis
      // float angleRadians = acos(dot(vNormal, viewDirection)); // this works except for horizontal planes

  // vec3 viewDirection = vNormal;
  // float angleRadians = acos(dot(vNormal, viewDirection)); // this works except for horizontal planes

      vec3 viewDirection = normalize(vModelViewMatrix * vec4(vNormal, 0.)).xyz;
      float angleRadians = acos(dot(vNormal, viewDirection)); // this works except for horizontal planes

      // float angleRadians = -atan(modelUp.y, modelUp.x);
      // float angleRadians = atan(modelViewUp.y, modelViewUp.x);
      // float angleRadians = -atan(vNormal.y, vNormal.x);

      mat2 rotationVector = mat2(
        cos(angleRadians), -sin(angleRadians),
        sin(angleRadians), cos(angleRadians)
      );
      // Use the angle to rotate the UV coordinates
      vec2 rotatedUV = rotationVector * uv; // vUv needs to be passed from the vertex shader

      rotatedUV = rotatedUV + vec2(uvoffset);





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

