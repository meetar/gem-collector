import React, { useState, useEffect, useRef } from 'react';
import { Pixelation } from '@react-three/postprocessing'

export function AnimatedPixelize() {

  

  const [count, setCount] = useState(256);
  const [started, setStarted] = useState(false);
  const forceUpdate = useRef(false);

  console.log('?', started, count);
  useEffect(() => {
    const waitAndSetState = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      setStarted(true)
      let c = count;
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          c = Math.floor(c /= 2);
          console.log(c);
          setCount(c); // Update the state to half the previous value
          forceUpdate.current = !forceUpdate.current; // Toggle forceUpdate to trigger a re-render
        }, i * 100); // Delay each update by 100ms
      }
    };

    waitAndSetState();
  }, []);





  return ( started ?
    <Pixelation granularity={count} />
    : 
    <Pixelation granularity={256} />
  );
}
