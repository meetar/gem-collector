import * as THREE from 'three';
import ParallaxMaterialXP from './ParallaxMaterialXP'
import { parallaxcontrols } from './parallaxcontrols'
import { useControls } from 'leva'

function ParallaxMeshXP({trigger, geometry, config, textureUrl, depthMap, ...props}) {
  const { ...pconfig } = useControls('Parallax', parallaxcontrols, {collapsed: true})

  depthMap.minFilter = THREE.NearestFilter;
  depthMap.magFilter = THREE.NearestFilter;
  depthMap.wrapS = THREE.RepeatWrapping;
  depthMap.wrapT = THREE.RepeatWrapping;

  return (
    <>
        <mesh geometry={geometry} {...props}>
          <ParallaxMaterialXP trigger={trigger} texture={depthMap} isShaderMaterial config={{...config, ...pconfig}} opacity={config.opacity} transparent={true} />
        </mesh>
    </>
  );
}

export default ParallaxMeshXP;