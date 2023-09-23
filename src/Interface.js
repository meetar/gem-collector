import { getCoda } from './dialogue.js'
import { useState, useEffect, useRef } from 'react'
import TypeIt from "typeit-react";
import { Intro } from './dialogue.js';

export const Interface = ({nightMode, toggleNightMode, desc, next}) => {
  const nightModeClass = nightMode ? 'nightmode' : '';
  const [continueButton, setContinueButton] = useState(false)
  const [complete, setComplete] = useState(false)
  const [intro, setIntro] = useState(true)
  const [introStep, setIntroStep] = useState(0)

  function getIntroText() {
    return <div id="gemtext">123</div>;
  }
  const [introText, setIntroText] = useState(getIntroText(introStep))

console.log(introText);
console.log('complete:', complete);
  function handleInteraction() {
    console.log('interac');
    if (!complete) {
      setComplete(true);
    }
    if (complete) {
      if (intro) {
        if (introStep >= Intro.length) {
          setIntro(false)
          next()
        }
        console.log('?', introStep);
        setIntroStep(v => v+1)
        setIntroText(getIntroText(introStep));
        setComplete(false)
      } else {
        next()
      }
    }

  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleInteraction()
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
  setComplete(false)
  // setContinueButton(false)
  // setTyping(true)
}, [desc])

  useEffect(() => {
    // console.log('continueButton', continueButton);
  }, [continueButton])

  const textColor = nightMode ? "white" : "black";
  // const bgColor = nightMode ? "#222" : "#eee";
  // const bgColor = nightMode ? "255, 0, 0" : "0, 255, 0";

  function getGemText() {
    return (
      <div id="gemtext"><span id="gemname">{desc.name}.</span> {desc.desc}
      <span className="coda">{desc.coda}</span></div>
      )
    // return "The quick brown fox jumps over the lazy dog."
  }
function typeText(speed, text) {
  console.log('typing, speed', speed, ', complted?', complete);
  let textelement = document.getElementById('dialogtext');
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
          afterStep: () => {
            textelement.scrollTop = textelement.scrollHeight;
          },
          afterComplete: () => {
            setComplete(true)
            setContinueButton(true)
            textelement.scrollTop = textelement.scrollHeight;
          },
        }}>{text}</TypeIt>)
  }

  function getDialogue() {
    if (intro) {
      return (complete ? typeText(2, getIntroText()) : typeText(3, getIntroText()))
    } else if (desc && desc.desc) {
      return (complete ? typeText(0, getGemText()) : typeText(1, getGemText()))
    } else {
      return <></>
    }
  }

  const bgColor = nightMode ? "#222" : "#ddd";

return (
<>
  <div className={`interface top buttons ${nightModeClass}`} style={{color: textColor}}>
    <div id="moon" onClick={toggleNightMode}>🌛</div>
    <div id="info"><img src="question.png" height={32}></img></div>
  </div>

  <div className={`interface bottom ${nightModeClass}`} onClick={handleInteraction}>
    <div className="dialog">
      <div id="portrait"><img src="textures/person/researcher.png"></img></div>
      <div id="charname">RESEARCHER</div>
      <div id="dialogtext">
        
        {getDialogue()}

      </div>
        <div key="continue" className={`continue ${continueButton ? 'visible' : ''}`} id="continue" data-char="▾">▾</div>
    </div>
  </div>
  <div id="bgNightmode" className={`${nightModeClass}`}></div>
  <div id="bg" className={`${nightModeClass}`}></div>


</>
)  
}

