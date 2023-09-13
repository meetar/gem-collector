import * as THREE from 'three'
import { useLoader } from '@react-three/fiber';
import { SubsurfaceScatteringShader } from 'three/addons/shaders/SubsurfaceScatteringShader.js';
import { useTexture } from '@react-three/drei'
import { useControls, button } from 'leva'
import { hexToVec3 } from './utils'

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
export default function SSSMat ({texture, config, depthMap}) {
console.log('sss mat');
  const {...sssControls} = useControls('SSS', {
    diffuse: 'red',
    thicknessColor: 'blue',
    shininess: { value: 500, min: 0, max: 10000, step: 10 },
    thicknessDistortion: { value: .1, min: 0, max: 2, step: .01 },
    thicknessAmbient: { value: .4, min: 0, max: 2, step: .01 },
    thicknessAttenuation: { value: .8, min: 0, max: 2, step: .01 },
    thicknessPower: { value: 2, min: 0, max: 10, step: .01 },
    thicknessScale: { value: 16, min: 0, max: 64, step: .01 },
  });



  const shader = SubsurfaceScatteringShader;
  const uniforms = THREE.UniformsUtils.clone( shader.uniforms );

  const imgTexture = useTexture('./textures/J3QeZ.png')
  imgTexture.colorSpace = THREE.SRGBColorSpace;

  const thicknessTexture = useTexture('./textures/J3QeZ.png')
  imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;

  // uniforms[ 'map' ].value = imgTexture;
  uniforms[ 'diffuse' ].value = hexToVec3(sssControls.diffuse);
  uniforms[ 'shininess' ].value = sssControls.shininess;

  uniforms[ 'thicknessMap' ].value = thicknessTexture;
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
    <shaderMaterial args={[args]} color={'#666'} lights={true} extensions={{derivatives: true}}
    side={THREE.DoubleSide}
   />
  )
}
