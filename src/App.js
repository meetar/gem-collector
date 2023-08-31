import TextureDebugStage from './TextureDebugStage'
import MainStage from './MainStage'
export function App() {


  // const geo = useLoader(GLTFLoader, './crystal.glb').scene.children[0].children[0].children[0].children[0].children[0].geometry;

  // const geo = useLoader(GLTFLoader, './gem.glb').scene.children[0].children[0].children[0].children[0].geometry;

  // const geo = useLoader(GLTFLoader, './rock.glb').scene.children[0].geometry;
  // const geo = useLoader(GLTFLoader, './crystal2.glb').scene.children[0].geometry
  // scale = 0.001


  // debugger
  // .scene.children[0].geometry


  // const geo = new THREE.PlaneGeometry;
  // const geo = new THREE.SphereGeometry;
  // console.log('gemconfig:', gemconfig);
  return (

    <MainStage />
    // <TextureDebugStage />

  )
}
