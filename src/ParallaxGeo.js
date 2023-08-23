import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Stats, Sphere, useTexture } from '@react-three/drei'
import { ParallaxMaterial } from './parallaxMaterial'

export function ParallaxGeo({geo, config, textureUrl}) {
  const [material, setMaterial] = useState(null);

  if (!textureUrl) textureUrl = './speckles.png';
  // textureUrl = './speck.png';
  // textureUrl = './dots.png';

  const texture = useTexture(textureUrl);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  useEffect(() => {
    async function fetchMaterial() {
      try {
        let mat = await ParallaxMaterial({texture, config});
        setMaterial(mat);
        console.log(mat);
      } catch (error) {
        console.error('Error loading fragment shader:', error);
      }

    }
    fetchMaterial();
  }, [config]);

  return (
    <>
    {/* <Sphere args={[1, 10, 10]} /> */}
    {/* <meshPhysicalMaterial color={'blue'} /> */}
      {material ? (
        <mesh geometry={geo} material={material} />
        ) : (
        <></>
      )}
    </>
  );
}
