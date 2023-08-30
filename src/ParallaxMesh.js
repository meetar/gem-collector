import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Stats, Sphere, useTexture } from '@react-three/drei'
import fetcher from './Fetcher'
import ParallaxMaterial from './ParallaxMaterial'

function ParallaxMesh({geometry, config, textureUrl, ...props}) {
  console.log('parallax mesh');
  const [shader, setShader] = useState({vert: null, frag: null});
  const [pmaterial, setPMaterial] = useState(null);

  if (!textureUrl) textureUrl = './speckles.png';
  // textureUrl = './speck.png';
  // textureUrl = './dots.png';

  const texture = useTexture(textureUrl);
  // texture.minFilter = THREE.NearestFilter;
  // texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  useEffect(() => {
    async function fetchMaterial() {
      try {
        let mat = await ParallaxMaterial({texture, config});
        mat.isShaderMaterial = true;
        setPMaterial(mat);
      } catch (error) {
        console.error('Error loading fragment shader:', error);
      }

    }
    fetchMaterial();
  }, [config]);

  return (
    <>
      {pmaterial ? (
        <mesh geometry={geometry} material={pmaterial} {...props} />
        ) : (
        <><Sphere /></>
      )}
    </>
  );
}

export default ParallaxMesh;
