import { useFrame } from "@react-three/fiber"
import React from "react"
import { getViewport } from "./utils"
import * as THREE from "three"
import { Materials } from "./Materials"

export const WorldPlane = ({materials}: {materials: Materials}) => {
    const mesh = React.useRef<THREE.Mesh>(null)
  
    useFrame((state) => {
      if (mesh.current) {
        const width = getViewport(state).width
        mesh.current.scale.set(width, width, width)
      }
    })
    
  
    return <mesh
      ref={mesh}
      scale={1}
      rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
      material={materials.worldPlane}
      >
      <planeGeometry />
    </mesh>
  }