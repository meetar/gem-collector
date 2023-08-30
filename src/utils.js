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
  // console.trace('getColor');
  const hexColor = randomColor();
  // console.log(hexColor);
  const rgb = hexToRgb(hexColor)
  // console.log(rgb);
  const threeColor = new THREE.Color(rgb.r, rgb.g, rgb.b);
  // const threeColor = new THREE.Color(1, 0, 0);
  // console.log(threeColor);
  return threeColor;
}

export { getColor }