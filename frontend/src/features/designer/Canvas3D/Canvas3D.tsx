import styles from "./Canvas3D.module.css";
import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'


export default function Canvas3D() {
  return (
    <section>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
      >
      </Canvas>
    </section>
  )
}