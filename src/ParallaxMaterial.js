import * as THREE from 'three'
import { useLoader } from '@react-three/fiber';

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const ParallaxMaterial = ({texture, config}) => {

  const vertexShader = useLoader(THREE.FileLoader, './vertexShader.vert');
  const fragmentShader = useLoader(THREE.FileLoader, './fragmentShader.frag');

  const uniforms = {
      _texture: { value: texture },
      _steps: {value: config._steps},
      _height: {value: config._height},
      _scale: {value: config._scale},
      _shift: {value: config._shift},
    };

    const args = {uniforms, fragmentShader, vertexShader}
  return (
    <shaderMaterial args={[args]} />
  )
}

export default ParallaxMaterial