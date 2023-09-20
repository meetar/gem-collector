import { Canvas, useFrame } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import WikipediaLinksComponent from './WikiLinks'
import Scene from './Scene.js'
import { useControls, button } from 'leva'



export function App() {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [trigger, setTrigger] = useState()

  function setText(text="Testing") {
    setName(text.name);
    setDesc(text.desc);
  }

  useControls({
    RANDOMIZE: button( () => { 
      console.clear()
      lowerCurtain()
    }),
  });

  const [opacity, setOpacity] = useState(1);

  function gemDone() {
    console.warn('GEM DONE');
    raiseCurtain()
  }

  // Function to start the opacity animation
  const lowerCurtain = () => {
    setOpacity(1);

    // Animation complete callback (use setTimeout as an example)
    setTimeout(() => {
      handleAnimationComplete();
    }, 1000); // Adjust the timeout duration as needed
  };

  const raiseCurtain = () => {
    setOpacity(0);
  };

  // Function to trigger when the animation is complete
  const handleAnimationComplete = () => {
    // Call another function or perform any desired action here
    console.log('Animation complete. Triggering randomize');
    setTrigger(Math.random())
  };

  return (
    <>
    {/* <WikipediaLinksComponent /> */}
<div style={{position: 'absolute', bottom: 0, left: 0, zIndex: 1, marginBottom: '50px', height: '20%', width: '100%', color: 'white', textAlign: 'center', alignContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
  <p style={{fontSize: '2em'}}>{name}</p>
  <p style={{fontSize: '1.2em', width: '800px'}}>{desc}</p>
</div>

<div id="curtain" style={{ opacity }}></div>

<div style={{height: '100%', backgroundColor: 'black', zIndex: 0, }}>
    <Canvas shadows dpr={[1, 2]} camera={{ position: [5, 3, -10], zoom: 1.5, near: 1, far: 1000 }} gl={{ preserveDrawingBuffer: true }}>
      <Scene setText={setText} gemDone={gemDone} randomizeTrigger={trigger} />
    </Canvas>
    {/* <DebugStage /> */}
</div>
</>
  )
}
