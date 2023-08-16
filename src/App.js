import { RGBELoader } from 'three-stdlib'
import { Canvas, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Stats } from '@react-three/drei'


import {
  Center,
  OrbitControls,
  MeshTransmissionMaterial,
  MeshRefractionMaterial,
} from '@react-three/drei'
import { useControls, button } from 'leva'

export function App() {
  const { autoRotate, text, shadow, ...gemconfig } = useControls({
    text: 'Inter',
    backside: true,
    backsideThickness: { value: 0.3, min: 0, max: 2 },
    samples: { value: 32, min: 1, max: 64, step: 1 },
    resolution: { value: 1024, min: 64, max: 2048, step: 64 },
    transmission: { value: 1, min: 0, max: 1 },
    clearcoat: { value: 0, min: 0.1, max: 1 },
    clearcoatRoughness: { value: 0.0, min: 0, max: 1 },
    thickness: { value: 0.4, min: 0, max: 5 },
    chromaticAberration: { value: 5, min: 0, max: 5 },
    anisotropy: { value: 0.3, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.5, min: 0, max: 4, step: 0.01 },
    distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
    ior: { value: 1.37, min: 0, max: 2, step: 0.01 },
    opacity: { value: .7, min: 0, max: 1, step: 0.01 },
    bounces: { value: 4, min: 0, max: 10, step: 1 },
    color: '#ff9cf5',
    gColor: '#ff7eb3',
    shadow: '#750d57',
    autoRotate: true,
    screenshot: button(() => {
      // Save the canvas as a *.png
      const link = document.createElement('a')
      link.setAttribute('download', 'canvas.png')
      link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'))
      link.click()
    }),
    HDRTexture: true,
    cubeCamera: true,
    InnerVisible: true,
    OuterVisible: true,
    bloom: true,
    lumThreshold: { value: .36, min: 0, max: 1, step: 0.01 },
    bloomIntensity: { value: 1.25, min: 0, max: 10, step: 0.01 },
    bloomLevels: { value: 4, min: 0, max: 9, step: 1 },
  })

  const btexture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')

  return (
    <Canvas camera={{ position: [20, 5, 10], zoom: 10 }} gl={{ preserveDrawingBuffer: true }}>
            <group  scale={.999}>
                <InnerGem config={gemconfig} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.5, 1]}
                backgroundTexture={
                  gemconfig.HDRTexture ? btexture :
                  null
                }
                visible={gemconfig.InnerVisible}
                />
            </group>
      <Gem config={gemconfig} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.5, 1]} visible={gemconfig.OuterVisible}
       />

      <EffectComposer>
        <Bloom luminanceThreshold={gemconfig.lumThreshold} intensity={gemconfig.bloom ? gemconfig.bloomIntensity : 0} levels={gemconfig.bloomLevels} mipmapBlur />
      </EffectComposer>

      {/** Controls */}
      <OrbitControls autoRotate={autoRotate} autoRotateSpeed={-1} zoomSpeed={0.25} dampingFactor={0.05} enableRotate={true} />


    <Stats />
    </Canvas>
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
        <MeshRefractionMaterial {...config} bounces={config.bounces} envMap={backgroundTexture}  />
      </mesh>

      </Center>
    </>
  )
}

function Gem({ backgroundTexture, config, font = '/Inter_Medium_Regular.json', ...props }) {
  const gltf = useLoader(GLTFLoader, './gem.glb');
  const geo = gltf.scene.children[0].children[0].children[0].children[0].geometry;
  console.log('backgroundTexture?', backgroundTexture);


  return (
    <>
      <Center scale={[1, 1, 1]} front top {...props}>

      <mesh geometry={geo} rotation={[Math.PI/2, 0, 0]} visible={true}>
        <MeshTransmissionMaterial {...config}  transparent={true} />
      </mesh>

      </Center>
    </>
  )
}
