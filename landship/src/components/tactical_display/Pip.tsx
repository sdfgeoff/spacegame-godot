import { useThree } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three';
import { Materials } from './Materials';

export interface pipProps {
    position: [number, number, number],
    materials: Materials,
    id: string,
    selected: boolean,
    onSelect: () => void,
}

/**
 * A pip represents a contact on the tactical display.
 * This can represent (Eg) a ship, a torpedo, a mine, etc.
 * @returns 
 */
export const Pip = ({ materials, position, id, selected, onSelect }: pipProps) => {
    const [hovered, setHover] = React.useState(false)
    const mesh = React.useRef<THREE.Mesh>(null)

    const { viewport } = useThree()

    React.useEffect(() => {
        if (mesh.current) {
            mesh.current.position.set(position[0], position[1], position[2])
        }
    }, [position, mesh.current])

    React.useEffect(() => {
        if (mesh.current) {
            if (hovered) {
                mesh.current.material = materials.hovered
            } else {
                mesh.current.material = selected ? materials.active : materials.inactive
            }
        }
    }, [selected, hovered, mesh.current])



    return (
        <mesh
            ref={mesh}
            scale={viewport.width / 100.0}
            onClick={(e) => onSelect()}
            onPointerOver={(e) => setHover(true)}
            onPointerOut={(e) => setHover(false)}>
            <sphereGeometry />

        </mesh>
    )
}