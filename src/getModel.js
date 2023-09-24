import * as _ from 'lodash'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { shuffleArray, divideCircleIntoPoints } from './utils';
import { models, combomodels } from './models';
import { roll } from './getDescription';

export const getModel = async () => {
  // first determine whether to get a single or a combo
  const combo = roll(0);
  if (combo) {
    let comboMesh = await makeComboMesh();
    return comboMesh;
  }

  const mesh = './models/'+_.sample(models)
  // const mesh = './models/crystal.obj' // testing
  const loader = new OBJLoader();
  const obj = await loader.loadAsync(mesh)
  // console.log('obj:', mesh);
  const geo = obj.children[0].geometry;
  return geo
}

// create a mesh using multiple scaled and rotated instances of the same input geo
async function makeComboMesh() {
  const mesh = './models/'+_.sample(combomodels)
    // console.log('combo obj:', mesh);

    // how many clones should we make?
    const number = Math.ceil(Math.random()*10)+1;
    const distance = .5;
    // arrange them evenly in a circle
    let points = divideCircleIntoPoints(number, distance);
    // shuffle them so they aren't ordered by size
    shuffleArray(points);

    // load the geo
    const loader = new OBJLoader();
    const obj = await loader.loadAsync(mesh)
    const geo = obj.children[0].geometry;

    let clones = [];
    let targetY = .1;
    // random scale
    let s = (Math.random()+1)/3;
    for (let x=0; x< points.length; x++) {
      let clone = geo.clone();
      clone.scale(s, s, s);
      // this tips the clones outward a bit, away from the center
      clone.lookAt(new THREE.Vector3(points[x].x, targetY, points[x].z));
      // adjust the lookat point and scale a bit for each clone
      targetY += .1;
      s *= .9;
      clones.push(clone)
    }
    let merged = BufferGeometryUtils.mergeGeometries(clones)
    return merged;
}