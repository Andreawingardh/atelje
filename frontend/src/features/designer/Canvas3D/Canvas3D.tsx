import styles from "./Canvas3D.module.css";
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'


export default function Canvas3D() {
  return (
    <section className={styles.designerWindow}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <directionalLight
          position={[0, 10, 0]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Sphere args={[1, 32, 32]} position={[1.5, 0, 0]} castShadow>
          <meshStandardMaterial color="#E3DCD3" metalness={0.7} roughness={0.2} />
        </Sphere>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </section>
  )
}