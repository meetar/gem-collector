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
import { parallaxcontrols } from './parallaxcontrols'
import { GemMesh } from './GemMesh'
import { gemcontrols } from './gemcontrols'
import { Testgem } from './Testgem'

const randomize = () => {
  console.log('gem randomizer called')
}


const getModel = () => {
  const meshes = ['crystal1.glb', 'crystal2.glb', 'crystal3.glb'];
  const mesh = './models/'+_.sample(meshes)
  const geo = useLoader(GLTFLoader, mesh).scene.children[0].geometry;

  // const meshes = ['crystal', 'rock1', 'cube']
  // const mesh = './models/' + _.sample(meshes) + '.stl'
  // const geo = useLoader(STLLoader, mesh)

  // const geo = useLoader(GLTFLoader, './models/crystal1.glb').scene.children[0].geometry;
  // const geo = useLoader(GLTFLoader, './models/cube.glb').scene.children[0].geometry;

  return geo
}

export function GemRandomizer({ config, geo, shapetrigger, materialtrigger, parallaxtrigger, gemtrigger, ...props }) {
  const crystalMap = useTexture('./6056-normal.jpg')
  const btexture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  const [parallaxMode, setParallaxMode] = useState(false);
  const [gemMode, setGemMode] = useState(false);

  const { ...parallaxconfig } = useControls(parallaxcontrols)

  const setParallax = (mode) => {
    console.log('  setParallax to', mode)
    setParallaxMode(mode);
  }

  const getMaterial = () => {
    // console.log('getMaterial, gemConfig?', gemConfig);
    // console.log('getMat');
    const materialTypes = ['shader', 'phong', 'lambert', 'basic']
    const materialType = _.sample(materialTypes)
    // const mat = 'phong';
    // console.log(mat);
    // const normalMap = useTexture('./speckles.png');

    const material =
      materialType == 'shader'
        ? new THREE.ShaderMaterial({
            uniforms: {
              _color: { value: getColor() } // use state
              // _color: { value: matColor }, // necessary?
            },
            fragmentShader: `uniform vec3 _color; void main() {gl_FragColor = vec4(_color, 1.);}`
          })
        : materialType == 'phong'
        ? new THREE.MeshPhongMaterial({
            color: getColor(),
            normalMap: crystalMap,
            alphaMap: crystalMap,
            specularMap: crystalMap
            // shininess: 1,
            // opacity: gemConfig.opacity,
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
    return material
  }

  function newMaterial() {
    setMaterial(getMaterial())
  }

  function newModel() {
    setModel(getModel)
  }

  function resetMode() {
    setParallaxMode(false)
    setGemMode(false)
  }

  const updateMaterial = (material, properties) => {
    // Update the material's properties from the properties object
    Object.assign(material, properties)
    setMaterial(material) // Trigger re-render
  }

  // console.log('\n\nGemRandomizer, config:', config);
  const [gemConfig, setGemConfig] = useState(config)
  // console.log('gemConfig?', gemConfig);
  const [material, setMaterial] = useState(getMaterial(config))
  // console.log('material?', material);
  const [model, setModel] = useState(getModel)
  useEffect(() => {
    //  this triggers a re-render of the entire component
    if (materialtrigger) {
      console.log('gem, materialtriggered!');
      resetMode()
      newMaterial()
      props.resetTriggers()
    }
  }, [materialtrigger])
  useEffect(() => {
    if (shapetrigger) {
      console.log('shapetriggered!');
      newModel()
      props.resetTriggers()
    }
  }, [shapetrigger])
  useEffect(() => {
    if (parallaxtrigger) {
      console.log('parallaxtriggered! parallaxMode:', parallaxMode);
      resetMode()
      setParallaxMode(true)
      props.resetTriggers()
    }
  }, [parallaxtrigger])
  useEffect(() => {
    if (gemtrigger) {
      console.log('gemtriggered! gemMode:', gemMode);
      resetMode()
      setGemMode(true)
      props.resetTriggers()
    }
  }, [gemtrigger])
  useEffect(() => {
    // console.log('      >>> useEffect');
    setGemConfig(config)
    Object.assign(material, config)
    if (materialtrigger) return // don't re-set the material if the materialtrigger has just been tripped
    // material.needsUpdate = true;
    setMaterial(material)
  }, [config])

  // geo = useLoader(GLTFLoader, './gem.glb').scene.children[0].children[0].children[0].children[0].geometry;
  // geo = useLoader(GLTFLoader, './crystal.glb').scene.children[0].children[0].children[0].children[0].children[0].geometry; // scale = 0.001
  // geo = useLoader(GLTFLoader, './crystal1.glb').scene.children[0].geometry;

  // geo = useLoader(GLTFLoader, model).scene.children[0].geometry;
  // geo = useLoader(STLLoader, './models/rock1.stl');
  // geo = new THREE.SphereGeometry(1.);
  // const color = getColor();
  
  // geo = useLoader(GLTFLoader, model);
  geo = useLoader(GLTFLoader, './models/cube.glb').scene.children[0].geometry;

// return (
//   <ParallaxMesh geometry={model} config={parallaxconfig} texture={btexture} />
// )
console.log('      rendering, parallaxMode?', parallaxMode);
console.log('      rendering, model?', model);

return (
    <>
      <Center top>
        <group>



          { parallaxMode ? (
            <ParallaxMesh config={parallaxconfig} geometry={model} castShadow />
          ) : gemMode ? (
            <Testgem geometry={model} />
          ) : (
            <mesh scale={1} geometry={model} material={material} castShadow />
          )}
        </group>
      </Center>
    </>
  )
}
