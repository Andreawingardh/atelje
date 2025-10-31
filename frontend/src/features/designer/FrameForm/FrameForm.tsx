import React from 'react';
import styles from './FrameForm.module.css';

export interface FrameData {
  id: string;
  frameColor: string;
  frameSize: string;
  frameOrientation: 'portrait' | 'landscape';
  position: [number, number, number];
}

interface FrameFormProps {
  frames: FrameData[];
  wallWidth: number;
  ceilingHeight: number;
  gridCellSize: number;
  onAddFrame: (frame: FrameData) => void;
}

export default function FrameForm({ frames, onAddFrame, wallWidth, ceilingHeight, gridCellSize }: FrameFormProps) {

  const getRandomPosition = (): [number, number, number] => {
    const wallWidthCm = wallWidth * gridCellSize;
    const ceilingHeightCm = ceilingHeight * gridCellSize;
  
  // Frame size will be dynamic based on selection
    const frameWidth = 0.7;
    const frameHeight = 0.5;
  
  // Calculate safe bounds (frame center positions)
    const padding = 0.1; // 10cm padding
    const minX = -(wallWidthCm / 2) + (frameWidth / 2) + padding;
    const maxX = (wallWidthCm / 2) - (frameWidth / 2) - padding;
    const minY = (frameHeight / 2) + padding;
    const maxY = ceilingHeightCm - (frameHeight / 2) - padding;
  
    const randomX = minX + Math.random() * (maxX - minX);
    const randomY = minY + Math.random() * (maxY - minY);
  
    return [randomX, randomY, 0];
  };

  const handleAddFrame = () => {
    const newFrame: FrameData = {
      id: `frame-${Date.now()}`,
      frameColor: '#ac924f',
      frameSize: '70x50',
      frameOrientation: 'portrait',
      position: getRandomPosition() // Position will be changed later to work with collisions etc
    };
    onAddFrame(newFrame);
  };

  return (
    <div className={styles.frameForm}>
      <button onClick={handleAddFrame} className={styles.addButton}>
        Add Frame
      </button>
    </div>
  );
}