import {
  CubeCamera,
  Center,
  MeshTransmissionMaterial,
} from '@react-three/drei'

export function Feedbackgem({config, btexture, geo, ...props}) {
console.log('config?', config);
config.autoRotate = false;
  return (
    <>
        <Center scale={[1, 1, 1]} center >

      {/* Create a CubeCamera */}
      <CubeCamera near={1} far={1000} resolution={256} visible={true}>
        {(texture) => {
          return (
            <>
              <group scale={0.998} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 1]}>
              <Center front top {...props}>
                <mesh geometry={geo} rotation={[Math.PI / 2, 0, 0]}>
                  <MeshTransmissionMaterial {...config} ior={config.iorInner} transparent={true} 
                  visible={config.InnerVisible}
                  background={btexture}
                  />
                </mesh>
              </Center>
              </group>
              <group scale={1} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 1]}>
              <Center front top {...props}>
                <mesh geometry={geo} rotation={[Math.PI / 2, 0, 0]}>
                  <MeshTransmissionMaterial {...config} ior={config.iorOuter} transparent={true}
                  visible={config.GemVisible}
                  background={texture}
                  />
                </mesh>
              </Center>
              </group>
            </>
          )
        }}
      </CubeCamera>
      </Center>
    </>
  )
}