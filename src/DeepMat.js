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
  samples: { value: 6, min: 1, max: 64, step: 1 },
  transmission: { value: 1, min: 0, max: 1, step: 0.01 },
  thickness: { value: .1, min: 0, max: 1, step: 0.01 },
  chromaticAberration: { value: .2, min: 0, max: 1, step: 0.01 },
  anisotropy: { value: 1, min: 0, max: 1, step: 0.01 },
  roughness: { value: .2, min: 0, max: 10, step: 0.01 },
  distortion: { value:  0.5, min: 0, max: 1, step: 0.01 },
  distortionScale: { value:  0.15, min: 0, max: 1, step: 0.01 },
  ior: { value:  1.5, min: 0, max: 10, step: 0.01 },
  opacity: { value: .9, min: 0, max: 1, step: 0.01 },
  envMapIntensity: { value:  1.5, min: 0, max: 10, step: 0.01 },
  reflectivity: { value:  .5, min: 0, max: 1, step: 0.01 },
  clearcoat: { value:  1, min: 0, max: 1, step: 0.01 },
  clearcoatRoughness: { value: .28, min: 0, max: 1, step: 0.01 },
  normalScale: { value: .28, min: 0, max: 1, step: 0.01 },
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


export default function DeepMat({config, color, geometry, normalMap, depthMap, texture, ...props}) {
// console.log('DeepMat', config.color);

const [{ ...deepConfig }, setDeepControls] = useControls('Deep', () => (deepControls))

const [{ ...parallaxConfig }, setParallaxControls] = useControls('Parallax', () => (parallaxcontrols))
// const [parallaxConfig, setParallaxConfig] = useState(pconfig)
// const [{ ...dconfig }, setDeepControls] = useControls('Deep', () => (deepControls))
// const [deepConfig, setDeepConfig] = useState(dconfig)

// useEffect(() => {
//   setParallaxConfig(pconfig)
// }, [pconfig])
// useEffect(() => {
//   setDeepConfig(dconfig)
// }, [dconfig])

deepConfig._displacement = -.01;
  
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

  // TODO: is the parallaxMaterial color being used?
  return (
    <>
      <mesh scale={1} renderOrder={2} geometry={geometry} transparent={true} castShadow >
        <MeshTransmissionMaterial color={color} {...parallaxConfig} {...deepConfig} {...config} normalMap={normalMap}
          envMap={texture}
          clearcoatNormalMap={normalMap}
          clearcoatNormalScale={new THREE.Vector2(.03,.03)}
          side={THREE.DoubleSide}

        />
        </mesh>
        <mesh scale={.99} renderOrder={1} geometry={geometry} >
          <ParallaxMaterial texture={depthMap} color={color} isShaderMaterial config={{...config, ...parallaxConfig, ...deepConfig}} opacity={config.opacity} transparent={true} />
        </mesh>
    </>
  )
}
