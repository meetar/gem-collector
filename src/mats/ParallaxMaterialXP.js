import * as THREE from 'three'
import { useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { randomBetween, createColorTexture } from '../utils';
import { colorMap } from '../textureUtils';
import { roll } from '../getDescription';

// tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const ParallaxMaterialXP = ({trigger, texture, config}) => {
  const vertexShader = useLoader(THREE.FileLoader, './vertexShader.vert');
  const fragmentShader = useLoader(THREE.FileLoader, './parallaxXP.frag');

  const [colorTexture, setColorMap] = useState(getColorMap(texture))

  useEffect(() => {
    setColorMap(getColorMap(texture))
  }, [trigger])

  function getColorMap() {
    return createColorTexture({r: Math.random(), g: Math.random(), b: Math.random()}); // create a single-pixel texture of a random color  

    // TODO: debug this
    return roll(0) ? async () => { //
      const colorMapurl = colorMap();
      const map = await new THREE.TextureLoader().loadAsync(colorMapurl);

      map.wrapT = THREE.MirroredRepeatWrapping;
      map.wrapS = THREE.MirroredRepeatWrapping;
      
      const scale = randomBetween(2, 10)
      map.repeat.set(scale, scale); // adjust the scale along U and V axes
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