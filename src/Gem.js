import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  Center,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { EquirectangularReflectionMapping } from 'three';


export function Gem({ backgroundTexture, config, ...props }) {
  const gltf = useLoader(GLTFLoader, './gem.glb');
  const geo = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  console.log('backgroundTexture?', backgroundTexture);

    backgroundTexture.mapping = EquirectangularReflectionMapping; 
  return (
    <>
      <Center scale={[1, 1, 1]} front top {...props}>

      <mesh geometry={geo} rotation={[Math.PI/2, 0, 0]} visible={true}>
        <MeshTransmissionMaterial {...config}  transparent={true}
        // color='black'
        // opacity={1}
               reflectivity={config.reflectivity} 
               envMap={config.envMap ? backgroundTexture : null}
              //  envMapIntensity={config.envMapIntensity}
               ior={config.iorOuter}
        />
      </mesh>

      </Center>
    </>
  )
}

