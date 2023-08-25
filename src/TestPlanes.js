import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Stats, Sphere, useTexture } from '@react-three/drei'
import fetcher from './Fetcher'
import ParallaxMaterial from './ParallaxMaterial'

function TestPlanes({config, textureUrl}) {
  const [shader, setShader] = useState({vert: null, frag: null});
  const [material, setMaterial] = useState(null);

  // if (!textureUrl) textureUrl = './speckles.png';
  // textureUrl = './speck.png';
  textureUrl = './dots.png';

  const texture = useTexture(textureUrl);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
 function rad(n) {
  return n * (Math.PI / 180);
 }
  useEffect(() => {
    async function fetchMaterial() {
      try {
        let mat = await ParallaxMaterial({texture, config});
        mat.isShaderMaterial = true;
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
        <>
          <mesh material={material}>
            <planeGeometry />
          </mesh>
          <mesh rotation={[0, rad(180), 0]} material={material}>
            <planeGeometry />
          </mesh>
          <mesh rotation={[rad(-90), 0, 0]} material={material}>
            <planeGeometry />
          </mesh>
        </>
        ) : (
        <></>
      )}
    </>
  );
}

export default TestPlanes;
