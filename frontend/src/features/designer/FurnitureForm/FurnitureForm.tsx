import styles from "./FurnitureForm.module.css";
import React from "react";
import { useDebouncedNumericInput } from "../../designs/useDebouncedNumericInput";

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
}

export default function FurnitureForm({
  furnitureColor,
  setFurnitureColor,
  furnitureWidth,
  setFurnitureWidth,
  furnitureDepth,
  setFurnitureDepth,
  furnitureHeight,
  setFurnitureHeight
}: FurnitureFormProps) {
  const MIN_FURNITURE_DEPTH = 80;
  const MAX_FURNITURE_DEPTH = 200;
  const MIN_FURNITURE_WIDTH = 110;
  const MAX_FURNITURE_WIDTH = 500;
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
  const handleSofaColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFurnitureColor({
      ...furnitureColor,
      sofa: e.target.value,
    });
  };

  return (
    <form className={styles.furnitureForm}>
      <div className={styles.colorGroup}>
        <label>Sofa Color:</label>
        <div className={styles.colorPickerContainer}>
          <input
            type="color"
            value={furnitureColor.sofa}
            onChange={handleSofaColorChange}
            className={styles.colorInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="furnitureWidth">Sofa Width (cm):</label>
          <input
            id="furnitureWidth"
            type="number"
            min={MIN_FURNITURE_WIDTH}
            max={MAX_FURNITURE_WIDTH}
            value={furnitureWidthContrl.inputValue}
            onChange={furnitureWidthContrl.handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="furnitureDepth">Sofa Depth (cm):</label>
          <input
            id="furnitureDepth"
            type="number"
            min={MIN_FURNITURE_DEPTH}
            max={MAX_FURNITURE_DEPTH}
            value={furnitureDepthControl.inputValue}
            onChange={furnitureDepthControl.handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="furnitureHeight">Sofa Height (cm):</label>
          <input
            id="furnitureHeight"
            type="number"
            min={MIN_FURNITURE_HEIGHT}
            max={MAX_FURNITURE_HEIGHT}
            value={furnitureHeightControl.inputValue}
            onChange={furnitureHeightControl.handleChange}
            className={styles.input}
          />
        </div>
      </div>

      {/* Future furniture color pickers can be added here following the same pattern */}
    </form>
  );
}

export type { FurnitureColor };
