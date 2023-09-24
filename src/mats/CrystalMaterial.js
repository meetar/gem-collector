import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { randomizeLevaControls, simpleControls } from '../utils';

const smokeyCrystal = {
  samples: { value: 6, min: 1, max: 32, step: 1 },
  transmission: { value: .7, min: .3, max: 1, step: 0.01 },
  thickness: { value: .49, min: .05, max: 1, step: 0.01 },
  chromaticAberration: { value: .2, min: 0, max: 1, step: 0.01 },
  anisotropy: { value: 1, min: 0, max: 1, step: 0.01 },
  roughness: { value: 11, min: 0, max: 100, step: 0.01 },
  distortion: { value: 1.62, min: 0, max: 10, step: 0.01 },
  roughness: { value:  .4, min: .1, max: 1, step: 0.01 },
  distortion: { value:  0.5, min: 0, max: 1, step: 0.01 },
  distortionScale: { value:  0.15, min: 0, max: 1, step: 0.01 },
  ior: { value:  1.5, min: 0.9, max: 2.5, step: 0.01 },
  opacity: { value:  1, min: 0, max: 1, step: 0.01 },
  envMapIntensity: { value:  1.5, min: 0, max: 1, step: 0.01 },
  reflectivity: { value:  .5, min: 0, max: 1, step: 0.01 },
  clearcoat: { value:  1, min: 0, max: 1, step: 0.01 },
  clearcoatRoughness: { value: .28, min: 0, max: 1, step: 0.01 },
  clearcoatNormalScale: { value: .03, min: 0, max: .4, step: 0.01 },
  normalScale: { value: .28, min: 0, max: .3, step: 0.01 },
}

// a hazy semi-transparent material
export default function CrystalMaterial({trigger, config, color, geometry, texture, envMap, normalMap}) {

  function randomizeCrystals() {
    const controls = randomizeLevaControls(smokeyCrystal);

    // space for material tuning

    return controls;
  }

  // Leva setup - initialize controls when component mounts
  const [{ ...crystalConfig }, setCrystalControls] = useControls('Crystal', () => (randomizeCrystals()), {collapsed: true});

  // function to re-randomize and update the controls
  const reloadControls = () => {
    setCrystalControls(simpleControls(randomizeCrystals()));
  };

  // useEffect to re-randomize on component mount
  useEffect(() => {
    reloadControls();
  }, [trigger]);
    
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.repeat.set(2, 2); // adjust the scale along U and V axes

  return (
    <>
        <MeshTransmissionMaterial color={color} {...crystalConfig} {...config}
          normalMap={normalMap}
          envMap={envMap}
          clearcoatNormalMap={normalMap}
          side={THREE.DoubleSide}
          backside={true}
        />
    </>
  )
}
