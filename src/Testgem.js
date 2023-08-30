import { RGBELoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { InnerGem } from "./InnerGem"
import { Gem } from "./Gem"
import { Leva, useControls, button } from 'leva'
import { gemcontrols } from './gemcontrols'

export function Testgem({config, geometry, texture, ...props}) {
  const { ...diamondconfig } = useControls(gemcontrols)

  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  console.log('texture?', texture);
  return (
    <>
      <group scale={0.999}>
        <InnerGem
          config={diamondconfig}
          backgroundTexture={texture}
          visible={true}
          geometry={geometry}
        />
      </group>

      {/* <Gem config={config} backgroundTexture={texture} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 1]} visible={config.GemVisible} /> */}
      <Gem config={diamondconfig} backgroundTexture={texture} geometry={geometry} />
    </>
  )
}
