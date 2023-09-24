import React, { useState, useEffect } from 'react';

const Typewriter = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  
  const handleJumpToEnd = () => {
    setDisplayText(text);
  };

  useEffect(() => {
    typeText();
  }, [])
  const typeText = () => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 1); // Adjust the typing speed as needed
  };

  return (
    <div>
      <div>{displayText}</div>
    </div>
  );
};

export default Typewriter;
