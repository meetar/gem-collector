import { getCoda, Intro, asides } from './txt/dialogue.js'
import { useState, useEffect, useRef } from 'react'
import TypeIt from "typeit-react";
import { roll } from './getDescription.js';
import { Infoscreen } from './Infoscreen.js';

export const Interface = ({nightMode, toggleNightMode, desc, next}) => {
  const nightModeClass = nightMode ? 'nightmode' : '';
  const [continueButton, setContinueButton] = useState(false)
  const [complete, setComplete] = useState(false)
  const [intro, setIntro] = useState(true)
  const [aside, setAside] = useState()
  const [introStep, setIntroStep] = useState(0)
  const [infomode, setInfomode] = useState(false)
  const [instance, setInstance] = useState()

  function toggleInfo() {
    setInfomode(v => !v)
  }

  function getIntroText() {
    return {text: <div id="gemtext">{Intro[introStep]}</div>, key: Intro[introStep]};
  }
  const [introText, setIntroText] = useState(getIntroText(introStep))

  function getAside() {
    let aside = _.sample(asides);
    return {text: <div id="gemtext">{aside}</div>, key: aside};
  }

  useEffect(() => {
    // console.log(introText);
  }, [])

  function handleTextInteraction() {
    if (!complete) {
      // skip the typing animation
      setComplete(true);
    }
  }

  function handleInteraction() {
    if (!complete) {
      // skip the typing animation
      setComplete(true);
    }
    if (complete) {
      if (aside) {
        setAside()
      }
      if (intro) {
        if (introStep >= Intro.length - 1) {
          setIntro(false)
        }
        setIntroStep(v => v+1)
        setIntroText(getIntroText(introStep));
        setComplete(false)
      } else {
        if (!aside && roll(.05)) {
          setComplete(false)
          setAside(getAside())
        } else {
          setContinueButton(false)
          next()
          setComplete(false)
        }
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
}, [desc])

  useEffect(() => {
    // console.log('continueButton', continueButton);
  }, [continueButton])

  const textColor = nightMode ? "white" : "black";
  // const bgColor = nightMode ? "#222" : "#eee";
  // const bgColor = nightMode ? "255, 0, 0" : "0, 255, 0";

  function getGemText() {
    return (
      { text: (
      <div id="gemtext"><span id="gemname">{desc.name}.</span> {desc.desc}
      <span className="coda">{desc.coda}</span></div>
      ), key: desc.name
      }
      )
    // return "The quick brown fox jumps over the lazy dog."
  }
function typeText(speed, textObject) {
  let textelement = document.getElementById('dialogtext');
  let startDelay = speed === 0 ? 0 : 750;
  let nextStringDelay = speed == 0 ? 0 : 750;
  let key = speed+textObject.key;
  return (<TypeIt key={key}
        getAfterInit={(instance) => {
          setContinueButton(false)
          // console.log('started?', instance.is('started'));
          // console.log('complete?', instance.is('complete'));
          // console.log(instance);
          setInstance(instance)
          return instance;
        }}
        options={{
          speed: speed,
          cursor: false,
          startDelay,
          nextStringDelay,
          beforeStep: async (instance) => {
          },
          afterStep: () => {
            textelement.scrollTop = textelement.scrollHeight;
          },
          afterComplete: () => {
            textelement.scrollTop = textelement.scrollHeight;
            setComplete(true)
            setContinueButton(true)
          },
        }}>{textObject.text}</TypeIt>)
  }

  function getDialogue() {
    if (intro) {
      return (complete ? typeText(0, getIntroText()) : typeText(1, getIntroText()))
    } else if (aside) {
      return (complete ? typeText(0, aside) : typeText(1, aside))
    } else if (desc && desc.desc) {
      return (complete ? typeText(0, getGemText()) : typeText(1, getGemText()))
    } else {
      return <></>
    }
  }

return (
<>

  <div className={`interface top buttons ${nightModeClass}`} style={{color: textColor}}>
    <div id="moon" onClick={toggleNightMode}><img src="moon.png" height={32} /></div>
    <div id="info" onClick={toggleInfo}><img src="question.png" height={32}></img></div>
  </div>

  <div className={`interface bottom ${nightModeClass}`}>
    <div className="dialog" onClick={handleTextInteraction}>
      <div id="portrait"><img src="textures/person/researcher.png"></img></div>
      <div id="charname">RESEARCHER</div>
      <div id="dialogtext">
        
        {getDialogue()}

      </div>
        <div key="continue" className={`continue ${continueButton ? 'visible' : ''}`} id="continue" data-char="▾" onClick={handleInteraction}>▾</div>
    </div>
  </div>
  <div id="bgNightmode" className={`${nightModeClass}`}></div>
  <div id="bg" className={`${nightModeClass}`}></div>

  {
    infomode && <Infoscreen {...{nightModeClass, toggleInfo}} />
  }

</>
)  
}

