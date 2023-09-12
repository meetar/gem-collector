import * as THREE from 'three'
import { EquirectangularReflectionMapping } from 'three';
import { diamondcontrols } from './diamondcontrols'
import SSSMat from './SSSMat'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { Center, MeshTransmissionMaterial, MeshBasicMaterial, Sphere } from '@react-three/drei'
import { Leva, useControls, button } from 'leva'
import { RGBELoader } from 'three-stdlib'
import ParallaxMeshXP from './ParallaxMeshXP'

export default function SSSMesh({geometry, config, normalMap, depthMap}) {
  console.log('depthamP', depthMap);
  diamondcontrols.normalScale = {value: 0.};
  const {...crystalconfig} = useControls('Crystal', diamondcontrols)
// debugger

  // const normalMap = useLoader(TextureLoader, './textures/6056-normal.jpg')

  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping;
  const spacing = .01;

  return (
<>
    <group scale={1 + spacing}>
      <mesh renderOrder={0} geometry={geometry} castShadow transparent={true} opacity={1}>
            <MeshTransmissionMaterial {...config} {...crystalconfig}
            // <MeshBasicMaterial {...config} {...crystalconfig}
              normalMap={normalMap}
              envMap={texture}
              ior={crystalconfig.iorOuter}
              clearcoatNormalMap={normalMap}
              clearcoatNormalScale={new THREE.Vector2(.03,.03)}
            />
      </mesh>
    </group>

    <group scale={1}>
    <ParallaxMeshXP depthMap={depthMap} renderOrder={2} geometry={geometry} config={config} transparent />
      </group>


    <group scale={1 - spacing}>
    <mesh renderOrder={1} geometry={geometry} castShadow transparent={false} >
    <SSSMat transparent={false} />
    </mesh>
      </group>
    </>
  )
}