import { Canvas } from '@react-three/fiber'
import React from 'react'
import { WorldPlane } from './WorldPlane';

import { createMaterials } from './Materials';
import { Pip } from './Pip';
import { OrbitControls } from '@react-three/drei'


export interface DisplayItem {
  position: [number, number, number],
  designation: string,
}




export type TacticalDisplayProps = {
  displayItems: DisplayItem[]
  setSelected: (item: DisplayItem) => void
  selected?: DisplayItem | undefined
} & React.RefAttributes<HTMLCanvasElement>


export const TacticalDisplay = ({displayItems, selected, setSelected, ...props}: TacticalDisplayProps) => {

  const materials = React.useMemo(() => createMaterials(), [])


  return (
    <Canvas {...props} camera={{position:[0,0,-30], fov: 90, near:0.1, far:100.0}}>
      <color attach="background" args={[0,0,0]} />
      <OrbitControls enablePan={false}/>
      {displayItems.map((item) => {
        return <Pip 
          materials={materials}
          key={item.designation} 
          position={item.position}
          id={item.designation}
          selected={selected?.designation === item.designation}
          onSelect={() => setSelected(item)}
        />
      })}
      <WorldPlane materials={materials}/>
    </Canvas>
  )
}

export default TacticalDisplay
