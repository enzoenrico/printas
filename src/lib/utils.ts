import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GLTFExporter } from 'three/examples/jsm/Addons.js'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function exportModel(modelRef: Group) {
    const options = {
        binary: true,
        trs: true,
        onlyVisible: true,
        format: 'glb',
        version: 2,
        embedImages: true
    }

    const exporter = new GLTFExporter()
    const exportedObj = modelRef.clone()
    exportedObj.applyMatrix4(modelRef.matrixWorld)
    exportedObj.position.set(0, 0, 0)
    exportedObj.updateMatrix()

    return new Promise((resolve, reject) => {
        exporter.parse(
            exportedObj,
            (gltf) => {
                const blob = new Blob([gltf], { type: 'model/gltf-binary' })
                resolve(blob)
            },
            reject,
            options
        )
    })

}
