import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  Center,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { EquirectangularReflectionMapping } from 'three';


export function Gem({ backgroundTexture, config, ...props }) {
  const gltf = useLoader(GLTFLoader, './models/gem.glb');
  const geo = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  // console.log('backgroundTexture?', backgroundTexture);
console.log(config);
    backgroundTexture.mapping = EquirectangularReflectionMapping; 
  return (
    <>
      <Center scale={[1, 1, 1]} front top {...props}>

      <mesh geometry={geo} rotation={[Math.PI/2, 0, 0]} visible={true}>
        <MeshTransmissionMaterial {...config}  transparent={true}
          envMap={backgroundTexture}
          ior={config.iorOuter}
        />
      </mesh>

      </Center>
    </>
  )
}

