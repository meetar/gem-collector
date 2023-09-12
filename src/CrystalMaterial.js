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
  samples: { value: 6, min: 0, max: 10, step: 0.01 },
  transmission: { value: .7, min: 0, max: 1, step: 0.01 },
  thickness: { value: .49, min: 0, max: 1, step: 0.01 },
  chromaticAberration: { value: .2, min: 0, max: 1, step: 0.01 },
  anisotropy: { value: 1, min: 0, max: 1, step: 0.01 },
  roughness: { value: 11, min: 0, max: 100, step: 0.01 },
  distortion: { value: 1.62, min: 0, max: 10, step: 0.01 },
  roughness: { value:  .4, min: 0, max: 1, step: 0.01 },
  distortion: { value:  0.5, min: 0, max: 1, step: 0.01 },
  distortionScale: { value:  0.15, min: 0, max: 1, step: 0.01 },
  iorOuter: { value:  1.5, min: 0, max: 10, step: 0.01 },
  opacity: { value:  1, min: 0, max: 1, step: 0.01 },
  envMapIntensity: { value:  1.5, min: 0, max: 10, step: 0.01 },
  reflectivity: { value:  .5, min: 0, max: 1, step: 0.01 },
  clearcoat: { value:  1, min: 0, max: 1, step: 0.01 },
  clearcoatRoughness: { value: .28, min: 0, max: 1, step: 0.01 },
}


export default function CrystalMaterial({config, geometry, texture, normalMap, ...props}) {

  const [{ ...crystalconfig }, setDiamondControls] = useControls('Diamond', () => (smokeyCrystal))
  const [dconfig, setDConfig] = useState(crystalconfig)

  useEffect(() => {
    setDConfig(crystalconfig)
  }, [crystalconfig])

  // let { ...smokeyCrystal } = useControls(smokeyCrystal)
  // debugger
  // Object.assign(crystalconfig, smokeyCrystal)
  console.log('crystal normal:', normalMap);

  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.repeat.set(2, 2); // Adjust the scale along U and V axes

  return (
    <>
          <meshStandardMaterial scale={1.1} wireframe={true} color={'red'} wireframeLinewidth={10} />
        <MeshTransmissionMaterial {...crystalconfig} {...config} normalMap={normalMap} normalScale={0} 
          envMap={texture}
          ior={smokeyCrystal.iorOuter}
          clearcoatNormalMap={normalMap}
          clearcoatNormalScale={new THREE.Vector2(.03,.03)}
        />
    </>
  )
}
