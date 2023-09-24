import { useEffect, useState } from 'react'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import * as THREE from 'three'
import { EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { Leva, useControls, button } from 'leva'
import { diamondcontrols, diamondcontrolsSlow } from './diamondcontrols'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import {
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { PerformanceMonitor } from '@react-three/drei';
import { randomizeLevaControls, simpleControls } from '../utils'

// a clear material with internal reflections and refractions
export function DiamondMaterial({slow, trigger, config, color, geometry, envMap, normalMap, ...props}) {
  const controls = slow ? diamondcontrolsSlow : diamondcontrols;

  // state variable to hold the randomized controls
  const [randomizedControls, setRandomizedControls] = useState(randomizeLevaControls(controls));
  // set up leva with first version of the randomized controls – don't rely on state being set here yet
  const [{ ...diamondconfig }, setDiamondControls] = useControls('Diamond', () => (randomizedControls), {collapsed: true})

  // function to re-randomize and update the controls
  const reloadControls = () => {
    const newRandomizedControls = randomizeLevaControls(controls);
    setRandomizedControls(newRandomizedControls);
    setDiamondControls(simpleControls(newRandomizedControls));
  };

  // useEffect to re-randomize on component mount
  useEffect(() => {
    reloadControls();
  }, [trigger]);

  // useEffect to re-randomize on component mount
  useEffect(() => {
    if (slow) {
      let controls = simpleControls(randomizedControls)
      controls.bounces = 1;
      controls.samples = 8;
      setDiamondControls(controls);
    }
  }, [slow]);

  geometry = BufferGeometryUtils.mergeVertices(geometry, 0); // this forces vertex indexing which fixes the 'BufferGeometry is already non-indexed' warning

  return (
    <>
     {/* <PerformanceMonitor bounds={(fps) => [40, 60]} onIncline={(fps) => setTest(fps)} onDecline={(fps) => setTest(fps)} ></PerformanceMonitor> */}
      <group scale={0.999}>

      <mesh geometry={geometry} castShadow>
        {/* don't set transparent to true here! I will crash your whole dang machine */}
        <MeshRefractionMaterial  {...diamondconfig} {...config}
        envMap={envMap} 
        color={color}
        envMapIntensity={diamondconfig.envMapIntensity}
        ior={diamondconfig.iorInner}
        side={THREE.DoubleSide}
        visible={diamondconfig.InnerVisible}
        />
      </mesh>

      </group>

      <mesh geometry={geometry} visible={true}>
        <MeshTransmissionMaterial color={color} {...diamondconfig} {...config}  transparent={true}
          // envMap={envMap}
          ior={diamondconfig.iorOuter}
          visible={diamondconfig.GemVisible}
          normalMap={normalMap}
        />
      </mesh>

    </>
  )
}
