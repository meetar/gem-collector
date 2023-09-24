import * as _ from 'lodash'
import { TextureLoader } from 'three';


export const randomNormal = () => {
  // console.log('randomNormal');
  let maps = [
'6056-normal.jpg',
// '4979-normal.jpg',
'1160-normal.jpg',
'ice-normal.jpeg',
'normal-moon.jpg',
'14009-normal.jpg',
'normals2.jpeg',
];
  let map = _.sample(maps);
  // console.log('fetching', './textures/'+map);
  return './textures/'+map;
}

