import styles from "./Canvas3D.module.css";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Floor } from "../scene-components/structural/Floor";
import { Wall } from "../scene-components/structural/Wall";
import { Ceiling } from "../scene-components/structural/Ceiling";

const cellSize = 0.01; // 1 cm
const floorSize = 500;
const ceilingHeight = 300;
const minDistanceZoom = Math.max(2, floorSize / 200);
const maxDistanceZoom = Math.max(5, floorSize / 80);

const YPosition = ceilingHeight * cellSize;
const pointLightHeight = YPosition * 1.0;    // same as current 3
const directionalLightHeight = YPosition * 3.33; // same as current 10
const cameraDistance = YPosition * 1.67;     // same as current 5


export default function Canvas3D() {
  return (
    <section className={styles.designerWindow}>
      <Canvas
        camera={{ 
          position: [0, 0, cameraDistance],
          fov: 30,
          near: 1,
          far: 100
        }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, pointLightHeight, -YPosition * 0.33]} intensity={3} castShadow />
        <directionalLight
          position={[0, directionalLightHeight, 0]}
          intensity={2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Wall wallColor="#3939390" wallWidth={500} ceilingHeight={ceilingHeight} wallPlacement='front' gridCellSize={cellSize} floorSize={floorSize}/>
        <Wall wallColor="#3939390" wallWidth={500} ceilingHeight={ceilingHeight} wallPlacement='left' gridCellSize={cellSize} floorSize={floorSize}/>
        <Wall wallColor="#3939390" wallWidth={500} ceilingHeight={ceilingHeight} wallPlacement='right' gridCellSize={cellSize} floorSize={floorSize}/>
        <Floor floorColor="#55412C" gridSize={floorSize} gridCellSize={cellSize} />
        <Ceiling ceilingHeight={ceilingHeight} gridSize={floorSize} gridCellSize={cellSize} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={minDistanceZoom}
          maxDistance={maxDistanceZoom}
          maxPolarAngle={Math.PI / 2 - 0.1} // Prevent camera from going below floor
          minAzimuthAngle={-Math.PI / 6}      // limit left rotation (~-30°)
          maxAzimuthAngle={Math.PI / 6}       // limit right rotation (~+30°)
          target={[0, 1.5, 0]}
          rotateSpeed={0.2}
          zoomSpeed={0.2}
        />
      </Canvas>
    </section>
  )
}