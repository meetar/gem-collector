import { getCoda } from './dialogue.js'
import { useState, useEffect, useRef } from 'react'
import TypeIt from "typeit-react";
import TypistWrapper from './TypeistWrapper.js';

export const Interface = ({nightMode, toggleNightMode, name, desc, next}) => {
  const nightModeClass = nightMode ? 'nightmode' : '';
  const [coda, setCoda] = useState('');
  const [continueButton, setContinueButton] = useState(false)
  const [complete, setComplete] = useState(false)
  const [instance, setInstance] = useState(null)
  // console.log('instance?', instance);
  console.log('completed?', complete);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log('\n\nSAW ENTER');
      // if (instance && instance.is('started') && !instance.is('completed')) {
        if (!complete) {

        console.log('COMPLETING');
        setComplete(true);
      }
      if (complete) {
        console.log('\n\nNExT');
        next();
      }
      // console.clear()
    }
  };


useEffect(() => {
  window.addEventListener('keydown', handleKeyPress);

  // remove the event listener when the component unmounts
  return () => {
    window.removeEventListener('keydown', handleKeyPress);
  };
});

useEffect(() => {
  // console.log('! INSTANCE', instance);
}, [instance]);

useEffect(() => {
  setCoda(getCoda())
  setComplete(false)
  // setContinueButton(false)
  // setTyping(true)
}, [desc])

  useEffect(() => {
    // console.log('continueButton', continueButton);
  }, [continueButton])

  const textColor = nightMode ? "white" : "black";
  // const bgColor = nightMode ? "#222" : "#eee";
  const bgColor = nightMode ? "255, 0, 0" : "0, 255, 0";

  function getTypedText() {
    return (
      <div id="gemtext"><span id="gemname">{name}.</span> {desc}
      {coda && <span className="coda">{coda}</span>}</div>
      )
    // return "The quick brown fox jumps over the lazy dog."
  }
function getText(speed) {
    return (<TypeIt key={speed}
        getAfterInit={(instance) => {
          setContinueButton(false)
          return instance;
        }}
        options={{
          speed: speed,
          cursor: false,
          startDelay: 0,
          nextStringDelay: () => speed == 0 ? 0 : 750,
          beforeStep: async (instance) => {
          },
          afterComplete: () => {
            setComplete(true)
            setContinueButton(true)
          },
        }}>{getTypedText()}</TypeIt>)
  }

return (
<>
  <div className={`interface bottom ${nightModeClass}`}>
    <div className="dialog">
      <div id="portrait"><img src="textures/person/gameboy.webp"></img></div>
      <div id="dialogtext">
        <div id="charname">RESEARCHER</div>
    { desc ? 
      complete ? getText(0) : getText(1)
    : <></>}

      </div>
        <div key="continue" className={`continue ${continueButton ? 'visible' : ''}`} id="continue" data-char="▾" onClick={next}>▾</div>
    </div>
  </div>

  <div className="interface top buttons" style={{color: textColor}}>
    <div id="nightmode" onClick={toggleNightMode}>🌛</div>
    <div id="info">?</div>
  </div>

</>
)  
}

