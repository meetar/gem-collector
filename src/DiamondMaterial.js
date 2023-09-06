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
  const { ...diamondconfig } = useControls(diamondcontrols)

  const [test, setTest] = useState(null)

  useEffect(() => {
      console.log('performance test', test);
      let bounces = Math.floor(4 - 60/test.fps);
      console.log('bounces:', bounces);
      diamondconfig.bounces = bounces;
  }, [test])


  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 

  console.log('diamond mat, #faces:', geometry.attributes.normal.array.length / 3 / 3);

  geometry = BufferGeometryUtils.mergeVertices(geometry, 0); // this forces vertex indexing which fixes the 'BufferGeometry is already non-indexed' warning
  diamondconfig.bounces

  return (
    <>
     <PerformanceMonitor bounds={(fps) => [30, 60]} onIncline={(fps) => setTest(fps)} onDecline={(fps) => setTest(fps)} ></PerformanceMonitor>
      <group scale={0.999}>

      <mesh geometry={geometry} castShadow>
        {/* don't set transparent to true here! I will crash */}
        <MeshRefractionMaterial  {...diamondconfig} envMap={texture} 
        ior={diamondconfig.iorInner}
        visible={diamondconfig.GemVisible}
         />
      </mesh>

      </group>

      {/* <Gem config={config} backgroundTexture={texture} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 1]} visible={config.GemVisible} /> */}
      {/* <Gem config={diamondconfig} backgroundTexture={texture} geometry={geometry} /> */}
      <mesh geometry={geometry} visible={true}>
        <MeshTransmissionMaterial  {...diamondconfig}  transparent={true}
          envMap={texture}
          ior={diamondconfig.iorOuter}
          visible={diamondconfig.InnerVisible}
        />
      </mesh>

    </>
  )
}
