import { useEffect } from 'react'
import * as THREE from 'three'
import { EquirectangularReflectionMapping } from 'three';
import { useControls } from 'leva'
import { MeshTransmissionMaterial } from '@react-three/drei'
import ParallaxMaterial from './ParallaxMaterial';
import { parallaxcontrols } from './parallaxcontrols';
import { randomizeLevaControls, simpleControls, roundValue, roundToNearest } from '../utils'
import { deepControls } from './deepControls';

// a material with inner depths
export default function DeepMat({trigger, config, color, geometry, normalMap, depthMap, envMap, texture, ...props}) {
  
  function randomizeDeep() {
    const controls = randomizeLevaControls(deepControls);

    // tune these
    controls.transmission.value = 1 - ( controls.transmission.value / 2 );
    controls.opacity.value = 1 - ( controls.opacity.value / 2 );
    controls.roughness.value = controls.roughness.value / 2;

    // round these off to their nearest 'step' value, or Leva will barf
    roundValue(controls.transmission)
    roundValue(controls.opacity)
    roundValue(controls.roughness)
    return controls;
  }

  // Leva setup - initialize controls with the same methods used to update them in reloadControls
  const [{ ...deepConfig }, setDeepControls] = useControls('Deep', () => (randomizeDeep()), {collapsed: true})
  const [{ ...parallaxConfig }, setPxControls] = useControls('Parallax', () => (randomizeLevaControls(parallaxcontrols)), {collapsed: true})

  // function to re-randomize and update the controls
  const reloadControls = () => {
    const randomDeep = randomizeDeep()
    setDeepControls(simpleControls(randomDeep));

    const randomPX = randomizeLevaControls(parallaxcontrols);
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
  depthMap.repeat.set(2, 2); // adjust the scale along U and V axes

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
