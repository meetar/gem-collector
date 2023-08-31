import { RGBELoader } from 'three-stdlib'
import * as THREE from 'three'
import { AxesHelper } from 'three'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Box, Sphere, Plane, Stats, SoftShadows } from '@react-three/drei'
import { useEffect, useState, Suspense } from 'react'
// import { CSGShape } from './CSGShape'
import { randomControls } from './randomControls'
import { GemRandomizer } from './GemRandomizer'

import { OrbitControls } from '@react-three/drei'
import { useControls, button } from 'leva'
import { AmbientLight } from 'three'


export default function MainStage() {

  const [materialtrigger, setMaterialTrigger] = useState()
  const [shapetrigger, setShapeTrigger] = useState()
  const [gemtrigger, setGemTrigger] = useState()
  const [parallaxtrigger, setParallaxTrigger] = useState()

  // const resetTriggers = () => {
  //   setMaterialTrigger(null)
  //   setShapeTrigger(null)
  //   setParallaxTrigger(null)
  //   setGemTrigger(null)
  // }

  // leva controls which use functions defined in this component
  useControls({
    materialTrigger: button(() => setMaterialTrigger(Math.random())),
    shapeTrigger: button(() => setShapeTrigger(Math.random())),
    parallax: button(() => setParallaxTrigger(Math.random())),
    gem: button(() => setGemTrigger(Math.random())),  
  });
  
  const { ...randomConfig } = useControls(randomControls)

  const SoftShadowsProps = {
    /** Size of the light source (the larger the softer the light), default: 25 */
    size: 25,
    /** Number of samples (more samples less noise but more expensive), default: 10 */
    samples: 10,
    /** Depth focus, use it to shift the focal point (where the shadow is the sharpest), default: 0 (the beginning) */
    focus: 10
  }
return (
      <Canvas shadows dpr={[2, 4]} camera={{ position: [10, 10, -10], zoom: 2 }} gl={{ preserveDrawingBuffer: true }}>
        <SoftShadows {...SoftShadowsProps} />
        <axesHelper args={[1]} />

        <ambientLight intensity={0.1} />
        <directionalLight castShadow position={[0, 10, 0]} intensity={1.5} shadow-mapSize={1024}>
          <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
        </directionalLight>

        <GemRandomizer
          {... {parallaxtrigger, materialtrigger, shapetrigger, gemtrigger }} // use spread syntax to add these vars as props of the same name
          config={randomConfig}
        />

        <Sphere args={[200, 200, 200]} rotation={[-1.5, 0, 0]} position={[0, 195, 0]} receiveShadow>
          <meshStandardMaterial color="white" emissive={'#666666'} transparent={true} opacity={1} side={THREE.BackSide} />
        </Sphere>

        <EffectComposer>
          <Bloom luminanceThreshold={randomConfig.lumThreshold} intensity={randomConfig.bloom ? randomConfig.bloomIntensity : 0} levels={randomConfig.bloomLevels} mipmapBlur />
        </EffectComposer>

        {/** Controls */}
        <OrbitControls autoRotate={randomConfig.autoRotate} autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.05} enableRotate={true} />

        <Stats />
      </Canvas>
      )
}