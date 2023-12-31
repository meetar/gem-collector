import { isBrowser } from 'react-device-detect';
import { EffectComposer, Bloom, Pixelation } from '@react-three/postprocessing'
import { SoftShadows } from '@react-three/drei'
import { useState, useEffect } from 'react'
import { randomControls } from './randomControls'
import { GemRandomizer } from './GemRandomizer.js'

import { OrbitControls } from '@react-three/drei'
import { useControls, button } from 'leva'


export default function Scene({gpuTier, slow, setText, nightMode, gemDone, randomizeTrigger}) {
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

  // leva controls which use functions defined in this component
  useControls('Shuffle', {
    color: button(() => {setTrigger(['color', Math.random()]  )}),
    normal: button( () => { setTrigger(['normal', Math.random()] )}),
    // envTrigger: button( () => { setTrigger(['env', Math.random()] )}),
    depth: button(() => { setTrigger(['depth', Math.random()])}),
    shape: button(() => setTrigger(['shape', Math.random()])),
    diamondMaterial: button(() => setTrigger(['gem', Math.random()])),
    crystalMaterial: button(() => setTrigger(['crystal', Math.random()])),
    deepMaterial: button(() => setTrigger(['deep', Math.random()])),
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

if (!gpuTier) return false;

return (
      <>
        { isBrowser && gpuTier.tier > 1 && <>
          <SoftShadows {...softShadowsProps} />
          <EffectComposer>
            <Pixelation granularity={pixelSize} />
            <Bloom luminanceThreshold={randomConfig.lumThreshold} intensity={randomConfig.bloom ? randomConfig.bloomIntensity : 0} levels={randomConfig.bloomLevels} mipmapBlur />
          </EffectComposer>
          </>
        }

        <ambientLight intensity={0.1} />
        <directionalLight castShadow position={[0, 10, 0]} intensity={1} />

        <GemRandomizer
          { ...{gpuTier, slow, trigger, setText}}
          config={randomConfig}
          gemDone={gemReady}
          />

        {/** Controls */}
        <OrbitControls target={[0, 0, 0]} autoRotate={randomConfig.autoRotate} autoRotateSpeed={-1} zoomSpeed={.5} dampingFactor={0.3} enableRotate={true} enablePan={false} />

      </>
      )
}