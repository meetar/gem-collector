import * as THREE from 'three'
import { Canvas, useFrame,  } from '@react-three/fiber'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { Stats, SoftShadows, useTexture } from '@react-three/drei'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { useState, useRef, useEffect } from 'react'
// import { CSGShape } from './CSGShape'
import { randomControls } from './randomControls'
import { GemRandomizer } from './GemRandomizer.js'

import { OrbitControls } from '@react-three/drei'
import { useControls, button } from 'leva'
import grayscaleShader from './grayscale.frag'; // Import your custom shader code



export default function Scene({setText, gemDone, randomizeTrigger}) {
  const [trigger, setTrigger] = useState()

  const [{ ...randomConfig }, setControls] = useControls('General', () => (randomControls), {collapsed: true})

useEffect(() => {
  console.log('saw randomizeTrigger');    
  setTrigger(['randomize', Math.random()]  )
}, [randomizeTrigger])

  // leva controls which use functions defined in this component
  useControls('Triggers', {
    colorTrigger: button(() => {setTrigger(['color', Math.random()]  )}),
    colorTrigger: button(() => {setTrigger(['color', Math.random()]  )}),
    normalTrigger: button( () => { setTrigger(['normal', Math.random()] )}),
    // envTrigger: button( () => { setTrigger(['env', Math.random()] )}),
    depthTrigger: button(() => { setTrigger(['depth', Math.random()])}),
    shapeTrigger: button(() => setTrigger(['shape', Math.random()])),
    gem: button(() => setTrigger(['gem', Math.random()])),
    crystal: button(() => setTrigger(['crystal', Math.random()])),
    deep: button(() => setTrigger(['deep', Math.random()])),
    // sss: button(() => setTrigger(['sss', Math.random()]))
  });

  const softShadowsProps = {
    size: { value: 10, min: 0, max: 50, step: 1 },
    samples: { value: 10, min: 1, max: 50, step: 1 },
    focus: { value: 10, min: 0, max: 50, step: 1 },
  }
  const [{ ...softShadows }, setSoftShadows] = useControls('SoftShadows', () => (softShadowsProps), {collapsed: true})

return (
      <>
        <color attach="background" args={["black"]} />
        <SoftShadows {...softShadows} />
        {/* <axesHelper args={[1]} /> */}

        <ambientLight intensity={0.1} />
        <directionalLight castShadow position={[0, 10, 0]} intensity={1} />

        <GemRandomizer
          trigger={trigger}
          config={randomConfig}
          setText={setText}
          gemDone={gemDone}
          />

        <EffectComposer>
          {/* <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} /> */}

          {/* <renderPass attachArray="passes" scene={undefined} camera={undefined} />
          <shaderPass attachArray="passes" args={[grayscaleShader]} /> */}

          <Bloom luminanceThreshold={randomConfig.lumThreshold} intensity={randomConfig.bloom ? randomConfig.bloomIntensity : 0} levels={randomConfig.bloomLevels} mipmapBlur />
          {/* <TextureEffect /> */}
        </EffectComposer>

        {/** Controls */}
        <OrbitControls autoRotate={randomConfig.autoRotate} autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.3} enableRotate={true} />

        <Stats />
      </>
      )
}