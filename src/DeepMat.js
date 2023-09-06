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
  thickness: .49,
  chromaticAberration: .2,
  anisotropy: 1,
  roughness:  .4 ,
  distortion:  0.5 ,
  distortionScale:  0.15 ,
  ior:  1.5 ,
  // opacity:  1 ,
  color: '#f00',
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


export default function DeepMat({config, geometry, texture, ...props}) {
console.log('DeepMat', config.color);
  const { ...pconfig } = useControls(parallaxcontrols)
  pconfig._displacement = -.01;
  
  const textureUrl = './speckles.png';
  const ptexture = useTexture(textureUrl);

  let { ...crystalconfig } = useControls(deepControls)
  
  // debugger
  // Object.assign(crystalconfig, deepControls)
  const normalMap = useLoader(TextureLoader, './textures/6056-normal.jpg')

  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  // normalMap.magFilter = THREE.NearestFilter;
  // normalMap.repeat.set(2, 2); // Adjust the scale along U and V axes
  
  ptexture.wrapT = THREE.RepeatWrapping;
  ptexture.wrapS = THREE.RepeatWrapping;
  ptexture.repeat.set(2, 2); // Adjust the scale along U and V axes
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
          <ParallaxMaterial texture={ptexture} isShaderMaterial config={{...config, ...pconfig}} opacity={config.opacity} transparent={true} />
        </mesh>
    </>
  )
}
