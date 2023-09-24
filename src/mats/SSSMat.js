import * as THREE from 'three'
import { useLoader } from '@react-three/fiber';
import { SubsurfaceScatteringShader } from 'three/addons/shaders/SubsurfaceScatteringShader.js';
import { useTexture } from '@react-three/drei'
import { useControls, button } from 'leva'
import { hexToVec3 } from '../utils'

// tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
export default function SSSMat ({texture, color, config, depthMap}) {
  const {...sssControls} = useControls('SSS', {
    thicknessColor: color,
    shininess: { value: 500, min: 0, max: 10000, step: 10 },
    thicknessDistortion: { value: .1, min: 0, max: 2, step: .01 },
    thicknessAmbient: { value: .4, min: 0, max: 2, step: .01 },
    thicknessAttenuation: { value: .8, min: 0, max: 2, step: .01 },
    thicknessPower: { value: 2, min: 0, max: 10, step: .01 },
    thicknessScale: { value: 16, min: 0, max: 64, step: .01 },
  }, {collapsed: true});

  const shader = SubsurfaceScatteringShader;
  const uniforms = THREE.UniformsUtils.clone( shader.uniforms );

  uniforms[ 'map' ].value = texture;
  uniforms[ 'diffuse' ].value = hexToVec3(color);
  uniforms[ 'shininess' ].value = sssControls.shininess;

  uniforms[ 'thicknessColor' ].value = hexToVec3(sssControls.thicknessColor);
  uniforms[ 'thicknessDistortion' ].value = sssControls.thicknessDistortion;
  uniforms[ 'thicknessAmbient' ].value = sssControls.thicknessAmbient;
  uniforms[ 'thicknessAttenuation' ].value = sssControls.thicknessAttenuation;
  uniforms[ 'thicknessPower' ].value = sssControls.thicknessPower;
  uniforms[ 'thicknessScale' ].value = sssControls.thicknessScale;


  const material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    lights: true,

  } );
  material.extensions.derivatives = true;
  const fragmentShader = shader.fragmentShader;
  const vertexShader = shader.vertexShader;
  const args = {uniforms, fragmentShader, vertexShader}
  return (
    <shaderMaterial args={[args]} color={color} lights={true} extensions={{derivatives: true}}
    side={THREE.DoubleSide}
   />
  )
}
