import React from 'react';
import { RoundedBox } from '@react-three/drei'

type SofaProps = {
    sofaColor: string;
    sofaWidth: number;
    sofaDepth: number;
    floorSize: number;
    gridCellSize: number;
}

export const Sofa: React.FC<SofaProps> = ({sofaColor, sofaWidth, sofaDepth, floorSize, gridCellSize}) => {
    //calculating Y-position based on floor size
    const floorDimension = floorSize * gridCellSize; // floor size in Three.js units
    const halfFloor = floorDimension / 2;
    const sofaYPlacement = -(halfFloor - (sofaDepth * gridCellSize) / 2);

    const convertedHeight = 80 * gridCellSize; // 85 cm total height
    const convertedDepth = sofaDepth * gridCellSize;
    const convertedWidth = sofaWidth * gridCellSize;
    
    const convertedArmrestWidth = 20 * gridCellSize; // 20 cm
    const convertedSeatWidth = (sofaWidth - 40) * gridCellSize; // subtract armrests
    const convertedSeatHeight = 45 * gridCellSize; // 45 cm seat height
    const convertedBackHeight = 40 * gridCellSize; // 40 cm backrest height
    
    return (
        <group>
            {/* Left Armrest */}
            <RoundedBox
                args={[convertedArmrestWidth, convertedHeight, convertedDepth]}
                radius={0.05}
                smoothness={4}
                position={[-(convertedWidth / 2) + (convertedArmrestWidth / 2), convertedHeight / 2, sofaYPlacement]}
                castShadow
            >
                <meshStandardMaterial color={sofaColor} />
            </RoundedBox>

            {/* Right Armrest */}
            <RoundedBox
                args={[convertedArmrestWidth, convertedHeight, convertedDepth]}
                radius={0.05}
                smoothness={4}
                position={[(convertedWidth / 2) - (convertedArmrestWidth / 2), convertedHeight / 2, sofaYPlacement]}
                castShadow
            >
                <meshStandardMaterial color={sofaColor} />
            </RoundedBox>

            {/* Seat */}
            <RoundedBox
                args={[convertedSeatWidth, convertedSeatHeight, convertedDepth]}
                radius={0.05}
                smoothness={4}
                position={[0, convertedSeatHeight / 2, sofaYPlacement]}
                castShadow
            >
                <meshStandardMaterial color={sofaColor} />
            </RoundedBox>

            {/* Backrest */}
            <RoundedBox
                args={[convertedSeatWidth, convertedBackHeight, convertedDepth * 0.3]}
                radius={0.05}
                smoothness={4}
                position={[0, convertedSeatHeight + (convertedBackHeight / 2), sofaYPlacement - (convertedDepth / 2) + (convertedDepth * 0.3 / 2)]}
                castShadow
            >
                <meshStandardMaterial color={sofaColor} />
            </RoundedBox>
        </group>
    );
};