import styles from "./StructuralForm.module.css";
import React from "react";

interface StructuralFormProps {
  wallWidth: number;
  setWallWidth: (value: number) => void;
  ceilingHeight: number;
  setCeilingHeight: (value: number) => void;
}

export default function StructuralForm({
  wallWidth,
  setWallWidth,
  ceilingHeight,
  setCeilingHeight,
}: StructuralFormProps) {
  // Define min and max values
  const MIN_WALL = 500;
  const MAX_WALL = 900;
  const MIN_CEILING = 200;
  const MAX_CEILING = 500;

  // Keep values within limits
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  const handleWallWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (isNaN(raw)) return;
    setWallWidth(clamp(raw, MIN_WALL, MAX_WALL));
  };

  const handleCeilingHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (isNaN(raw)) return;
    setCeilingHeight(clamp(raw, MIN_CEILING, MAX_CEILING));
  };

  return (
    <form className={styles.structuralForm}>
      <div className={styles.formGroup}>
        <label htmlFor="wallWidth">Wall Width (cm):</label>
        <input
          id="wallWidth"
          type="number"
          min={MIN_WALL}
          max={MAX_WALL}
          value={wallWidth}
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
          value={ceilingHeight}
          onChange={handleCeilingHeightChange}
          className={styles.input}
        />
      </div>
    </form>
  );
}