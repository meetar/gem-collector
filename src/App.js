import { RGBELoader } from 'three-stdlib'
import * as THREE from 'three'
import { AxesHelper } from 'three'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Box, Sphere, Stats } from '@react-three/drei'
import { useEffect, useState, Suspense } from 'react';
// import { CSGShape } from './CSGShape'
// import { Gem } from './Gem'
// import { InnerGem } from './InnerGem'
// import { gemcontrols } from './gemcontrols'
import { parallaxcontrols } from './parallaxcontrols'
// import { Testgem } from './Testgem'
// import { Feedbackgem } from './Feedbackgem'
import { GemRandomizer } from './GemRandomizer'

import {
  Center,
  OrbitControls,
  MeshTransmissionMaterial,
  MeshRefractionMaterial,
  MeshReflectorMaterial,
} from '@react-three/drei'
import { Leva, useControls, button } from 'leva'
import { MeshBasicMaterial, meshPhysicalMaterial, TextureLoader, CubeTextureLoader, CubeReflectionMapping, CubeRefractionMapping, EquirectangularReflectionMapping } from 'three';
import { AmbientLight } from 'three';
import { RefractGeo } from './RefractGeo';
// import ParallaxGeo from './ParallaxGeo';
import { ParallaxGeoSync } from './ParallaxGeoSync';
import ParallaxMesh from './ParallaxMesh';
import TestPlanes from './TestPlanes';


export function App() {
  const [colortrigger, setColorTrigger] = useState();
  const [testtrigger, setTestTrigger] = useState();
  const testFunc = () => {
    setTrigger(Math.random())
  }
    
    const parallaxcontrols = {
      _steps: { value: 5, min: 0, max: 100, step: 1 },
      _height: { value: 1., min: 0, max: 5, step: .01 },
      _scale: { value: 1, min: 0, max: 10, step: .01 },
      _shift: { value: 1, min: 0, max: 10, step: .01 },
      autoRotate: {value: false}, 
      colorTrigger: button(() => setColorTrigger(Math.random())),
      testTrigger: button(() => setTestTrigger(Math.random()))
    }
    
    const { ...parallaxconfig } = useControls(parallaxcontrols)
    
    const btexture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
    
    // const geo = useLoader(GLTFLoader, './crystal.glb').scene.children[0].children[0].children[0].children[0].children[0].geometry;
    
    // const geo = useLoader(GLTFLoader, './gem.glb').scene.children[0].children[0].children[0].children[0].geometry;
    
    // const geo = useLoader(GLTFLoader, './rock.glb').scene.children[0].geometry;
    const geo = useLoader(GLTFLoader, './crystal2.glb').scene.children[0].geometry;
    // scale = 0.001
    
    // const geo = useLoader(GLTFLoader, './cube.glb').scene.children[0].geometry;
    // const geo = new THREE.PlaneGeometry;
    // const geo = new THREE.SphereGeometry;
    // console.log('gemconfig:', gemconfig);
    return (
      <Suspense fallback={<p>Loading</p>} >
      {/* <Leva {...parallaxconfig} testFunc={testFunc} /> */}

    <Canvas dpr={[2, 4]} camera={{ position: [10, 10, -10], zoom: 1 }} gl={{ preserveDrawingBuffer: true }}>

    <axesHelper args={[1]} />

<ambientLight intensity={.1} />
<pointLight intensity={10} position={[0, 3, 0]} />
      {/* <Test /> */}
      {/* <Sphere scale={.2} position={[0,1,0]}>
        <meshBasicMaterial />
      </Sphere> */}


      {/* <ParallaxGeo geometry={geo} config={gemconfig} texture={btexture} /> */}


      {/* <ParallaxMesh geometry={geo} config={parallaxconfig} texture={btexture} /> */}
      {/* <TestPlanes config={parallaxconfig} texture={btexture} /> */}


      {/* <ParallaxGeoSync geo={geo} config={gemconfig} texture={btexture} /> */}
      {/* <RefractGeo geo={geo} config={gemconfig} texture={btexture} /> */}
      {/* <Feedbackgem geo={geo} config={gemconfig} btexture={btexture} /> */}

      {/* <CSGShape geo={geo} config={gemconfig} backgroundTexture={btexture} /> */}

      {/* <GemRandomizer config={parallaxconfig} ref={instance => GemRandomizerInstance = instance} /> */}
      <GemRandomizer config={parallaxconfig} colortrigger={colortrigger} testtrigger={testtrigger} />
      {/* <GemRandomizer config={parallaxconfig}  /> */}

      <EffectComposer>
        {/* <Bloom luminanceThreshold={gemconfig.lumThreshold} intensity={gemconfig.bloom ? gemconfig.bloomIntensity : 0} levels={gemconfig.bloomLevels} mipmapBlur /> */}
      </EffectComposer>

      {/** Controls */}
      <OrbitControls autoRotate={parallaxconfig.autoRotate} autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.05} enableRotate={true} />


      <Stats />
    </Canvas>
    </Suspense>
  )
}

