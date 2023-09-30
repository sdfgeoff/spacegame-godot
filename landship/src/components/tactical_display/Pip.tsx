import { useFrame, useThree } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three';
import { Materials } from './Materials';
import { getViewport } from './utils';

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
    const pip = React.useRef<THREE.Mesh>(null)
    const leg = React.useRef<THREE.Mesh>(null)

    const { viewport } = useThree()

    React.useEffect(() => {
        if (pip.current && leg.current) {
            pip.current.position.set(position[0], position[1], position[2])
            leg.current.position.set(position[0], position[1] / 2, position[2])
        }
    }, [position, pip.current, leg.current])


    React.useEffect(() => {
        if (pip.current && leg.current) {
            if (hovered) {
                pip.current.material = materials.hovered
                leg.current.material = materials.hovered
            } else {
                pip.current.material = selected ? materials.active : materials.inactive
                leg.current.material = selected ? materials.active : materials.inactive
            }
        }
    }, [selected, hovered, pip.current])

    useFrame((state) => {
        if (pip.current && leg.current) {
            const width = getViewport(state).width
            pip.current.scale.set(width, width, width)
            leg.current.scale.set(width, leg.current.position.y, width)
        }
    })



    return (
        <>
            <mesh
                ref={pip}
                scale={viewport.width}
                onClick={() => onSelect()}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}>
                <sphereGeometry args={[
                    0.01, // Radius as percentage of screen width
                    8, // Width segments
                    8, // Height segments
                ]} />
            </mesh>
            <mesh ref={leg}>
                <cylinderGeometry args={[
                    0.002, // linewidth as percentage of screen width
                    0.002, // linewidth as percentage of screen width
                    2, // height
                    8 // radial segments
                ]} />
            </mesh>
        </>
    )
}