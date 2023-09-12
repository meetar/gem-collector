import * as THREE from 'three';
import { useTexture } from '@react-three/drei'
import ParallaxMaterialXP from './ParallaxMaterialXP'
import { parallaxcontrols } from './parallaxcontrols'
import { useControls } from 'leva'

function ParallaxMeshXP({geometry, config, textureUrl, depthMap, ...props}) {
  const { ...pconfig } = useControls(parallaxcontrols)
  // if (!textureUrl) textureUrl = './textures/speckles.png';
  // if (!textureUrl) textureUrl = './textures/streaks3.png';
  // if (!textureUrl) textureUrl = './textures/cracks3.png';
  // if (!textureUrl) textureUrl = './textures/streaks4.png';

  // const texture = useTexture(textureUrl);

  depthMap.minFilter = THREE.NearestFilter;
  depthMap.magFilter = THREE.NearestFilter;
  depthMap.wrapS = THREE.RepeatWrapping;
  depthMap.wrapT = THREE.RepeatWrapping;

  return (
    <>
        <mesh geometry={geometry} {...props}>
          <ParallaxMaterialXP texture={depthMap} isShaderMaterial config={{...config, ...pconfig}} opacity={config.opacity} transparent={true} />
        </mesh>
    </>
  );
}

export default ParallaxMeshXP;