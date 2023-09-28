import { getGPUTier } from 'detect-gpu';
import * as _ from 'lodash'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import React, { Suspense, useState, useEffect } from 'react'
import Scene from './Scene.js'
import { Leva, useControls, button } from 'leva'
import { getCoda } from './txt/dialogue.js'
import { Interface } from './Interface'
import { Stats } from '@react-three/drei'
import { ResizeObserver as polyfill } from '@juggle/resize-observer';

function computeDPRScale(fps) {
  // Define the threshold values for DPR
  const highFPSThreshold = 60;
  const lowFPSThreshold = 30;
  const highDPR = 2;
  const lowDPR = .5;

  // Interpolate linearly for the DPR value based on the FPS
  const scaleFactor = (fps - lowFPSThreshold) / (highFPSThreshold - lowFPSThreshold);

  // Clamp the DPR value between low and high thresholds
  const clampedDPR = Math.min(highDPR, Math.max(lowDPR, lowDPR + scaleFactor * (highDPR - lowDPR)));
  return clampedDPR;
}

export function App() {
  const [desc, setDesc] = useState()
  const [gpuTier, setGpuTier] = useState()




  const [randomizeTrigger, setTrigger] = useState()
  const [nightMode, setNightMode] = useState(false)
  const [showLeva, setshowLeva] = useState('hidden')
  const [curtainOpacity, setCurtainOpacity] = useState(1);
  const [curtainDisplay, setCurtainVisibility] = useState('block');
  const [dpr, setDpr] = useState(2)
  const [slow, setSlow] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    (async () => {
      const gpu = await getGPUTier();
      setGpuTier(gpu)
    })()
  }, [])
  useEffect(() => {if (gpuTier) console.log(gpuTier.tier)}, [gpuTier])

  useEffect(() => {
    const handleKeyPress = (event) => {
      let key = event.key; // react won't act on it unless I manipulate it here
      if (key === 'u') {
        // show Leva UI
        setshowLeva(v => v == 'hidden' ? 'visible' : 'hidden')
      }
    };
    window.addEventListener('keydown', handleKeyPress);
  }, []);

  function toggleNightMode() {
    setNightMode(val => !val)
  }

  function setText(text={}) {
    setDesc({
      desc: text.desc,
      name: text.name,
      coda: getCoda()
    });
  }

  useControls({
    RANDOMIZE: button( () => {
      lowerCurtain()
    }),
    NightMode: button( () => {
      toggleNightMode()
    }),
  });

  function gemDone() {
    raiseCurtain()
  }

  // function to start the opacity animation
  const lowerCurtain = () => {
    setCount(v => v+1)
    setText()
    setCurtainOpacity(1);
    setCurtainVisibility('visible')
    setTrigger(Math.random())
  };

  const raiseCurtain = () => {
    setCurtainOpacity(0);
    setTimeout(() => {
      setCurtainVisibility('hidden');
    }, 1000); // synchronize this timing with the curtain opacity transition timing
  };

  return (
  <>
  <div id="curtain" style={{ opacity: curtainOpacity, visibility: curtainDisplay}}></div>

  <div id="levaWrapper" style={{visibility: showLeva}} >
    <Leva />
  </div>
  {/* <div className="gpu">{JSON.stringify(gpuTier)}</div> */}
  <Interface {...{count, toggleNightMode, nightMode, desc, slow}} gpu={gpuTier} next={lowerCurtain}/>

  <div style={{height: '100%', zIndex: 0, }}>

    <Canvas resize={{polyfill}} shadows dpr={dpr} camera={{ position: [5, 3, -10], zoom: 1.5, near: 1, far: 1000 }} >
      <PerformanceMonitor onChange={(stats) => {
        let factor = stats.factor
        let fps = stats.fps;
        if (fps < 10 && factor < .5 && dpr > .5) {
          console.warn("Slow performance. Throttling resolution...");
          return setDpr(.5);
        }
        // let dpr = computeDPRScale(fps);
        let newdpr = 0.5 + (1.5 * factor);
        // console.warn('fps?:', fps, 'factor:', factor, 'dpr:', newdpr);
        if (fps < 5) {
          console.warn("Slow performance. Throttling materials...");
          setSlow(true);
        }
        return setDpr(newdpr)
      }}>

      {/* put everything into a component inside Canvas, to avoid the R3F Hooks warning - this provides the Canvas context */}
      <Scene {... {gpuTier, slow, nightMode, setText, gemDone, randomizeTrigger}} />

      </PerformanceMonitor>
      {showLeva == 'visible' && <Stats />}
    </Canvas>
    {/* <DebugStage /> */}
  </div>
  </>

)
}
