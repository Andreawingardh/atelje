import styles from "./FurnitureForm.module.css";
import React, { useEffect, useState, useRef } from "react";

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
}

function useDebouncedNumericInput(
  value: number,
  setValue: (value: number) => void,
  min: number,
  max: number,
  delay: number = 600
) {
  const [inputValue, setInputValue] = useState(value.toString());
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const isTyping = useRef(false);

  // Clamp helper to keep values within limits
  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

  // Sync from props when not typing
  useEffect(() => {
    if (!isTyping.current) {
      setInputValue(value.toString());
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  // Handle change with debouncing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    isTyping.current = true;

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      const parsed = parseInt(newValue, 10);
      if (!isNaN(parsed)) {
        const clamped = clamp(parsed, min, max);
        setValue(clamped);
        setInputValue(clamped.toString());
      }
      isTyping.current = false;
    }, delay);
  };

  return { inputValue, handleChange };
}

export default function FurnitureForm({
  furnitureColor,
  setFurnitureColor,
  furnitureWidth,
  setFurnitureWidth,
  furnitureDepth,
  setFurnitureDepth,
}: FurnitureFormProps) {
  const MIN_FURNITURE_DEPTH = 80;
  const MAX_FURNITURE_DEPTH = 200;
  const MIN_FURNITURE_WIDTH = 100;
  const MAX_FURNITURE_WIDTH = 500;

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
      </div>

      {/* Future furniture color pickers can be added here following the same pattern */}
    </form>
  );
}

export type { FurnitureColor };
