import React, { useState } from 'react';
import * as THREE from 'three';

type WallProps = {
    wallColor: string;
    wallWidth: number;
    ceilingHeight: number;
    wallPlacement: 'front' | 'left' | 'right';
    floorSize: number;
    gridCellSize: number;
}

export const Wall: React.FC<WallProps> =({wallColor, wallWidth, ceilingHeight, wallPlacement, gridCellSize, floorSize}) => {
    const meshRef = React.useRef<THREE.Mesh>(null);
    
    const width = wallWidth * gridCellSize; // convert cm to Three.js units
    const height = ceilingHeight * gridCellSize; // convert cm to Three.js units
    const floorDimension = floorSize * gridCellSize; // floor size in Three.js units
    
    // Calculate positions dynamically based on floor size
    const halfFloor = floorDimension / 2;
    const halfHeight = height / 2;

    const rotation: [number, number, number] = (() => {
        switch (wallPlacement) {
        case 'left':
            return [0, Math.PI / 2, 0];
        case 'right':
            return [0, -Math.PI / 2, 0];
        default: // 'front'
            return [0, 0, 0];
        }
    })();

    const position: [number, number, number] = (() => {
        switch (wallPlacement) {
        case 'left':
            return [-halfFloor, halfHeight, 0];
        case 'right':
            return [halfFloor, halfHeight, 0];
        default: // 'front'
            return [0, halfHeight, -halfFloor];
        }
    })();


    return (
      <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      receiveShadow
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color={wallColor}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    );
  };