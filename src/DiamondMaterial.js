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

export function DiamondMaterial({config, color, geometry, texture, normalMap, ...props}) {
  // console.log('diamond mat');
  const [{ ...diamondconfig }, setDiamondControls] = useControls('Diamond', () => (diamondcontrols), {collapsed: true})
  // console.log('diamond color:', color);
  // const [dconfig, setDConfig] = useState(diamondconfig)

  // useEffect(() => {
  //   console.log('diamondconfig update');
  //   setDConfig(diamondconfig)
  // }, [diamondconfig])

  // fps testing - TODO later
  // const [test, setTest] = useState(null)

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
  // console.log('diamond mat, #faces:', geometry.attributes.normal.array.length / 3 / 3);


  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 

  geometry = BufferGeometryUtils.mergeVertices(geometry, 0); // this forces vertex indexing which fixes the 'BufferGeometry is already non-indexed' warning

  return (
    <>
     {/* <PerformanceMonitor bounds={(fps) => [40, 60]} onIncline={(fps) => setTest(fps)} onDecline={(fps) => setTest(fps)} ></PerformanceMonitor> */}
      <group scale={0.999}>

      <mesh geometry={geometry} color={color} {...config} {...diamondconfig} castShadow>
        {/* don't set transparent to true here! I will crash your whole dang machine */}
        <MeshRefractionMaterial  {...diamondconfig} {...config} envMap={texture} 
        ior={diamondconfig.iorInner}
        visible={diamondconfig.GemVisible}
        side={THREE.DoubleSide}
        />
      </mesh>

      </group>

      <mesh geometry={geometry} visible={true}>
        <MeshTransmissionMaterial color={color} {...diamondconfig} {...config}  transparent={true}
          envMap={texture}
          ior={diamondconfig.iorOuter}
          visible={diamondconfig.InnerVisible}
          normalMap={normalMap}

        />
      </mesh>

    </>
  )
}
