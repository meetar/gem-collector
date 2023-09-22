import React, { useEffect, useRef, forwardRef, useState } from 'react';
import TypeIt from 'typeit-react';

function TypistWrapper ({ name, desc, coda, onComplete }) {
  const [instance, setInstance] = useState(null)
  const [complete, setComplete] = useState(false)
  const [nname, setnname] = useState(name)

  function done() {
    console.log('Done');
  }
  
  const [count, setCount] = useState(0)
  console.log(count);


  const [trigger, setTrigger] = useState()
  const options = {
    speed: 0,
    cursor: false,
    afterComplete: () => {
      console.log('COMPLETE');
      onComplete();
      setComplete(true)
    },
  }

  useEffect(() => {
    console.warn('Saw changes', name);
    setnname(name)
    setCount(c => c+1)
    if (instance) {
      console.log(instance.key);
      instance.reset().go()
    }
  }, [name, desc, coda]);
  
  useEffect(() => {
    // console.log('increment');
  }, []);
  
  useEffect(() => {
    if (complete) {
      console.log('is complete, emptying', complete);
    }
  }, [complete])

function getTypist(count) {
  console.log('count??', count);
  if (nname && desc) {
    return (
    <TypeIt key='key'
    options={options}
    getAfterInit={(instance) => {
      setInstance(instance);
      return instance;
    }}>
    <div>{count}</div>
    {/* <div id="gemtext"><span id="gemname">{nname}.</span> {desc}
    {coda && <span className="coda">{coda}</span>}</div> */}

</TypeIt>)
  } else {
    return null
  }
}

  return getTypist(count)
};

export default TypistWrapper;
