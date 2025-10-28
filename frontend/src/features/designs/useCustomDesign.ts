import { useState } from "react";
import { FurnitureColor } from "../designer/FurnitureForm/FurnitureForm";

export interface CustomDesign {
  wallWidth: number;
  ceilingHeight: number;
  wallColor: string;
  furnitureColor: FurnitureColor;
}

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

  return {
    customDesign,
    setCustomDesign,
    setWallWidth,
    setCeilingHeight,
    setWallColor,
    setFurnitureColor,
  };
}
