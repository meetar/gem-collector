import { RGBELoader,  } from 'three-stdlib'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Box, Sphere, Stats } from '@react-three/drei'
import { useEffect } from 'react';
import { Shape } from './Shape'
import { Gem } from './Gem'
import { InnerGem } from './InnerGem'
import { gemcontrols } from './gemcontrols'

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
  const geo = useLoader(GLTFLoader, './crystal.glb').scene.children[0].children[0].children[0].children[0].children[0].geometry;



  return (

    <>
      {/* <Leva /> */}
    <Canvas camera={{ position: [20, 5, 10], zoom: 10 }} gl={{ preserveDrawingBuffer: true,  }}>
<Test />
{/* <Sphere scale={.2} position={[0,1,0]}>
  <meshBasicMaterial />
</Sphere> */}



      <group  scale={.999}>
          <InnerGem config={gemconfig} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.5, 1]}
          backgroundTexture={
            gemconfig.HDRTexture ? btexture :
            null
          }
          visible={gemconfig.InnerVisible}
          />
      </group>


      <Gem config={gemconfig} backgroundTexture={btexture} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.5, 1]} visible={gemconfig.GemVisible}
       />


      <EffectComposer>
        <Bloom luminanceThreshold={gemconfig.lumThreshold} intensity={gemconfig.bloom ? gemconfig.bloomIntensity : 0} levels={gemconfig.bloomLevels} mipmapBlur />
      </EffectComposer>

      {/** Controls */}
      <OrbitControls autoRotate={autoRotate} autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.05} enableRotate={true} />


    <Stats />
    </Canvas>
    </>
  )
}

