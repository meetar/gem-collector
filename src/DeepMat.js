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
} from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import ParallaxMaterial from './ParallaxMaterial';
import { parallaxcontrols } from './parallaxcontrols';

const smokeyCrystal = {
  samples: 6,
  transmission: 1,
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
  color: '#f00',
  envMapIntensity:  1.5 ,
  reflectivity:  .5 ,
  clearcoat:  1 ,
  clearcoatRoughness: .28
}


export default function DeepMat({config, geometry, texture, ...props}) {

  const { ...pconfig } = useControls(parallaxcontrols)
  
  const textureUrl = './speckles.png';
  const ptexture = useTexture(textureUrl);

  let { ...crystalconfig } = useControls(smokeyCrystal)
  // debugger
  // Object.assign(crystalconfig, smokeyCrystal)
  const normalMap = useLoader(TextureLoader, './textures/6056-normal.jpg')

  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.repeat.set(2, 2); // Adjust the scale along U and V axes

  ptexture.wrapT = THREE.RepeatWrapping;
  ptexture.wrapS = THREE.RepeatWrapping;
  ptexture.repeat.set(2, 2); // Adjust the scale along U and V axes

  return (
    <>
  <mesh scale={1.003} renderOrder={0} geometry={geometry} transparent={true} castShadow >
          {/* <meshStandardMaterial wireframe={false} color={'red'} wireframeLinewidth={10} /> */}
        <MeshTransmissionMaterial {...config} {...smokeyCrystal} normalMap={normalMap} normalScale={.2} 
          envMap={texture}
          ior={smokeyCrystal.iorOuter}
          clearcoatNormalMap={normalMap}
          clearcoatNormalScale={new THREE.Vector2(.03,.03)}
        />
        </mesh>
  <mesh renderOrder={1} geometry={geometry} castShadow >
          <ParallaxMaterial texture={ptexture} isShaderMaterial config={{...config, ...pconfig}} opacity={config.opacity} transparent={true} />
          </mesh>
    </>
  )
}
