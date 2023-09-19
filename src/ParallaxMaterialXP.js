import * as THREE from 'three'
import { useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { randomBetween, createColorTexture } from './utils';
import randomColor from 'randomcolor';
import { colorMap } from './textureUtils';
import { roll } from './getDescription';

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const ParallaxMaterialXP = ({texture, config}) => {
  const vertexShader = useLoader(THREE.FileLoader, './vertexShader.vert');
  const fragmentShader = useLoader(THREE.FileLoader, './parallaxXP.frag');

  const [colorTexture, setColorMap] = useState(getColorMap())

  function getColorMap() {
    return new THREE.TextureLoader().loadAsync(colorMap());
    return roll(0) ? texture :
    roll(0) ? async () => {
      const colorMapurl = colorMap();
      // const map = useTexture(colorMapurl);
      const map = await new THREE.TextureLoader().loadAsync(colorMapurl);

      map.wrapT = THREE.MirroredRepeatWrapping;
      map.wrapS = THREE.MirroredRepeatWrapping;
      
      const scale = randomBetween(1, 10)
      map.repeat.set(10, 10); // Adjust the scale along U and V axes
      return map
    } : createColorTexture({r: Math.random(), g: Math.random(), b: Math.random()}); // create a single-pixel texture of a random color  
  }

  const uniforms = {
      _texture: { value: texture },
      _colorMap: { value: colorTexture },
      _steps: {value: config._steps},
      _height: {value: config._height},
      _scale: {value: config._scale},
      _opacity: {value: config.opacity},
    };

    const args = {uniforms, fragmentShader, vertexShader}
  return (
    <shaderMaterial args={[args]} depthWrite={false} side={THREE.FrontSide} depthTest={true} alphaTest={0} transparent={true} />
  )
}

export default ParallaxMaterialXP