import * as THREE from 'three'
import { useLoader } from '@react-three/fiber';

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const ParallaxMaterial = ({texture, config}) => {
  const vertexShader = useLoader(THREE.FileLoader, './parallax.vert');
  const fragmentShader = useLoader(THREE.FileLoader, './parallax.frag');

  const uniforms = {
      _displacement: { value: config._displacement },
      _texture: { value: texture },
      _steps: {value: config._steps},
      _height: {value: config._height},
      _scale: {value: config._scale},
      _opacity: {value: config.opacity},
    };

    const args = {uniforms, fragmentShader, vertexShader}
  return (
    <shaderMaterial args={[args]} depthWrite={true} side={THREE.FrontSide} depthTest={true} alphaTest={0} transparent={true} />
  )
}

export default ParallaxMaterial