import { RGBELoader } from 'three-stdlib'
import * as THREE from 'three'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Box, Sphere, Stats } from '@react-three/drei'
import { useEffect, Suspense } from 'react';
import { CSGShape } from './CSGShape'
import { Gem } from './Gem'
import { InnerGem } from './InnerGem'
import { gemcontrols } from './gemcontrols'
import { Testgem } from './Testgem'

import {
  Center,
  OrbitControls,
  MeshTransmissionMaterial,
  MeshRefractionMaterial,
  MeshReflectorMaterial,
} from '@react-three/drei'
import { Leva, useControls, button } from 'leva'
import { MeshBasicMaterial, meshPhysicalMaterial, TextureLoader, CubeTextureLoader, CubeReflectionMapping, CubeRefractionMapping, EquirectangularReflectionMapping } from 'three';

export function Test() {
  const { gl } = useThree();
  useEffect(() => {
    // gl === WebGLRenderer
    // gl.info.calls
    console.log(gl.info);
  });
}

export function App() {
  const { autoRotate, text, shadow, ...gemconfig } = useControls(gemcontrols)

  const btexture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')

  // const geo = useLoader(GLTFLoader, './crystal.glb').scene.children[0].children[0].children[0].children[0].children[0].geometry;
  // geo.scale(.001, .001, .001);

  // const geo = useLoader(GLTFLoader, './gem.glb').scene.children[0].children[0].children[0].children[0].geometry;

  const geo = useLoader(GLTFLoader, './rock.glb').scene.children[0].geometry;
  // const geo = useLoader(GLTFLoader, './cube.glb').scene.children[0].geometry;
  // const geo = new THREE.PlaneGeometry;
  // const geo = new THREE.SphereGeometry;


  return (
    <Suspense fallback={<p>Loading</p>}>
    {/* <Leva /> */}

    <Canvas camera={{ position: [20, 5, 10], zoom: 10 }} gl={{ preserveDrawingBuffer: true,  }}>

      {/* <Test /> */}
      {/* <Sphere scale={.2} position={[0,1,0]}>
        <meshBasicMaterial />
      </Sphere> */}



      {/* <Testgem config={gemconfig} texture={btexture} /> */}


      {/* scg test */}
        <CSGShape geo={geo} config={gemconfig} backgroundTexture={btexture} />


      <EffectComposer>
        <Bloom luminanceThreshold={gemconfig.lumThreshold} intensity={gemconfig.bloom ? gemconfig.bloomIntensity : 0} levels={gemconfig.bloomLevels} mipmapBlur />
      </EffectComposer>

      {/** Controls */}
      <OrbitControls autoRotate={autoRotate} autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.05} enableRotate={true} />


      <Stats />
    </Canvas>
    </Suspense>
  )
}

