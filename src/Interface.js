import { getCoda } from './dialogue.js'
import { useState, useEffect, useRef } from 'react'
import TypeIt from "typeit-react";

export const Interface = ({nightMode, toggleNightMode, name, desc, next}) => {
console.log('Interface');

console.log(nightMode);
const nightModeClass = nightMode ? 'nightmode' : '';
const [coda, setCoda] = useState('');
const [continueButton, setContinueButton] = useState(false)

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

  function Typist() {
    return (
      <TypeIt
        options={{
          speed: 1,
          waitUntilVisible: true,
          cursor: false,
          strings: [
            `<div id="gemtext"><span id="gemname">${name}.</span> ${desc}`,
            `${coda && '<span className="coda">'+coda+'</span>'}</div>`
          ],
          afterComplete: () => {
            setContinueButton(true)
          }
        }}>
      </TypeIt>
    )
  }
return (
<>
  <div className={`interface bottom ${nightModeClass}`}>
    <div className="dialog">
      <div id="portrait"><img src="textures/person/gameboy.webp"></img></div>
      <div id="dialogtext">
        <div id="charname">RESEARCHER</div>
        <Typist />
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

