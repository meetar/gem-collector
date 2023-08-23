import {
  MeshTransmissionMaterial,
} from '@react-three/drei'
import * as CSG from '@react-three/csg'
import { Geometry, Base, Addition, Subtraction, Intersection, Difference } from '@react-three/csg'

import { EquirectangularReflectionMapping } from 'three';

export function CSGShape({geo, config, backgroundTexture}) {

    backgroundTexture.mapping = EquirectangularReflectionMapping; 
    return (
      <mesh scale={1}>
                <MeshTransmissionMaterial {...config}  transparent={true}
          // color='black'
          // opacity={1}
                 reflectivity={config.reflectivity} 
                 envMap={config.envMap ? backgroundTexture : null}
                //  envMapIntensity={config.envMapIntensity}
                 ior={config.iorOuter}
          />
  
        {/** This will yield a regular THREE.BufferGeometry which needs to be paired with a mesh. */}
        <Geometry>
          {/** The chain begins with a base geometry, where all operations are carried out on. */}
          <Base geometry={geo} scale={1.5} position={[0, 0.5, 0]} />
          {/** Chain your boolean operations: Addition, Subtraction, Difference and Intersection. */}
          <Subtraction position={[-1, 1, 1]}>
            {/** Geometry can be set by prop or by child, just like any regular <mesh>. */}
            <sphereGeometry />
          </Subtraction>
          {/** Geometry is re-usable, form hierachies with previously created CSG geometries. */}
          <group position={[0.5, 1, 0.9]}>
            <Subtraction>
              <sphereGeometry args={[0.65, 32, 32]} />
            </Subtraction>
          </group>
        </Geometry>
      </mesh>

    )
  }
  
  