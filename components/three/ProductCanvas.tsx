'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { Suspense } from 'react'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.5} />
}

export default function ProductCanvas({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <Suspense fallback={null}>
          <Model url={modelUrl} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}