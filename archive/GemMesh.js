import { RGBELoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshBasicMaterial, MeshPhysicalMaterial } from 'three';
import { Box, Sphere, Plane, Stats, SoftShadows } from '@react-three/drei'

import {
  Center,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { EquirectangularReflectionMapping } from 'three';


export function GemMesh({ geometry, backgroundTexture, config, ...props }) {
  // const gltf = useLoader(GLTFLoader, './models/gem.glb');
  // const geo = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  backgroundTexture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  console.log('backgroundTexture?', backgroundTexture);

    backgroundTexture.mapping = EquirectangularReflectionMapping; 
  return (
    <>
      <Center scale={[1, 1, 1]} front top {...props}>

      <mesh {...{geometry}} position={[0,1,0]}>
        <meshBasicMaterial color={'blue'}/>
      </mesh>


      </Center>
    </>
  )
}

