import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  Center,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { EquirectangularReflectionMapping } from 'three';


export function Gem({ geometry, backgroundTexture, config, ...props }) {
  const gltf = useLoader(GLTFLoader, './models/gem.glb');
  // geometry = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  // console.log('backgroundTexture?', backgroundTexture);
console.log(config);
    backgroundTexture.mapping = EquirectangularReflectionMapping; 
  return (
    <>

      <mesh geometry={geometry} visible={true}>
        <MeshTransmissionMaterial {...config}  transparent={true}
          envMap={backgroundTexture}
          ior={config.iorOuter}
        />
      </mesh>

    </>
  )
}

