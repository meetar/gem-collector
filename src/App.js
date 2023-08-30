import { RGBELoader } from 'three-stdlib'
import * as THREE from 'three'
import { AxesHelper } from 'three'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Box, Sphere, Plane, Stats, SoftShadows } from '@react-three/drei'
import { useEffect, useState, Suspense } from 'react'
// import { CSGShape } from './CSGShape'
// import { Gem } from './Gem'
// import { InnerGem } from './InnerGem'
import { gemcontrols } from './gemcontrols'
import { parallaxcontrols } from './parallaxcontrols'
// import { Testgem } from './Testgem'
// import { Feedbackgem } from './Feedbackgem'
import { GemRandomizer } from './GemRandomizer'

import { Center, OrbitControls, MeshTransmissionMaterial, MeshRefractionMaterial, MeshReflectorMaterial } from '@react-three/drei'
import { Leva, useControls, button } from 'leva'
import {
  MeshBasicMaterial,
  meshPhysicalMaterial,
  TextureLoader,
  CubeTextureLoader,
  CubeReflectionMapping,
  CubeRefractionMapping,
  EquirectangularReflectionMapping
} from 'three'
import { AmbientLight } from 'three'
import { RefractGeo } from './RefractGeo'
// import ParallaxGeo from './ParallaxGeo';
import { ParallaxGeoSync } from './ParallaxGeoSync'
import ParallaxMesh from './ParallaxMesh'
import TestPlanes from './TestPlanes'

export function App() {
  const [materialtrigger, setMaterialTrigger] = useState()
  const [shapetrigger, setShapeTrigger] = useState()
  const [gemtrigger, setGemTrigger] = useState()
  const [parallaxtrigger, setParallaxTrigger] = useState()
  const testFunc = () => {
    setTrigger(Math.random())
  }
  const resetTriggers = () => {
    setMaterialTrigger(null)
    setShapeTrigger(null)
    setParallaxTrigger(null)
  }
  const randomControls = {
    _shift: { value: 1, min: 0, max: 10, step: 0.01 },
    opacity: { value: 1, min: 0, max: 1, step: 0.01 },
    shininess: { value: 1, min: 0, max: 100, step: 0.01 },
    autoRotate: { value: true },
    materialTrigger: button(() => setMaterialTrigger(Math.random())),
    shapeTrigger: button(() => setShapeTrigger(Math.random())),
    parallax: button(() => setParallaxTrigger(Math.random())),
    gem: button(() => setGemTrigger(Math.random())),
  }

  const { ...parallaxconfig } = useControls(parallaxcontrols)
  
  const { ...randomConfig } = useControls(randomControls)

  const btexture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')

  // const geo = useLoader(GLTFLoader, './crystal.glb').scene.children[0].children[0].children[0].children[0].children[0].geometry;

  // const geo = useLoader(GLTFLoader, './gem.glb').scene.children[0].children[0].children[0].children[0].geometry;

  // const geo = useLoader(GLTFLoader, './rock.glb').scene.children[0].geometry;
  // const geo = useLoader(GLTFLoader, './crystal2.glb').scene.children[0].geometry
  // scale = 0.001


  // debugger
  // .scene.children[0].geometry

  const SoftShadowsProps = {
    /** Size of the light source (the larger the softer the light), default: 25 */
    size: 25,
    /** Number of samples (more samples less noise but more expensive), default: 10 */
    samples: 10,
    /** Depth focus, use it to shift the focal point (where the shadow is the sharpest), default: 0 (the beginning) */
    focus: 10
  }

  const geo = useLoader(GLTFLoader, './models/cube.glb').scene.children[0].geometry;
  // const geo = new THREE.PlaneGeometry;
  // const geo = new THREE.SphereGeometry;
  // console.log('gemconfig:', gemconfig);
  return (
    <Suspense fallback={<p>Loading</p>}>
      {/* <Leva {...parallaxconfig} testFunc={testFunc} /> */}

      <Canvas shadows dpr={[2, 4]} camera={{ position: [10, 10, -10], zoom: 1 }} gl={{ preserveDrawingBuffer: true }}>
        <SoftShadows {...SoftShadowsProps} />
        <axesHelper args={[1]} />

        <ambientLight intensity={0.1} />
        <directionalLight castShadow position={[0, 10, 0]} intensity={1.5} shadow-mapSize={1024}>
          <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
        </directionalLight>

        <GemRandomizer
          {... {parallaxtrigger, materialtrigger, shapetrigger, gemtrigger, resetTriggers}} // use spread syntax to add these vars as props of the same name
          config={randomConfig}
        />
        {/* <ParallaxMesh geometry={geo} config={parallaxconfig} texture={btexture} /> */}

        <Sphere args={[200, 200, 200]} rotation={[-1.5, 0, 0]} position={[0, 195, 0]} receiveShadow>
          <meshStandardMaterial color="white" emissive={'#666666'} transparent={true} opacity={1} side={THREE.BackSide} />
        </Sphere>

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
