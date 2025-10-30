import { useState, useCallback } from "react";
import { FurnitureColor } from "../designer/FurnitureForm/FurnitureForm";
import { FrameData } from "../designer/FrameForm/FrameForm";

export interface CustomDesign {
  wallWidth: number;
  ceilingHeight: number;
  wallColor: string;
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
};


export function useCustomDesign(initialDesign?: Partial<CustomDesign>) {
  const [customDesign, setCustomDesign] = useState<CustomDesign>({
    wallWidth: initialDesign?.wallWidth ?? 500,
    ceilingHeight: initialDesign?.ceilingHeight ?? 300,
    wallColor: initialDesign?.wallColor ?? "#DEDEDE",
    furnitureColor: initialDesign?.furnitureColor ?? { sofa: "#8B4513" },
    furnitureDepth: initialDesign?.furnitureDepth ?? 80,
    furnitureWidth: initialDesign?.furnitureWidth ?? 210,
    furnitureHeight: initialDesign?.furnitureHeight ?? 85,
    frames: initialDesign?.frames ?? []
  });

  // Helper functions
  const setWallWidth = (value: number) => {
    setCustomDesign((prev) => ({ ...prev, wallWidth: value }));
  };

  const setCeilingHeight = (value: number) => {
    setCustomDesign((prev) => ({ ...prev, ceilingHeight: value }));
  };

  const setWallColor = (value: string) => {
    setCustomDesign((prev) => ({ ...prev, wallColor: value }));
  };

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

  const addFrame = (frame: FrameData) => {
    setCustomDesign((prev) => ({ 
      ...prev, 
      frames: [...prev.frames, frame] 
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
      frames: customDesign.frames
    };
    return JSON.stringify(data);
  };

  const loadSceneData = useCallback((jsonString: string): void => {
    const currentDesign: DesignData = JSON.parse(jsonString)
    setWallWidth(currentDesign.wall.width);
    setCeilingHeight(currentDesign.wall.height)
    setWallColor(currentDesign.wall.color)
    setFurnitureColor(currentDesign.sofa.color)
    setFurnitureDepth(currentDesign.sofa.depth)
    setFurnitureWidth(currentDesign.sofa.width)
    setFurnitureHeight(currentDesign.sofa.height)
    setFrames(currentDesign.frames || [])
  }, [])


  return {
    customDesign,
    setCustomDesign,
    setWallWidth,
    setCeilingHeight,
    setWallColor,
    setFurnitureColor,
    setFurnitureDepth,
    setFurnitureWidth,
    setFurnitureHeight,
    setFrames,
    addFrame,
    getSceneData,
    loadSceneData
  };
}
