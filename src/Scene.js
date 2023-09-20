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



export default function Scene({setText}) {
  const [trigger, setTrigger] = useState()
  const lightRef = useRef();
  const ambientRef = useRef();
  const gemLightRef = useRef();

  const [lightIntensity, setLightIntensity] = useState(1);
  const [nextAction, setNextAction] = useState();
  // const [gemDone, setGemDone] = useState();
  const [targetIntensity, setTargetIntensity] = useState(1); // Target intensity
  const [intensityTimeout, setIntensityTimeout] = useState();
  const [animating, setAnimating] = useState(false);

  function gemDone() {
    console.warn('GEM DONE');
    setTargetIntensity(1);   
    setAnimating(true); 
  }

  const [{ ...randomConfig }, setControls] = useControls('General', () => (randomControls), {collapsed: true})
  const limit = .01;
  // Update the light intensity smoothly
  useFrame(() => {
    // debugger
    // console.log(targetIntensity, lightRef.current.intensity);
    // console.log('animating?', animating);
    if (animating && lightRef.current) {
      // console.log('updating');
      const delta = (targetIntensity == 0 ? 0.05 : 0.03); // Change this to control the animation speed
      // Interpolate the light intensity towards the target intensity
      let newIntensity = lightIntensity + (targetIntensity - lightIntensity) * delta;
      lightRef.current.intensity = newIntensity;
      if (Math.abs(newIntensity - targetIntensity) <= limit) {
        setAnimating(false);
        console.log('finished animate');
        // done
        newIntensity = targetIntensity; // prevent zeno
        // clearTimeout(intensityTimeout)
      }
      ambientRef.current.intensity = newIntensity / 10;
      // gemLightRef.intensity = newIntensity / 10;
      console.log('setting intensity:', newIntensity);
      setLightIntensity(newIntensity);
    } else {
      // console.log('not updating');
    }
  });

  useEffect(() => {
    console.log('targetIntensity:', targetIntensity);
    // setTimeout(() => {
    //   console.warn('clearing intensityTimeout');
    //   clearTimeout(intensityTimeout), 3000
    // })
  }, [targetIntensity]);

  useEffect(() => {
    console.log('set animating:', animating);
    try {
      console.log('nextAction?', nextAction, 'animating?', animating);
      if (nextAction && !animating) {
        console.log('found nextAction()');
        nextAction.func(nextAction.args)
        setNextAction()
      } else {
        // debugger
        // console.log('no');
      }
    } catch(e) {
        throw new Error('bad nextAction')
        debugger
    }
}, [animating]);

  // leva controls which use functions defined in this component
  useControls('Triggers', {
    // materialTrigger: button(() => {
    //   setTrigger(['material', Math.random()])
    // }),
    RANDOMIZE: button( () => { 
      // debugger
      console.clear()
      console.warn('set 0')
      console.log('setting intensity:', 0);
      setTargetIntensity(0)
      setAnimating(true);
      setNextAction({func: setTrigger, args: ['randomize', Math.random()]})
      // setIntensityTimeout(setTimeout(() => {
      //   console.warn('set 1')
      //   setTargetIntensity(1);
      // }, 2000));
      // setTimeout(() => {
      //   console.warn('randomize')
      //   setTrigger(['randomize', Math.random()])
      // }, 1000);
    }),
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

        <ambientLight ref={ambientRef} intensity={lightIntensity * 0.1} />
        <directionalLight ref={lightRef} castShadow position={[0, 10, 0]} intensity={lightIntensity} />

        <GemRandomizer
          trigger={trigger}
          config={randomConfig}
          setText={setText}
          intensity={lightIntensity}
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