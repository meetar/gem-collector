import * as THREE from 'three'
import { useEffect, useState } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'; // Import the OBJLoader module
import { useTexture, Plane } from '@react-three/drei'
import { useControls } from 'leva'
import { RGBELoader } from 'three-stdlib'
import { EquirectangularReflectionMapping } from 'three';
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
import { getDescription } from './getDescription.js'
import { getColor, shuffleArray, randomBetween } from './utils';
import { randomColor } from 'randomcolor';
import { randomDepth, randomNormal, randomEnv } from './textureUtils'

export function GemRandomizer({ config, trigger, setText }) {
  const { gl } = useThree();

  // console.log('>> GemRandomizer <<');

  // const [mode, setMode] = useState();
  const [mode, setMode] = useState('deep');
  const [statecolor, setColor] = useState('#ff0000');
  const [model, setModel] = useState()
  const [normalMap, setNormalMap] = useState()
  const [depthMap, setDepthMap] = useState()
  const [envMap, setEnvMap] = useState(useLoader(RGBELoader, './textures/env/aerodynamics_workshop_1k.hdr'))
  // this sends a trigger to update and reload a material
  const [mattrigger, setMattrigger] = useState()

  // leva color control - this setup both sets state and reflects state even if set by setColor elsewhere
  const [{uicolor}, setUIColor] = useControls(() => ({
    color: {
      value: statecolor,
      label: 'Color',
      onChange: async (v) => {
        setColor(v)
        let desc = await getDescription(v)
        // console.log('desc', desc);
        setText(desc)
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
    const scale = randomBetween(1, 10)
    map.repeat.set(scale, scale); // Adjust the scale along U and V axes
    return map;
  }
  
  async function getDepth() {
    // console.log('getDepth');
    const url = randomDepth();
    const map = await new THREE.TextureLoader().loadAsync(url);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // Adjust the scale along U and V axes (this is further adjusted in the shader)
    return map;
  }

  function getEnv() {
    // too many async errors, giving up
    // const url = randomEnv();
    // const map = await useLoader(RGBELoader, url)
    const map = useLoader(RGBELoader, './textures/env/aerodynamics_workshop_1k.hdr')

    map.mapping = EquirectangularReflectionMapping; 
    
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

  async function randomizeAll(mode = null, oldmodel = null, gl) {
    // console.log('RANDOMIZE ALL', mode, oldmodel);
    // use Promise.all so we wait to set any state until we have all the info at once –
    // this prevents the model from being drawn multiple times with incomplete data every time one of the states updates
    let model, normal, depth, newcolor;
    if (mode && oldmodel) {
      [normal, depth, newcolor] = await Promise.all([getNormal(), getDepth(), getColor()]);
      setModel(oldmodel)
    }
    else if (mode) {
      [model, normal, depth, newcolor] = await Promise.all([getModel(), getNormal(), getDepth(), getColor()]);
      setModel(model)
    }
    else {
      [model, normal, depth, newcolor, mode] = await Promise.all([getModel(), getNormal(), getDepth(), getColor(), getMode()]);
      setModel(model)
    }
    console.log('mode:', mode, newcolor);
    setNormalMap(normal)
    setDepthMap(depth)
    // setEnvMap(env)
    // trigger material to reload if there's already a mode set
    setMattrigger(Math.random())
    setMode(mode)
    setColor(newcolor)
  }

  // watch for triggers from app
  useEffect(() => {
    // console.log('>> useeffect trigger', trigger)
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
        // console.log('trigger: normal');
        (async function () {
          const normal = await getNormal();
          setNormalMap(normal)
        })()
      }
      else if (trigger == 'env') {
        console.log('trigger: env');
        (function () {

          // const env = await getEnv();
          const env = getEnv();
          // giving up on dynamic imports for now - might have something to do with the requirement for PMREMGenerator ¯\_(ツ)_/¯
          // const env = useLoader(RGBELoader, './textures/env/aerodynamics_workshop_1k.hdr')

          setEnvMap(env)
        })()
      }
      else if (trigger == 'color') {
        // console.log('trigger: color');
        (async function () {
          const newcolor = await getColor();
          setColor(newcolor)
        })()
      }
      else if (trigger == 'randomize') {
        // console.log('trigger: normal');
        randomizeAll(null, null, gl)
      }
      else {
        // this randomizes everything except the mode, passed as the trigger
        randomizeAll(trigger, model, gl)
        // setMode(trigger)
      }
      trigger = null;
    } else {
      console.log('no trigger, initializing with new randomize');
      randomizeAll(mode, null, gl)
    }
  }, [trigger])

  // console.log('gem mode', mode);
  if (!model) {
    // console.error('No model');
    return null;
  }
  if (!mode) {
    // console.error('No mode');
  }

  // unused, the materials and mesh setups are too idiosyncratic to formalize yet
  const materialProps = {
    geometry: model,
    color: statecolor,
    normalMap,
    depthMap,
    config
  }

return ( mode &&
    <>

      { mode == 'parallax' ? (
        <ParallaxMesh geometry={model} color={statecolor} config={config} castShadow />
      ) : mode == 'gem' ? (
        <DiamondMaterial trigger={mattrigger} config={config} color={statecolor} normalMap={normalMap} envMap={envMap} geometry={model} castShadow />
      ) : mode == 'crystal' ? (
        <mesh geometry={model} castShadow >
          <CrystalMaterial trigger={mattrigger} normalMap={normalMap} color={statecolor} geometry={model} envMap={envMap} config={config} />
        </mesh>
      ) : mode == 'sss' ? (
        <SSSMesh trigger={mattrigger} geometry={model} color={statecolor} normalMap={normalMap} depthMap={depthMap} envMap={envMap} config={config} castShadow />
      ) : mode == 'deep' ? (
        <DeepMat trigger={mattrigger} geometry={model} color={statecolor} normalMap={normalMap} depthMap={depthMap} envMap={envMap} config={config} castShadow />
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
