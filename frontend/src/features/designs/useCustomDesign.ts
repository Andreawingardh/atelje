import { useState, useCallback } from "react";
import { FurnitureColor } from "../designer/FurnitureForm/FurnitureForm";
import { FrameData } from "../designer/FrameForm/FrameForm";

export interface CustomDesign {
  wallWidth: number;
  ceilingHeight: number;
  wallColor: string;
  flooring: string;
  furnitureColor: FurnitureColor;
  furnitureWidth: number,
  furnitureDepth: number,
  furnitureHeight: number,
  frames: FrameData[];
}

export type DesignData = {
  sofa: {
    color: FurnitureColor;
    width: number,
    depth: number,
    height: number
  };

  wall: {
    color: string;
    width: number;
    height: number;
  };

  frames: FrameData[];

  flooring: string;
};


export function useCustomDesign(initialDesign?: Partial<CustomDesign>) {
  const [customDesign, setCustomDesignInternal] = useState<CustomDesign>({
    wallWidth: initialDesign?.wallWidth ?? 500,
    ceilingHeight: initialDesign?.ceilingHeight ?? 300,
    wallColor: initialDesign?.wallColor ?? "#DEDEDE",
    flooring: initialDesign?.flooring ?? "birch-floor-parquet",
    furnitureColor: initialDesign?.furnitureColor ?? { sofa: "#8B4513" },
    furnitureDepth: initialDesign?.furnitureDepth ?? 80,
    furnitureWidth: initialDesign?.furnitureWidth ?? 210,
    furnitureHeight: initialDesign?.furnitureHeight ?? 85,
    frames: initialDesign?.frames ?? []
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const setCustomDesign = (
  updater: CustomDesign | ((prev: CustomDesign) => CustomDesign),
  markAsUnsaved = true
) => {
  if (markAsUnsaved) {
    setHasUnsavedChanges(true);
  }
  setCustomDesignInternal(updater);
  };
  
  const markAsSaved = () => {
    setHasUnsavedChanges(false);
  }

  // Structural helper functions
  const setWallWidth = (value: number) => {
    setCustomDesign((prev) => ({ ...prev, wallWidth: value }));
  };

  const setCeilingHeight = (value: number) => {
    setCustomDesign((prev) => ({ ...prev, ceilingHeight: value }));
  };

  const setWallColor = (value: string) => {
    setCustomDesign((prev) => ({ ...prev, wallColor: value }));
  };

  const setFlooring = (value: string) => {
    setCustomDesign((prev) => ({ ...prev, flooring: value }));
  }

  // Furniture helper functions
  const setFurnitureColor = (value: FurnitureColor) => {
    setCustomDesign((prev) => ({ ...prev, furnitureColor: value }));
  };

  const setFurnitureWidth = (value: number) => {
    setCustomDesign((prev) => ({ ...prev, furnitureWidth: value }));
  };
  const setFurnitureDepth = (value: number) => {
    setCustomDesign((prev) => ({ ...prev, furnitureDepth: value }));
  };

  const setFurnitureHeight = (value: number) => {
    setCustomDesign((prev) => ({ ...prev, furnitureHeight: value }));
  };

  const setFrames = (value: FrameData[]) => {
    setCustomDesign((prev) => ({ ...prev, frames: value }));
  };

  // Frame helper functions
  const addFrame = (frame: FrameData) => {
    setCustomDesign((prev) => ({ 
      ...prev, 
      frames: [...prev.frames, frame] 
    }));
  };

  const updateFrame = (index: number, updatedFrame: Partial<FrameData>) => {
    setCustomDesign((prev) => ({
      ...prev,
      frames: prev.frames.map((frame, i) => 
        i === index ? { ...frame, ...updatedFrame } : frame
      )
    }));
  };

  const setFrameColor = (index: number, color: string) => {
    updateFrame(index, { frameColor: color });
  };

  const setFrameImage = (index: number, imageUrl: string) => {
    updateFrame(index, { imageUrl });
  };

  const setFrameSize = (index: number, size: string) => {
    updateFrame(index, { frameSize: size });
  };

  const setFrameOrientation = (index: number, orientation: 'portrait' | 'landscape') => {
    updateFrame(index, { frameOrientation: orientation });
  };

  const setFramePosition = (index: number, framePosition: [number, number, number]) => {
    updateFrame(index, { position: framePosition });
  }

  const deleteFrame = (index: number) => {
    setCustomDesign((prev) => ({
      ...prev,
      frames: prev.frames.filter((frame, i) => i !== index)
    }));
  };



  // Inside useCustomDesign:
  const getSceneData = (): string => {
    const data: DesignData = {
      wall: {
        color: customDesign.wallColor,
        width: customDesign.wallWidth,
        height: customDesign.ceilingHeight
      },
      sofa: {
        color: customDesign.furnitureColor,
        width: customDesign.furnitureWidth,
        depth: customDesign.furnitureDepth,
        height: customDesign.furnitureHeight
      },
      frames: customDesign.frames,
      flooring: customDesign.flooring
    };
    return JSON.stringify(data);
  };

  const loadSceneData = useCallback((jsonString: string): void => {
    const currentDesign: DesignData = JSON.parse(jsonString)
  setCustomDesign({
    wallWidth: currentDesign.wall.width,
    ceilingHeight: currentDesign.wall.height,
    wallColor: currentDesign.wall.color,
    flooring: currentDesign.flooring,
    furnitureColor: currentDesign.sofa.color,
    furnitureDepth: currentDesign.sofa.depth,
    furnitureWidth: currentDesign.sofa.width,
    furnitureHeight: currentDesign.sofa.height,
    frames: currentDesign.frames || []
  }, false);
  }, [])


  return {
    customDesign,
    setCustomDesign,
    setWallWidth,
    setCeilingHeight,
    setWallColor,
    setFlooring,
    setFurnitureColor,
    setFurnitureDepth,
    setFurnitureWidth,
    setFurnitureHeight,
    setFrames,
    addFrame,
    updateFrame,
    setFrameColor,
    setFrameImage,
    setFrameSize,
    setFrameOrientation,
    setFramePosition,
    deleteFrame,
    getSceneData,
    loadSceneData,
    hasUnsavedChanges,
    markAsSaved
  };
}
