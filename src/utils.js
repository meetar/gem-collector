import * as THREE from 'three'
import { randomColor } from 'randomcolor';


function hexToRgb(hex) {
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

const getColor = () => {
  const hexColor = randomColor();
  const rgb = hexToRgb(hexColor)
  const threeColor = new THREE.Color(rgb.r / 5, rgb.g / 5, rgb.b / 5);
  return threeColor;
}

function hexToVec3(hexColor) {
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

export { getColor, hexToVec3 }