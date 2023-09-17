import DebugStage from './DebugStage'
import MainStage from './MainStage'
import { useEffect, useState } from 'react'
import WikipediaLinksComponent from './WikiLinks'

export function App() {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")

  function setText(text="Testing") {
    setName(text.name);
    setDesc(text.desc);
  }

  return (
    <>
    {/* <WikipediaLinksComponent /> */}
<div style={{position: 'absolute', bottom: 0, left: 0, zIndex: 1, marginBottom: '50px', height: '20%', width: '100%', color: 'white', textAlign: 'center', alignContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
  <p style={{fontSize: '2em'}}>{name}</p>
  <p style={{fontSize: '1.2em', width: '800px'}}>{desc}</p>
</div>

<div style={{height: '100%', backgroundColor: 'black', zIndex: 0, }}>
    <MainStage setText={setText} />
    {/* <DebugStage /> */}
</div>
</>
  )
}
