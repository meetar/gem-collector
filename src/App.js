import { RGBELoader,  } from 'three-stdlib'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Box, Sphere, Stats } from '@react-three/drei'
import { useEffect } from 'react';

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
  const { autoRotate, text, shadow, ...gemconfig } = useControls({
    // text: 'Inter',
    // backside: true,
    // backsideThickness: { value: 0.3, min: 0, max: 2 },
    samples: { value: 16, min: 1, max: 64, step: 1 },
    resolution: { value: 2048, min: 64, max: 2048, step: 64 },
    transmission: { value: 1, min: 0, max: 1 },
    thickness: { value: 3.17, min: 0, max: 10, step: .01 },
    chromaticAberration: { value: .02 , min: 0, max: 5 },
    anisotropy: { value: 0.0, min: 0, max: 1, step: 0.01 },
    // roughness: { value: 0, min: 0, max: 1, step: 0.01 },
    // distortion: { value: 0.5, min: 0, max: 4, step: 0.01 },
    // distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    // temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
    iorInner: { value: 2.15, min: 0, max: 2.147, step: 0.01 },
    iorOuter: { value: 1.03, min: 0, max: 2.147, step: 0.01 },
    opacity: { value: .7, min: 0, max: 1, step: 0.01 },
    bounces: { value: 4, min: 0, max: 10, step: 1 },
    // color: '#ff9cf5',
    color: 'white',
    autoRotate: true,
    HDRTexture: true,
    InnerVisible: true,
    GemVisible: true,
    bloom: true,
    lumThreshold: { value: .36, min: 0, max: 1, step: 0.01 },
    bloomIntensity: { value: 0.33, min: 0, max: 10, step: 0.01 },
    bloomLevels: { value: 3, min: 0, max: 9, step: 1 },
    // fastChroma: true,
    envMap: true,
    envMapIntensity: { value: 1, min: 0, max: 3, step: .01 },
    // envMapRoughness: { value: .5, min: 0, max: 3, step: .01 },
    reflectivity: { value: .01, min: 0, max: 1, step: .01 },
    clearcoat: { value: .33, min: 0, max: 1, step: .01 },
    clearcoatRoughness: { value: .11, min: 0, max: 1, step: .01 },
    // roughness: { value: 1, min: 0, max: 1, step: .01 },
  })

  const btexture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')



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

function InnerGem({ camera, backgroundTexture, config, ...props }) {
  const gltf = useLoader(GLTFLoader, './gem.glb');
  const geo = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  console.log('backgroundTexture?', backgroundTexture);
  console.log('camera?', camera);


  return (
    <>
      <Center scale={[1, 1, 1]} front top {...props}>

      <mesh geometry={geo} rotation={[Math.PI/2, 0, 0]}>
        <MeshRefractionMaterial {...config} envMap={backgroundTexture}
        reflectivity={config.reflectivity} 
        ior={config.iorInner}
         />
      </mesh>

      </Center>
    </>
  )
}

function Gem({ backgroundTexture, config, ...props }) {
  const gltf = useLoader(GLTFLoader, './gem.glb');
  const geo = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  console.log('backgroundTexture?', backgroundTexture);

    backgroundTexture.mapping = EquirectangularReflectionMapping; 
  return (
    <>
      <Center scale={[1, 1, 1]} front top {...props}>

      <mesh geometry={geo} rotation={[Math.PI/2, 0, 0]} visible={true}>
        <MeshTransmissionMaterial {...config}  transparent={true}
        // color='black'
        // opacity={1}
               reflectivity={config.reflectivity} 
               envMap={config.envMap ? backgroundTexture : null}
              //  envMapIntensity={config.envMapIntensity}
               ior={config.iorOuter}
        />
      </mesh>

      </Center>
    </>
  )
}

