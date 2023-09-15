import DebugStage from './DebugStage'
import MainStage from './MainStage'
import { useEffect, useState } from 'react'
import WikipediaLinksComponent from './WikiLinks'

export function App() {
  const [name, setName] = useState("Testings")
  const [desc, setDesc] = useState("Testings desc")

  function setText(text="Testing") {
    setName(text.name);
    setDesc(text.desc);
  }

  return (
    <>
    {/* <WikipediaLinksComponent /> */}
<div style={{position: 'absolute', bottom: 0, left: 0, zIndex: 1, marginBottom: '20px', height: '20%', width: '100%', color: 'white', textAlign: 'center', alignContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
  <p style={{fontSize: '2em'}}>{name}</p>
  <p style={{fontSize: '1em', width: '80%'}}>{desc}</p>
</div>

<div style={{height: '100%', backgroundColor: 'black', zIndex: 0, }}>
    <MainStage setText={setText} />
    // <DebugStage />
</div>
</>
  )
}
