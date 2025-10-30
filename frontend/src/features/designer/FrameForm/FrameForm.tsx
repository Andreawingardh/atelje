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
  onAddFrame: (frame: FrameData) => void;
}

export default function FrameForm({ frames, onAddFrame }: FrameFormProps) {
  const handleAddFrame = () => {
    const newFrame: FrameData = {
      id: `frame-${Date.now()}`,
      frameColor: '#ac924f',
      frameSize: '70x50',
      frameOrientation: 'portrait',
      position: [(frames.length * 0.8) - 1, 0, 0] // Position will be changed later to work with collisions etc
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