import styles from "./StructuralForm.module.css";
import React, { useState } from "react";
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
  const MIN_WALL = 300;
  const MAX_WALL = 900;
  const MIN_CEILING = 210;
  const MAX_CEILING = 500;

  const [showFormElement, setShowFormElement] = useState<
    "measurements" | "wall-color" | "flooring" | null
  >(null);

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
    <div className={styles.structuralForm}>
      <button
        onClick={() => {
          if (showFormElement == "measurements") {
            setShowFormElement(null);
          } else {
            setShowFormElement("measurements");
          }
        }}
      >
        Measurements
      </button>
      {showFormElement == "measurements" && (
        <>
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
        </>
      )}
      <button
        onClick={() => {
          if (showFormElement == "wall-color") {
            setShowFormElement(null);
          } else {
            setShowFormElement("wall-color");
          }
        }}
      >
        Wall color
      </button>
      {showFormElement == "wall-color" && (
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
      )}
      <button
        onClick={() => {
          if (showFormElement == "flooring") {
            setShowFormElement(null);
          } else {
            setShowFormElement("flooring");
          }
        }}
      >
        Flooring
      </button>
      {showFormElement == "flooring" && (
        <div className={styles.formGroup}>
        <label htmlFor="Flooring">Flooring</label>
        <div className={styles.colorPickerContainer}>
          <label htmlFor="birch-floor-parquet" className={styles.flooringLabel}>
          <input 
            id="birch-floor-parquet"
            type="radio"
            name="flooring"
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
            name="flooring"
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
            name="flooring"
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
            name="flooring"
            value={"walnut-floor-herringbone"}
            checked={flooring === "walnut-floor-herringbone"}
            onChange={handleFlooringChange}
            className={styles.flooringInput}
          />
          walnut herringbone
          </label>
        </div>
       </div>
      )}
    </div>
  );
}
