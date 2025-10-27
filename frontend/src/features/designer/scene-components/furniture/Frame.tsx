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
    const frameYPlacement = -(halfFloor - (frameThickness * gridCellSize) / 2);


   
    
    return (
        <group>
        
        </group>
    );
};