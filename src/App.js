import DebugStage from './DebugStage'
import MainStage from './MainStage'
import { useEffect, useState } from 'react'

export function App() {
  const [content, setContent] = useState("Testings")

  function setText(text="Testing") {
    setContent(text);
  }

  return (
    <>
<div style={{position: 'absolute', bottom: 0, left: 0, zIndex: 1, height: '20%', width: '100%', fontSize: '4em', color: 'white', textAlign: 'center'}}>
  <p>{content}</p>
</div>
<div style={{height: '100%', backgroundColor: 'black', zIndex: 0, }}>
    <MainStage setText={setText} />
    // <DebugStage />
</div>
</>
  )
}
