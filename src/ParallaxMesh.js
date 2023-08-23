import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Stats, Sphere, useTexture } from '@react-three/drei'
import fetcher from './Fetcher'
import ParallaxMaterial from './parallaxMaterial'

function ParallaxMesh({geometry, config, textureUrl}) {
  const [shader, setShader] = useState({vert: null, frag: null});
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

export default ParallaxMesh;
