import * as THREE from 'three'

export interface Materials {
    hovered: THREE.MeshBasicMaterial,
    active: THREE.MeshBasicMaterial,
    inactive: THREE.MeshBasicMaterial,
}


export const createMaterials = () => {
    const hovered = new THREE.MeshBasicMaterial({ color: 'white' })
    const active = new THREE.MeshBasicMaterial({ color: 'hotpink' })
    const inactive = new THREE.MeshBasicMaterial({ color: 'red' })
    return { hovered, active, inactive }
}