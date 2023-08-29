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
  const [materialtrigger, setMaterialTrigger] = useState();
  const [shapetrigger, setShapeTrigger] = useState();
  const testFunc = () => {
    setTrigger(Math.random())
  }
    
    const parallaxcontrols = {
      _steps: { value: 5, min: 0, max: 100, step: 1 },
      _height: { value: 1., min: 0, max: 5, step: .01 },
      _scale: { value: 1, min: 0, max: 10, step: .01 },
      _shift: { value: 1, min: 0, max: 10, step: .01 },
    }
    
    const randomControls = {
      _shift: { value: 1, min: 0, max: 10, step: .01 },
      opacity: { value: .2, min: 0, max: 1, step: .01 },
      shininess: { value: 1, min: 0, max: 100, step: .01 },
      autoRotate: {value: true}, 
      materialTrigger: button(() => setMaterialTrigger(Math.random())),
      shapeTrigger: button(() => setShapeTrigger(Math.random()))
    }
    
    // const { ...parallaxconfig } = useControls(parallaxcontrols)
    const { ...randomConfig } = useControls(randomControls)
    
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
<pointLight intensity={1} position={[0, 3, -3]} />
      <GemRandomizer config={randomConfig} materialtrigger={materialtrigger} shapetrigger={shapetrigger} />

      <EffectComposer>
        {/* <Bloom luminanceThreshold={gemconfig.lumThreshold} intensity={gemconfig.bloom ? gemconfig.bloomIntensity : 0} levels={gemconfig.bloomLevels} mipmapBlur /> */}
      </EffectComposer>

      {/** Controls */}
      <OrbitControls autoRotate={randomConfig.autoRotate} autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.05} enableRotate={true} />


      <Stats />
    </Canvas>
    </Suspense>
  )
}

