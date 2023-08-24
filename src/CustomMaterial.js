import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshBasicMaterial, MeshPhysicalMaterial } from 'three';
import React, { useMemo } from 'react';
import { ShaderMaterial, loadAsync } from 'three';
import { Canvas } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

function fetchShaders() {
//   console.log('fetching');
//   try {
//     let frag = await fetcher('./fragmentShader.frag');
//     let vert = await fetcher('./vertexShader.vert');
//     const shader = { vert, frag };
//     return shader;
//   } catch(e) {
//     console.error(e);
//   }
}
var loader = new THREE.FileLoader();
// debugger
// var result = await loader.loadAsync("./fragmentShader.frag");
// console.log('result?', result);

const [ vert, frag ] = await Promise.all( [
  loader.loadAsync( './vertexShader.vert' ),
  loader.loadAsync( './fragmentShader.frag' ),
] );

var customMaterial;
const CustomMaterial = ({ texture, config, color }) => {
  console.log('texture!', texture);

  // let frag = loader.loadAsync('./fragmentShader.frag', r => {console.log('?', r); return r});
  // console.log('vert?', vert);
  // console.log('frag?', frag);
  // const shader = await fetchShaders();
  const shader = {vert, frag}
  console.log('shader!', shader);

  // customMaterial = useMemo(() => {



    
    // customMaterial = new MeshBasicMaterial({color: color});
    customMaterial = new MeshPhysicalMaterial({color: color});


     // Define vertex and fragment shader code
  const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); // Red color
  }
`;

// Create the ShaderMaterial
customMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
});

customMaterial = new ShaderMaterial({
    uniforms: {
        _texture: { value: texture },
        _steps: { value: config._steps },
        _height: { value: config._height },
        _scale: { value: config._scale }
      },
      vertexShader: shader.vert,
      // fragmentShader: shader.frag
      fragmentShader: `
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
    offset = vUv;

    lum = ( texture2D( _texture, offset ) ).r; // 
    // if the value of the sampled texture is less than the sampling distance, use it --
    // this pulls in dim values from nearby and bright values from further away
    if (lum >= percent && lum < next) {
      color += vec4(lum);
      break;
    }
  }

  gl_FragColor = vec4(color.rgb, 1.);
  // gl_FragColor = vec4(0., 1., 1., 1.);

  // if (lum > .1) {
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
}`
    })
    
    
    // console.log(customMaterial.vertexShader);



  // }, [color]);
console.log('mat?', customMaterial);
  // return (customMaterial ? customMaterial : <></>);
  return customMaterial;
};

export default CustomMaterial;