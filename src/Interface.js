import { getCoda, IntroLines, asides } from './txt/dialogue.js'
import { useState, useEffect, useRef } from 'react'
import TypeIt from "typeit-react";
import { roll } from './getDescription.js';
import { Infoscreen } from './Infoscreen.js';

export const Interface = ({sceneDone, gpu, slow, count, nightMode, toggleNightMode, desc, next}) => {
  const nightModeClass = nightMode ? 'nightmode' : '';
  const [continueButton, setContinueButton] = useState(false)
  const [typingDone, setTypingDone] = useState(false)
  const [intro, setIntro] = useState(true)
  const [aside, setAside] = useState()
  const [introStep, setIntroStep] = useState(0)
  const [infomode, setInfomode] = useState(false)
  const [instance, setInstance] = useState()
  const [started, setStarted] = useState(true)
  const [rotate, setRotate] = useState(false)
  const [introText, setIntroText] = useState()

  function toggleInfo() {
    setInfomode(v => !v)
  }

  function getIntroText() {
    return {text: <div id="gemtext">{IntroLines[introStep]}</div>, key: IntroLines[introStep]};
  }

  function getAside() {
    let aside = _.sample(asides);
    return {text: <div id="gemtext">{aside}</div>, key: aside};
  }

  function handleTextInteraction() {
    if (!typingDone) {
      // skip the typing animation
      setTypingDone(true);
      // setContinueButton(true);
    }
    else {
      // setTimeout(() => setContinueButton(true), 2000)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setIntroText(getIntroText(introStep));
    }, 1000)
  })

  function handleInteraction() {
    if (instance && !typingDone) {
      // skip the typing animation
      setTypingDone(true);
      // setContinueButton(true);
    }
    if (!instance || typingDone) {
      if (aside) {
        setAside()
      }
      if (intro) {
        if ((introStep >= IntroLines.length - 1) ||
          // if tier 0, skip the rotation suggestion - orbit controls don't work on many old machines
          (gpu == 0 && introStep >= IntroLines.length - 2)) {
          setIntro(false)
        }
        setIntroStep(v => v+1)
        setIntroText(getIntroText(introStep));
        setTypingDone(false)
      } else {
        if (count > 1 && count % 50 == 0) {
          setTypingDone(false)
          setAside({text: <div id="gemtext">This isn't ever going to end, is it?</div>, key: "forever"})
        }
        if (!aside && count > 10 && roll(.08)) {
          setTypingDone(false)
          setAside(getAside())
        } else {
          setContinueButton(false)
          setStarted(false)
          next()
          setTypingDone(false)
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
  if (!sceneDone) return;
  if (instance) setTypingDone(false)
  // if we're skipping the TypeIt instance, just set typingDone
  if (!instance) setTypingDone(true)
}, [desc])

useEffect(() => {
  if (gpu == 0 && sceneDone) {
    setTypingDone(true)
    setContinueButton(true)
  }
}, [gpu, sceneDone])

  useEffect(() => {
    // console.log('continueButton', continueButton);
  }, [continueButton])

  const textColor = nightMode ? "white" : "black";

  function getGemText() {
    // if (instance && instance.current) return {text: <div id="gemtext">STARTED: {instance.is('started')}</div>, key: Intro[introStep]};
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
  if (gpu == 0) {
    return <div style={{padding: '20px'}}>{textObject.text}</div>;
  }
  let textelement = document.getElementById('dialogtext');
  let startDelay = speed === 0 ? 0 : 750;
  let nextStringDelay = speed == 0 ? 0 : 750;
  let key = speed+textObject.key;
  return (<TypeIt key={key}
        getAfterInit={(instance) => {
          setContinueButton(false)
          setInstance(instance)
          setStarted(true)
          return instance;
        }}
        options={{
          speed: speed,
          cursor: false,
          startDelay,
          nextStringDelay,
          beforeStep: async (instance) => {
            if (!started) setStarted(true)
          },
          afterStep: () => {
            textelement.scrollTop = textelement.scrollHeight;
          },
          afterComplete: () => {
            textelement.scrollTop = textelement.scrollHeight;
            setTypingDone(true)
            setContinueButton(true)
          },
        }}>{textObject.text}</TypeIt>)
  }

  function getDialogue() {
    // console.log('getDialogue, gpu?', gpu);
    // if 'complete' is true, set typing delay to 0 for instant display,
    // otherwise use a 1ms delay between characters
    if (intro) { // first intro text
      return (typeText(typingDone ? 0 : 1, getIntroText()))
    } else if (aside) { // the occasional aside
      return (typeText(typingDone ? 0 : 1, aside))
    } else if (desc && desc.desc) { // normal operation
      return typeText(typingDone ? 0 : 1, getGemText())
    } else {
      return <></>
    }
  }

  // this checks state and returns a class to show "rotate.png" with the first gem
  function getRotate() {
    if (intro && introStep >= IntroLines.length - 1) {
      return 'fade'
    } else {
      return ''
    }
  }

  function getDialogStatus() {
    // console.log('getDialogStatus, instance?', instance);
    if (instance && instance.current) {
      console.log(1, started);
      if (started) {
        // setContinueButton(true);
        return '';
      }
      else return 'hiding'
    }
  }

return (
<>
  {/* <div className="gpu">{` ContinueButton: ${continueButton} - TypingDone: ${typingDone} - Intro: ${intro} - Started: ${started} - SceneDone: ${sceneDone}`}</div> */}
  <div className={`interface top buttons ${nightModeClass}`} style={{color: textColor}}>
    <div id="moon" onClick={toggleNightMode}><img src="moon.png" height={32} /></div>
    <div id="info" onClick={toggleInfo}><img src="question.png" height={32}></img></div>
  </div>

  { count < 2 &&
  <div className={`interface rotate ${getRotate()}`}>
    <img className={`rotate ${getRotate()}`} src="rotate2.png"/>
  </div>
  }

  <div className={`interface bottom ${nightModeClass}`}>
    <div className="dialog" onClick={handleTextInteraction}>
      <div id="portrait"><img src="textures/person/researcher.png"></img></div>
      <div id="charname">RESEARCHER</div>
      <div id="dialogtext" className={getDialogStatus()}>

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

