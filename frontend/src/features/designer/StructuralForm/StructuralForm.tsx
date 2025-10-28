import styles from "./StructuralForm.module.css";
import React, { useEffect, useState, useRef } from "react";

interface StructuralFormProps {
  wallWidth: number;
  setWallWidth: (value: number) => void;
  ceilingHeight: number;
  setCeilingHeight: (value: number) => void;
  wallColor: string;
  setWallColor: (value: string) => void;
}

export default function StructuralForm({
  wallWidth,
  setWallWidth,
  ceilingHeight,
  setCeilingHeight,
  wallColor,
  setWallColor,
}: StructuralFormProps) {
  // Define min and max values
  const MIN_WALL = 500;
  const MAX_WALL = 900;
  const MIN_CEILING = 200;
  const MAX_CEILING = 500;

  // Keep values within limits
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  // Local state to keep track of input values
  const [wallWidthInput, setWallWidthInput] = useState(wallWidth.toString());
  const [ceilingHeightInput, setCeilingHeightInput] = useState(ceilingHeight.toString());

  const wallWidthTimeout = useRef<NodeJS.Timeout | null>(null);
  const ceilingHeightTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setWallWidthInput(wallWidth.toString());
  }, [wallWidth]);

  useEffect(() => {
    setCeilingHeightInput(ceilingHeight.toString());
  }, [ceilingHeight]);

  const handleWallWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWallWidthInput(value);

    // Clear existing and set new timeout
    if (wallWidthTimeout.current) {
      clearTimeout(wallWidthTimeout.current);
    }
    
    wallWidthTimeout.current = setTimeout(() => {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        setWallWidth(clamp(parsed, MIN_WALL, MAX_WALL));
      }
    }, 600);
  };

  const handleCeilingHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCeilingHeightInput(value);

    // Clear existing and set new timeout
    if (ceilingHeightTimeout.current) {
      clearTimeout(ceilingHeightTimeout.current);
    }
    
    ceilingHeightTimeout.current = setTimeout(() => {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        setCeilingHeight(clamp(parsed, MIN_CEILING, MAX_CEILING));
      }
    }, 600);
  };

  const handleWallColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallColor(e.target.value);
  };

  useEffect(() => {
    return () => {
      if (wallWidthTimeout.current) clearTimeout(wallWidthTimeout.current);
      if (ceilingHeightTimeout.current) clearTimeout(ceilingHeightTimeout.current);
    };
  }, []);

  return (
    <form className={styles.structuralForm}>
      <div className={styles.formGroup}>
        <label htmlFor="wallWidth">Wall Width (cm):</label>
        <input
          id="wallWidth"
          type="number"
          min={MIN_WALL}
          max={MAX_WALL}
          value={wallWidthInput}
          onChange={handleWallWidthChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="ceilingHeight">Ceiling Height (cm):</label>
        <input
          id="ceilingHeight"
          type="number"
          min={MIN_CEILING}
          max={MAX_CEILING}
          value={ceilingHeightInput}
          onChange={handleCeilingHeightChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="wallColor">Wall Color:</label>
        <div className={styles.colorPickerContainer}>
          <input 
            id="wallColor"
            type="color"
            value={wallColor}
            onChange={handleWallColorChange}
            className={styles.colorInput}
          />
          <span className={styles.hexCode}>{wallColor}</span>
        </div>
      </div>
    </form>
  );
}