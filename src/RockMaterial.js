import * as THREE from 'three'
import { useLoader } from '@react-three/fiber';
import { Stats, Sphere, useTexture } from '@react-three/drei'

const RockMaterial = ({texture, config}) => {
  const btexture = useTexture('./textures/Cliffs0177_1_350.jpg')
  btexture.wrapS = THREE.RepeatWrapping;
  btexture.wrapT = THREE.RepeatWrapping;
  // const normalmap = useTexture('./textures/13191-normal.jpg')
  // const normalmap = useTexture('./textures/J3QeZ.png')
  const normalmap = useTexture('./textures/earth-normalmap.jpg')
  // const normalTexture = new THREE.TextureLoader().load('img/earth_normalmap.jpg');
  // normalTexture.wrapS = THREE.RepeatWrapping;
  // normalTexture.wrapT = THREE.RepeatWrapping;
  // const normalmap = useTexture('./textures/1160-normal.jpg')
  // normalmap.magFilter = THREE.NearestFilter;
  // normalmap.normalMapType = THREE.ObjectSpaceNormalMap;
  

  btexture.repeat.set(3, 3); // Adjust the scale along U and V axes
  normalmap.repeat.set(2, 2); // Adjust the scale along U and V axes
  // normalTexture.repeat.set(3, 3); // Adjust the scale along U and V axes





  return (
    // <shaderMaterial args={[args]} transparent={true} />
    <meshStandardMaterial transparent={true} color={'white'} map={btexture} normalScale={(1, 1)} normalMap={normalmap}  />
    // <meshPhongMaterial transparent={true} specular={'#ffffff'} normalMap={normalmap} map={btexture} />
  )
}

export default RockMaterial