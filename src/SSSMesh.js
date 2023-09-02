import * as THREE from 'three'
import { EquirectangularReflectionMapping } from 'three';
import { diamondcontrols } from './diamondcontrols'
import SSSMat from './SSSMat'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { Center, MeshTransmissionMaterial, Sphere } from '@react-three/drei'
import { Leva, useControls, button } from 'leva'
import { RGBELoader } from 'three-stdlib'

export default function SSSMesh({geometry, config}) {

  const {...crystalconfig} = useControls(diamondcontrols)


  const normalMap = useLoader(TextureLoader, './textures/6056-normal.jpg')

  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.repeat.set(2, 2); // Adjust the scale along U and V axes

  return (
<>
    <group scale={1.01}>
    <mesh rotation={[0, 1.4, 0]} geometry={geometry} castShadow transparent={true} opacity={1}>
          <MeshTransmissionMaterial {...config} {...crystalconfig} normalMap={normalMap} normalScale={.2} 
            envMap={texture}
            ior={crystalconfig.iorOuter}
            clearcoatNormalMap={normalMap}
            clearcoatNormalScale={new THREE.Vector2(.03,.03)}
          />
    </mesh>
    </group>
    <mesh rotation={[0, 1.4, 0]} geometry={geometry} castShadow >
    <SSSMat />
    </mesh>
    </>
  )
}