import { getCoda } from './dialogue.js'
import { useState, useEffect, useRef } from 'react'
import TypeIt from "typeit-react";
import TypistWrapper from './TypeistWrapper.js';

export const Interface = ({nightMode, toggleNightMode, name, desc, next}) => {
console.log('NAME', name);
const typistRef = useRef()
console.log(nightMode);
const nightModeClass = nightMode ? 'nightmode' : '';
const [coda, setCoda] = useState('');
const [continueButton, setContinueButton] = useState(false)
const [complete, setComplete] = useState(false)

  useEffect(() => {
    setCoda(getCoda())
    setContinueButton(false)
  }, [desc])

  useEffect(() => {
    console.log('continueButton', continueButton);
  }, [continueButton])

  const textColor = nightMode ? "white" : "black";
  // const bgColor = nightMode ? "#222" : "#eee";
  const bgColor = nightMode ? "255, 0, 0" : "0, 255, 0";

 
return (
<>
  <div className={`interface bottom ${nightModeClass}`}>
    <div className="dialog">
      <div id="portrait"><img src="textures/person/gameboy.webp"></img></div>
      <div id="dialogtext">
        <div id="charname">RESEARCHER</div>
        {desc ? <TypeIt
        options={{
          speed: 1,
          cursor: false,
          afterComplete: () => {
            setComplete(true)
            setContinueButton(true)
          },
          strings: [
          `<div id="gemtext"><span id="gemname">${name}.</span> ${desc}`,
          `${coda && '<span className="coda">'+coda+'</span>'}</div>`
        ],

        }} /> : <></>}

      </div>
        <div key="continue" className={`continue ${continueButton ? 'visible' : ''}`} id="continue" onClick={next}>▾</div>
    </div>
  </div>

  <div className="interface top buttons" style={{color: textColor}}>
    <div id="nightmode" onClick={toggleNightMode}>🌛</div>
    <div id="info">?</div>
  </div>

</>
)  
}

