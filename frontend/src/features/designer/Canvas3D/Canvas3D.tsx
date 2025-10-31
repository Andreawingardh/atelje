import styles from "./Canvas3D.module.css";
import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Floor } from "../scene-components/structural/Floor";
import { Wall } from "../scene-components/structural/Wall";
import { Ceiling } from "../scene-components/structural/Ceiling";
import { Sofa } from "../scene-components/furniture/Sofa";
import { FurnitureColor } from "../FurnitureForm/FurnitureForm";
import { Frame } from "../scene-components/furniture/Frame";
import { FrameData } from "../FrameForm/FrameForm";

interface Canvas3DProps {
  wallWidth: number;
  ceilingHeight: number;
  wallColor: string;
  furnitureColor: FurnitureColor;
  furnitureWidth: number;
  furnitureDepth: number;
  furnitureHeight: number;
  frames: FrameData[];
}

export default function Canvas3D({ wallWidth, ceilingHeight, wallColor, furnitureColor, furnitureWidth, furnitureDepth, furnitureHeight, frames } : Canvas3DProps) {
const cellSize = 0.01; // 1 cm
const floorSize = Math.max(wallWidth, 500);
const minDistanceZoom = Math.max(2, floorSize / 200);
const maxDistanceZoom = Math.max(5, floorSize / 80);

const YPosition = ceilingHeight * cellSize;
const pointLightHeight = YPosition * 1.0;
const directionalLightHeight = YPosition * 3.33;
const cameraDistance = Math.max(5, floorSize * cellSize * 3, YPosition * 1.67);

const wallRef = useRef<THREE.Mesh>(null);

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
        <Wall wallColor={wallColor} wallWidth={wallWidth} ceilingHeight={ceilingHeight} wallPlacement='front' ref={wallRef} gridCellSize={cellSize} floorSize={floorSize}/>
        <Wall wallColor={wallColor} wallWidth={wallWidth} ceilingHeight={ceilingHeight} wallPlacement='left' gridCellSize={cellSize} floorSize={floorSize}/>
        <Wall wallColor={wallColor} wallWidth={wallWidth} ceilingHeight={ceilingHeight} wallPlacement='right' gridCellSize={cellSize} floorSize={floorSize}/>
        <Floor floorColor="#55412C" gridSize={floorSize} gridCellSize={cellSize} />
        <Ceiling ceilingHeight={ceilingHeight} gridSize={floorSize} gridCellSize={cellSize} />
        <Sofa sofaColor={furnitureColor.sofa} sofaWidth={furnitureWidth} sofaDepth={furnitureDepth} sofaHeight={furnitureHeight} floorSize={floorSize} gridCellSize={cellSize} />
        {/* <Frame frameColor="#ac924f" frameSize="70x100" frameOrientation={'landscape'} floorSize={floorSize} wallMesh={wallRef.current} gridCellSize={cellSize} /> */}

        {/* Render all frames */}
        {frames.map((frame) => (
          <group key={frame.id} position={frame.position}>
            <Frame 
              frameColor={frame.frameColor}
              frameSize={frame.frameSize}
              frameOrientation={frame.frameOrientation}
              floorSize={floorSize}
              gridCellSize={cellSize}
              wallMesh={wallRef.current}
            />
          </group>
        ))}

        <OrbitControls 
          enablePan={false}
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