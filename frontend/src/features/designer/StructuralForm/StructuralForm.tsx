import styles from "./StructuralForm.module.css";
import React from "react";
import { useDebouncedNumericInput } from "../../designs/useDebouncedNumericInput";

interface StructuralFormProps {
  wallWidth: number;
  setWallWidth: (value: number) => void;
  ceilingHeight: number;
  setCeilingHeight: (value: number) => void;
  wallColor: string;
  setWallColor: (value: string) => void;
  flooring: string;
  setFlooring: (value: string) => void;
}

export default function StructuralForm({
  wallWidth,
  setWallWidth,
  ceilingHeight,
  setCeilingHeight,
  wallColor,
  setWallColor,
  flooring,
  setFlooring,
}: StructuralFormProps) {
  // Define min and max values
  const MIN_WALL = 250;
  const MAX_WALL = 1000;
  const MIN_CEILING = 210;
  const MAX_CEILING = 500;

  const wallWidthControl = useDebouncedNumericInput(
    wallWidth,
    setWallWidth,
    MIN_WALL,
    MAX_WALL
  );

  const ceilingHeightControl = useDebouncedNumericInput(
    ceilingHeight,
    setCeilingHeight,
    MIN_CEILING,
    MAX_CEILING
  );

  const handleWallColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallColor(e.target.value);
  };

  const handleFlooringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlooring(e.target.value);
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
          value={wallWidthControl.inputValue}
          onChange={wallWidthControl.handleChange}
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
          value={ceilingHeightControl.inputValue}
          onChange={ceilingHeightControl.handleChange}
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
        <div className={styles.formGroup}>
        <label htmlFor="Flooring">Flooring</label>
        <div className={styles.colorPickerContainer}>
          <label htmlFor="birch-floor-parquet" className={styles.flooringLabel}>
          <input 
            id="birch-floor-parquet"
            type="radio"
            value={"birch-floor-parquet"}
            checked={flooring === "birch-floor-parquet"}
            onChange={handleFlooringChange}
            className={styles.flooringInput}
          />
          birch parquet
          </label>
          <label htmlFor="birch-floor-herringbone" className={styles.flooringLabel}>
          <input 
            id="birch-floor-herringbone"
            type="radio"
            value={"birch-floor-herringbone"}
            checked={flooring === "birch-floor-herringbone"}
            onChange={handleFlooringChange}
            className={styles.flooringInput}
          />
          birch herringbone
          </label>
          <label htmlFor="walnut-floor-parquet" className={styles.flooringLabel}>
          <input 
            id="walnut-floor-parquet"
            type="radio"
            value={"walnut-floor-parquet"}
            checked={flooring === "walnut-floor-parquet"}
            onChange={handleFlooringChange}
            className={styles.flooringInput}
          />
          walnut parquet
          </label>
          <label htmlFor="walnut-floor-herringbone" className={styles.flooringLabel}>
          <input 
            id="walnut-floor-herringbone"
            type="radio"
            value={"walnut-floor-herringbone"}
            checked={flooring === "walnut-floor-herringbone"}
            onChange={handleFlooringChange}
            className={styles.flooringInput}
          />
          walnut herringbone
          </label>
        </div>
      </div>
    </form>
  );
}