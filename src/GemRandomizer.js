import * as THREE from 'three'
import { useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'; // Import the OBJLoader module
import { useTexture, Plane } from '@react-three/drei'
import { useControls } from 'leva'

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
import { getDescription } from './getDescription'
import { getColor, shuffleArray } from './utils';
import { randomColor } from 'randomcolor';
import { randomDepth, randomNormal } from './textureUtils'

export function GemRandomizer({ config, trigger, setText }) {
  console.log('>> GemRandomizer <<');

  const [mode, setMode] = useState();
  // const [mode, setMode] = useState('deep');
  const [statecolor, setColor] = useState('#ff0000');
  // TODO figure out why GemRandomizer is rendering 12 times - something to do with useState(getModel)
  const [model, setModel] = useState()
  const [normalMap, setNormalMap] = useState()
  const [depthMap, setDepthMap] = useState()

  // leva color control - this setup both sets state and reflects state even if set by setColor elsewhere
  const [{uicolor}, setUIColor] = useControls(() => ({
    color: {
      value: statecolor,
      label: 'Color',
      onChange: async (v) => {
        setColor(v)
        let text = await getDescription(v)
        setText(v+' '+text)
      }},
  }));

  useEffect(() => {
    setUIColor({color: statecolor});
  }, [statecolor])

  async function getNormal() {
    // console.log('getNormal:');
    const url = randomNormal();
    const map = await new THREE.TextureLoader().loadAsync(url);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // Adjust the scale along U and V axes
    return map;
  }
  
  async function getDepth() {
    // console.log('getDepth');
    const url = randomDepth();
    const map = await new THREE.TextureLoader().loadAsync(url);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // Adjust the scale along U and V axes
    return map;
  }

  async function getColor() {
    return randomColor()
  }

  async function getMode() {
    return _.sample(['gem', 'crystal', 'deep', 'sss'])
  }

  async function randomizeAll(mode = null) {
    // console.clear();
    console.log('RANDOMIZE ALL');
    // Promise.all so we wait to set any state until we have all the info at once –
    // this prevents the model from being drawn with incomplete data
    console.log(config.color);
    let model, normal, depth, newcolor;
    if (mode) {
      [model, normal, depth, newcolor] = await Promise.all([getModel(), getNormal(), getDepth(), getColor()]);
    }
    else {
      [model, normal, depth, newcolor, mode] = await Promise.all([getModel(), getNormal(), getDepth(), getColor(), getMode()]);
    }
    console.log('mode, color', mode, newcolor);
    setModel(model)
    setNormalMap(normal)
    setDepthMap(depth)
    setMode(mode)
    setColor(newcolor)
  }

  async function randomizeProps() {
    // console.clear();
    console.log('RANDOMIZE PROPS');
    // Promise.all so we wait to set any state until we have all the info at once –
    // this prevents the model from being drawn with incomplete data
    console.log(config.color);
    let [model, normal, depth, newcolor] = await Promise.all([getModel(), getNormal(), getDepth(), getColor()]);
    console.log('mode, color', mode, newcolor);
    setModel(model)
    setNormalMap(normal)
    setDepthMap(depth)
    setColor(newcolor)
  }

  // watch for triggers from app
  useEffect(() => {
    console.log('>> useeffect trigger', trigger)
    // console.log('mode:', mode);
    if (trigger) {
      trigger = trigger[0];
      if (trigger == 'shape') {
        (async function () {
          const model = await getModel();
          setModel(model)
        })()
      }
      else if (trigger == 'depth') {
        // console.log('trigger: depth');
        // setDepthMap(getDepth)
        (async function () {
          const depth = await getDepth();
          setDepthMap(depth)
        })()
      }
      else if (trigger == 'normal') {
        console.log('trigger: normal');
        (async function () {
          const normal = await getNormal();
          setNormalMap(normal)
        })()
      }
      else if (trigger == 'color') {
        console.log('trigger: color');
        (async function () {
          const newcolor = await getColor();
          setColor(newcolor)
        })()
      }
      else if (trigger == 'randomize') {
        // console.log('trigger: normal');
        randomizeAll()
      }
      else {
        // this randomizes everything except the mode, passed as the trigger
        randomizeAll(trigger)
        // setMode(trigger)
      }
      trigger = null;
    } else {
      console.log('no trigger, initializing with new randomize');
      randomizeAll()
    }
  }, [trigger])

  // console.log('gem mode', mode);
  if (!model) {
    console.error('No model');
    return null;
  }
  if (!mode) {
    console.error('No mode');
  }

  const materialProps = {
    geometry: model,
    color: statecolor,
    normalMap,
    depthMap,
    config
  }
// return ( ready &&
return ( mode &&
    <>

      { mode == 'parallax' ? (
        <ParallaxMesh geometry={model} color={statecolor} config={config} castShadow />
      ) : mode == 'gem' ? (
        <DiamondMaterial config={config} color={statecolor} normalMap={normalMap} geometry={model} castShadow />
      ) : mode == 'crystal' ? (
        <mesh geometry={model} castShadow >
          <CrystalMaterial normalMap={normalMap} color={statecolor} geometry={model} config={config} />
        </mesh>
      ) : mode == 'sss' ? (
        <SSSMesh geometry={model} color={statecolor} normalMap={normalMap} depthMap={depthMap} config={config} castShadow />
      ) : mode == 'deep' ? (
        <DeepMat geometry={model} color={statecolor} normalMap={normalMap} depthMap={depthMap} config={config} castShadow />
      ) : (
        <mesh geometry={model} castShadow>
          <meshStandardMaterial {...config} />
        </mesh>
      )}

      <directionalLight position={[0, .5, 0]} intensity={1} penumbra={1} distance={2} color={statecolor} />
      <Center bottom position={[0, .5, 0]}>
          <Rock receiveShadow />
        </Center>
    </>
  )
}
