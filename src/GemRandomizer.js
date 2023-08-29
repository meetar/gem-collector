import { useEffect, useState, useMemo, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { randomColor } from 'randomcolor';
import {
  Center,
  MeshTransmissionMaterial,
  Sphere,
} from '@react-three/drei'
import { MeshBasicMaterial } from 'three';
import * as _ from 'lodash'

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 256,
    g: parseInt(result[2], 16) / 256,
    b: parseInt(result[3], 16) / 256
  } : null;
}

const randomize = () => {
  console.log('gem randomizer called');
}

const getColor = () => {
  // console.trace('getColor');
  const hexColor = randomColor();
  // console.log(hexColor);
  const rgb = hexToRgb(hexColor)
  // console.log(rgb);
  const threeColor = new THREE.Color(rgb.r, rgb.g, rgb.b);
  // const threeColor = new THREE.Color(1, 0, 0);
  // console.log(threeColor);
  return threeColor;
}


const getModel = () => {
  const meshes = ['./crystal1.glb', './crystal2.glb', './crystal3.glb'];
  const mesh = _.sample(meshes);
  return mesh
}

export function GemRandomizer({config, geo, shapetrigger, materialtrigger, ...props}) {



  const crystalMap = useTexture('./6056-normal.jpg');
  // const [gemConfig, setGemConfig] = useState(null);

const getMaterial = () => {
  console.log('getMaterial, gemConfig?', gemConfig);
  // console.log('getMat');
  const mats = ['shader', 'phong', 'lambert', 'basic'];
  // const mat = _.sample(mats);
  const mat = 'phong';
  // console.log(mat);
  // const matRef = useRef();

  
  // const normalMap = useTexture('./speckles.png');

  const newmaterial = (mat == 'shader' ?
      new THREE.ShaderMaterial({
        uniforms: {
          _color: { value: getColor() }, // use state 
          // _color: { value: matColor }, // necessary?
        },
        fragmentShader: `uniform vec3 _color; void main() {gl_FragColor = vec4(_color, 1.);}`
      })
      : mat == 'phong' ?
      new THREE.MeshPhongMaterial({
        color: getColor(),
        normalMap: crystalMap,
        alphaMap: crystalMap,
        specularMap: crystalMap,
        shininess: 1,
        opacity: gemConfig.opacity,
        transparent: true

      })
      : mat == 'lambert' ?
      new THREE.MeshLambertMaterial({
        color: getColor()
      })
    : 
      new THREE.MeshBasicMaterial({
        color: getColor()
    }))
    console.log('mat opacity:', newmaterial.opacity);
    return newmaterial
}

function newMaterial() {
  setMaterial(getMaterial());
}

function newModel() {
  setModel(getModel);
}

const updateMaterial = (material, properties) => {
  // Update the material's properties from the properties object
  Object.assign(material, properties);
  setMaterial(material); // Trigger re-render
};

  console.log('\n\nGemRandomizer, config:', config);
  const [gemConfig, setGemConfig] = useState(config);
  console.log('gemConfig?', gemConfig);
  const [material, setMaterial] = useState(getMaterial(config));
  // console.log('material?', material);
  const [model, setModel] = useState(getModel);
  useEffect(() => {
    //  this triggers a re-render of the entire component
    if (materialtrigger) {
      console.log('materialtriggered!');
      newMaterial()
    }}, [materialtrigger]);
    useEffect(() => {
      if (shapetrigger) {
        console.log('shapetriggered!');
        // newModel();
    }}, [shapetrigger]);
    useEffect(() => {
      if (materialtrigger) return;
      console.log('      >>> useEffect');
       setGemConfig(config);
       Object.assign(material, config);
       material.needsUpdate = true;
       setMaterial(material);
      }, [config] )

        // Use useFrame to update the material properties over time
  // useFrame(() => {
  //   // You can update material properties here
  // });


  // geo = useLoader(GLTFLoader, './gem.glb').scene.children[0].children[0].children[0].children[0].geometry;
  // geo = useLoader(GLTFLoader, './crystal.glb').scene.children[0].children[0].children[0].children[0].children[0].geometry; // scale = 0.001
  // geo = useLoader(GLTFLoader, './crystal1.glb').scene.children[0].geometry;

  geo = useLoader(GLTFLoader, model).scene.children[0].geometry;
  // geo = new THREE.SphereGeometry(1.);
  // const color = getColor();

  return (
    <>
      <group>

        <mesh scale={1} geometry={geo} material={material}>

        </mesh>
      </group>
    </>
  )
}
