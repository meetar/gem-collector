import { useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'; // Import the OBJLoader module

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Center } from '@react-three/drei'
import * as _ from 'lodash'
import ParallaxMesh from './ParallaxMesh'
import { DiamondMaterial } from './DiamondMaterial'
import CrystalMaterial from './CrystalMaterial'
import DeepMat from './DeepMat'
import SSSMesh from './SSSMesh'
import { Rock } from './Rock'
import { getMaterial } from './getMaterial'
import { models } from './models'



const getModel = () => {
  // console.log('getModel');
  const mesh = './models/'+_.sample(models)
  // const mesh = './models/crystal.obj';
  // const mesh = './models/rock1.glb'
  // console.log(models);
  // console.log(mesh);
  // debugger
  const geo = useLoader(OBJLoader, mesh).children[0].geometry;

  // const meshes = ['crystal', 'rock1', 'cube']
  // const mesh = './models/' + _.sample(meshes) + '.stl'
  // const geo = useLoader(STLLoader, mesh)
  // console.log('new geo:', geo);
  return geo
}

export function GemRandomizer({ config, trigger }) {
  console.log('GemRandomizer');
  const [material, setMaterial] = useState([getMaterial(config), Math.random()]);
  const [mode, setMode] = useState(false);
  const [model, setModel] = useState(getModel)


  function newMaterial() {
    const newmat = getMaterial(config);
    newmat.needsUpdate = true;
    return setMaterial([newmat, Math.random()])
  }

  function newModel() {
    console.log('old model', model);
    setModel(getModel)
    console.log('new model?', model);
  }

  // watch for triggers from app
  useEffect(() => {
    // console.log('trigger', trigger);
    if (trigger) {
      trigger = trigger[0];
      // console.log('trigger changed, trigger:', trigger);
      if (trigger == 'material') {
        setMode('material')
        newMaterial()
      }
      if (trigger == 'shape') {
        // console.log('shape');
        newModel()
      }
      else {
        setMode(trigger)
      }
      trigger = null;
    }
  }, [trigger])

  useEffect(() => {
    if (material && material[0]) {
      Object.assign(material[0], config)
      material[0].needsUpdate = true;
    }

  }, [config])

  useEffect(() => {
    if (trigger && trigger[0] == 'material') return // don't re-set the material if the materialtrigger has just been tripped
    if (material && material[0]) {
      material[0].needsUpdate = true;
      setMaterial(material[0])
    }
  }, [material])

  // console.log('mode', mode);
  if (!model) {
    return null;
  }
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
            // <mesh geometry={model} castShadow >
            <SSSMesh geometry={model} config={config} />
            // </mesh>
            ) : mode == 'deep' ? (
              <DeepMat geometry={model} config={config} castShadow />
            ) : mode == 'material' ? (
            <mesh scale={1} geometry={model} material={material[0]} castShadow />
            ) : (
              <mesh scale={1} geometry={model} castShadow>
                <meshBasicMaterial {...config} color={'#f0f'} />
                </mesh>
            )}

        </group>
      </Center>

      <Rock insetGeo={model} csg={false} />
    </>
  )
}
