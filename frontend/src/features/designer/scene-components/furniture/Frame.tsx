import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';

type FrameProps = {
    frameColor: string;
    imageUrl: string;
    frameSize: string;
    frameOrientation: 'portrait' | 'landscape';
    floorSize: number;
    gridCellSize: number;
    wallMesh?: THREE.Mesh | null;
    wallWidth: number;
    ceilingHeight: number;
    selected?: boolean;
    onSelect?: () => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onPositionChange?: (position: THREE.Vector3) => void;
}

export const Frame: React.FC<FrameProps> = ({
    frameColor,
    imageUrl, 
    frameSize, 
    frameOrientation, 
    floorSize, 
    gridCellSize,
    wallMesh,
    wallWidth,
    ceilingHeight,
    selected = false,
    onSelect,
    onDragStart,
    onDragEnd,
    onPositionChange
}) => {
    const frameThickness = 4 * gridCellSize; // 3 cm thickness
    const groupRef = useRef<THREE.Group>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 150 }); // Position in cm
    const dragOffset = useRef(new THREE.Vector3());
    const [ImageTexture, setImageTexture] = useState<THREE.Texture | null>(null);
    
    const { camera, gl, raycaster } = useThree();

    //calculating Z-position based on floor size
    const floorDimension = floorSize * gridCellSize;
    const halfFloor = floorDimension / 2;
    const frameZPlacement = -(halfFloor - (frameThickness * gridCellSize));
    const frameDepth = 5 * gridCellSize; // 5 cm depth

    const getFrameDimensions = (frameSize: string): { width: number; height: number } => {
        const parts = frameSize.split('x').map(Number); // Split "70x50" into [70, 50]
        
        // Handle invalid format
        if (parts.length !== 2 || parts.some(isNaN)) {
            console.warn(`Invalid frame size format: ${frameSize}. Using default 70x50.`);
            return { 
                width: 70 * gridCellSize, 
                height: 50 * gridCellSize 
            };
        }
        
        const [dimension1, dimension2] = parts;
        
        // Convert cm to meters by multiplying by gridCellSize
        return { 
            width: dimension1! * gridCellSize, 
            height: dimension2! * gridCellSize 
        };
    };

    const baseDimensions = getFrameDimensions(frameSize);

    // Adjust dimensions based on orientation
    const frameWidth = frameOrientation === 'portrait' 
    ? Math.min(baseDimensions.width, baseDimensions.height)
    : Math.max(baseDimensions.width, baseDimensions.height);
  
    const frameHeight = frameOrientation === 'portrait'
    ? Math.max(baseDimensions.width, baseDimensions.height)
    : Math.min(baseDimensions.width, baseDimensions.height);

    // Calculate wall boundaries in world space
    const getWallBoundaries = () => {
        const wallWidthInMeters = wallWidth * gridCellSize;
        const wallHeightInMeters = ceilingHeight * gridCellSize;
        
        // Half dimensions of the frame including thickness
        const halfFrameWidth = (frameWidth + frameThickness * 2) / 2;
        const halfFrameHeight = (frameHeight + frameThickness * 2) / 2;
        
        return {
            minX: -wallWidthInMeters / 2 + halfFrameWidth,
            maxX: wallWidthInMeters / 2 - halfFrameWidth,
            minY: halfFrameHeight,
            maxY: wallHeightInMeters - halfFrameHeight
        };
    };

    // Clamp position to wall boundaries
    const clampToWallBoundaries = (pos: THREE.Vector3): THREE.Vector3 => {
        const boundaries = getWallBoundaries();
        const clampedPos = pos.clone();
        
        clampedPos.x = Math.max(boundaries.minX, Math.min(boundaries.maxX, pos.x));
        clampedPos.y = Math.max(boundaries.minY, Math.min(boundaries.maxY, pos.y));
        
        return clampedPos;
    };

      // Effect to clamp frame position when wall dimensions change
      useEffect(() => {
        if (groupRef.current) {
            const currentPos = new THREE.Vector3();
            groupRef.current.getWorldPosition(currentPos);
            
            const clampedPos = clampToWallBoundaries(currentPos);
            
            // Only update if position changed after clamping
            if (!currentPos.equals(clampedPos)) {
                if (groupRef.current.parent) {
                    const localPosition = groupRef.current.parent.worldToLocal(clampedPos.clone());
                    groupRef.current.position.copy(localPosition);
                } else {
                    groupRef.current.position.copy(clampedPos);
                }
                
                // Update position display
                setPosition({
                    x: Math.round(clampedPos.x / gridCellSize),
                    y: Math.round(clampedPos.y / gridCellSize)
                });

                // Notify parent of position change
                onPositionChange?.(clampedPos);
            }
        }
    }, [wallWidth, ceilingHeight, frameWidth, frameHeight]);


    
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
    
        // Calculate new position: where the mouse hits the wall + the original offset
        let newPosition = hit.point.clone().add(dragOffset.current);
    
        // Snap to grid (1cm increments)
        newPosition.x = snapToGrid(newPosition.x, gridCellSize);
        newPosition.y = snapToGrid(newPosition.y, gridCellSize);
        
        // Clamp to wall boundaries
        newPosition = clampToWallBoundaries(newPosition);
    
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

        // Notify parent of position change
        onPositionChange?.(newPosition);
    };
    

    const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
        if (isDragging) {
            setIsDragging(false);
            onDragEnd?.();
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
    };

    // Load image texture
    useEffect(() => {
        if (imageUrl) {
            const loader = new THREE.TextureLoader();
            loader.load(
                imageUrl,
                (loadedTexture) => {
                    setImageTexture(loadedTexture);
                },
                undefined,
                (error) => {
                    console.error('Error loading texture:', error);
                }
            );
        }
    }, [imageUrl]);


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
                <meshStandardMaterial color={selected ? "#000000" : frameColor} /> {/* temporary color change on select for dev */}
            </mesh>

            {/* Inner frame (cutout) */}
            <mesh position={[0, 0, frameDepth * 0.15]}>
                <boxGeometry args={[frameWidth, frameHeight, frameDepth * 0.8]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Image plane */}
            <mesh position={[0, 0, frameDepth * 0.6]}>
                <planeGeometry args={[frameWidth * 0.95, frameHeight * 0.95]} />
                <meshStandardMaterial map={ImageTexture} />
            </mesh>

            {/* Position display when dragging */}
            {isDragging && (
                <Html
                    position={[0, 0 / 2 + 0.15, 0]}
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