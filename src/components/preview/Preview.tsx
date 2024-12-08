import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  OrbitControlsChangeEvent,
  Text3D,
  useGLTF
} from '@react-three/drei'
import { useRef, Suspense, useState, useEffect } from 'react'
import { Group, Box3, Vector3, MeshNormalMaterial, Camera } from 'three'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { CSG } from 'three-csg-ts'
import { Mesh } from 'three'
import { debounce } from 'lodash'
import { exportModel } from '../../lib/utils'

type models = 'trophy' | 'base'

export interface Tpreview {
  displayText: string
  model: models
  grid?: boolean
  spin?: boolean
  color?: string
}

const LoadingFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color='hotpink' />
    </mesh>
  )
}

const chooseModel = (model: models) => {
  switch (model) {
    case 'trophy':
      return '/src/assets/trophy.glb'
    case 'base':
      return '/src/assets/base.glb'
  }
}

const Model = ({ textToDisplay, model, spin }: Tpreview) => {
  const meshRef = useRef<Group>(null)
  const textRef = useRef<Mesh>(null)
  const [modelDimensions, setModelDimensions] = useState({
    center: new Vector3(),
    size: new Vector3()
  })

  const chosenModel = chooseModel(model)
  const { scene } = useGLTF(chosenModel)

  useFrame(() => {
    if (meshRef.current) {
      const box = new Box3().setFromObject(meshRef.current)
      const center = new Vector3()
      const size = new Vector3()
      box.getCenter(center)
      box.getSize(size)
      setModelDimensions({ center, size })
      // console.log(modelDimensions)
    }
  }, [scene])

  useFrame(() => {
    if (spin && meshRef.current) {
      meshRef.current.rotateZ(0.005)
      //   meshRef.current.rotateX(0.005)
      //   meshRef.current.rotateY(0.005)
    }
  })

  const handleExporting = async () => {
    if (!meshRef) return
    const blob = await exportModel(meshRef)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'model.glb'
    link.click()
    URL.revokeObjectURL(url)
  }

  const debouncedSubtract = debounce(() => {
    if (!meshRef.current || !textRef.current) return

    const part_mesh = meshRef.current
    let part_actual_mesh: Mesh | null
    part_mesh.traverse(o => {
      if (o instanceof Mesh) {
        part_actual_mesh = o
      }
    })
    console.log(part_actual_mesh)
    const text_mesh = textRef.current
    const text_geom = text_mesh?.geometry
    if (!text_geom) return

    const tme = new Mesh(text_geom, new MeshNormalMaterial())
    // const bonga = new Mesh(part_actual_mesh, new MeshNormalMaterial())

    tme.updateMatrix()
    // bonga.updateMatrix()
    part_actual_mesh?.updateMatrix()

    const startTime = performance.now()
    console.log('Starting the union operation...')
    const newMesh = CSG.union(part_actual_mesh, tme)
    const endTime = performance.now()
    console.log(`Union operation completed in ${endTime - startTime}ms`)
    // meshRef.current?.remove(acc_mesh)
    console.log('adding mesh')
    meshRef.current?.add(newMesh)
  }, 300)

  return (
    <group>
      <primitive
        ref={meshRef}
        object={scene}
        scale={10}
        position={[0, 0, 0]}
        onClick={e => {
          e.stopPropagation()
          debouncedSubtract()
        }}
      />
      {textToDisplay && (
        <Text3D
          ref={textRef}
          font={helvetiker}
          position={[-0.2, 0.15, 0.4]}
          size={modelDimensions.size.x * 0.1}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.005}
          bevelOffset={0}
          bevelSegments={5}
        >
          {textToDisplay}
          <meshPhongMaterial
            color='white'
            emissive='#ffffff'
            emissiveIntensity={0.2}
            shininess={100}
          />
        </Text3D>
      )}
    </group>
  )
}

const Preview = ({
  displayText,
  model,
  spin,
  grid,
  color = '#27272a'
}: Tpreview) => {
  return (
    // Starter camera position
    <Canvas shadows camera={{ position: [0, -10, 0], fov: 30 }} className='rounded-xl'>
      {/* Soft ambient light */}
      <ambientLight intensity={0.3} />
      /* Key light */
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color='#0014dc'
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-5, -5, -5]}
        intensity={1}
        color='#ff8200'
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill light */}
      <directionalLight position={[-5, 5, -5]} intensity={0.2} />

      {/* Rim light */}
      <directionalLight position={[0, -5, 0]} intensity={0.2} />

      {/* Grid and background */}
      {grid ? <gridHelper args={[10, 10, '#444444', '#222222']} /> : null}
      <color attach='background' args={[color]} />
      <Suspense fallback={<LoadingFallback />}>
        <Model
          textToDisplay={displayText}
          model={model}
          spin={spin}
          grid={grid}
        />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

export default Preview
