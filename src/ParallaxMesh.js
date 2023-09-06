import * as THREE from 'three';
import { useTexture } from '@react-three/drei'
import ParallaxMaterial from './ParallaxMaterial'
import { parallaxcontrols } from './parallaxcontrols'
import { useControls } from 'leva'

function ParallaxMesh({geometry, config, textureUrl, ...props}) {
  const { ...pconfig } = useControls(parallaxcontrols)
  if (!textureUrl) textureUrl = './speckles.png';

  const texture = useTexture(textureUrl);
  // texture.minFilter = THREE.NearestFilter;
  // texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return (
    <>
        <mesh geometry={geometry} {...props}>
          <ParallaxMaterial texture={texture} isShaderMaterial config={{...config, ...pconfig}} opacity={config.opacity} transparent={true} />
        </mesh>
    </>
  );
}

export default ParallaxMesh;
