import * as _ from 'lodash'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three';


export const randomNormal = () => {
  console.log('randomNormal');
  // const normalMap = useLoader(TextureLoader, './textures/6056-normal.jpg')
  const normalMap = useLoader(TextureLoader, './textures/13191-normal.jpg')
  console.log(normalMap);
  return normalMap;
}
