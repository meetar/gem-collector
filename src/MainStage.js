import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Sphere, Stats, SoftShadows } from '@react-three/drei'
import { useState } from 'react'
// import { CSGShape } from './CSGShape'
import { randomControls } from './randomControls'
import { GemRandomizer } from './GemRandomizer.js'

import { OrbitControls } from '@react-three/drei'
import { useControls, button } from 'leva'
import { randomColor } from 'randomcolor';

export default function MainStage() {
  const [trigger, setTrigger] = useState()

  const [{ ...randomConfig }, setControls] = useControls('General', () => (randomControls))

  // leva controls which use functions defined in this component
  useControls('Triggers', {
    // materialTrigger: button(() => {
    //   setTrigger(['material', Math.random()])
    // }),
    colorTrigger: button(() => { setControls({color: randomColor()})}),
    normalTrigger: button( () => { setTrigger(['normal', Math.random()] )}),
    depthTrigger: button(() => { setTrigger(['depth', Math.random()])}),
    shapeTrigger: button(() => setTrigger(['shape', Math.random()])),
    // parallax: button(() => setTrigger(['parallax', Math.random()])),
    gem: button(() => setTrigger(['gem', Math.random()])),
    crystal: button(() => setTrigger(['crystal', Math.random()])),
    deep: button(() => setTrigger(['deep', Math.random()])),
    sss: button(() => setTrigger(['sss', Math.random()]))
  });


  const SoftShadowsProps = {
    /** Size of the light source (the larger the softer the light), default: 25 */
    size: 25,
    /** Number of samples (more samples less noise but more expensive), default: 10 */
    samples: 10,
    /** Depth focus, use it to shift the focal point (where the shadow is the sharpest), default: 0 (the beginning) */
    focus: 10
  }
return (
      <Canvas  shadows dpr={[2, 4]} camera={{ position: [10, 15, -10], zoom: 2, near: 1, far: 1000 }} gl={{ preserveDrawingBuffer: true }}>
        <SoftShadows {...SoftShadowsProps} />
        <axesHelper args={[1]} />

        <ambientLight intensity={0.1} />
        <directionalLight castShadow position={[0, 10, 0]} intensity={1.5} shadow-mapSize={1024}>
          <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
        </directionalLight>
        {/* <pointLight position={[0, 0, 10]} intensity={.1} /> */}

        <GemRandomizer
          trigger={trigger}
          config={randomConfig}
        />

        <Sphere args={[200, 200, 200]} rotation={[-1.5, 0, 0]} position={[0, 195, 0]} receiveShadow>
          <meshStandardMaterial color="white" transparent={true} opacity={1} side={THREE.BackSide} />
        </Sphere>

        <EffectComposer>
          <Bloom luminanceThreshold={randomConfig.lumThreshold} intensity={randomConfig.bloom ? randomConfig.bloomIntensity : 0} levels={randomConfig.bloomLevels} mipmapBlur />
        </EffectComposer>

        {/** Controls */}
        <OrbitControls autoRotate={randomConfig.autoRotate} autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.3} enableRotate={true} />

        <Stats />
      </Canvas>
      )
}