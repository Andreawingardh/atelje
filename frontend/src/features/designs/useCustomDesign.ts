import { useState, useCallback } from "react";
import { FurnitureColor } from "../designer/FurnitureForm/FurnitureForm";

export interface CustomDesign {
  wallWidth: number;
  ceilingHeight: number;
  wallColor: string;
  furnitureColor: FurnitureColor;
}

export type DesignData = {
  sofa: {
    color: FurnitureColor;
  };

  wall: {
    color: string;
    width: number;
    height: number;
  };

//   frames: { frameColor: string; frameSize: string }[];
};


export function useCustomDesign(initialDesign?: Partial<CustomDesign>) {
  const [customDesign, setCustomDesign] = useState<CustomDesign>({
    wallWidth: initialDesign?.wallWidth ?? 500,
    ceilingHeight: initialDesign?.ceilingHeight ?? 300,
    wallColor: initialDesign?.wallColor ?? "#DEDEDE",
    furnitureColor: initialDesign?.furnitureColor ?? { sofa: "#8B4513" },
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

  // Inside useCustomDesign:
const getSceneData = (): string => {
  const data: DesignData = {
    wall: {
    color: customDesign.wallColor,
    width: customDesign.wallWidth,
    height: customDesign.ceilingHeight
    },
    sofa: {
      color: customDesign.furnitureColor
    }
  };
  return JSON.stringify(data);
};

  const loadSceneData = useCallback((jsonString: string): void => {
    const currentDesign: DesignData = JSON.parse(jsonString)
    setWallWidth(currentDesign.wall.width);
    setCeilingHeight(currentDesign.wall.height)
    setWallColor(currentDesign.wall.color)
    setFurnitureColor(currentDesign.sofa.color)
}, [])


  return {
    customDesign,
    setCustomDesign,
    setWallWidth,
    setCeilingHeight,
    setWallColor,
    setFurnitureColor,
    getSceneData,
    loadSceneData
  };
}
