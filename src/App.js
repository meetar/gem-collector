import { Canvas, useFrame } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import WikipediaLinksComponent from './WikiLinks'
import Scene from './Scene.js'
import { Leva, useControls, button } from 'leva'



export function App() {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [randomizeTrigger, setTrigger] = useState()
  const [nightMode, setNightMode] = useState(false)
  const [showLeva, setshowLeva] = useState('hidden')
  const [curtainOpacity, setCurtainOpacity] = useState(1);
  const [curtainDisplay, setCurtainVisibility] = useState('block');

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'u') {
        setshowLeva(v => v == 'hidden' ? 'visible' : 'hidden') // toggle value
      }
    };

    // add the event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);

    // remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // empty dependency array means this effect runs once, like componentDidMount


  function setText(text='') {
    setName(text.name);
    setDesc(text.desc);
  }

  useControls({
    RANDOMIZE: button( () => { 
      lowerCurtain()
    }),
    NightMode: button( () => { 
      setNightMode(val => !val)

    }),
  });


  function gemDone() {
    // console.warn('GEM DONE');
    raiseCurtain()
  }

  // function to start the opacity animation
  const lowerCurtain = () => {
    setCurtainOpacity(1);
    setCurtainVisibility('visible')
    setTimeout(() => {
      setTrigger(Math.random())
    }, 1000); // synchronize this timing with the curtain opacity transition timing
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
  <div id="levaWrapper" style={{visibility: showLeva}} >
    <Leva />
  </div>
<div className="gemName" style={{color: textColor, position: 'absolute', bottom: 0, left: 0, zIndex: 1, marginBottom: '50px', height: '20%', width: '100%', textAlign: 'center', alignContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
  <p style={{fontSize: '2em'}}>{name}</p>
  <p className="description" style={{color: textColor, fontSize: '1.2em', width: '800px'}}>{desc}</p>
</div>

<div id="curtain" style={{ opacity: curtainOpacity, visibility: curtainDisplay}}></div>
<div id="bg" style={{ backgroundColor: bgColor}}></div>

<div style={{height: '100%', zIndex: 0, }}>
    <Canvas shadows dpr={[1, 2]} camera={{ position: [5, 3, -10], zoom: 1.5, near: 1, far: 1000 }} gl={{ preserveDrawingBuffer: true }}>
      {/* put everything into a component inside Canvas, to avoid the R3F Hooks warning - this provides the Canvas context */}
      <Scene {... {nightMode, setText, gemDone, randomizeTrigger}} />
    </Canvas>
    {/* <DebugStage /> */}
</div>

<div className="centered-button">
  <button>Centered Button</button>
</div>

</>
  )
}
