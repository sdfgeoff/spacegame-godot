import { Canvas } from '@react-three/fiber'
// import { OrbitControls as OrbitControls3 } from 'three/examples/jsm/controls/OrbitControls'
import React from 'react'
import { WorldPlane } from './WorldPlane';
import * as THREE from 'three'

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
  selected?: DisplayItem | undefined,
  sensorPosition: [number, number, number],
} & React.RefAttributes<HTMLCanvasElement>


export const TacticalDisplay = ({displayItems, selected, setSelected, sensorPosition, ...props}: TacticalDisplayProps) => {

  const materials = React.useMemo(() => createMaterials(), [])

  const displayItemsCompensated = React.useMemo(() => {
    return displayItems.map((item) => {
      const position: [number, number, number] = [
        item.position[0] - sensorPosition[0],
        item.position[1] - sensorPosition[1],
        item.position[2] - sensorPosition[2],
      ]
      return {
        ...item,
        position
      }
    })
  }, [displayItems, sensorPosition])

  const [orbitRef, setOrbitRef] = React.useState<any /*OrbitControls3*/ | null>(null)

  const [scale, setScale] = React.useState<number>(1.0)

  const onCameraMove = React.useCallback(() => {
    if (!orbitRef) {
      return
    }
    const camera = orbitRef.object
    const dist = orbitRef.getDistance()
    const visibleRadius = dist * Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))
    camera.near = Math.max(0.1, dist - visibleRadius )
    camera.far = visibleRadius + dist
    setScale(visibleRadius)
  }, [setScale, orbitRef])


  React.useEffect(() => {
    if (orbitRef) {
      orbitRef.addEventListener('change', onCameraMove)
      return () => {
        orbitRef?.removeEventListener('change', onCameraMove)
      }
    }
  }, [orbitRef, onCameraMove])


  return (
    <Canvas {...props} camera={{position:[0,0,-45], fov: 30, near:1.0, far:1000.0}}>
      <color attach="background" args={[0,0,0]} />
      <OrbitControls enablePan={false} ref={(r) => setOrbitRef(r)}/>
      {displayItemsCompensated.map((item) => {
        return <Pip 
          materials={materials}
          key={item.designation} 
          position={item.position}
          id={item.designation}
          selected={selected?.designation === item.designation}
          onSelect={() => setSelected(item)}
        />
      })}
      <WorldPlane materials={materials} scale={scale}/>
    </Canvas>
  )
}

export default TacticalDisplay
