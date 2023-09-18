import * as THREE from 'three'
import { randomColor } from 'randomcolor';


export function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
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
  // Remove the '#' symbol if present
  hexColor = hexColor.replace('#', '');

  // Parse the hex value to an integer
  const hexValue = parseInt(hexColor, 16);

  // Extract the red, green, and blue components
  const r = (hexValue >> 16) & 255;
  const g = (hexValue >> 8) & 255;
  const b = hexValue & 255;

  // Normalize the values to the range [0, 1]
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;

  // Create and return a Three.js Vector3
  return new THREE.Vector3(normalizedR, normalizedG, normalizedB);
}

export function calculateDeltas(angleDegrees, distance) {
  // Convert the angle from degrees to radians
  const angleRadians = (angleDegrees * Math.PI) / 180;

  // Calculate the x and y deltas (displacements)
  const deltaX = distance * Math.cos(angleRadians);
  const deltaZ = distance * Math.sin(angleRadians);

  // Calculate the rotation vector as a vector pointing from the root
  const rootVector = new THREE.Vector3(0, 0, -distance);
  const deltaVector = new THREE.Vector3(deltaX, deltaZ, 0); // Ignore the z-coordinate for the delta
  const rotationVector = new THREE.Vector3().subVectors(deltaVector, rootVector);

  // Calculate the Euler angles for the rotation
  const rotation = new THREE.Euler();
  rotation.setFromVector3(rotationVector);
  // console.log(rotation);

  return { deltaX, deltaZ, rotationVector, rotation };  
  // return { deltaX, deltaY, rotationAngleDegrees };
}

export function divideCircleIntoPoints(n, d) {
  const points = [];

  for (let i = 0; i < n; i++) {
    // Calculate the angle for each point evenly distributed around the circle
    const angle = (360 / n) * i;

    // Calculate the deltas (x and y displacements) using the calculateDeltas function
    const { deltaX, deltaZ, rotation } = calculateDeltas(angle, d);

    // Add the calculated point to the array
    points.push({ x: deltaX, z: deltaZ, rotation });
  }

  return points;
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function clamp(n) {
  return Math.min(Math.max(n, 0), 1)
}

export function randomExp() {
  const lambda = 2;
  const rand = Math.random();
  // console.log('rand:', rand);
  return clamp(Math.log(1.1 - Math.random()) / (-lambda));
}
  
