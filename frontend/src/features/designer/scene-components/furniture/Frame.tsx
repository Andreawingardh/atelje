import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { checkCollision, findNearestFreePosition, clampToAvoidCollision } from '@/lib/frameCollisionUtils';

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
    framePosition?: [number, number, number];
    onPositionChange?: (position: THREE.Vector3) => void;
    occupiedPositions?: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
        frameId: string;
    }>;
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
    framePosition = [0, 1.5, 0],
    onPositionChange,
    occupiedPositions = []
}) => {
    const frameThickness = 4 * gridCellSize; // 4 cm thickness
    const groupRef = useRef<THREE.Group>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragOffset = useRef(new THREE.Vector3());
    const [ImageTexture, setImageTexture] = useState<THREE.Texture | null>(null);
    const isInitialized = useRef(false); // To prevent initial clamping effect before first position set
    const [hasCollision, setHasCollision] = useState(false);
    const lastValidPosition = useRef<THREE.Vector3 | null>(null);
    
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
        
        // Half dimensions of the frame
        const halfFrameWidth = frameWidth / 2; 
        const halfFrameHeight = frameHeight / 2;
        
        return {
            minX: -wallWidthInMeters / 2 + halfFrameWidth,
            maxX: wallWidthInMeters / 2 - halfFrameWidth,
            minY: halfFrameHeight,
            maxY: wallHeightInMeters - halfFrameHeight
        };
    };
    
        // Convert from Three.js center origin to lower-left origin
        // AND offset to represent bottom-left corner of frame instead of center
        const worldToLowerLeft = (worldPos: THREE.Vector3): { x: number; y: number } => {
            const wallWidthInMeters = wallWidth * gridCellSize;
            
            // Calculate half dimensions of the ENTIRE frame
            const halfTotalFrameWidth = frameWidth / 2;
            const halfTotalFrameHeight = frameHeight / 2;
            
            return {
                x: worldPos.x + wallWidthInMeters / 2 - halfTotalFrameWidth,
                y: worldPos.y - halfTotalFrameHeight
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
        if (groupRef.current && isInitialized.current) {
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
                const displayPos = worldToLowerLeft(clampedPos);
                setPosition({
                    x: Math.round(displayPos.x / gridCellSize),
                    y: Math.round(displayPos.y / gridCellSize)
                });

                // Notify parent of position change
                onPositionChange?.(clampedPos);
            }
        }
    }, [wallWidth, ceilingHeight, frameWidth, frameHeight]);

    // Initialize position from props
    useEffect(() => {
        if (groupRef.current && framePosition) {
            groupRef.current.position.set(framePosition[0], framePosition[1], frameZPlacement);
            isInitialized.current = true;
            
            const worldPos = new THREE.Vector3(framePosition[0], framePosition[1], framePosition[2]);
            const displayPos = worldToLowerLeft(worldPos);
            setPosition({
                x: Math.round(displayPos.x / gridCellSize),
                y: Math.round(displayPos.y / gridCellSize)
            });
        }
    }, [framePosition, frameZPlacement, gridCellSize, frameWidth, frameHeight, wallWidth]);

    
    // Helper function to snap to our 1x1cm grid
    const snapToGrid = (value: number, gridSize: number): number => {
        return Math.round(value / gridSize) * gridSize;
    };

    // Helper function to get which sizes should have white border
    const shouldHaveWhiteBorder = (frameSize: string): boolean => {
        const smallSizes = ['20x30', '30x20', '13x18', '18x13'];
        return !smallSizes.includes(frameSize);
    };

    // Helper function to get normalized pointer coordinates relative to canvas
    const getPointerCoordinates = (e: ThreeEvent<PointerEvent>): THREE.Vector2 => {
        const rect = gl.domElement.getBoundingClientRect();
        return new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
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

        // Store starting position as last valid position
        lastValidPosition.current = framePosition.clone();
    
        // Cast a ray to the wall at the current mouse position
        const pointer = getPointerCoordinates(e);

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
    
        const pointer = getPointerCoordinates(e);
    
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
        newPosition = clampToAvoidCollision(newPosition, lastValidPosition.current, { frameSize, frameOrientation, gridCellSize }, occupiedPositions, clampToWallBoundaries);

        // Update last valid position
        lastValidPosition.current = newPosition.clone();

        // Check for collision while dragging and update state
        setHasCollision(checkCollision(newPosition, { frameSize, frameOrientation, gridCellSize }, occupiedPositions));
    
        // Apply the new position
        if (groupRef.current.parent) {
            const localPosition = groupRef.current.parent.worldToLocal(newPosition.clone());
            groupRef.current.position.copy(localPosition);
        } else {
            groupRef.current.position.copy(newPosition);
        }

        // Update position display (convert to cm)
        const displayPos = worldToLowerLeft(newPosition);
        setPosition({
            x: Math.round(displayPos.x / gridCellSize),
            y: Math.round(displayPos.y / gridCellSize)
        });

        // Notify parent of position change
        onPositionChange?.(newPosition);
    };
    

    const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
        if (isDragging) {
            // Get current position
            const currentPos = new THREE.Vector3();
            if (groupRef.current) {
                groupRef.current.getWorldPosition(currentPos);
            }
        
            // Test collision detection
            const collisionDetected = checkCollision(currentPos, { frameSize, frameOrientation, gridCellSize }, occupiedPositions);

            if (collisionDetected) {
                // Find nearest free position
                const freePos = findNearestFreePosition(currentPos, { frameSize, frameOrientation, gridCellSize }, occupiedPositions, clampToWallBoundaries, wallWidth, ceilingHeight);
            
                if (freePos) {
                    // Move frame to the free position
                    if (groupRef.current) {
                        if (groupRef.current.parent) {
                            const localPosition = groupRef.current.parent.worldToLocal(freePos.clone());
                            groupRef.current.position.copy(localPosition);
                        } else {
                            groupRef.current.position.copy(freePos);
                        }
                
                        // Update position display
                        const displayPos = worldToLowerLeft(freePos);
                        setPosition({
                            x: Math.round(displayPos.x / gridCellSize),
                            y: Math.round(displayPos.y / gridCellSize)
                        });
                
                        // Notify parent of new position
                        onPositionChange?.(freePos);
                    }
                    setHasCollision(false);
                } else {
                    // No free position found anywhere on wall
                    alert('Wall is completely full! Remove some frames.');
                    console.error('Cannot place frame - wall is full');
                }
            } else {
                // Clear collision state when released without collision
                setHasCollision(false);
            }

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
                    loadedTexture.colorSpace = THREE.SRGBColorSpace;
                    loadedTexture.needsUpdate = true;
                    setImageTexture(loadedTexture);
                },
                undefined,
                (error) => {
                    console.error('Error loading texture:', error);
                }
            );
        }
    }, [imageUrl]);

    // Adjust image based on aspect ratio
    useEffect(() => {
        if (ImageTexture) {
            const imageAspect = ImageTexture.image.width / ImageTexture.image.height;
            const frameAspect = frameWidth / frameHeight;
            const scale = imageAspect > frameAspect 
                ? frameAspect / imageAspect  // Crop sides
                : imageAspect / frameAspect; // Crop top/bottom
        
            ImageTexture.repeat.set(
                imageAspect > frameAspect ? scale : 1,
                imageAspect > frameAspect ? 1 : scale
            );
            ImageTexture.offset.set(
                imageAspect > frameAspect ? (1 - scale) / 2 : 0,
                imageAspect > frameAspect ? 0 : (1 - scale) / 2
            );
        
            ImageTexture.needsUpdate = true;
        }
    }, [ImageTexture, frameWidth, frameHeight]);

    return (
        <group
            ref={groupRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* Frame border */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[
                    frameWidth,
                    frameHeight,
                    frameDepth
                ]} />
                <meshStandardMaterial color={frameColor} />
            </mesh>

            {/* Selection border - only visible when selected */}
            {selected && (
                <>
                    {/* Top border */}
                    <mesh position={[0, frameHeight / 2, 0]}>
                        <boxGeometry args={[frameWidth + 0.01, 0.015, frameDepth + 0.01]} />
                        <meshBasicMaterial color={hasCollision ? '#8C3535' : '#5877c9'} />
                    </mesh>
                    {/* Bottom border */}
                    <mesh position={[0, -frameHeight / 2, 0]}>
                        <boxGeometry args={[frameWidth + 0.01, 0.015, frameDepth + 0.01]} />
                        <meshBasicMaterial color={hasCollision ? '#8C3535' : '#5877c9'} />
                    </mesh>
                    {/* Left border */}
                    <mesh position={[-frameWidth / 2, 0, 0]}>
                        <boxGeometry args={[0.015, frameHeight + 0.01, frameDepth + 0.01]} />
                        <meshBasicMaterial color={hasCollision ? '#8C3535' : '#5877c9'} />
                    </mesh>
                    {/* Right border */}
                    <mesh position={[frameWidth / 2, 0, 0]}>
                        <boxGeometry args={[0.015, frameHeight + 0.01, frameDepth + 0.01]} />
                        <meshBasicMaterial color={hasCollision ? '#8C3535' : '#5877c9'} />
                    </mesh>
                </>
            )}

            {/* Inner frame (cutout) */}
            {shouldHaveWhiteBorder(frameSize) && (
                <mesh position={[0, 0, frameDepth * 0.15]}>
                    <boxGeometry args={[frameWidth - frameThickness * 2, frameHeight - frameThickness * 2, frameDepth * 0.8]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
            )}
            
            {/* Image plane */}
            <mesh position={[0, 0, frameDepth * 0.6]}>
                <planeGeometry args={[
                    shouldHaveWhiteBorder(frameSize) 
                        ? frameWidth - (frameThickness * 4) * 0.95
                        : frameWidth - frameThickness * 2,
                    shouldHaveWhiteBorder(frameSize)
                        ? frameHeight - (frameThickness * 4) * 0.95
                        : frameHeight - frameThickness * 2
                ]} />
                {ImageTexture && (
                    <meshStandardMaterial 
                        key={imageUrl}
                        map={ImageTexture} 
                        side={THREE.DoubleSide}
                    />
                )}
            </mesh>

            {/* Position display and measurement lines when selected */}
            {selected && (() => {
                const wallWidthMeters = wallWidth * gridCellSize;
                const wallLeftEdge = -wallWidthMeters / 2;
    
                // Get current world position of the frame
                const currentWorldPos = new THREE.Vector3();
                if (groupRef.current) {
                    groupRef.current.getWorldPosition(currentWorldPos);
                }
    
                const frameLeftEdge = -(frameWidth / 2);
                const frameBottomEdge = -(frameHeight / 2);
                const lineZ = frameDepth / 2 + 0.01;
    
                // Calculate distances in local space
                const distanceToWallLeft = wallLeftEdge - currentWorldPos.x;
                const distanceToFloor = -currentWorldPos.y;

                // Calculate line dimensions
                const horizontalLineLength = Math.abs(frameLeftEdge - distanceToWallLeft);
                const verticalLineLength = Math.abs(frameBottomEdge - distanceToFloor);
    
                return (
                    <>
                        {/* Horizontal line from frame left edge to wall left edge */}
                        <mesh position={[
                            (frameLeftEdge + distanceToWallLeft) / 2,
                            0,
                            lineZ
                        ]}>
                            <boxGeometry args={[horizontalLineLength, 0.01, 0.001]} />
                            <meshBasicMaterial color="#636363" />
                        </mesh>
            
                        <Html
                            position={[
                                frameLeftEdge - 0.5,
                                0.1,
                                lineZ
                            ]}
                            center
                            style={{
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}
                        >
                            <p style={{ 
                                background: 'rgba(255,255,255,0.9)', 
                                padding: '3px 6px',
                                borderRadius: '10px',
                                fontSize: '12px'
                            }}>
                                {Math.round(position.x)} cm
                            </p>
                        </Html>
            
                        {/* Vertical line from frame bottom to floor */}
                        <mesh position={[
                            0,
                            (frameBottomEdge + distanceToFloor) / 2,
                            lineZ
                        ]}>
                            <boxGeometry args={[0.01, verticalLineLength, 0.001]} />
                            <meshBasicMaterial color="#636363" />
                        </mesh>
            
                        <Html
                            position={[
                                0.05,
                                frameBottomEdge - 0.3,
                                lineZ
                            ]}
                            style={{
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}
                        >
                            <p style={{ 
                                background: 'rgba(255,255,255,0.9)', 
                                padding: '3px 6px',
                                borderRadius: '10px',
                                fontSize: '12px'
                            }}>
                                {Math.round(position.y)} cm
                            </p>
                        </Html>
                    </>
                );
            })()}
        </group>
    );
};