import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import fetcher from './Fetcher'

let shader = { vert: 'novert', frag: 'nofrag' }

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const ParallaxMaterial = async ({texture, config}) => {

  async function fetchShaders() {
    try {
      let frag = await fetcher('./fragmentShader.frag');
      let vert = await fetcher('./vertexShader.vert');
      shader = { vert, frag };
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
    if (error) {
      return error.message
    }
    if (data) {
      return data
    }

  }
  return fetchShaders()
}
export default ParallaxMaterial
