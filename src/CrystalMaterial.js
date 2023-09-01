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
  samples: 6,
  transmission: .7,
  thickness: .49,
  chromaticAberration: .2,
  anisotropy: 1,
  roughness: 11,
  distortion: 1.62,
  roughness:  .4 ,
  distortion:  0.5 ,
  distortionScale:  0.15 ,
  iorOuter:  1.5 ,
  opacity:  1 ,
  color: '#666',
  envMapIntensity:  1.5 ,
  reflectivity:  .5 ,
  clearcoat:  1 ,
  clearcoatRoughness: .28
}


export default function CrystalMaterial({config, geometry, texture, ...props}) {
  let { ...smokeyCrystal } = useControls(diamondcontrols)
  // debugger
  // Object.assign(crystalconfig, smokeyCrystal)
  const normalMap = useLoader(TextureLoader, './textures/6056-normal.jpg')

  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.repeat.set(2, 2); // Adjust the scale along U and V axes

  return (
    <>
          <meshStandardMaterial scale={1.1} wireframe={true} color={'red'} wireframeLinewidth={10} />
        <MeshTransmissionMaterial {...config} {...smokeyCrystal} normalMap={normalMap} normalScale={.2} 
          envMap={texture}
          ior={smokeyCrystal.iorOuter}
          clearcoatNormalMap={normalMap}
          clearcoatNormalScale={new THREE.Vector2(.03,.03)}
        />
    </>
  )
}
