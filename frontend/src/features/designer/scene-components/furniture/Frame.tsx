import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { useThree, ThreeEvent } from '@react-three/fiber';

type FrameProps = {
    frameColor: string;
    frameSize: string;
    frameOrientation: 'portrait' | 'landscape';
    floorSize: number;
    gridCellSize: number;
    wallMesh?: THREE.Mesh | null;
}

export const Frame: React.FC<FrameProps> = ({
    frameColor, 
    frameSize, 
    frameOrientation, 
    floorSize, 
    gridCellSize,
    wallMesh
}) => {
    const frameThickness = 3 * gridCellSize; // 3 cm thickness
    const groupRef = useRef<THREE.Group>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef(new THREE.Vector3());
    
    const { camera, gl, raycaster } = useThree();

    //calculating Y-position based on floor size
    const floorDimension = floorSize * gridCellSize;
    const halfFloor = floorDimension / 2;
    const frameYPlacement = -(halfFloor - (frameThickness * gridCellSize));

    const size: [number, number, number] = (() => {
        switch (frameSize) {
        case '70x100':
            return [1, 0.7, frameThickness];
        case '70x50':
            return [0.5, 0.7, frameThickness];
        case '50x50':
            return [0.5, 0.5, frameThickness];
        case '50x40':
            return [0.4, 0.5, frameThickness];
        case '40x30':
            return [0.3, 0.4, frameThickness];
        case '30x30':
            return [0.3, 0.3, frameThickness];
        case '20x20':
            return [0.2, 0.2, frameThickness];
        case '18x13':
            return [0.2, 0.3, frameThickness];
        default:
            return [0.5, 0.7, frameThickness];
        }
    })();

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (!groupRef.current || !wallMesh) return;
    
        // Where we clicked on the frame (in world space)
        const clickPoint = e.point.clone();
    
        // The frame’s world position
        const framePosition = new THREE.Vector3();
        groupRef.current.getWorldPosition(framePosition);
    
        // Calculate offset vector from frame center to click point
        dragOffset.current.copy(clickPoint).sub(framePosition);
    
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };
    
    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!isDragging || !groupRef.current || !wallMesh) return;
        e.stopPropagation();
    
        const pointer = new THREE.Vector2(
            (e.clientX / gl.domElement.clientWidth) * 2 - 1,
            -(e.clientY / gl.domElement.clientHeight) * 2 + 1
        );
    
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(wallMesh);
        if (intersects.length === 0) return;
    
        const hit = intersects[0]!;
        const wallNormal = hit.face?.normal.clone() ?? new THREE.Vector3(0, 0, 1);
    
        // Clone intersection point on the wall
        const newPosition = hit.point.clone();
    
        // Project the drag offset onto the wall plane
        // This ensures your mouse stays visually "on" the frame
        const projectedOffset = dragOffset.current.clone().projectOnPlane(wallNormal);
        newPosition.sub(projectedOffset);
    
        // Add offset so the frame sits ON the wall and not inside it
        newPosition.add(wallNormal.multiplyScalar(frameThickness / 2));
    
        // Apply the new position
        groupRef.current.position.copy(newPosition);
    };
    

    const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
        if (isDragging) {
            setIsDragging(false);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
    };

    return (
        <group
            position={[0, 1.5, frameYPlacement]}
            ref={groupRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <mesh 
                castShadow
            >
                <boxGeometry args={size} />
                <meshStandardMaterial 
                    color={frameColor} 
                    roughness={0.6} 
                    metalness={0.2}
                    emissive={isDragging ? frameColor : '#000000'}
                    emissiveIntensity={isDragging ? 0.2 : 0}
                />
            </mesh>
        </group>
    );
};