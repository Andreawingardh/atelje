import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';

type WallProps = {
  wallColor: string;
  wallWidth: number;
  ceilingHeight: number;
  wallPlacement: 'front' | 'left' | 'right';
  floorSize: number;
  gridCellSize: number;
};

export const Wall = forwardRef<THREE.Mesh, WallProps>(
  ({ wallColor, wallWidth, ceilingHeight, wallPlacement, gridCellSize, floorSize }, ref) => {
    const localRef = useRef<THREE.Mesh>(null!);

    // Expose the mesh to parent components to access its world matrix
    React.useImperativeHandle(ref, () => localRef.current);

    const width = wallWidth * gridCellSize;
    const height = ceilingHeight * gridCellSize;
    const floorDimension = floorSize * gridCellSize;

    const halfFloor = floorDimension / 2;
    const halfHeight = height / 2;
    const halfWidth = width / 2;

    const rotation: [number, number, number] = (() => {
      switch (wallPlacement) {
        case 'left':
          return [0, Math.PI / 2, 0];
        case 'right':
          return [0, -Math.PI / 2, 0];
        default:
          return [0, 0, 0];
      }
    })();

    const position: [number, number, number] = (() => {
      switch (wallPlacement) {
        case 'left':
          return [-halfFloor, halfHeight, 0];
        case 'right':
          return [halfFloor, halfHeight, 0];
        default:
          return [0, halfHeight, -halfFloor];
      }
    })();

    // Convert world position to wall-relative position
    const worldToWallPosition = (worldPos: THREE.Vector3): { x: number; y: number } | null => {
      if (!localRef.current) return null;

      const wallMatrix = localRef.current.matrixWorld;
      const wallMatrixInverse = wallMatrix.clone().invert();

      const localPos = worldPos.clone().applyMatrix4(wallMatrixInverse);
      const xCm = (localPos.x + halfWidth) / gridCellSize;
      const yCm = (localPos.y + height / 2) / gridCellSize;

      return { x: xCm, y: yCm };
    };

    // Convert wall-relative (cm) to world position
    const wallToWorldPosition = (xCm: number, yCm: number): THREE.Vector3 | null => {
      if (!localRef.current) return null;

      const localX = xCm * gridCellSize - halfWidth;
      const localY = yCm * gridCellSize - height / 2;
      const localPos = new Vector3(localX, localY, 0.001);

      const worldPos = localPos.clone().applyMatrix4(localRef.current.matrixWorld);
      return worldPos;
    };

    return (
      <mesh ref={localRef} position={position} rotation={rotation} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0} />
      </mesh>
    );
  }
);
Wall.displayName = 'Wall';