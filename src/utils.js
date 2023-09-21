import * as THREE from 'three'
import { randomColor } from 'randomcolor';


export function hexToRgb(hex) {
  // expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 256,
    g: parseInt(result[2], 16) / 256,
    b: parseInt(result[3], 16) / 256
  } : null;
}

export const getColor = () => {
  const hexColor = randomColor();
  const rgb = hexToRgb(hexColor)
  const threeColor = new THREE.Color(rgb.r / 5, rgb.g / 5, rgb.b / 5);
  return threeColor;
}

export function hexToVec3(hexColor) {
  // remove the '#' symbol if present
  hexColor = hexColor.replace('#', '');

  // parse the hex value to an integer
  const hexValue = parseInt(hexColor, 16);

  // extract the red, green, and blue components
  const r = (hexValue >> 16) & 255;
  const g = (hexValue >> 8) & 255;
  const b = hexValue & 255;

  // normalize the values to the range [0, 1]
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;

  // create and return a Three.js Vector3
  return new THREE.Vector3(normalizedR, normalizedG, normalizedB);
}

export function calculateDeltas(angleDegrees, distance) {
  // convert the angle from degrees to radians
  const angleRadians = (angleDegrees * Math.PI) / 180;

  // calculate the x and y deltas (displacements)
  const deltaX = distance * Math.cos(angleRadians);
  const deltaZ = distance * Math.sin(angleRadians);

  // calculate the rotation vector as a vector pointing from the root
  const rootVector = new THREE.Vector3(0, 0, -distance);
  const deltaVector = new THREE.Vector3(deltaX, deltaZ, 0); // ignore the z-coordinate for the delta
  const rotationVector = new THREE.Vector3().subVectors(deltaVector, rootVector);

  // calculate the Euler angles for the rotation
  const rotation = new THREE.Euler();
  rotation.setFromVector3(rotationVector);
  // console.log(rotation);

  return { deltaX, deltaZ, rotationVector, rotation };  
  // return { deltaX, deltaY, rotationAngleDegrees };
}

export function divideCircleIntoPoints(n, d) {
  const points = [];

  for (let i = 0; i < n; i++) {
    // calculate the angle for each point evenly distributed around the circle
    const angle = (360 / n) * i;

    // calculate the deltas (x and y displacements) using the calculateDeltas function
    const { deltaX, deltaZ, rotation } = calculateDeltas(angle, d);

    // add the calculated point to the array
    points.push({ x: deltaX, z: deltaZ, rotation });
  }

  return points;
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // swap array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function clamp(n) {
  return Math.min(Math.max(n, 0), 1)
}

export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomExp() {
  const lambda = 2;
  const rand = Math.random();
  // console.log('rand:', rand);
  return clamp(Math.log(1.1 - Math.random()) / (-lambda));
}

// convert a Leva controls object to a simplified form for setting UI values
export function simpleControls(controlObject) {
  // console.log('simpleControls');
  const simplifiedObject = {};
  
  for (const key in controlObject) {
    if (controlObject.hasOwnProperty(key)) {
      if (typeof controlObject[key] == 'boolean') {
        simplifiedObject[key] = controlObject[key];
      }
      else if (typeof controlObject[key] == 'object') {
        simplifiedObject[key] = controlObject[key].value;
      }
      else {
        // debugger
        throw new Error(key, typeof controlObject[key])
      }

    }
  }
  // console.log('returning', simplifiedObject);
  return simplifiedObject;
}

export function randomizeLevaControls(controlsObject) {
  // console.log('randomize');
  const randomizedObject = {};

  for (const key in controlsObject) {
    if (controlsObject.hasOwnProperty(key)) {
      const attribute = controlsObject[key];
      if (typeof attribute === 'object' && 'value' in attribute && 'min' in attribute && 'max' in attribute && 'step' in attribute) {
        const { min, max, step } = attribute;
        const range = (max - min) / step;
        // const randomSteps = Math.floor(Math.random() * (range + 1));
        const randomSteps = Math.floor(randomExp() * (range + 1));
        const randomizedValue = (min + randomSteps * step).toFixed(2); // round to 2 decimal places for floating-point steps
        const stepMultiplier = Math.round(randomizedValue / step); // calculate the multiple of 'step'
        const finalValue = step * stepMultiplier; // adjust the value to align with the step


        randomizedObject[key] = {
          value: finalValue, // convert the result back to a float
          min,
          max,
          step,
        };
      } else {
        randomizedObject[key] = attribute;
      }
    }
  }

  return randomizedObject;
}

export function createColorTexture(color) {
  // create a Uint8Array with RGB values
  const data = new Uint8Array([color.r * 255, color.g * 255, color.b * 255, 255]);

  // create a DataTexture with a width and height of 1
  const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  texture.needsUpdate = true; // ensure the texture is updated

  return texture;
}
