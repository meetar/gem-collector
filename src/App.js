import { useRef } from 'react';
import { RGBELoader } from 'three-stdlib'
import { Canvas, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  Center,
  Text3D,
  Instance,
  Instances,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  AccumulativeShadows,
  MeshTransmissionMaterial,
  MeshRefractionMaterial,
  CubeCamera,
} from '@react-three/drei'
import { useControls, button } from 'leva'

export function App() {
  const { autoRotate, text, shadow, ...gemconfig } = useControls({
    text: 'Inter',
    backside: true,
    backsideThickness: { value: 0.3, min: 0, max: 2 },
    samples: { value: 16, min: 1, max: 32, step: 1 },
    resolution: { value: 1024, min: 64, max: 2048, step: 64 },
    transmission: { value: 1, min: 0, max: 1 },
    clearcoat: { value: 0, min: 0.1, max: 1 },
    clearcoatRoughness: { value: 0.0, min: 0, max: 1 },
    thickness: { value: 0.3, min: 0, max: 5 },
    chromaticAberration: { value: 5, min: 0, max: 5 },
    anisotropy: { value: 0.3, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.5, min: 0, max: 4, step: 0.01 },
    distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
    ior: { value: 1.5, min: 0, max: 2, step: 0.01 },
    opacity: { value: .7, min: 0, max: 1, step: 0.01 },
    color: '#ff9cf5',
    gColor: '#ff7eb3',
    shadow: '#750d57',
    autoRotate: true,
    screenshot: button(() => {
      // Save the canvas as a *.png
      const link = document.createElement('a')
      link.setAttribute('download', 'canvas.png')
      link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'))
      link.click()
    }),
    HDRTexture: true,
    cubeCamera: true,
  })

  const cubeCameraRef = useRef(); // Ref to access the CubeCamera instance
  const btexture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')

  return (
    <Canvas camera={{ position: [20, 5, 10], zoom: 10 }} gl={{ preserveDrawingBuffer: true }}>
      <color attach="background" args={['#f2f2f5']} />

      {/* Create a CubeCamera */}
      <CubeCamera
        ref={cubeCameraRef}
        near={1}
        far={1000}
        resolution={256}
        visible={true}
        >

{(texture) => {
  console.log('cubecam texture?', cubeCameraRef);
  return (

        <InnerGem config={gemconfig} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.5, 1]} backgroundTexture={texture}>
        </InnerGem>
)}}
        </CubeCamera>

      {/** The text and the grid */}
      {/* <Gem config={gemconfig} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.5, 1]} backgroundTexture={
        gemconfig.cubeCamera ? cubeCameraRef.current?.renderTarget.texture :
        gemconfig.HDRTexture ? btexture :
        btexture
      }> */}
      {/* <Gem config={gemconfig} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.5, 1]} backgroundTexture={cubeCameraRef.current?.renderTarget.texture}> */}
      <Gem config={gemconfig} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.5, 1]} backgroundTexture={btexture}>
      </Gem>

      {/** Controls */}
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={-1}
        zoomSpeed={0.25}
        minZoom={0}
        maxZoom={140}
        enablePan={true}
        dampingFactor={0.05}

        enableRotate={true}
      />
    </Canvas>
  )
}

const Grid = ({ number = 10, lineWidth = 0.026, height = 0.5 }) => (
  // Renders a grid and crosses as instances
  <Instances position={[0, -1.02, 0]}>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color="#999" opacity={.5} />
    {Array.from({ length: number }, (_, y) =>
      Array.from({ length: number }, (_, x) => (
        <group key={x + ':' + y} position={[x * 2 - Math.floor(number / 2) * 2, -0.01, y * 2 - Math.floor(number / 2) * 2]}>
          <Instance rotation={[-Math.PI / 2, 0, 0]} />
          <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
        </group>
      ))
    )}
    <gridHelper args={[18, 18, '#bbb', '#bbb']} position={[0, -0.01, 0]} />
  </Instances>
)

function InnerGem({ backgroundTexture, config, font = '/Inter_Medium_Regular.json', ...props }) {
  const gltf = useLoader(GLTFLoader, './gem.glb');
  const geo = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  console.log('backgroundTexture?', backgroundTexture);


  return (
    <>
      <Center scale={[1, 1, 1]} front top {...props}>

      <mesh geometry={geo} rotation={[Math.PI/2, 0, 0]}>
        {/* <MeshTransmissionMaterial {...config} background={texture} /> */}
        <MeshTransmissionMaterial {...config} transparent={true} background={backgroundTexture} />
        {/* <MeshRefractionMaterial envMap={texture} {...config} toneMapped={true} /> */}
        {/* <MeshRefractionMaterial {...config} envMap={backgroundTexture}  /> don't turn on transparency here */}
      </mesh>

      </Center>
      {/* <Grid /> */}
    </>
  )
}

function Gem({ backgroundTexture, config, font = '/Inter_Medium_Regular.json', ...props }) {
  const gltf = useLoader(GLTFLoader, './gem.glb');
  const geo = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  console.log('backgroundTexture?', backgroundTexture);


  return (
    <>
      <Center scale={[1, 1, 1]} front top {...props}>

      <mesh geometry={geo} rotation={[Math.PI/2, 0, 0]}>
        {/* <MeshTransmissionMaterial {...config} background={texture} /> */}
        {/* <MeshTransmissionMaterial {...config} bounces={5} transparent={true} background={backgroundTexture} /> */}
        {/* <meshBasicMaterial {...config} transparent={true} background={backgroundTexture} /> */}
        {/* <MeshRefractionMaterial envMap={texture} {...config} toneMapped={true} /> */}
        <MeshRefractionMaterial bounces={1} envMap={backgroundTexture}  />
      </mesh>

      </Center>
      {/* <Grid /> */}
    </>
  )
}
