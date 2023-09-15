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
  return ( <>{ 
    
    <mesh geometry={rock} receiveShadow scale={1.5}> 
      <RockMaterial  />
      </mesh>

  }</>)
}
