import React from 'react';
import * as THREE from 'three';
import { useTexture } from "@react-three/drei";

type FloorProps = {
    floorColor: string;
    gridSize: number;
    gridCellSize: number;
}


export const Floor: React.FC<FloorProps> = ({floorColor, gridSize, gridCellSize}) => {
    const floorSize = gridSize * gridCellSize; // convert cm to Three.js units

      const textures = useTexture({
        map: "/3D-textures/birch-floor-herringbone/albedo.jpg",
        normalMap: "/3D-textures/birch-floor-herringbone/normal.jpg",
        roughnessMap: "/3D-textures/birch-floor-herringbone/roughness.jpg",
      })
    
      // Repeat pattern across the floor
      Object.values(textures).forEach(tex => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
        tex.repeat.set(2, 2)
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