import * as THREE from 'three';

interface OccupiedPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  frameId: string;
}

interface FrameDimensions {
  frameSize: string;
  frameOrientation: 'portrait' | 'landscape';
  gridCellSize: number;
}

/**
 * Check if two frames overlap
 */
export const checkOverlap = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number },
  padding: number = 0.01
): boolean => {
  return !(
    rect1.x + rect1.width / 2 + padding < rect2.x - rect2.width / 2 ||
    rect1.x - rect1.width / 2 - padding > rect2.x + rect2.width / 2 ||
    rect1.y + rect1.height / 2 + padding < rect2.y - rect2.height / 2 ||
    rect1.y - rect1.height / 2 - padding > rect2.y + rect2.height / 2
  );
};

/**
 * Check if a frame position collides with any occupied positions
 */
export const checkCollision = (
  pos: THREE.Vector3,
  frameDimensions: FrameDimensions,
  occupiedPositions: OccupiedPosition[]
): boolean => {
  const { frameSize, frameOrientation, gridCellSize } = frameDimensions;
  const [width, height] = frameSize.split('x').map(Number);
  
  const isPortrait = frameOrientation === 'portrait';
  const currentFrameWidth = isPortrait 
    ? Math.min(width || 50, height || 70) * gridCellSize
    : Math.max(width || 50, height || 70) * gridCellSize;
  const currentFrameHeight = isPortrait
    ? Math.max(width || 50, height || 70) * gridCellSize
    : Math.min(width || 50, height || 70) * gridCellSize;
  
  const newFrame = { 
    x: pos.x, 
    y: pos.y, 
    width: currentFrameWidth, 
    height: currentFrameHeight 
  };
  
  return occupiedPositions.some(occupied => 
    checkOverlap(newFrame, occupied, 0.01)
  );
};

/**
 * Find nearest free position using spiral search
 */
export const findNearestFreePosition = (
  targetPos: THREE.Vector3,
  frameDimensions: FrameDimensions,
  occupiedPositions: OccupiedPosition[],
  clampToWallBoundaries: (pos: THREE.Vector3) => THREE.Vector3,
  wallWidth: number,
  ceilingHeight: number
): THREE.Vector3 | null => {
  if (!checkCollision(targetPos, frameDimensions, occupiedPositions)) {
    return targetPos;
  }

  const { gridCellSize } = frameDimensions;
  
  // Calculate maximum search radius to cover entire wall
  const wallWidthM = wallWidth * gridCellSize;
  const wallHeightM = ceilingHeight * gridCellSize;
  
  // Try positions in expanding spiral outward from target
  const maxRadius = Math.max(wallWidthM, wallHeightM);
  const radiusStep = 0.05; // 5cm steps
  const angleSteps = 16; // Check 16 positions per circle
  
  for (let radius = radiusStep; radius <= maxRadius; radius += radiusStep) {
    for (let i = 0; i < angleSteps; i++) {
      const angle = (Math.PI * 2 * i) / angleSteps;
      
      const testPos = new THREE.Vector3(
        targetPos.x + Math.cos(angle) * radius,
        targetPos.y + Math.sin(angle) * radius,
        targetPos.z
      );
      
      // Clamp to wall boundaries
      const clampedPos = clampToWallBoundaries(testPos);
      
      // Check for free position
      if (!checkCollision(clampedPos, frameDimensions, occupiedPositions)) {
        return clampedPos;
      }
    }
  }
  
  console.warn('No free position found on entire wall');
  return null;
};