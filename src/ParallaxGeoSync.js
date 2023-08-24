import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import fetcher from './Fetcher'
import { Stats, Sphere, useTexture } from '@react-three/drei'

async function fetchShaders(config, texture) {
  console.log('fetchshaders');
  try {
    // console.log('trying');
    let frag = await fetcher('./fragmentShader.frag');
    let vert = await fetcher('./vertexShader.vert');
    // console.log('vert?', vert);
    const shader = { vert, frag };
    console.log('shader:', shader);
    return new THREE.ShaderMaterial({
      uniforms: {
        _texture: { value: texture },
        _steps: {value: config._steps},
        _height: {value: config._height},
        _scale: {value: config._scale},
      },
      vertexShader: shader.vert,
      fragmentShader: shader.frag
    })
  } catch (error) {
    console.error('Error loading fragment shader:', error)
  }
}
// return fetchShaders()

export function ParallaxGeoSync({geo, config, textureUrl}) {
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
        let mat = await fetchShaders({texture, config});
        setMaterial(mat);
        console.log('mat:', mat);
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
