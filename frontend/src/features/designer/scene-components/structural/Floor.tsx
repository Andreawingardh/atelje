import React from 'react';
import * as THREE from 'three';
import { useTexture } from "@react-three/drei";

type FloorProps = {
  flooring: string;
    gridSize: number;
    gridCellSize: number;
}


export const Floor: React.FC<FloorProps> = ({flooring, gridSize, gridCellSize}) => {
    const floorSize = gridSize * gridCellSize; // convert cm to Three.js units

      const textures = useTexture({
        map: `/3D-textures/${flooring}/albedo.jpg`,
        normalMap: `/3D-textures/${flooring}/normal.jpg`,
        roughnessMap: `/3D-textures/${flooring}/roughness.jpg`,
      })
    
      // Repeat pattern across the floor
      Object.values(textures).forEach(tex => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
        tex.repeat.set(1, 1)
      })

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[floorSize, floorSize]} />
      <meshStandardMaterial 
        {...textures}
      />
    </mesh>
  );
};