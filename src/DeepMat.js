import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { Leva, useControls, button } from 'leva'
import { diamondcontrols } from './diamondcontrols'
import {
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
  Edges
} from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import ParallaxMaterial from './ParallaxMaterial';
import { parallaxcontrols } from './parallaxcontrols';

const deepControls = {
  samples: 6,
  transmission: 1,
  thickness: .0,
  // thickness: .49,
  chromaticAberration: .2,
  anisotropy: 0,
  roughness:  0 ,
  // anisotropy: 1,
  // roughness:  .2 ,
  distortion:  0.5 ,
  distortionScale:  0.0 ,
  // distortionScale:  0.15 ,
  ior:  1.5 ,
  // opacity:  1 ,
  envMapIntensity:  1.5 ,
  reflectivity:  .5 ,
  clearcoat:  1 ,
  clearcoatRoughness: .28



}

const iceControls = {
  samples: 32,
  transmission: 1,
  thickness: .65,
  chromaticAberration: .79,
  anisotropy: 4.3,
  roughness: .4,
  distortion: 0,
  iorOuter:  1.5 ,
  color: '#fff',
  envMapIntensity:  .6 ,
  reflectivity:  .5 ,
  clearcoat:  1 ,
  clearcoatRoughness: .28
}


export default function DeepMat({config, geometry, normalMap, depthMap, texture, ...props}) {
// console.log('DeepMat', config.color);

const [{ ...pconfig }, setDeepControls] = useControls('Deep', () => (parallaxcontrols))
const [deepConfig, setDeepConfig] = useState(pconfig)

useEffect(() => {
  setDeepConfig(pconfig)
}, [pconfig])

deepConfig._displacement = -.01;
  
  let { ...crystalconfig } = useControls(deepControls)

  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  // normalMap.magFilter = THREE.NearestFilter;
  // normalMap.repeat.set(2, 2); // Adjust the scale along U and V axes
  
  depthMap.wrapT = THREE.RepeatWrapping;
  depthMap.wrapS = THREE.RepeatWrapping;
  depthMap.repeat.set(2, 2); // Adjust the scale along U and V axes
  // ptexture.magFilter = THREE.NearestFilter;

  // eventually check out https://discourse.threejs.org/t/how-to-smooth-an-obj-with-threejs/3950/11
  // for converting from hard to smooth vertex normals - have to combine dupe verts first

  return (
    <>
      <mesh scale={1} renderOrder={2} geometry={geometry} transparent={true} castShadow >
        <MeshTransmissionMaterial {...deepControls} {...config} normalMap={normalMap} normalScale={.2} 
          envMap={texture}
          clearcoatNormalMap={normalMap}
          clearcoatNormalScale={new THREE.Vector2(.03,.03)}
        />
        </mesh>
        <mesh scale={.99} renderOrder={1} geometry={geometry} castShadow >
          <ParallaxMaterial texture={depthMap} isShaderMaterial config={{...config, ...deepConfig}} opacity={config.opacity} transparent={true} />
        </mesh>
    </>
  )
}
