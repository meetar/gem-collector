import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { Leva, useControls, button } from 'leva'
import {
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
  Edges
} from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import ParallaxMaterial from './ParallaxMaterial';
import { parallaxcontrols } from './parallaxcontrols';
import { randomizeLevaControls, simpleControls } from './utils'
import { deepControls } from './deepControls';

// a material with inner depths
export default function DeepMat({trigger, config, color, geometry, normalMap, depthMap, envMap, texture, ...props}) {
  // State variables to hold the randomized controls
  const [randomDeepControls, setRandomDeepControls] = useState(randomizeDeep());
  const [randomPxControls, setRandomPxControls] = useState(randomizeLevaControls(parallaxcontrols));

  function roundToNearest(x, n) {
    return Math.round(x / n) * n;
  }

  function roundValue(attribute) {
    roundToNearest(attribute.value, attribute.step)
  }
  
  function randomizeDeep() {
    const controls = randomizeLevaControls(deepControls);
    controls.transmission.value = 1 - ( controls.transmission.value / 2 );
    controls.opacity.value = 1 - ( controls.opacity.value / 2 );
    controls.roughness.value = controls.roughness.value / 2;

    roundValue(controls.transmission)
    roundValue(controls.opacity)
    roundValue(controls.roughness)
    return controls;
  }

  // set up leva with first version of the randomized controls – don't rely on state being set here yet
  const [{ ...deepConfig }, setDeepControls] = useControls('Deep', () => (deepControls), {collapsed: true})
  const [{ ...parallaxConfig }, setPxControls] = useControls('Parallax', () => (randomPxControls), {collapsed: true})

  // Function to re-randomize and update the controls
  const reloadControls = () => {
    const randomDeep = randomizeDeep()
    setRandomDeepControls(randomDeep);
    setDeepControls(simpleControls(randomDeep));

    const randomPX = randomizeLevaControls(parallaxcontrols);
    setRandomDeepControls(randomPX);
    setPxControls(simpleControls(randomPX));
  };

  // useEffect to re-randomize on component mount
  useEffect(() => {
    reloadControls();
  }, [trigger]);

  deepConfig._displacement = -.01;

  envMap.mapping = EquirectangularReflectionMapping; 
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  
  depthMap.wrapT = THREE.RepeatWrapping;
  depthMap.wrapS = THREE.RepeatWrapping;
  depthMap.repeat.set(2, 2); // Adjust the scale along U and V axes

  return (
    <>
      <mesh scale={1} renderOrder={2} geometry={geometry} transparent={true} castShadow >
        <MeshTransmissionMaterial {...parallaxConfig} {...deepConfig} {...config}
          color={color}
          normalMap={normalMap}
          envMap={envMap}
          clearcoatNormalMap={normalMap}
          clearcoatNormalScale={new THREE.Vector2(.03,.03)}
          side={THREE.DoubleSide}
        />
        </mesh>
        <mesh scale={.99} renderOrder={1} geometry={geometry} >
          <ParallaxMaterial
          config={{...config, ...parallaxConfig, ...deepConfig}}
          texture={depthMap}
          color={color} // TODO: is the parallaxMaterial color being used?
          isShaderMaterial
          opacity={config.opacity}
          transparent={true}
          />
        </mesh>
    </>
  )
}
