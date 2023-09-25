import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei'
import ParallaxMaterial from './ParallaxMaterial'

function ParallaxGeo({geometry, config, textureUrl}) {
  const [material, setMaterial] = useState(null);

  if (!textureUrl) textureUrl = './textures/speckles.png';

  const texture = useTexture(textureUrl);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  useEffect(() => {
    async function fetchMaterial() {
      try {
        let mat = await ParallaxMaterial({texture, config});
        setMaterial(mat);
      } catch (error) {
        console.error('Error loading fragment shader:', error);
      }

    }
    fetchMaterial();
  }, [config]);

  return (
    <>
      {material ? (
        <mesh geometry={geometry} material={material} />
        ) : (
        <></>
      )}
    </>
  );
}

export default ParallaxGeo
