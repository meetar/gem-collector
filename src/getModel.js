import * as _ from 'lodash'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'; // Import the OBJLoader module
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { shuffleArray, divideCircleIntoPoints } from './utils';
import { models, combomodels } from './models';

export const getModel = async () => {
  // console.log('getmodel');
  // first determine whether to get a single or a combo
  const combo = (Math.random() < .2); //20% chance of combo
  // const combo = true;
  // console.log('obj combo:', combo);
  if (combo) {
    let comboMesh = await makeComboMesh();
    return comboMesh;
  }

  const mesh = './models/'+_.sample(models)
  const loader = new OBJLoader();
  const obj = await loader.loadAsync(mesh)
  // console.log('>> got obj', mesh);
  const geo = obj.children[0].geometry;
  // console.log('>> returning geo', mesh);
  return geo
}

// create a mesh using multiple scaled and rotated instances of the same input geo
async function makeComboMesh() {
  const mesh = './models/'+_.sample(combomodels)
    // const mesh = './models/icosphere.obj'
    console.log(mesh);
    // const mesh = './models/pointer.obj';

    const number = Math.ceil(Math.random()*10)+1;
    // const number = 1;
    const distance = .5;
    // console.log('distance', distance);
    let points = divideCircleIntoPoints(number, distance);
    shuffleArray(points);

    const loader = new OBJLoader();
    const obj = await loader.loadAsync(mesh)
    const geo = obj.children[0].geometry;
    // const geo1 = useLoader(OBJLoader, mesh).children[0].geometry;
    let clones = [];
    let targetY = .1;
    let s = (Math.random()+1)/3;
    // let sY = (Math.random()+1)/2;
    for (let x=0; x< points.length; x++) {
      let clone = geo.clone();
      clone.rotateY(Math.random()*3.16);
      // let targetY = Math.random()/5+.1;
      // console.log(s);
      // clone.scale(s, sY, s);
      clone.scale(s, s, s);
      // let targetY = (1/5)+.1;
      // console.log(targetY);
      clone.lookAt(new THREE.Vector3(points[x].x, targetY, points[x].z));
      targetY += .1;
      s *= .9;
      // clone.lookAt(new THREE.Vector3(points[x].x, 1./4+.1, points[x].z));
      // clone.lookAt(new THREE.Vector3(points[x].x, .0001/3+.1, points[x].z));
      // clone.translate(points[x].x, 0, points[x].z);
      clones.push(clone)
    }
    let merged = BufferGeometryUtils.mergeGeometries(clones)
    return merged;
}