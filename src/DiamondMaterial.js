import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { Leva, useControls, button } from 'leva'
import { diamondcontrols } from './diamondcontrols'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import {
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { PerformanceMonitor } from '@react-three/drei';
import { clamp, randomExp } from './utils'

function simpleControls(controlObject) {
  console.log('simpleControls');
  const simplifiedObject = {};
  
  for (const key in controlObject) {
    if (controlObject.hasOwnProperty(key)) {
      if (typeof controlObject[key] == 'boolean') {
        simplifiedObject[key] = controlObject[key];
      }
      else if (typeof controlObject[key] == 'object') {
        simplifiedObject[key] = controlObject[key].value;
      }
      else {
        // debugger
        throw new Error(key, typeof controlObject[key])
      }

    }
  }
  console.log('returning', simplifiedObject);
  return simplifiedObject;
}

function randomizeLevaControls(controlsObject) {
  console.log('randomize');
  const randomizedObject = {};

  for (const key in controlsObject) {
    if (controlsObject.hasOwnProperty(key)) {
      const attribute = controlsObject[key];
      if (typeof attribute === 'object' && 'value' in attribute && 'min' in attribute && 'max' in attribute && 'step' in attribute) {
        const { min, max, step } = attribute;
        const range = (max - min) / step;
        // const randomSteps = Math.floor(Math.random() * (range + 1));
        const randomSteps = Math.floor(randomExp() * (range + 1));
        const randomizedValue = (min + randomSteps * step).toFixed(2); // Round to 2 decimal places for floating-point steps
        const stepMultiplier = Math.round(randomizedValue / step); // Calculate the multiple of 'step'
        const finalValue = step * stepMultiplier; // Adjust the value to align with the step


        randomizedObject[key] = {
          value: finalValue, // Convert the result back to a float
          min,
          max,
          step,
        };
      } else {
        randomizedObject[key] = attribute;
      }
    }
  }

  return randomizedObject;
}

// Example usage:
const levaControls = {
  resolution: { value: 2048, min: 64, max: 2048, step: 64 },
  // Add more attributes as needed
};


export function DiamondMaterial({trigger, config, color, geometry, texture, normalMap, ...props}) {
  console.log('diamond mat');

  // State variable to hold the randomized controls
  const [randomizedControls, setRandomizedControls] = useState(randomizeLevaControls(diamondcontrols));

  const [{ ...diamondconfig }, setDiamondControls] = useControls('Diamond', () => (randomizedControls), {collapsed: true})
  // console.log(JSON.stringify(randomizedControls));

  // Function to re-randomize and update the controls
  const reloadControls = () => {
    // console.log('>>>reloadControls');
    const newRandomizedControls = randomizeLevaControls(diamondcontrols);
    setRandomizedControls(newRandomizedControls);
    // console.log('newRandomizedControls', JSON.stringify(newRandomizedControls));
    // console.warn(simpleControls(newRandomizedControls));
    setDiamondControls(simpleControls(newRandomizedControls));
  };

  // useEffect to re-randomize on component mount
  useEffect(() => {
    console.warn('     *** RELOAD');
    reloadControls();
  }, [trigger]);




  // fps testing - TODO later
  // const [test, setTest] = useState(null)

  // TODO later
  // useEffect(() => {
  //     console.log('performance test', test);
  //     if (!test) return;
  //     let bounces = Math.ceil(5 - 60/test.fps);
  //     console.log('bounces:', bounces);
  //     diamondconfig.bounces = bounces;
  //     setConfig(useControls(diamondcontrols))
  //     console.log('now:', config.bounces);
  // }, [test])
  // console.log('diamond mat, #faces:', geometry.attributes.normal.array.length / 3 / 3);


  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 

  geometry = BufferGeometryUtils.mergeVertices(geometry, 0); // this forces vertex indexing which fixes the 'BufferGeometry is already non-indexed' warning

  return (
    <>
     {/* <PerformanceMonitor bounds={(fps) => [40, 60]} onIncline={(fps) => setTest(fps)} onDecline={(fps) => setTest(fps)} ></PerformanceMonitor> */}
      <group scale={0.999}>

      <mesh geometry={geometry} color={color} {...config} {...diamondconfig} castShadow>
        {/* don't set transparent to true here! I will crash your whole dang machine */}
        <MeshRefractionMaterial  {...diamondconfig} {...config} envMap={texture} 
        ior={diamondconfig.iorInner}
        visible={diamondconfig.GemVisible}
        side={THREE.DoubleSide}
        />
      </mesh>

      </group>

      <mesh geometry={geometry} visible={true}>
        <MeshTransmissionMaterial color={color} {...diamondconfig} {...config}  transparent={true}
          envMap={texture}
          ior={diamondconfig.iorOuter}
          visible={diamondconfig.InnerVisible}
          normalMap={normalMap}

        />
      </mesh>

    </>
  )
}
