import { Leva, useControls, button } from 'leva'
export const parallaxcontrols = {
  _steps: { value: 5, min: 0, max: 100, step: 1 },
  _height: { value: 1., min: 0, max: 5, step: .01 },
  _scale: { value: 1, min: 0, max: 10, step: .01 },
  _shift: { value: 1, min: 0, max: 10, step: .01 },
  autoRotate: {value: false}, 
}