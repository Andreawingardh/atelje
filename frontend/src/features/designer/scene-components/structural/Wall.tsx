import React, { useState } from 'react';

type WallProps = {
    wallColor: string;
    wallWidth: number;
    roofHeight: number;
    wallPlacement: 'front' | 'left' | 'right';
    gridCellSize: number;
}

export const Wall: React.FC<WallProps> =({wallColor, wallWidth, roofHeight, wallPlacement, gridCellSize}) => {
    const width = wallWidth * gridCellSize; // convert cm to Three.js units
    const height = roofHeight * gridCellSize; // convert cm to Three.js units

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
            return [-2.5, 1.5, 0];
        case 'right':
            return [2.5, 1.5, 0];
        default: // 'front'
            return [0, 1.5, -2.5];
        }
    })();

    return (
      <mesh
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