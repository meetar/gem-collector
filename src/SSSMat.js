import * as THREE from 'three'
import { useLoader } from '@react-three/fiber';
import { SubsurfaceScatteringShader } from 'three/addons/shaders/SubsurfaceScatteringShader.js';
import { useTexture } from '@react-three/drei'

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
export default function SSSMat ({texture, config}) {
  const shader = SubsurfaceScatteringShader;
  const uniforms = THREE.UniformsUtils.clone( shader.uniforms );

  const imgTexture = useTexture('./textures/J3QeZ.png')
  imgTexture.colorSpace = THREE.SRGBColorSpace;

  const thicknessTexture = useTexture('./textures/J3QeZ.png')
  imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;

  // uniforms[ 'map' ].value = imgTexture;

  uniforms[ 'diffuse' ].value = new THREE.Vector3( 1.0, 0.2, 0.2 );
  uniforms[ 'shininess' ].value = 500;

  uniforms[ 'thicknessMap' ].value = thicknessTexture;
  uniforms[ 'thicknessColor' ].value = new THREE.Vector3( 0.3, 0.3, 0.3 );
  uniforms[ 'thicknessDistortion' ].value = 0.1;
  uniforms[ 'thicknessAmbient' ].value = 0.4;
  uniforms[ 'thicknessAttenuation' ].value = 0.8;
  uniforms[ 'thicknessPower' ].value = 2.0;
  uniforms[ 'thicknessScale' ].value = 16.0;


  const material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    lights: true
  } );
  material.extensions.derivatives = true;
  const fragmentShader = shader.fragmentShader;
  const vertexShader = shader.vertexShader;
  const args = {uniforms, fragmentShader, vertexShader}
  return (
    <shaderMaterial args={[args]} color={'#666'} lights={true} extensions={{derivatives: true}} />
  )
}
