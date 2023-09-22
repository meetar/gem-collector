import { getCoda } from './dialogue.js'
import { useState, useEffect, useRef } from 'react'
import TypeIt from "typeit-react";

export const Interface = ({nightMode, toggleNightMode, name, desc, next}) => {

let typer = useRef();
 
console.log(nightMode);
  const nightModeClass = nightMode ? 'nightmode' : '';
  const [coda, setCoda] = useState('');
  const [continueButton, setContinueButton] = useState(false)
console.log(coda);
  useEffect(() => {
    console.log('desc');
    console.log('typer?', typer);
    setCoda(getCoda())
    // typer.current.typing = 0;
    // typer.current.typing = 1;
    setTimeout(() => setContinueButton(true), 1000)
  }, [desc])

  var delays = [{
    // Add a 400ms delay following every period character.
    at: new RegExp(/\s/),
    delay: 400
  }];
  
  const textColor = nightMode ? "white" : "black";
  // const bgColor = nightMode ? "#222" : "#eee";
  const bgColor = nightMode ? "255, 0, 0" : "0, 255, 0";

  const typeprops = {
    delayMap: delays,
    ref: typer,
    typing: 1,
    maxDelay: 10,
    minDelay: 0,
  }
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
          ]
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
        {continueButton ? <div id="continue" onClick={next}>▾</div> : null }
      </div>
    </div>
  </div>

  <div className="interface top buttons" style={{color: textColor}}>
    <div id="nightmode" onClick={toggleNightMode}>🌛</div>
    <div id="info">?</div>
  </div>



    {/* <p className="gemName" style={{fontSize: '2em'}}>{name}</p> */}
    {/* <p className="description" style={{color: textColor, fontSize: '1.2em', width: '800px'}}>{desc}</p> */}
</>
)  
}

