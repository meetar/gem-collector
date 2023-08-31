import { EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { InnerGem } from "./InnerGem"
import { Gem } from "./Gem"
import { Leva, useControls, button } from 'leva'
import { diamondcontrols } from './diamondcontrols'
import {
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
} from '@react-three/drei'

export function DiamondMaterial({config, geometry, texture, ...props}) {
  const { ...diamondconfig } = useControls(diamondcontrols)

  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 

  return (
    <>
      <group scale={0.999}>

      <mesh geometry={geometry} castShadow>
        {/* don't set transparent to true here! I will crash */}
        <MeshRefractionMaterial {...config} {...diamondconfig} envMap={texture} 
        ior={diamondconfig.iorInner}
         />
      </mesh>

      </group>

      {/* <Gem config={config} backgroundTexture={texture} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 1]} visible={config.GemVisible} /> */}
      {/* <Gem config={diamondconfig} backgroundTexture={texture} geometry={geometry} /> */}
      <mesh geometry={geometry} visible={true}>
        <MeshTransmissionMaterial {...config} {...diamondconfig}  transparent={true}
          envMap={texture}
          ior={diamondconfig.iorOuter}
        />
      </mesh>

    </>
  )
}
