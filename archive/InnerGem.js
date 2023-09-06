import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  Center,
  MeshTransmissionMaterial,
  MeshRefractionMaterial
} from '@react-three/drei'
import { EquirectangularReflectionMapping } from 'three';


export function InnerGem({ geometry, camera, backgroundTexture, config, ...props }) {

  console.log('config?', config.iorInner);
  
  const gltf = useLoader(GLTFLoader, './models/gem.glb');
  // geometry = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  // console.log('backgroundTexture?', backgroundTexture);
  // console.log('camera?', camera);


  return (
    <>

      <mesh geometry={geometry} castShadow>
        <MeshRefractionMaterial {...config} envMap={backgroundTexture}
        ior={config.iorInner}
         />
      </mesh>

    </>
  )
}

