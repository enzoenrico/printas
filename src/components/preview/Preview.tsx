import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text3D, useGLTF } from '@react-three/drei'
import { useRef, Suspense, useState, Ref } from 'react'
import { Group, Box3, Vector3 } from 'three'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { Mesh } from 'three'

type models = 'trophy' | 'base'

export interface Tpreview {
  displayText: string
  model: models
  people: string[]
  cam_position?: number[]
  grid?: boolean
  spinY?: boolean
  spinZ?: boolean
  color?: string
  groupRef?: Ref
}

const LoadingFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <circleGeometry args={[1, 1, 1]} />
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

const Model = ({
  textToDisplay,
  people,
  model,
  spinY,
  spinZ,
  groupRef
}: Tpreview) => {
  //trophy model ref
  const meshRef = useRef<Group>(null)

  //all of the models present in the right preview
  //   const groupRef = useRef<Group>(null)
  const textRef = useRef<Mesh>(null)
  const peopleRef = useRef<Mesh>(null)

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
    if (spinZ && meshRef.current) {
      meshRef.current.rotateZ(0.005)
      // meshRef.current.rotateX(0.005)
      // meshRef.current.rotateY(0.005)
    }
    if (spinY && meshRef.current) {
      //   meshRef.current.rotateZ(0.005)
      // meshRef.current.rotateX(0.005)
      meshRef.current.rotateY(0.005)
    }
  })

  return (
    <group ref={groupRef}>
      <primitive ref={meshRef} object={scene} scale={10} position={[0, 0, 0]} />
      {textToDisplay && (
        <Text3D
          ref={textRef}
          font={helvetiker}
          position={[-0.38, modelDimensions.size.y / 8, 0.3]}
          size={
            modelDimensions.size.x *
            (0.1 / Math.ceil(textToDisplay.length / 12)) *
            (textToDisplay.length > 40 ? 0.7 : 1)
          }
          height={0.25}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.005}
          bevelOffset={0}
          bevelSegments={5}
        >
          {textToDisplay.length > 18
            ? textToDisplay.split(' ') + '\n' + textToDisplay.split(' ')[1]
            : textToDisplay}
          <meshPhongMaterial
            color='white'
            emissive='#ffffff'
            emissiveIntensity={0.2}
            shininess={100}
          />
        </Text3D>
      )}

      {people && people.length > 0 && (
        <Text3D
          ref={peopleRef}
          font={helvetiker}
          position={[0.2, modelDimensions.size.y / 8 + 0.05, -0.5]}
          scale={[-1, 1, 1]}
          size={
            modelDimensions.size.x *
            (0.09 / Math.ceil(people[0].length / 20)) *
            (people[0].length > 40 ? 0.09 : 1)
          }
          height={0.5}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.005}
          bevelOffset={0}
          bevelSegments={5}
        >
          {people[0].length > 16
            ? people[0].split(' ')[0] + '\n' + people[0].split(' ')[1]
            : people[0]}
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
  people,
  spinZ,
  spinY,
  grid,
  groupRef,
  cam_position = [0, -10, 0],
  color = '#27272a'
}: Tpreview) => {
  return (
    // Starter camera position
    <Canvas
      shadows
      camera={{ position: [...cam_position], fov: 30 }}
      className='rounded-xl'
    >
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
          people={people}
          groupRef={groupRef}
          spinY={spinY}
          spinZ={spinZ}
          grid={grid}
        />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

export default Preview
