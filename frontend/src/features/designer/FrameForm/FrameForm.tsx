import React from 'react';
import styles from './FrameForm.module.css';
import { stockPhotos } from "@/lib/stockPhotos";

export interface FrameData {
  id: string;
  frameColor: string;
  frameSize: string;
  frameOrientation: 'portrait' | 'landscape';
  imageUrl: string;
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

  const frameSizes = [
    { size: '70x100', label: '70x100 cm' },
    { size: '50x70', label: '50x70 cm' },
    { size: '40x50', label: '40x50 cm' },
    { size: '30x40', label: '30x40 cm' },
    { size: '30x30', label: '30x30 cm' },
    { size: '20x30', label: '20x30 cm' },
    { size: '13x18', label: '13x18 cm' }
  ]
  const getRandomPosition = (frameSize: string): [number, number, number] => {
    const wallWidthCm = wallWidth * gridCellSize;
    const ceilingHeightCm = ceilingHeight * gridCellSize;
  
  // Frame size will be dynamic based on selection
    const [width, height] = frameSize.split('x').map(Number);
    const frameWidth = (width || 50) * gridCellSize;
    const frameHeight = (height || 70) * gridCellSize;
  
  // Calculate safe bounds (frame center positions)
    const padding = 0.1; // 10cm padding
    const minX = -(wallWidthCm / 2) + (frameWidth / 2) + padding;
    const maxX = (wallWidthCm / 2) - (frameWidth / 2) - padding;
    const minY = (ceilingHeightCm / 2) + (frameHeight / 2) + padding;
    const maxY = ceilingHeightCm - (frameHeight / 2) - padding;
  
    const randomX = minX + Math.random() * (maxX - minX);
    const randomY = minY + Math.random() * (maxY - minY);
  
    return [randomX, randomY, 0];
  };

  const getRandomImageUrl = (): string => {
    if (stockPhotos.length === 0) {
      return '/mountains-field-flowers-daniela-kokina-unsplash.jpg';
    }
    const randomIndex = Math.floor(Math.random() * stockPhotos.length);
    const photo = stockPhotos[randomIndex]!;
    return `/stock-photos/${photo.filename}`;
  };

  const handleAddFrame = (size: string) => {
    const newFrame: FrameData = {
      id: `frame-${Date.now()}`,
      frameColor: '#ac924f',
      frameSize: size,
      frameOrientation: 'portrait',
      imageUrl: getRandomImageUrl(),
      position: getRandomPosition(size)
    };
    onAddFrame(newFrame);
  };

  return (
    <div className={styles.frameForm}>
      {frameSizes.map(({ size, label }) => (
        <button 
          key={size}
          onClick={() => handleAddFrame(size)}
          className={styles.addFrameButton}
        >
          {label}
        </button>
      ))}
    </div>
  );
}