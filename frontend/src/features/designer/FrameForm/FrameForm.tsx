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

interface OccupiedPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  frameId: string;
}

interface FrameFormProps {
  frames: FrameData[];
  wallWidth: number;
  ceilingHeight: number;
  gridCellSize: number;
  occupiedPositions: OccupiedPosition[];
  onAddFrame: (frame: FrameData) => void;
  onAddOccupiedPosition: (position: OccupiedPosition) => void;
}

export default function FrameForm({ 
  frames, 
  onAddFrame, 
  wallWidth, 
  ceilingHeight, 
  gridCellSize,
  occupiedPositions,
  onAddOccupiedPosition
}: FrameFormProps) {

  const frameSizes = [
    { size: '70x100', label: '70x100 cm' },
    { size: '50x70', label: '50x70 cm' },
    { size: '40x50', label: '40x50 cm' },
    { size: '30x40', label: '30x40 cm' },
    { size: '30x30', label: '30x30 cm' },
    { size: '20x30', label: '20x30 cm' },
    { size: '13x18', label: '13x18 cm' }
  ];

  const checkOverlap = (
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number },
    padding: number = 0.03 // 3cm padding
  ): boolean => {
    return !(
      rect1.x + rect1.width / 2 + padding < rect2.x - rect2.width / 2 ||
      rect1.x - rect1.width / 2 - padding > rect2.x + rect2.width / 2 ||
      rect1.y + rect1.height / 2 + padding < rect2.y - rect2.height / 2 ||
      rect1.y - rect1.height / 2 - padding > rect2.y + rect2.height / 2
    );
  };

  const getRandomPosition = (frameSize: string, frameId: string): [number, number, number] | null => {
    const [width, height] = frameSize.split('x').map(Number);
    const frameWidth = (width || 50) * gridCellSize;
    const frameHeight = (height || 70) * gridCellSize;
    
    const wallWidthCm = wallWidth * gridCellSize;
    const ceilingHeightCm = ceilingHeight * gridCellSize;
    
    const padding = 0.1; // 10 cm padding from edges
    const minX = -(wallWidthCm / 2) + (frameWidth / 2) + padding;
    const maxX = (wallWidthCm / 2) - (frameWidth / 2) - padding;
    const minY = (ceilingHeightCm / 2) + (frameHeight / 2) + padding;
    const maxY = ceilingHeightCm - (frameHeight / 2) - padding;

    for (let i = 0; i < 200; i++) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);
      
      const newFrame = { x, y, width: frameWidth, height: frameHeight, frameId };
      
      if (!occupiedPositions.some(occupied => checkOverlap(newFrame, occupied))) {
        onAddOccupiedPosition(newFrame);
        return [x, y, 0];
      }
    }
    
    return null;
  };

  const getRandomImageUrl = (): string => {
    if (stockPhotos.length === 0) return '/mountains-field-flowers-daniela-kokina-unsplash.jpg';
    const randomIndex = Math.floor(Math.random() * stockPhotos.length);
    return `/stock-photos/${stockPhotos[randomIndex]!.filename}`;
  };

  const handleAddFrame = (size: string) => {
    const frameId = `frame-${Date.now()}`;
    const position = getRandomPosition(size, frameId);
    
    if (!position) {
      alert('Wall is full! Remove or move some frames.');
      return;
    }
    
    onAddFrame({
      id: frameId,
      frameColor: '#ac924f',
      frameSize: size,
      frameOrientation: 'portrait',
      imageUrl: getRandomImageUrl(),
      position
    });
  };

  return (
    <div className={styles.frameForm}>
      {frameSizes.map(({ size, label }) => (
        <>
        <button 
          key={size}
          onClick={() => handleAddFrame(size)}
          className={styles.addFrameButton}
        >
          {label}
          <div className={styles.addIcon}>
            <img 
              src={`/icons/add-icon.svg`} 
              alt={"Add button"} 
              className={styles.framePreviewImage} 
            />
          </div>
        </button>
        <hr className={styles.frameDivider} />
        </>
      ))}
    </div>
  );
}