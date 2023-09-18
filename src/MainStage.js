import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Sphere, Stats, SoftShadows } from '@react-three/drei'
import { useState } from 'react'
// import { CSGShape } from './CSGShape'
import { randomControls } from './randomControls'
import { GemRandomizer } from './GemRandomizer.js'
import { Center } from '@react-three/drei'

import { OrbitControls } from '@react-three/drei'
import { useControls, button } from 'leva'
import { randomColor } from 'randomcolor';
import { Rock } from './Rock'

export default function MainStage({setText}) {
  const [trigger, setTrigger] = useState()

  const [{ ...randomConfig }, setControls] = useControls('General', () => (randomControls), {collapsed: true})

  // leva controls which use functions defined in this component
  useControls('Triggers', {
    // materialTrigger: button(() => {
    //   setTrigger(['material', Math.random()])
    // }),
    RANDOMIZE: button( () => { setTrigger(['randomize', Math.random()] )}),
    // colorTrigger: button(() => {setTrigger(['color', Math.random()]  )}),
    // normalTrigger: button( () => { setTrigger(['normal', Math.random()] )}),
    // depthTrigger: button(() => { setTrigger(['depth', Math.random()])}),
    // shapeTrigger: button(() => setTrigger(['shape', Math.random()])),
    // parallax: button(() => setTrigger(['parallax', Math.random()])),
    gem: button(() => setTrigger(['gem', Math.random()])),
    crystal: button(() => setTrigger(['crystal', Math.random()])),
    deep: button(() => setTrigger(['deep', Math.random()])),
    sss: button(() => setTrigger(['sss', Math.random()]))
  });

  const softShadowsProps = {
    size: { value: 10, min: 0, max: 50, step: 1 },
    samples: { value: 10, min: 1, max: 50, step: 1 },
    focus: { value: 10, min: 0, max: 50, step: 1 },
  }
  const [{ ...softShadows }, setSoftShadows] = useControls('SoftShadows', () => (softShadowsProps), {collapsed: true})

return (
      <Canvas shadows dpr={[1, 2]} camera={{ position: [10, 15, -10], zoom: 2, near: 1, far: 1000 }} gl={{ preserveDrawingBuffer: true }}>
        <color attach="background" args={["black"]} />
        <SoftShadows {...softShadows} />
        {/* <axesHelper args={[1]} /> */}

        <ambientLight intensity={0.1} />
        <directionalLight castShadow position={[0, 10, 0]} intensity={2} />

        <GemRandomizer
          trigger={trigger}
          config={randomConfig}
          setText={setText}
          />

        <EffectComposer>
          <Bloom luminanceThreshold={randomConfig.lumThreshold} intensity={randomConfig.bloom ? randomConfig.bloomIntensity : 0} levels={randomConfig.bloomLevels} mipmapBlur />
        </EffectComposer>

        {/** Controls */}
        <OrbitControls autoRotate={randomConfig.autoRotate} autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.3} enableRotate={true} />

        <Stats />
      </Canvas>
      )
}