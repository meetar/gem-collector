import * as THREE from 'three'
import { useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader';

const RockMaterial = ({texture, config}) => {
  const btexture = useTexture('./textures/Cliffs0177_1_350.jpg')
  btexture.wrapS = THREE.RepeatWrapping;
  btexture.wrapT = THREE.RepeatWrapping;

  const normalmap = useLoader(TextureLoader, './textures/normal/earth-normalmap.jpg');
  // const normalmap = useLoader(TextureLoader, './textures/J3QeZ.png');
  // const normalmap = useLoader(TextureLoader, './textures/13191-normal.jpg');

  normalmap.wrapS = THREE.RepeatWrapping;
  normalmap.wrapT = THREE.RepeatWrapping;

  normalmap.repeat.set(2, 2); // adjust the scale along U and V axes

  return (
    <meshPhongMaterial transparent={true} side={THREE.DoubleSide} color={'grey'} normalMap={normalmap} specularMap={normalmap} specular={'#666'} />
  )
}

export default RockMaterial