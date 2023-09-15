import { button } from 'leva'

// const [trigger, setTrigger] = useState();
export const randomControls = {
  autoRotate: true,
  bloom: true,
  lumThreshold: { value: .36, min: 0, max: 1, step: 0.01 },
  bloomIntensity: { value: 0.33, min: 0, max: 10, step: 0.01 },
  bloomLevels: { value: 3, min: 0, max: 9, step: 1 },
  // fastChroma: true,
}
