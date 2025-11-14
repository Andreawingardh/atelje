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

/**
 * Clamp position to avoid overlap with occupied frames during drag
 */
export const clampToAvoidCollision = (
  targetPos: THREE.Vector3,
  lastValidPos: THREE.Vector3 | null,
  frameDimensions: FrameDimensions,
  occupiedPositions: OccupiedPosition[],
  clampToWallBoundaries: (pos: THREE.Vector3) => THREE.Vector3
): THREE.Vector3 => {
  const { frameSize, frameOrientation, gridCellSize } = frameDimensions;
  const [width, height] = frameSize.split('x').map(Number);
  
  const isPortrait = frameOrientation === 'portrait';
  const currentFrameWidth = isPortrait 
    ? Math.min(width || 50, height || 70) * gridCellSize
    : Math.max(width || 50, height || 70) * gridCellSize;
  const currentFrameHeight = isPortrait
    ? Math.max(width || 50, height || 70) * gridCellSize
    : Math.min(width || 50, height || 70) * gridCellSize;
  
  const halfWidth = currentFrameWidth / 2;
  const halfHeight = currentFrameHeight / 2;
  const padding = 0.01;
  
  // Check if position would cause collision
  const wouldCollide = (pos: THREE.Vector3): boolean => {
    for (const occupied of occupiedPositions) {
      const occupiedHalfWidth = occupied.width / 2;
      const occupiedHalfHeight = occupied.height / 2;
      
      const xOverlap = 
        (pos.x + halfWidth + padding > occupied.x - occupiedHalfWidth) &&
        (pos.x - halfWidth - padding < occupied.x + occupiedHalfWidth);
      const yOverlap = 
        (pos.y + halfHeight + padding > occupied.y - occupiedHalfHeight) &&
        (pos.y - halfHeight - padding < occupied.y + occupiedHalfHeight);
      
      if (xOverlap && yOverlap) {
        return true;
      }
    }
    return false;
  };
  
  const clampedTarget = clampToWallBoundaries(targetPos);
  
  // If no last valid position, just check target
  if (!lastValidPos) {
    return wouldCollide(clampedTarget) ? clampedTarget : clampedTarget;
  }
  
  // Move in small steps to handle fast mouse movement
  const maxStepSize = 0.02; // 2cm max step
  const deltaX = clampedTarget.x - lastValidPos.x;
  const deltaY = clampedTarget.y - lastValidPos.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // If movement is small, check new position
  if (distance <= maxStepSize) {
    if (!wouldCollide(clampedTarget)) {
      return clampedTarget;
    }
    
    // Try individual axes
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    if (absDeltaX >= absDeltaY) {
      const tryX = new THREE.Vector3(clampedTarget.x, lastValidPos.y, clampedTarget.z);
      const tryXClamped = clampToWallBoundaries(tryX);
      if (!wouldCollide(tryXClamped)) return tryXClamped;
      
      const tryY = new THREE.Vector3(lastValidPos.x, clampedTarget.y, clampedTarget.z);
      const tryYClamped = clampToWallBoundaries(tryY);
      if (!wouldCollide(tryYClamped)) return tryYClamped;
    } else {
      const tryY = new THREE.Vector3(lastValidPos.x, clampedTarget.y, clampedTarget.z);
      const tryYClamped = clampToWallBoundaries(tryY);
      if (!wouldCollide(tryYClamped)) return tryYClamped;
      
      const tryX = new THREE.Vector3(clampedTarget.x, lastValidPos.y, clampedTarget.z);
      const tryXClamped = clampToWallBoundaries(tryX);
      if (!wouldCollide(tryXClamped)) return tryXClamped;
    }
    
    return lastValidPos;
  }
  
  // Check movement in steps
  const steps = Math.ceil(distance / maxStepSize);
  const stepX = deltaX / steps;
  const stepY = deltaY / steps;
  
  let currentPos = lastValidPos.clone();
  
  for (let i = 1; i <= steps; i++) {
    const nextPos = new THREE.Vector3(
      lastValidPos.x + stepX * i,
      lastValidPos.y + stepY * i,
      clampedTarget.z
    );
    
    const nextPosClamped = clampToWallBoundaries(nextPos);
    
    // Try full movement
    if (!wouldCollide(nextPosClamped)) {
      currentPos = nextPosClamped;
      continue;
    }
    
    // Full movement blocked - try individual axes
    const stepDeltaX = nextPosClamped.x - currentPos.x;
    const stepDeltaY = nextPosClamped.y - currentPos.y;
    const absStepDeltaX = Math.abs(stepDeltaX);
    const absStepDeltaY = Math.abs(stepDeltaY);
    
    let moved = false;
    
    if (absStepDeltaX >= absStepDeltaY) {
      // Try x-axis first
      const tryX = new THREE.Vector3(nextPosClamped.x, currentPos.y, currentPos.z);
      const tryXClamped = clampToWallBoundaries(tryX);
      if (!wouldCollide(tryXClamped)) {
        currentPos = tryXClamped;
        moved = true;
      } else {
        // Try y-axis
        const tryY = new THREE.Vector3(currentPos.x, nextPosClamped.y, currentPos.z);
        const tryYClamped = clampToWallBoundaries(tryY);
        if (!wouldCollide(tryYClamped)) {
          currentPos = tryYClamped;
          moved = true;
        }
      }
    } else {
      // Try y-axis first
      const tryY = new THREE.Vector3(currentPos.x, nextPosClamped.y, currentPos.z);
      const tryYClamped = clampToWallBoundaries(tryY);
      if (!wouldCollide(tryYClamped)) {
        currentPos = tryYClamped;
        moved = true;
      } else {
        // Try x-axis
        const tryX = new THREE.Vector3(nextPosClamped.x, currentPos.y, currentPos.z);
        const tryXClamped = clampToWallBoundaries(tryX);
        if (!wouldCollide(tryXClamped)) {
          currentPos = tryXClamped;
          moved = true;
        }
      }
    }
    
    if (!moved) {
      break;
    }
  }
  
  return currentPos;
};