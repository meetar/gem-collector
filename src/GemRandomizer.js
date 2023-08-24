import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  Center,
  MeshTransmissionMaterial,
  Sphere,
} from '@react-three/drei'
import { MeshBasicMaterial } from 'three';
import * as _ from 'lodash'

const meshes = ['./crystal1.glb', './crystal2.glb', './crystal3.glb'];
const mesh = _.sample(meshes);
// console.log(mesh);

export function GemRandomizer({config, geo, ...props}) {

  // geo = useLoader(GLTFLoader, './gem.glb').scene.children[0].children[0].children[0].children[0].geometry;
  // geo = useLoader(GLTFLoader, './crystal.glb').scene.children[0].children[0].children[0].children[0].children[0].geometry; // scale = 0.001
  // geo = useLoader(GLTFLoader, './crystal1.glb').scene.children[0].geometry;

  geo = useLoader(GLTFLoader, mesh).scene.children[0].geometry;
  // geo = new THREE.SphereGeometry(1.);

  console.log(geo);

  // const material = new THREE.MeshNormalMaterial();
  const material = new THREE.ShaderMaterial({
    fragmentShader: `void main() {gl_FragColor = vec4(1., 0., 1., 1.);}`
  });

  return (
    <>
      <group>

        <mesh scale={1} geometry={geo} material={material}>

        </mesh>
      </group>
    </>
  )
}
