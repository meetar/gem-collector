import * as THREE from 'three';
import { useTexture } from '@react-three/drei'
import ParallaxMaterialXP from './ParallaxMaterialXP'
import { parallaxcontrols } from './parallaxcontrols'
import { useControls } from 'leva'

function ParallaxMeshXP({geometry, config, textureUrl, ...props}) {
  const { ...pconfig } = useControls(parallaxcontrols)
  // if (!textureUrl) textureUrl = './speckles.png';
  if (!textureUrl) textureUrl = './textures/streak2.png';

  const texture = useTexture(textureUrl);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
console.log('ro?', props.renderOrder);
  return (
    <>
        <mesh geometry={geometry} {...props}>
          <ParallaxMaterialXP texture={texture} isShaderMaterial config={{...config, ...pconfig}} opacity={config.opacity} transparent={true} />
        </mesh>
    </>
  );
}

export default ParallaxMeshXP;