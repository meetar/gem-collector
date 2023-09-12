import * as _ from 'lodash'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three';


export const randomNormal = () => {
  console.log('randomNormal');
  // const normalMap = useLoader(TextureLoader, './textures/6056-normal.jpg')
  let maps = [
'6056-normal.jpg',
// '4979-normal.jpg',
'1160-normal.jpg',
'ice-normal.jpeg',
'normal-moon.png',
'14009-normal.jpg',
'normals2.jpeg',
];
  let map = _.sample(maps);
  console.log('fetching', './textures/'+map);
  return './textures/'+map;
}

