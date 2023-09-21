import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { Leva, useControls, button } from 'leva'
import { diamondcontrols } from './diamondcontrols'
import {
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

const smokeyCrystal = {
  samples: { value: 6, min: 1, max: 32, step: 1 },
  transmission: { value: .7, min: 0, max: 1, step: 0.01 },
  thickness: { value: .49, min: 0, max: 1, step: 0.01 },
  chromaticAberration: { value: .2, min: 0, max: 1, step: 0.01 },
  anisotropy: { value: 1, min: 0, max: 1, step: 0.01 },
  roughness: { value: 11, min: 0, max: 100, step: 0.01 },
  distortion: { value: 1.62, min: 0, max: 10, step: 0.01 },
  roughness: { value:  .4, min: 0, max: 1, step: 0.01 },
  distortion: { value:  0.5, min: 0, max: 1, step: 0.01 },
  distortionScale: { value:  0.15, min: 0, max: 1, step: 0.01 },
  ior: { value:  1.5, min: 0, max: 10, step: 0.01 },
  opacity: { value:  1, min: 0, max: 1, step: 0.01 },
  envMapIntensity: { value:  1.5, min: 0, max: 10, step: 0.01 },
  reflectivity: { value:  .5, min: 0, max: 1, step: 0.01 },
  clearcoat: { value:  1, min: 0, max: 1, step: 0.01 },
  clearcoatRoughness: { value: .28, min: 0, max: 1, step: 0.01 },
  clearcoatNormalScale: { value: .03, min: 0, max: 1, step: 0.01 },
  normalScale: { value: .28, min: 0, max: 1, step: 0.01 },
}

// a hazy material with an inner glow
export default function CrystalMaterial({config, color, geometry, texture, envMap, normalMap}) {
  // console.log('crystalconfig');

  const [{ ...crystalconfig }, setDiamondControls] = useControls('Crystal', () => ({...smokeyCrystal}), {collapsed: true})
  // const [dconfig, setDConfig] = useState(crystalconfig)

  // useEffect(() => {
  //   console.log('updating crystalconfig');
  //   setDConfig(crystalconfig)
  // }, [crystalconfig])

  // let { ...smokeyCrystal } = useControls(smokeyCrystal)
  // debugger
  // object.assign(crystalconfig, smokeyCrystal)
  // setDiamondControls({...smokeyCrystal})
  // console.log('crystal normal:', normalMap);

  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.repeat.set(2, 2); // adjust the scale along U and V axes

  return (
    <>
        <MeshTransmissionMaterial color={color} {...crystalconfig} {...config}
          normalMap={normalMap}
          envMap={envMap}
          clearcoatNormalMap={normalMap}
          side={THREE.DoubleSide}
        />
    </>
  )
}
