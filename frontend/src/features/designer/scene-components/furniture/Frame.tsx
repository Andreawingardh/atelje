import React from 'react';

type FrameProps = {
    frameColor: string;
    frameSize: string;
    sofaDepth: number;
    floorSize: number;
    gridCellSize: number;
}

export const Frame: React.FC<FrameProps> = ({frameColor, frameSize, floorSize, gridCellSize}) => {
    const frameThickness = 3 * gridCellSize; // 3 cm thickness

    //calculating Y-position based on floor size
    const floorDimension = floorSize * gridCellSize; // floor size in Three.js units
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
        default: // '70x50'
        return [0.5, 0.7, frameThickness];
        }
    })();

   
    
    return (
        <group>
            <mesh position={[0, 1.5, frameYPlacement]}
                castShadow>
                <boxGeometry 
                args={size}
                 />
                <meshStandardMaterial color={frameColor} roughness={0.6} metalness={0.2} />
            </mesh>
        </group>
    );
};