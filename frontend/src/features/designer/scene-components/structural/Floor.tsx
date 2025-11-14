import React from 'react';
import { getFloorMaterial } from '@/lib/preloadTextures';

type FloorProps = {
  flooring: string;
  gridSize: number;
  gridCellSize: number;
};

export const Floor: React.FC<FloorProps> = ({ flooring, gridSize, gridCellSize }) => {
  const floorSize = gridSize * gridCellSize; // convert cm to Three.js units
  const material = getFloorMaterial(flooring);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      material={material}
    >
      <planeGeometry args={[floorSize, floorSize]} />
    </mesh>
  );
};