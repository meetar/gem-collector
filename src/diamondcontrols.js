import _ from "lodash"

export const diamondcontrols = {
    // backside: true,
    // backsideThickness: { value: 0.3, min: 0, max: 2 },
    samples: { value: 8, min: 1, max: 32, step: 1 },
    transmission: { value: 1, min: 0, max: 1 },
    thickness: { value: 3.17, min: 0, max: 10, step: .01 },
    chromaticAberration: { value: .02 , min: 0, max: 5 },
    anisotropy: { value: 0.0, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.5, min: 0, max: 4, step: 0.01 },
    distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0, min: 0, max: .1, step: 0.01 },
    iorInner: { value: 2.15, min: 1.02, max: 2.147, step: 0.01 },
    iorOuter: { value: 1.03, min: 0.9, max: 2.147, step: 0.01 },
    opacity: { value: .7, min: 0, max: 1, step: 0.01 },
    bounces: { value: 2, min: 1, max: 3, step: 1 },
    InnerVisible: true,
    GemVisible: true,

    envMap: true,
    envMapIntensity: { value: 1, min: 0, max: 3, step: .01 },
    reflectivity: { value: .01, min: 0, max: 1, step: .01 },
    clearcoat: { value: .33, min: 0, max: 1, step: .01 },
    clearcoatRoughness: { value: .11, min: 0, max: 1, step: .01 },
    normalScale: { value: 1, min: 0, max: 1, step: .01 },
  }