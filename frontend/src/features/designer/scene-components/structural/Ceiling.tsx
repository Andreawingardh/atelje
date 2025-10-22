import React from 'react';

type CeilingProps = {
    ceilingHeight: number;
    gridSize: number;
    gridCellSize: number;
}


export const Ceiling: React.FC<CeilingProps> = ({ceilingHeight, gridSize, gridCellSize}) => {
    const floorSize = gridSize * gridCellSize; // convert cm to Three.js units
    const ceilingYPosition = ceilingHeight * gridCellSize; // convert cm to Three.js units

  return (
    <mesh 
      rotation={[Math.PI / 2, 0, 0]} 
      position={[0, ceilingYPosition, 0]}
      receiveShadow
    >
      <planeGeometry args={[floorSize, floorSize]} />
      <meshStandardMaterial 
        color={"#EEE9E3"}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};