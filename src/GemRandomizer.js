import { useEffect, useState, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { randomColor } from 'randomcolor';
import {
  Center,
  MeshTransmissionMaterial,
  Sphere,
} from '@react-three/drei'
import { MeshBasicMaterial } from 'three';
import * as _ from 'lodash'

const meshes = ['./crystal1.glb', './crystal2.glb', './crystal3.glb'];
const mesh = _.sample(meshes);
// console.log(mesh);

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
  console.log(rgb);
  const threeColor = new THREE.Color(rgb.r, rgb.g, rgb.b);
  // const threeColor = new THREE.Color(1, 0, 0);
  // console.log(threeColor);
  return threeColor;
}

export function GemRandomizer({config, geo, testtrigger, colortrigger, ...props}) {
  const [value, setValue] = useState(getColor);
  useEffect(() => {
    //  this triggers a re-render of the entire component
    if (colortrigger) {
      console.log('colortriggered!');
      setValue(getColor);
    }}, [colortrigger]);
  useEffect(() => {
    if (testtrigger) {
      console.log('testtriggered!');
    }}, [testtrigger]);


  // geo = useLoader(GLTFLoader, './gem.glb').scene.children[0].children[0].children[0].children[0].geometry;
  // geo = useLoader(GLTFLoader, './crystal.glb').scene.children[0].children[0].children[0].children[0].children[0].geometry; // scale = 0.001
  // geo = useLoader(GLTFLoader, './crystal1.glb').scene.children[0].geometry;

  geo = useLoader(GLTFLoader, mesh).scene.children[0].geometry;
  // geo = new THREE.SphereGeometry(1.);
  // const color = getColor();

  // memoize the color so it remembers state between renders
  // necessary?
  const matColor = useMemo(() => value, [value]);


  // console.log(geo);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      _color: { value: value }, // this works perfectly fine
      // _color: { value: matColor }, // necessary?
    },
    fragmentShader: `uniform vec3 _color; void main() {gl_FragColor = vec4(_color, 1.);}`
  });

  return (
    <>
      <group>

        <mesh scale={1} geometry={geo} material={material}>

        </mesh>
      </group>
    </>
  )
}
