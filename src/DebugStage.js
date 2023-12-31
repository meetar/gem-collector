import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useControls, button } from 'leva'
import { OrbitControls } from '@react-three/drei'
import { useTexture, Plane } from '@react-three/drei'
import {
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { randomDepth, randomNormal } from './textureUtils'


export default function DebugStage() {

  const { ...testControls } = useControls({
    normalScale: { value: 0, min: 0, max: 2, step: 0.5 },
    normalTrigger: button( async () => {
      const newNormal = await getNormal()
      console.log('newNormal:', newNormal);
      setNormalMap(newNormal)
    }),
  });
  
  const [normalMap, setNormalMap] = useState(null)

  async function getNormal() {
    console.warn('getNormal:');
    const normalurl = randomNormal();
    const map = await new THREE.TextureLoader().loadAsync(normalurl);
    console.log('map:', map);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // adjust the scale along U and V axes
    return map;
  }


  function Scene() {
    // const normalMap = useTexture('./textures/PavingStones092_1K_normal.jpg')
    // const normalMap = useLoader(TextureLoader, './textures/6056-normal.jpg')
    // const normalMap = useLoader(TextureLoader, './textures/13191-normal.jpg')
    
    // const normalMap = useTexture('./textures/13191-normal.jpg')
    // normalMap.colorspace = THREE.NoColorSpace;
    // normalMap.colorspace = THREE.SRGBColorSpace;
    // normalMap.colorspace = THREE.LinearSRGBColorSpace;
// debugger
    return (
      <>
        {/* <ambientLight intensity={0.2} /> */}
        <directionalLight intensity={1} />
        <mesh>
          {/* <planeGeometry args={[10, 10, 10]} /> */}
          </mesh>
        <mesh>
          {/* Width and height segments for displacementMap */}
          <sphereGeometry args={[1, 100, 100]} />
          <meshStandardMaterial
          // <MeshTransmissionMaterial
            side={THREE.DoubleSide}
            color={'white'}
            // thickness={1}
            // transmissionSampler={true}
            // backside={true}
            // displacementScale={0.2}
            // map={normalMap}
            // displacementMap={displacementMap}
            normalMap={normalMap}
            normalScale={1}
            // normalMap-encoding={THREE.LinearEncoding}
            // normalMap-encoding={THREE.sRGBEncoding}
            // roughnessMap={roughnessMap}
            // aoMap={aoMap}
          />
        </mesh>
      </>
    );
  }

  function TestRock() {

    // const btexture = useTexture('./textures/Cliffs0177_1_350.jpg')
    // btexture.wrapS = THREE.RepeatWrapping;
    // btexture.wrapT = THREE.RepeatWrapping;
    // const normalmap = useTexture('./textures/13191-normal.jpg')
    // normalmap.flipY = true;
    // const normalmap = useTexture('./textures/J3QeZ.png')
    // const normalmap = useTexture('./textures/earth-normalmap.jpg') // correct at first, then broken
    // const normalmap = useTexture('./textures/1160-normal.jpg') // correct
    // const normalmap = useTexture('./textures/hawaii.png') // incorrect
    // const normalmap = useLoader(THREE.TextureLoader, "./textures/hawaii.png");
    // const normalmap = useLoader(THREE.TextureLoader, "./textures/LPS.jpg");
    const normalmap = useTexture('./textures/LPS.jpg') // incorrect
    // const normalmap = useLoader(TextureLoader, "./textures/LPS.jpg");
    // const normalTexture = new THREE.TextureLoader().load('img/earth_normalmap.jpg');
    THREE.ColorManagement.enabled = true;
    normalmap.flipY = false;
    normalmap.wrapS = THREE.RepeatWrapping;
    normalmap.wrapT = THREE.RepeatWrapping;

    // normalmap.colorSpace = THREE.LinearSRGBColorSpace
    // normalmap.colorspace = THREE.NoColorSpace;


    // normalmap.magFilter = THREE.NearestFilter;
    // normalmap.normalMapType = THREE.ObjectSpaceNormalMap;
    // normalmap.normalMapType = THREE.TangentSpaceNormalMap;
    

    // btexture.repeat.set(3, 3); // adjust the scale along U and V axes
    normalmap.repeat.set(2, 2); // adjust the scale along U and V axes
    // normalmap.repeat.set(3, 3); // adjust the scale along U and V axes
    // normalTexture.repeat.set(3, 3); // adjust the scale along U and V axes
    const test = new THREE.PlaneGeometry(1., 1, 10);
    return (normalMap && 
      <>
      <mesh scale={5} geometry={test} rotation={[-1.4, 0, 0]}>
            <meshStandardMaterial attach="material" color={'grey'} normalScale={0} normalMap={normalmap}  />

           {/* <meshStandardMaterial color={'grey'}  /> */}
          </mesh>

    <group>
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3, 0]}
        args={[16, 16]}
      >
        <meshStandardMaterial
          attach="material"
          color="grey"
          normalMap={normalmap}
          normalScale={1}
        />
      </Plane>
    </group>
    </>
    )
  }


return (
      <Canvas shadows dpr={[2, 4]} camera={{ position: [0, 10, -2], zoom: 2 }} gl={{ preserveDrawingBuffer: true }}>

        {/* <ambientLight intensity={0.1} /> */}
        <directionalLight castShadow position={[0, 10, 0]} intensity={1.5} />
        {/* <pointLight position={[0, 10, 0]} intensity={1} /> */}

        {/* <TestRock /> */}
<Scene />
        


        {/** Controls */}
        <OrbitControls autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.05} enableRotate={true} />

      </Canvas>
      )
}