import { getCoda } from './dialogue.js'
import { useState, useEffect } from 'react'


export const Interface = ({nightMode, toggleNightMode, name, desc, next}) => {
console.log(nightMode);
  const nightModeClass = nightMode ? 'nightmode' : '';
  const [coda, setCoda] = useState()

  useEffect(() => {
    setCoda(getCoda())

  }, [desc])

  const textColor = nightMode ? "white" : "black";
  // const bgColor = nightMode ? "#222" : "#eee";
  const bgColor = nightMode ? "255, 0, 0" : "0, 255, 0";

  function Coda() {
    return coda && (<div className="coda">{coda}</div>)
  }
return (
<>
  <div className={`interface bottom ${nightModeClass}`}>
    <div className="dialog">
      <div id="portrait"><img src="textures/person/gameboy.webp"></img></div>
      <div id="dialogtext">
        <div id="charname">RESEARCHER</div>
        <div id="gemtext"><span id="gemname">{name}.</span> {desc}<Coda /></div>
        <div id="continue" onClick={next}>▾</div>
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

