export const Infoscreen = ({nightModeClass, toggleInfo}) => {
  return (
    <div id="infoscreen" className={`${nightModeClass}`} onClick={toggleInfo}><div id="infocontent">
      
      <h3>The Gem Collector</h3>
      <p>~ by <a href="http://github.com/meetar/gem-collector">Peter and Juna</a> ~</p>

      <p>Made with <a href="https://threejs.org/">three.js</a>, <a href="https://github.com/pmndrs/react-three-fiber">react-three-fiber</a>, <a href='https://github.com/pmndrs/drei'>drei</a>, <a href="http://blender.org">Blender</a>, <a href="https://github.com/pmndrs/leva">Leva</a>, <a href="https://www.pixilart.com/">pixilart</a>, and <a href="https://www.typeitjs.com/">TypeIt</a>.</p>

      <p>~ Thank you to the <a href="https://pmnd.rs/">Poimandres</a> open source developer collective ~</p>

      <p>Sept. 2023<br/>💎</p>
      </div></div>
    )
  }