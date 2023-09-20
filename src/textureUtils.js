import * as _ from 'lodash'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three';
import { RGBELoader } from 'three-stdlib'


export const randomNormal = () => {
  // console.log('randomNormal');
  let maps = [
  '6056-normal.jpg',
  '1160-normal.jpg',
  // 'ice-normal.jpeg',
  'normal-moon.jpg',
  '14009-normal.jpg',
  'normals2.jpeg',
  'rocknormal-s.jpg',
  // 'lava-normal.jpeg',
  'lava-normal2.jpeg'
  ];
  let map = _.sample(maps);
  console.log('fetching', './textures/'+map);
  return './textures/normal/'+map;
}

export const randomDepth = () => {
  // console.log('randomDepth');
  let maps = [
'streaks4.png',
'cracks3.png',
'cracks.png',
'speckles.png',
'speck.png',
'streaks3.png',
'streaks.png',
'spatter.jpg',
'spatter2.jpg',
// 'stripes.jpg',
];
  let map = _.sample(maps);
  // console.log('fetching', './textures/'+map);
  return './textures/depth/'+map;
}

export const colorMap = () => {
  // console.log('randomDepth');
  let maps = [
  // 'redsquare.png',
  'rainbow.png',
  // 'ice.jpeg',
  // 'redblue.jpeg',
  // 'peach.jpeg',
];
  let map = _.sample(maps);
  // console.log('fetching', './textures/'+map);
  return './textures/colorMap/'+map;
}

export const randomEnv = () => {
  // console.log('randomEnv');
  let maps = [
  'aerodynamics_workshop_1k.hdr',
//  'burnt_warehouse_1k.hdr',
//  'empty_workshop_1k.hdr',
// 'little_paris_under_tower_1k.hdr',
//  'peppermint_powerplant_2_1k.hdr',
//  'rainforest_trail_1k.hdr',
//  'whale_skeleton_1k.hdr',
//  'workshop_1k.hdr'

//  'fireplace_1k.hdr',
//  'gum_trees_1k.hdr',
//  'little_paris_eiffel_tower_1k.hdr',
//  'pine_attic_1k.hdr',
//  'sandsloot_1k.hdr',

//  'blouberg_sunrise_1_1k.hdr',
//   'kloofendal_misty_morning_puresky_1k.hdr'
 
];
  let map = _.sample(maps);
  // console.log('fetching', './textures/env'+map);
  return './textures/env/'+map;
}

