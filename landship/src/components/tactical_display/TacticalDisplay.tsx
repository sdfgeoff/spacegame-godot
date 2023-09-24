import { Canvas, useThree, MeshProps } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three';

import { createMaterials } from './Materials';
import { Pip } from './Pip';


export interface DisplayItem {
  position: [number, number, number],
  id: string,
}


const CameraControls = (props: MeshProps) => {
  useThree(({ camera }) => {
    camera.rotation.set(THREE.MathUtils.degToRad(180), 0, 0);
  });

  return <mesh
    {...props}
    scale={1}
    >
  </mesh>
}



export type TacticalDisplayProps = {
  displayItems: DisplayItem[]
  setSelected: (item: DisplayItem) => void
  selected?: DisplayItem | undefined
} & React.RefAttributes<HTMLCanvasElement>


export const TacticalDisplay = ({displayItems, selected, setSelected, ...props}: TacticalDisplayProps) => {

  const materials = React.useMemo(() => createMaterials(), [])


  return (
    <Canvas {...props} camera={{position:[0,0,-10], fov: 120, near:0.1, far:100.0}}>
      {/* <CameraControls/> */}

      {displayItems.map((item) => {
        return <Pip 
          materials={materials}
          key={item.id} 
          position={item.position}
          id={item.id}
          selected={selected?.id === item.id}
          onSelect={() => setSelected(item)}
        />
      })}
    </Canvas>
  )
}

export default TacticalDisplay
