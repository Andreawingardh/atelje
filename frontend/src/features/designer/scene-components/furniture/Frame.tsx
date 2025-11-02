import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';

type FrameProps = {
    frameColor: string;
    frameSize: string;
    imageUrl?: string;
    frameOrientation: 'portrait' | 'landscape';
    floorSize: number;
    gridCellSize: number;
    wallMesh?: THREE.Mesh | null;
    selected?: boolean;
    onSelect?: () => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

export const Frame: React.FC<FrameProps> = ({
    frameColor, 
    frameSize, 
    imageUrl,
    frameOrientation, 
    floorSize, 
    gridCellSize,
    wallMesh,
    selected = false,
    onSelect,
    onDragStart,
    onDragEnd
}) => {
    const frameThickness = 4 * gridCellSize; // 3 cm thickness
    const groupRef = useRef<THREE.Group>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 150 }); // Position in cm
    const dragOffset = useRef(new THREE.Vector3());
    
    const { camera, gl, raycaster } = useThree();

    //calculating Z-position based on floor size
    const floorDimension = floorSize * gridCellSize;
    const halfFloor = floorDimension / 2;
    const frameZPlacement = -(halfFloor - (frameThickness * gridCellSize));

    const frameWidth = 70 * gridCellSize;
    const frameHeight = 100 * gridCellSize;
    const frameDepth = 5 * gridCellSize;
    const image = "241113-doge.jpg";

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

    // Helper function to snap to our 1x1cm grid
    const snapToGrid = (value: number, gridSize: number): number => {
        return Math.round(value / gridSize) * gridSize;
    };

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();

         // Toggle selection first
         if (!selected) {
            onSelect?.();
            return;
        }

        if (!groupRef.current || !wallMesh) return;
    
        // Get the frame's current world position
        const framePosition = new THREE.Vector3();
        groupRef.current.getWorldPosition(framePosition);
    
        // Cast a ray to the wall at the current mouse position
        const pointer = new THREE.Vector2(
            (e.clientX / gl.domElement.clientWidth) * 2 - 1,
            -(e.clientY / gl.domElement.clientHeight) * 2 + 1
        );

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(wallMesh);
        
        if (intersects.length > 0) {
            const hit = intersects[0]!;
            // Store the offset between where we clicked on the wall and the frame's position
            dragOffset.current.copy(framePosition).sub(hit.point);
        }
    
        setIsDragging(true);
        onDragStart?.();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!isDragging || !groupRef.current || !wallMesh || !selected) return;
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
    
        // Calculate new position: where the mouse hits the wall + the original offset
        const newPosition = hit.point.clone().add(dragOffset.current);
    
        // Snap to grid (1cm increments)
        newPosition.x = snapToGrid(newPosition.x, gridCellSize);
        newPosition.y = snapToGrid(newPosition.y, gridCellSize);
    
        // Apply the new position
        if (groupRef.current.parent) {
            const localPosition = groupRef.current.parent.worldToLocal(newPosition.clone());
            groupRef.current.position.copy(localPosition);
        } else {
            groupRef.current.position.copy(newPosition);
        }

        // Update position display (convert to cm)
        setPosition({
        x: Math.round(newPosition.x / gridCellSize),
        y: Math.round(newPosition.y / gridCellSize)
        });
    };
    

    const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
        if (isDragging) {
            setIsDragging(false);
            onDragEnd?.();
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
    };


    return (
        <group
            position={[0, 0, frameZPlacement]}
            ref={groupRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* Frame border */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[
                    frameWidth + frameThickness * 2,
                    frameHeight + frameThickness * 2,
                    frameDepth
                ]} />
                <meshStandardMaterial color={frameColor} />
            </mesh>
            
            {/* Inner frame (cutout) */}
            <mesh position={[0, 0, frameDepth * 0.1]}>
                <boxGeometry args={[frameWidth, frameHeight, frameDepth * 0.8]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            
            {/* Glass effect */}
            <mesh position={[0, 0, frameDepth * 0.48]}>
                <planeGeometry args={[frameWidth, frameHeight]} />
                <meshPhysicalMaterial 
                    color="#ffffff"
                    transmission={0.9}
                    thickness={0.01}
                    roughness={0.1}
                    metalness={0.1}
                />
            </mesh>



            {/* Position display when dragging */}
            {isDragging && (
                <Html
                    position={[0, size[1] / 2 + 0.15, 0]}
                    center
                    style={{
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        userSelect: 'none'
                    }}
                >
                    X: {position.x} cm <br></br> Y: {position.y} cm
                </Html>
            )}
        </group>
    );
};