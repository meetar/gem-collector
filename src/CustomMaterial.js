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
      fragmentShader: shader.frag
    })
    
    
    // console.log(customMaterial.vertexShader);



  // }, [color]);
console.log('mat?', customMaterial);
  // return (customMaterial ? customMaterial : <></>);
  return customMaterial;
};

export default CustomMaterial;