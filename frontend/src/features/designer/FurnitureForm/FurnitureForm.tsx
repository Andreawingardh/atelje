import styles from "./FurnitureForm.module.css";
import React, { useState, useEffect } from "react";
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

  const [hexInputValue, setHexInputValue] = useState(furnitureColor.sofa.replace('#', ''));

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
    setHexInputValue(furnitureColor.sofa.replace('#', ''));
  }, [furnitureColor.sofa]);

  // Debounce the hex input to update sofaColor
  useEffect(() => {
    const timer = setTimeout(() => {
      let value = hexInputValue.replace(/[^0-9A-Fa-f]/g, '');
      
      if (value.length === 3) {
        // Convert 3-char hex to 6-char
        value = value.split('').map(char => char + char).join('');
      }
      
      if (value.length === 6) {
        setFurnitureColor({
          ...furnitureColor,
          sofa: `#${value}`,
        });
      }
    }, 800); // 800ms delay

    return () => clearTimeout(timer);
  }, [hexInputValue]);

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

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
    if (value.length <= 6) {
      setHexInputValue(value);
    }
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
        <UnitInput
          value={hexInputValue}
          units="HEX"
          onChange={handleHexInputChange}
          placeholder="000000"
        />
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
