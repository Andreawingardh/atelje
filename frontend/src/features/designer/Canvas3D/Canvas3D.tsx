import styles from "./Canvas3D.module.css";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';


// Floor component with invisible 1cm grid structure
const Floor = () => {
  
  // Grid data structure for future object placement
  // Each unit represents 1cm, floor is 5m x 5m = 500cm x 500cm
  const gridSize = 500; // 500 cm
  const cellSize = 0.01; // 1 cm in Three.js units
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[5, 5]} />
      <meshStandardMaterial 
        color="#2d2a28"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

// Wall component with invisible 1cm grid structure
const BackWall = () => {
  // Grid structure for wall - 5m wide x 3m tall
  const gridWidth = 500; // 500 cm
  const gridHeight = 300; // 300 cm
  const cellSize = 0.01; // 1 cm
  
  return (
    <mesh
      position={[0, 1.5, -2.5]} 
      receiveShadow
    >
      <planeGeometry args={[5, 3]} />
      <meshStandardMaterial 
        color="#F9F6F3"
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
};

// Left wall component
const LeftWall = () => {

  return (
    <mesh 
      position={[-2.5, 1.5, 0]}
      rotation={[0, Math.PI / 2, 0]}
      receiveShadow
    >
      <planeGeometry args={[5, 3]} />
      <meshStandardMaterial 
        color="#F9F6F3"
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
};

// Right wall component
const RightWall = () => {
  
  return (
    <mesh 
      position={[2.5, 1.5, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      receiveShadow
    >
      <planeGeometry args={[5, 3]} />
      <meshStandardMaterial 
        color="#F9F6F3"
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
};

export default function Canvas3D() {
  return (
    <section className={styles.designerWindow}>
      <Canvas
        camera={{ 
          position: [0, 0, 3], 
          fov: 30,
          near: 1,
          far: 100
        }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[1, 1, 10]} intensity={60} castShadow />
        <directionalLight
          position={[0, 10, 0]}
          intensity={6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <BackWall />
        <LeftWall />
        <RightWall />
        <Floor />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2 - 0.1} // Prevent camera from going below floor
          minAzimuthAngle={-Math.PI / 6}      // limit left rotation (~-30°)
          maxAzimuthAngle={Math.PI / 6}       // limit right rotation (~+30°)
          target={[0, 1.5, 0]}
        />
      </Canvas>
    </section>
  )
}