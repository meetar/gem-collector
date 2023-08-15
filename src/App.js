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
    })
  })

  const cubeCameraRef = useRef(); // Ref to access the CubeCamera instance
  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')

  return (
    <Canvas shadows camera={{ position: [30, 40, 30], zoom: 10 }} gl={{ preserveDrawingBuffer: true }}>
      <color attach="background" args={['#f2f2f5']} />

      {/* Create a CubeCamera */}
      <CubeCamera
        ref={cubeCameraRef}
        near={1}
        far={1000}
        resolution={256}
        >

{(texture) => (

        <Gem config={gemconfig} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.5, 1]} backgroundTexture={texture}>
        </Gem>
)}
        </CubeCamera>

      {/** The text and the grid */}
      <Gem config={gemconfig} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.5, 1]} backgroundTexture={cubeCameraRef.current?.renderTarget.texture}>
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
      {/** The environment is just a bunch of shapes emitting light. This is needed for the clear-coat */}
      <Environment resolution={32}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
          <Lightformer type="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
        </group>
      </Environment>
      {/** Soft shadows */}
      {/* <AccumulativeShadows frames={100} color={shadow} colorBlend={5} toneMapped={true} alphaTest={0.9} opacity={1} scale={30} position={[0, -1.01, 0]}>
        <RandomizedLight amount={4} radius={10} ambient={0.5} intensity={1} position={[0, 10, -10]} size={15} mapSize={1024} bias={0.0001} />
      </AccumulativeShadows> */}
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

function Gem({ backgroundTexture, config, font = '/Inter_Medium_Regular.json', ...props }) {
  const gltf = useLoader(GLTFLoader, './gem.glb');
  const geo = gltf.scene.children[0].children[0].children[0].children[0].geometry;



  return (
    <>
      <Center scale={[1, 1, 1]} front top {...props}>

      <mesh geometry={geo} rotation={[Math.PI/2, 0, 0]}>
        {/* <MeshTransmissionMaterial {...config} background={texture} /> */}
        <MeshTransmissionMaterial {...config} background={backgroundTexture} />
      </mesh>

      </Center>
      <Grid />
    </>
  )
}
