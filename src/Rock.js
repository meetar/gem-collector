import * as CSG from '@react-three/csg'
import { Geometry, Base, Addition, Subtraction, Intersection, Difference } from '@react-three/csg'
import RockMaterial from './RockMaterial'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'; // Import the OBJLoader module
import { Center, MeshTransmissionMaterial, Sphere } from '@react-three/drei'


export function Rock({insetGeo, csg=false }) {
  const rock = useLoader(OBJLoader, './models/rock1.obj').children[0].geometry;
  // rock.computeTangents(); unnecessary?

  // can't put space between the <> and the { or it complains about text in the r3f tree
  return ( <>{ csg ? (

<mesh scale={1} castShadow>
      <RockMaterial  />

      {/** This will yield a regular THREE.BufferGeometry which needs to be paired with a mesh. */}
      <Geometry>
        {/** The chain begins with a base geometry, where all operations are carried out on. */}
        <Base geometry={rock} scale={1.5} />
        {/** Chain your boolean operations: Addition, Subtraction, Difference and Intersection. */}
        <Center top>
        <group scale={1} position={[0, 0, 0]}>
          <Subtraction geometry={insetGeo} />
        </group>
        </Center>
      </Geometry>
    </mesh>

    ) : (
    
    <mesh geometry={rock} scale={1.5}> 
      <RockMaterial  />
      </mesh>

    )
  }</>)
}
