import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Stats, Sphere, useTexture } from '@react-three/drei'
import fetcher from './Fetcher'
import ParallaxMaterial from './ParallaxMaterial'
import { parallaxcontrols } from './parallaxcontrols'
import { Leva, useControls, button } from 'leva'


function ParallaxMesh({geometry, config, textureUrl, ...props}) {
  const { ...pconfig } = useControls(parallaxcontrols)
  // console.log('parallax mesh, config?', parallaxconfig);
  const [shader, setShader] = useState({vert: null, frag: null});
  const [pmaterial, setPMaterial] = useState(null);
  // const [pconfig, setPConfig] = useState(parallaxconfig)
// const pconfig = {...config, ...parallaxconfig}
  if (!textureUrl) textureUrl = './speckles.png';
  // textureUrl = './speck.png';
  // textureUrl = './dots.png';

  const texture = useTexture(textureUrl);
  // texture.minFilter = THREE.NearestFilter;
  // texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
        <mesh geometry={geometry} {...props}>
          <ParallaxMaterial texture={texture} isShaderMaterial config={pconfig} />
        </mesh>
    </>
  );
}

export default ParallaxMesh;
