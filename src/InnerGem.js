import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  Center,
  MeshTransmissionMaterial,
  MeshRefractionMaterial
} from '@react-three/drei'
import { EquirectangularReflectionMapping } from 'three';


export function InnerGem({ camera, backgroundTexture, config, ...props }) {
  const gltf = useLoader(GLTFLoader, './gem.glb');
  const geo = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  console.log('backgroundTexture?', backgroundTexture);
  console.log('camera?', camera);


  return (
    <>
      <Center scale={[1, 1, 1]} front top {...props}>

      <mesh geometry={geo} rotation={[Math.PI/2, 0, 0]}>
        <MeshRefractionMaterial {...config} envMap={backgroundTexture}
        reflectivity={config.reflectivity} 
        ior={config.iorInner}
         />
      </mesh>

      </Center>
    </>
  )
}

