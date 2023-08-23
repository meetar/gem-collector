import { InnerGem } from "./InnerGem"
import { Gem } from "./Gem"
import {
  Center,
  MeshTransmissionMaterial,
  MeshRefractionMaterial
} from '@react-three/drei'

export function RefractGeo({geo, config, texture, ...props}) {
  console.log('config?', config);
  return (
    <>
    <Center scale={[1, 1, 1]} center >
      <group scale={0.999}>
        <mesh geometry={geo}
          config={config}
          backgroundTexture={config.HDRTexture ? texture : null}
          visible={config.InnerVisible}
        >
                  <MeshRefractionMaterial {...config} envMap={texture}
        reflectivity={config.reflectivity} 
        ior={config.iorInner} />
        
        </mesh>
      </group>

      <group scale={1}>
        <mesh geometry={geo}
          config={config}
          backgroundTexture={config.HDRTexture ? texture : null}
          visible={config.GemVisible}
        >
        <MeshTransmissionMaterial {...config}  transparent={true}
        // color='black'
        // opacity={1}
               reflectivity={config.reflectivity} 
               envMap={config.envMap ? texture : null}
              //  envMapIntensity={config.envMapIntensity}
               ior={config.iorOuter}
        />

        </mesh>
      </group>
      </Center>
    </>
  )
}
