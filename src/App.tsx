import { Suspense, useRef, useState } from 'react'
import './App.css'

//threejs imports
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  MeshDistortMaterial,
  OrbitControls,
  useGLTF
} from '@react-three/drei'

function App () {
  const [count, setCount] = useState<number>(
    Number(localStorage.getItem('count')) || 0
  )

  return (
    <>
      <div className='card'>
        <button
          onClick={() =>
            setCount(count => {
              localStorage.setItem('count', JSON.stringify(count + 1))
              return count + 1
            })
          }
        >
          count is {count}
        </button>

        {/* 3d  */}
        <div className='canvas-container'>
          <Canvas
            camera={{ position: [0, 0, 5] }}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
          >
            <color attach='background' args={['#000528']} />
            <fog attach='fog' args={['#f0f0f0', 0, 40]} />
            <ambientLight intensity={0.1} />

            <Scene />
            <Environment preset='lobby' />
            <OrbitControls
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>
      </div>
    </>
  )
}

function Scene () {
    const gltf = useGLTF('scene.gltf')
  return (
    <>
      {/* <FloatingSphere position={[-1.5, 0, 0]} /> */}
      {/* <FloatingPlatform /> */}
      <group position={[1.5, 0, 0]}>
        <primitive object={gltf.scene} />
        <FloatingSphere color='#ff0000' position={[0, 0, 0]} />
        <FloatingSphere color='#00ff00' position={[0, 2, 0]} />
        <FloatingSphere color='#0000ff' position={[0, -2, 0]} />
      </group>
    </>
  )
}

function FloatingSphere ({
  position = [0, 0, 0],
  scale = 1,
  speed = 1,
  distort = 0.5,
  color = '#000528'
}) {
  const meshRef = useRef()

  useFrame(state => {
    const t = state.clock.getElapsedTime() * speed
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.2
    meshRef.current.rotation.x = Math.sin(t / 4) * 0.2
    meshRef.current.rotation.y = Math.sin(t / 2) * 0.2
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={distort}
        roughness={0}
        metalness={0.8}
      />
    </mesh>
  )
}

function FloatingPlatform () {
  const meshRef = useRef()

  useFrame(state => {
    const t = state.clock.getElapsedTime()
    meshRef.current.position.y = Math.sin(t / 2) * 0.05
    meshRef.current.rotation.z = Math.sin(t / 4) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotattion={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[2, 32]} />
      <meshStandardMaterial color='#444444' metalness={0.8} roughness={0.1} />
    </mesh>
  )
}

export default App
