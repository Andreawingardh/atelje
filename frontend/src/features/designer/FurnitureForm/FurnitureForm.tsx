import styles from "./FurnitureForm.module.css";
import React, { useEffect } from "react";
import { useDebouncedNumericInput } from "../../designs/useDebouncedNumericInput";
import UnitInput from "@/elements/UnitInput/UnitInput";

interface FurnitureColor {
  sofa: string;
  // We can add future furnitures here
}

interface FurnitureFormProps {
  furnitureColor: FurnitureColor;
  setFurnitureColor: (colors: FurnitureColor) => void;
  furnitureWidth: number;
  setFurnitureWidth: (value: number) => void;
  furnitureDepth: number;
  setFurnitureDepth: (value: number) => void;
  furnitureHeight: number;
  setFurnitureHeight: (value: number) => void;
  wallWidth: number;
}

export default function FurnitureForm({
  furnitureColor,
  setFurnitureColor,
  furnitureWidth,
  setFurnitureWidth,
  furnitureDepth,
  setFurnitureDepth,
  furnitureHeight,
  setFurnitureHeight,
  wallWidth
}: FurnitureFormProps) {
  const MIN_FURNITURE_DEPTH = 80;
  const MAX_FURNITURE_DEPTH = 200;
  const MIN_FURNITURE_WIDTH = 110;
  const MAX_FURNITURE_WIDTH = wallWidth;
  const MIN_FURNITURE_HEIGHT = 70;
  const MAX_FURNITURE_HEIGHT = 100;

  const furnitureDepthControl = useDebouncedNumericInput(
    furnitureDepth,
    setFurnitureDepth,
    MIN_FURNITURE_DEPTH,
    MAX_FURNITURE_DEPTH
  );

  const furnitureWidthContrl = useDebouncedNumericInput(
    furnitureWidth,
    setFurnitureWidth,
    MIN_FURNITURE_WIDTH,
    MAX_FURNITURE_WIDTH
  );
  const furnitureHeightControl = useDebouncedNumericInput(
    furnitureHeight,
    setFurnitureHeight,
    MIN_FURNITURE_HEIGHT,
    MAX_FURNITURE_HEIGHT
  );
  useEffect(() => {
    if (furnitureWidth > wallWidth) {
      setFurnitureWidth(wallWidth);
    }
  }, [wallWidth]);

  const handleSofaColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFurnitureColor({
      ...furnitureColor,
      sofa: e.target.value,
    });
  };


  return (
    <form className={styles.furnitureForm}>
      <div className={styles.colorGroup}>
        <label className={styles.colorLabel}>Color</label>
        <div className={styles.colorPickerContainer}>
          <div 
            className={styles.colorInputWrapper}
            onClick={() => document.getElementById('sofaColor')?.click()}
          >
            <div 
              className={styles.colorInputDisplay}
              style={{ backgroundColor: furnitureColor.sofa }}
            />
          </div>
          <input
            id="sofaColor"
            type="color"
            value={furnitureColor.sofa}
            onChange={handleSofaColorChange}
            className={styles.colorInput}
          />
        </div>
      </div>
        <hr className={styles.formDivider} />
        <div className={styles.measurmentsGroup}>
          <h3>Measurments</h3>
          <label htmlFor="furnitureWidth">Width
            <UnitInput
              id="furnitureWidth"
              type="number"
              units="cm"
              min={MIN_FURNITURE_WIDTH}
              max={MAX_FURNITURE_WIDTH}
              value={furnitureWidthContrl.inputValue}
              onChange={furnitureWidthContrl.handleChange}
              className={styles.input}
            />
          </label>
          <label htmlFor="furnitureDepth">Depth
            <UnitInput
              id="furnitureDepth"
              type="number"
              units="cm"
              min={MIN_FURNITURE_DEPTH}
              max={MAX_FURNITURE_DEPTH}
              value={furnitureDepthControl.inputValue}
              onChange={furnitureDepthControl.handleChange}
              className={styles.input}
            />
          </label>
          <label htmlFor="furnitureHeight">Height
            <UnitInput
              id="furnitureHeight"
              type="number"
              units="cm"
              min={MIN_FURNITURE_HEIGHT}
              max={MAX_FURNITURE_HEIGHT}
              value={furnitureHeightControl.inputValue}
              onChange={furnitureHeightControl.handleChange}
              className={styles.input}
            />
          </label>
        </div>
    </form>
  );
}

export type { FurnitureColor };
