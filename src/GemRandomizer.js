import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  Center,
  MeshTransmissionMaterial,
  Sphere,
} from '@react-three/drei'
import { MeshBasicMaterial } from 'three';
import { Gem } from "./Gem"

export function GemRandomizer({config, geo, texture, ...props}) {

  // geo = useLoader(GLTFLoader, './gem.glb').scene.children[0].children[0].children[0].children[0].geometry;
  // geo = useLoader(GLTFLoader, './crystal.glb').scene.children[0].children[0].children[0].children[0].children[0].geometry; // scale = 0.001
  // geo = useLoader(GLTFLoader, './crystal1.glb').scene.children[0].geometry; // scale = 0.001
  geo = useLoader(GLTFLoader, './crystal2.glb').scene.children[0].geometry; // scale = 0.001
  console.log(geo);
  // geo = new THREE.SphereGeometry(1.);

  console.log(geo);

  return (
    <>
      <group>



      {/* <Gem config={config} backgroundTexture={texture} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 1]} visible={config.GemVisible} /> */}

{/* <Sphere>
          <meshBasicMaterial color={'red'} />
</Sphere> */}

        <mesh scale={1} geometry={geo}>
          {/* <sphereBufferGeometry args={[1, 10, 10]} /> */}
        {/* <meshBasicMaterial color={'blue'} /> */}
        <meshPhysicalMaterial color={'blue'} />

          {/* <MeshTransmissionMaterial {...config}  transparent={true}
          color='black'
          // opacity={1}
                reflectivity={config.reflectivity} 
                envMap={config.envMap ? texture : null}
                //  envMapIntensity={config.envMapIntensity}
                ior={config.iorOuter}
          /> */}
        </mesh>
      </group>
    </>
  )
}
