import { RootState } from "@react-three/fiber"
import * as THREE from "three"


export const isOrthographicCamera = (camera: THREE.Camera): camera is THREE.OrthographicCamera => {
    return camera.type === 'OrthographicCamera'
}


export const getViewport = (state: RootState) => {
    const { width, height } = state.size
    const distance = state.camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
    if (isOrthographicCamera(state.camera)) {
        return { width: width / state.camera.zoom, height: height / state.camera.zoom, factor: 1, distance }
    } else {
        const fov = (state.camera.fov * Math.PI) / 180 // convert vertical fov to radians
        const h = 2 * Math.tan(fov / 2) * distance // visible height
        const w = h * (width / height)
        return { width: w, height: h, factor: width / w, distance }
    }
}