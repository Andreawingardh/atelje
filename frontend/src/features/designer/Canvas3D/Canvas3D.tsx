import styles from "./Canvas3D.module.css";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Floor } from "../scene-components/structural/Floor";
import { Wall } from "../scene-components/structural/Wall";

const cellSize = 0.01; // 1 cm

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

        <Wall wallColor="#3939390" wallWidth={500} roofHeight={300} wallPlacement='left' gridCellSize={cellSize}/>
        <Wall wallColor="#3939390" wallWidth={500} roofHeight={300} wallPlacement='front' gridCellSize={cellSize}/>
        <Wall wallColor="#3939390" wallWidth={500} roofHeight={300} wallPlacement='right' gridCellSize={cellSize}/>
        <Floor floorColor="#000000" gridSize={500} gridCellSize={cellSize} />
        
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