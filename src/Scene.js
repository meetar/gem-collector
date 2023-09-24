import * as THREE from 'three'
import { EffectComposer, Bloom, Pixelation } from '@react-three/postprocessing'
import { Stats, SoftShadows, useTexture, AdaptiveDpr } from '@react-three/drei'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { useState, useRef, useEffect } from 'react'
// import { CSGShape } from './CSGShape'
import { randomControls } from './randomControls'
import { GemRandomizer } from './GemRandomizer.js'

import { OrbitControls } from '@react-three/drei'
import { useControls, button } from 'leva'


export default function Scene({slow, setText, nightMode, gemDone, randomizeTrigger}) {
  const [trigger, setTrigger] = useState()
  const [pixelSize, setPixelSize] = useState(256)
  const [pixelTrigger, setPixelTrigger] = useState('in')

  const [{ ...randomConfig }, setControls] = useControls('General', () => (randomControls), {collapsed: true})

  // animate in when a new gem is ready
  // wrap the gemDone function with the pixelTrigger
  function gemReady() {
    gemDone()
    setPixelTrigger('in')
  }

  // animate out and make a new one
  useEffect(() => {
    setPixelTrigger('out')
    setTimeout(() => {
      setTrigger(['randomize', Math.random()])
    }, 500); // synchronize this timing with the curtain opacity transition timing
}, [randomizeTrigger])

//   // animate out and make a new one
//   useEffect(() => {
//     if (slow) {
//       setTrigger(['randomize', Math.random()])
//     }
// }, [slow])

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
    size: 10,
    samples: 10,
    focus: 10,
  }

  // for use with Leva controls
  // const softShadowsProps = {
  //   size: { value: 10, min: 0, max: 50, step: 1 },
  //   samples: { value: 10, min: 1, max: 50, step: 1 },
  //   focus: { value: 10, min: 0, max: 50, step: 1 },
  // }
  // const [{ ...softShadowsUI }, setSoftShadows] = useControls('SoftShadows', () => (softShadowsProps), {collapsed: true})


  // animate the pixelize effect
  useEffect(() => {
    const animatePixelize = async () => {
      let c = pixelTrigger == 'in' ? 256 : 1;
      setPixelSize(c)
      // set 10 timeouts to animate the pixel size
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          c = pixelTrigger == 'in' ?
            Math.floor(c /= 2) // half the previous value
            : Math.min(128, Math.floor(c *= 2)) // twice the previous value
          setPixelSize(c); // Update the state
        }, i * 100); // delay each update by 100ms
      }
    };
    animatePixelize();
  }, [pixelTrigger]);



return (
      <>
        <SoftShadows {...softShadowsProps} />

        <ambientLight intensity={0.1} />
        <directionalLight castShadow position={[0, 10, 0]} intensity={1} />

        <GemRandomizer
          slow={slow}
          trigger={trigger}
          config={randomConfig}
          setText={setText}
          gemDone={gemReady}
          />

        <EffectComposer>
          <Pixelation granularity={pixelSize} />
          <Bloom luminanceThreshold={randomConfig.lumThreshold} intensity={randomConfig.bloom ? randomConfig.bloomIntensity : 0} levels={randomConfig.bloomLevels} mipmapBlur />
        </EffectComposer>
 
        {/** Controls */}
        <OrbitControls target={[0, 0, 0]} autoRotate={randomConfig.autoRotate} autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.3} enableRotate={true} />

      </>
      )
}