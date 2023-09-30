import { useFrame } from "@react-three/fiber"
import React from "react"
import { getViewport } from "./utils"
import * as THREE from "three"
import { Materials } from "./Materials"

export const WorldPlane = ({materials}: {materials: Materials}) => {
    const plane = React.useRef<THREE.Mesh>(null);
    const ring = React.useRef<THREE.Mesh>(null);
  
    useFrame((state) => {
      if (plane.current && ring.current) {
        const width = getViewport(state).width
        plane.current.scale.set(width, width, width)
        ring.current.scale.set(width, width, width)
      }
    })
    
  
    return <><mesh
      ref={plane}
      scale={1}
      rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
      material={materials.worldPlane}
      >
      <planeGeometry />
    </mesh>
    <mesh
        ref={ring}
        scale={1}
        material={materials.worldCylinder}
        >
        <cylinderGeometry args={[0.45, 0.45, 1.0, 32]} />
    </mesh>
    </>
  }