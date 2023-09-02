import { RGBELoader } from 'three-stdlib'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { Leva, useControls, button } from 'leva'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Center, MeshTransmissionMaterial, Sphere } from '@react-three/drei'
import { MeshBasicMaterial } from 'three'
import * as _ from 'lodash'
import { getColor } from './utils'
import ParallaxMesh from './ParallaxMesh'
import { DiamondMaterial } from './DiamondMaterial'
import { MeshPhongMaterial } from 'three'
import RockMaterial from './RockMaterial'
import CrystalMaterial from './CrystalMaterial'
import SSSMat from './SSSMat'
import DeepMat from './DeepMat'
import { Rock } from './Rock'

const getModel = () => {
  const meshes = ['crystal1', 'crystal2', 'crystal3', 'rock1'];
  const mesh = './models/'+_.sample(meshes)+'.glb'
  // const mesh = './models/rock1.glb'
  const geo = useLoader(GLTFLoader, mesh).scene.children[0].geometry;

  // const meshes = ['crystal', 'rock1', 'cube']
  // const mesh = './models/' + _.sample(meshes) + '.stl'
  // const geo = useLoader(STLLoader, mesh)
  return geo
}

export function GemRandomizer({ config, geo, trigger, ...props }) {
  const crystalMap = useLoader(TextureLoader, './textures/6056-normal.jpg')

  const getMaterial = () => {
    // console.log('getMat');
    const materialTypes = ['shader', 'phong', 'lambert', 'basic']
    const materialType = _.sample(materialTypes)

    const material =
      materialType == 'shader'
        ? new THREE.ShaderMaterial({
            uniforms: {
              _color: { value: getColor() } // use state
            },
            fragmentShader: `uniform vec3 _color; void main() {gl_FragColor = vec4(_color, 1.);}`
          })
        : materialType == 'phong'
        ? new THREE.MeshPhongMaterial({
            color: getColor(),
            normalMap: crystalMap,
            alphaMap: crystalMap,
            specularMap: crystalMap,
            opacity: Math.random()
          })
        : materialType == 'lambert'
        ? new THREE.MeshLambertMaterial({
            color: getColor()
          })
        : new THREE.MeshBasicMaterial({
            color: getColor()
          })
    // console.log('mat opacity:', material.opacity);

    // set cross-material defaults
    material.transparent = true
    // apply config
    Object.assign(material, gemConfig)
    // console.log('material:', material);
    return material
  }

  const [material, setMaterial] = useState([getMaterial(config), Math.random()]);
  const [mode, setMode] = useState(false);

  

  function newMaterial() {
    // console.log('new mat');
    // const newmat = getMaterial(config);
    const newmat = getMaterial(config);
    newmat.needsUpdate = true;
    // console.log('newmat?', newmat);
    // setMaterial(Math.random())
    return setMaterial([newmat, Math.random()])
  }

  function newModel() {
    setModel(getModel)
  }

  // const updateMaterial = (material, properties) => {
  //   // Update the material's properties from the properties object
  //   Object.assign(material, properties)
  //   setMaterial(material) // Trigger re-render
  // }

  // console.log('\n\nGemRandomizer, config:', config);
  const [gemConfig, setGemConfig] = useState(config)
  // console.log('gemConfig?', gemConfig);
  // console.log('material?', material);
  const [model, setModel] = useState(getModel)

  // watch for triggers from app
  useEffect(() => {
    if (trigger) {
      trigger = trigger[0];
      // console.log('trigger changed, trigger:', trigger);
      if (trigger == 'material') {
        setMode('material')
        newMaterial()
      }
      if (trigger == 'shape') newModel()
      else {
        setMode(trigger)
      }
      trigger = null;
    }
  }, [trigger])

  useEffect(() => {
    // console.log('      >>> useEffect config');
    setGemConfig(config)
    if (material && material[0]) {
      Object.assign(material[0], config)
      material[0].needsUpdate = true;
    }

    // no trigger at this point
    // console.log('trigger?', trigger);
    // if (trigger) console.log('trigger[0]?', trigger[0]);
    // if (trigger && trigger[0] == 'material') return // don't re-set the material if the materialtrigger has just been tripped

    // material.needsUpdate = true;
    // console.log('setting mat:', material);
    // setMaterial(material)
  }, [config])

  useEffect(() => {
    // console.log('  >>> material changed!');
    setGemConfig(config)
    // Object.assign(material, config)
    if (trigger && trigger[0] == 'material') return // don't re-set the material if the materialtrigger has just been tripped
    if (material && material[0]) {
      material[0].needsUpdate = true;
      setMaterial(material[0])
    }
  }, [material])

return (
  <mesh geometry={model} castShadow >
    <SSSMat />
  </mesh>

)

return (
    <>
      <Center top>
        <group>



          { mode == 'parallax' ? (
            <ParallaxMesh geometry={model} config={config} castShadow />
          ) : mode == 'gem' ? (
            <DiamondMaterial geometry={model} />
            ) : mode == 'crystal' ? (
            <mesh geometry={model} castShadow >
              <CrystalMaterial geometry={model} />
            </mesh>
            ) : mode == 'sss' ? (
            <mesh geometry={model} castShadow >
              <SSSMat />
            </mesh>
            ) : mode == 'deep' ? (
              <DeepMat geometry={model} config={config} castShadow />
            ) : mode == 'material' ? (
            <mesh scale={1} geometry={model} material={material[0]} castShadow />
            ) : (
              <mesh scale={1} geometry={model} castShadow>
                <meshBasicMaterial color={'#f0f'} />
                </mesh>
            )}

        </group>
      </Center>

      <Rock insetGeo={model} csg={true} />
    </>
  )
}
