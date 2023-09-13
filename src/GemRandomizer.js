import * as THREE from 'three'
import { useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'; // Import the OBJLoader module
import { useTexture, Plane } from '@react-three/drei'

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
import { models, combomodels } from './models'
import { getModel } from './getModel'
import { getColor, shuffleArray } from './utils';
import { randomColor } from 'randomcolor';
import { randomDepth, randomNormal } from './textureUtils'
import { TextureLoader, Vector3 } from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { divideCircleIntoPoints } from './utils';


export function GemRandomizer({ config, trigger }) {
  console.log('GemRandomizer');
  const [material, setMaterial] = useState([getMaterial(config), Math.random()]);
  // const [mode, setMode] = useState(false);
  const [mode, setMode] = useState('deep');
  // TODO figure out why GemRandomizer is rendering 12 times - something to do with useState(getModel)
  const [model, setModel] = useState(getModel)
  const [normalMap, setNormalMap] = useState(getNormal)
  const [depthMap, setDepthMap] = useState(getNormal)


  function newMaterial() {
    const newmat = getMaterial(config);
    newmat.needsUpdate = true;
    return setMaterial([newmat, Math.random()])
  }

  function getNormal() {
    const normalurl = randomNormal();
    const map = new THREE.TextureLoader().load(normalurl);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // Adjust the scale along U and V axes
    return map;
  }

  function getDepth() {
    const url = randomDepth();
    const map = new THREE.TextureLoader().load(url);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // Adjust the scale along U and V axes
    return map;
  }


  // watch for triggers from app
  useEffect(() => {
    // console.log('trigger', trigger)
    // console.log('mode:', mode);
    if (trigger) {
      trigger = trigger[0];
      // console.log('trigger changed, trigger:', trigger);
      if (trigger == 'material') {
        setMode('material')
        newMaterial()
      }
      else if (trigger == 'color') {
        // setMode('material')
        // this block is vestigial
        // color is shared among configs, so the parent sets this now
      }
      else if (trigger == 'shape') {
        setModel(getModel)
      }
      else if (trigger == 'depth') {
        // console.log('trigger: depth');
        setDepthMap(getDepth)
      }
      else if (trigger == 'normal') {
        // console.log('trigger: normal');
        setNormalMap(getNormal)
      }
      else {
        setMode(trigger)
      }
      trigger = null;
    }
  }, [trigger])

  useEffect(() => {
    // console.log('config changed');
    if (material && material[0]) {
      console.log('updating material');
      
      Object.assign(material[0], config)
      material[0].needsUpdate = true;
    }

  }, [config])

  useEffect(() => {
    // console.log('material changed');
    if (trigger && trigger[0] == 'material') return // don't re-set the material if the materialtrigger has just been tripped
    if (material && material[0]) {
      material[0].needsUpdate = true;
      setMaterial(material[0])
    }
  }, [material])

  console.log('gem mode', mode);
  // console.log('depthamP', depthMap);
  if (!model) {
    return null;
  }


return (
    <>
      <Center top position={[0, 0, 0]}>



          { mode == 'parallax' ? (
            <ParallaxMesh geometry={model} config={config} castShadow />
          ) : mode == 'gem' ? (
            <DiamondMaterial config={config} normalMap={normalMap} geometry={model} castShadow />
          ) : mode == 'crystal' ? (
            <mesh geometry={model} castShadow >
              <CrystalMaterial normalMap={normalMap} geometry={model} config={config} />
            </mesh>
          ) : mode == 'sss' ? (
          // <mesh geometry={model} castShadow >
            <SSSMesh geometry={model} normalMap={normalMap} depthMap={depthMap} config={config} castShadow />
          // </mesh>
          ) : mode == 'deep' ? (
            <DeepMat geometry={model} normalMap={normalMap} depthMap={depthMap} config={config} castShadow />
          ) : mode == 'material' ? (
            <mesh geometry={model} material={material[0]} castShadow />
          ) : (
            <mesh geometry={model} castShadow>
              <meshStandardMaterial {...config} />
            </mesh>
          )}

      {/* </Center> */}
      <directionalLight position={[0, .5, 0]} intensity={1} penumbra={1} distance={2} color={config.color} />
    </>
  )
}
