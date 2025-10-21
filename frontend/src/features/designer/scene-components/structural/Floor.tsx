import React from 'react';

type FloorProps = {
    floorColor: string;
    gridSize: number;
    gridCellSize: number;
}


export const Floor: React.FC<FloorProps> = ({floorColor, gridSize, gridCellSize}) => {
    const floorSize = gridSize * gridCellSize; // convert cm to Three.js units

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[floorSize, floorSize]} />
      <meshStandardMaterial 
        color={floorColor}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};