import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { Leva, useControls, button } from 'leva'
import { diamondcontrols } from './diamondcontrols'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import {
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { PerformanceMonitor } from '@react-three/drei';

export function DiamondMaterial({config, geometry, texture, ...props}) {
  console.log('Diamond Mat, color:', config.color);
  // const { ...diamondconfig } = useControls(diamondcontrols)

  const [test, setTest] = useState(null)
  
  
  // TODO: determine how to both tweak the controls and pass in color from outside
  // const [dconfig, setDConfig] = useState(useControls('Diamond', diamondcontrols))
  // const { ...diamondconfig } = dconfig;


  const { ...dconfig } = useState(useControls('Diamond', diamondcontrols))


  // TODO later
  // useEffect(() => {
  //     console.log('performance test', test);
  //     if (!test) return;
  //     let bounces = Math.ceil(5 - 60/test.fps);
  //     console.log('bounces:', bounces);
  //     diamondconfig.bounces = bounces;
  //     setConfig(useControls(diamondcontrols))
  //     console.log('now:', config.bounces);
  // }, [test])


  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 

  // console.log('diamond mat, #faces:', geometry.attributes.normal.array.length / 3 / 3);

  geometry = BufferGeometryUtils.mergeVertices(geometry, 0); // this forces vertex indexing which fixes the 'BufferGeometry is already non-indexed' warning
  // console.log('bounces:', config.bounces);

  return (
    <>
     <PerformanceMonitor bounds={(fps) => [40, 60]} onIncline={(fps) => setTest(fps)} onDecline={(fps) => setTest(fps)} ></PerformanceMonitor>
      <group scale={0.999}>

      <mesh geometry={geometry} {...config} {...dconfig} castShadow>
        {/* don't set transparent to true here! I will crash */}
        <MeshRefractionMaterial  {...dconfig} {...config} envMap={texture} 
        // ior={diamondconfig.iorInner}
        // visible={diamondconfig.GemVisible}
         />
      </mesh>

      </group>

      {/* <Gem config={config} backgroundTexture={texture} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 1]} visible={config.GemVisible} /> */}
      {/* <Gem config={diamondconfig} backgroundTexture={texture} geometry={geometry} /> */}
      <mesh geometry={geometry} visible={true}>
        <MeshTransmissionMaterial  {...dconfig} {...config}  transparent={true}
          envMap={texture}
          // ior={diamondconfig.iorOuter}
          // visible={diamondconfig.InnerVisible}
        />
      </mesh>

    </>
  )
}
