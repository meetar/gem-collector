export const Infoscreen = ({nightModeClass, toggleInfo}) => {
  return (
    <div id="infoscreen" className={`${nightModeClass}`} onClick={toggleInfo}><div id="infocontent">
      
      <h3>The Gem Collector</h3>
      <p>~ by Peter and Juna ~</p>

      <p>Gems were made in <a href="https://threejs.org/">three.js</a> using <a href="https://github.com/pmndrs/react-three-fiber">react-three-fiber</a> and <a href='https://github.com/pmndrs/drei'>drei</a>.</p>

      <p>Other tools used include <a href="https://github.com/pmndrs/leva">Leva</a>, <a href="https://www.pixilart.com/">pixilart</a>, and <a href="https://www.typeitjs.com/">TypeIt</a>.</p>

      <p>~ Thank you to the <a href="https://pmnd.rs/">Poimandres</a> open source developer collective ~</p>

      <p>💎</p>
      </div></div>
    )
  }