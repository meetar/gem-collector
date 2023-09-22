import * as _ from 'lodash'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useState, useEffect } from 'react'
import WikipediaLinksComponent from './WikiLinks'
import Scene from './Scene.js'
import { Leva, useControls, button } from 'leva'
import { getCoda } from './dialogue'
import { Interface } from './Interface'

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
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [randomizeTrigger, setTrigger] = useState()
  const [nightMode, setNightMode] = useState(false)
  const [showLeva, setshowLeva] = useState('hidden')
  const [curtainOpacity, setCurtainOpacity] = useState(1);
  const [curtainDisplay, setCurtainVisibility] = useState('block');
  const [dpr, setDpr] = useState(2)
  
  const [first, setFirst] = useState(() => {
    const savedCount = localStorage.getItem('count');
    return savedCount ? parseInt(savedCount) : 0;
  });

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'u') {
        setshowLeva(v => v == 'hidden' ? 'visible' : 'hidden') // toggle value
      }
      if (event.key === 'Enter') {
        lowerCurtain()
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    // remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  function toggleNightMode() {
    setNightMode(val => !val)
  }
  function setText(text='') {
    setName(text.name);
    setDesc(text.desc);
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

  const textColor = nightMode ? "white" : "black";
  const bgColor = nightMode ? "#222" : "#eee";

  return (
    <>
  <div id="curtain" style={{ opacity: curtainOpacity, visibility: curtainDisplay}}></div>

  <div id="levaWrapper" style={{visibility: showLeva}} >
    <Leva />
  </div>

<Interface toggleNightMode={toggleNightMode} nightMode={nightMode} name={name} desc={desc} next={lowerCurtain}/>

  {/* <button id="summon" onClick={lowerCurtain}>LOOK AGAIN</button> */}
  <div id="bg" style={{ backgroundColor: bgColor}}></div>

  <div style={{height: '100%', zIndex: 0, }}>
    <Canvas shadows dpr={dpr} camera={{ position: [5, 3, -10], zoom: 1.5, near: 1, far: 1000 }} gl={{ preserveDrawingBuffer: true }}>
      {/* <PerformanceMonitor onChange={(stats) => {

        let factor = stats.factor
        let fps = stats.fps
        let dpr = computeDPRScale(fps)
        // let dpr = _.round(0.5 + .25 * factor, 1);
        return setDpr(dpr)
      }}> */}


      {/* put everything into a component inside Canvas, to avoid the R3F Hooks warning - this provides the Canvas context */}
      <Scene {... {nightMode, setText, gemDone, randomizeTrigger}} />
      {/* </PerformanceMonitor> */}
    </Canvas>
    {/* <DebugStage /> */}
</div>


</>
  )
}
