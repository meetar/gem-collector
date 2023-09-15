import * as _ from 'lodash'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'; // Import the OBJLoader module
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { shuffleArray, divideCircleIntoPoints } from './utils';
import { models, combomodels } from './models';
import * as namer from 'color-namer'
import * as adjectives from './adjectives'

function roll(chance) {
  return Math.random() < chance;
}

function getName(color) {
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
  const consonants = ['b', 'g', 'd', 'z', 'th', 'k', 'l', 'm', 'n', 'x', 'p', 'r', 's', 't', 'ph', 'ch', 'ps']
  const n = _.random(2, 5);
  let string = '';
  for (let i = 0; i < n; i++) {
    string += _.sample(consonants) + _.sample(vowels)
  }
  // console.log(string);

  let adj = roll(.5) ? _.sample(adjectives)+' ' : '';
  let col = roll(.5) ? color+' ' : '';
  return `${adj}${col}${string}${_.sample(consonants)}ite`
}

function getAdjective() {

}

export const getDescription = async (color) => {
    return getName(namer(color).basic[0].name);
}
