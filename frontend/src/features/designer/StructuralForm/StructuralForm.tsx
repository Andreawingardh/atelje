import styles from "./StructuralForm.module.css";
import React, { useState } from "react";
import { useDebouncedNumericInput } from "../../designs/useDebouncedNumericInput";
import UnitInput from "@/elements/UnitInput/UnitInput";
import CircleColorInput from "@/elements/CircleColorInput/CircleColorInput";

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
      <div className={showFormElement == "measurements" ? styles.openFormGroup : ""}>
      <button
        className={styles.structuralFormButton}
        onClick={() => {
          if (showFormElement == "measurements") {
            setShowFormElement(null);
          } else {
            setShowFormElement("measurements");
          }
        }}
      >
        <img src="/icons/rouler-icon.svg" alt="Measurements Icon" className={styles.buttonIcon} />
      </button>
      {showFormElement == "measurements" && (
        <>
          <label htmlFor="ceilingHeight">Ceiling height</label>
          <UnitInput
            id="ceilingHeight"
            type="number"
            min={MIN_CEILING}
            max={MAX_CEILING}
            units="cm"
            value={ceilingHeightControl.inputValue}
            onChange={ceilingHeightControl.handleChange}
            className={styles.input}
          />
          <label htmlFor="wallWidth">Wall width</label>
          <UnitInput
            id="wallWidth"
            type="number"
            min={MIN_WALL}
            max={MAX_WALL}
            units="cm"
            value={wallWidthControl.inputValue}
            onChange={wallWidthControl.handleChange}
            className={styles.input}
          />
        </>
      )}
      </div>
      <div className={showFormElement == "wall-color" ? styles.openFormGroup : ""}>
      <button
      className={styles.structuralFormButton}
        onClick={() => {
          if (showFormElement == "wall-color") {
            setShowFormElement(null);
          } else {
            setShowFormElement("wall-color");
          }
        }}
      >
        <img src="/icons/walls-icon.svg" alt="Wall Color Icon" className={styles.buttonIcon} />
      </button>
      {showFormElement == "wall-color" && (
        <>
          <label htmlFor="wallColor" className={styles.visuallyHiddenLabel}>Wall color</label>
            <input
              id="wallColor"
              type="color"
              value={wallColor}
              onChange={handleWallColorChange}
              className={styles.colorInput}
            />
            <span className={styles.hexCode}>{wallColor}</span>
        </>
      )}
      </div>
      <div className={showFormElement == "flooring" ? styles.openFormGroup : ""}>
      <button
      className={styles.structuralFormButton}
        onClick={() => {
          if (showFormElement == "flooring") {
            setShowFormElement(null);
          } else {
            setShowFormElement("flooring");
          }
        }}
      >
        <img src="/icons/flooring-icon.svg" alt="Flooring Icon" className={styles.buttonIcon} />
      </button>
      {showFormElement == "flooring" && (
        <>
        <label htmlFor="Flooring" className={styles.visuallyHiddenLabel}>Flooring</label>
        <div className={styles.colorPickerContainer}>
          <CircleColorInput
            id="birch-floor-parquet"
            label="birch parquet"
            imageSrc="/3D-textures/birch-floor-parquet/albedo.jpg"
            name="flooring"
            value={"birch-floor-parquet"}
            checked={flooring === "birch-floor-parquet"}
            onChange={handleFlooringChange}
            className={styles.flooringInput}
          />
          <CircleColorInput 
            id="birch-floor-herringbone"
            label="birch herringbone"
            imageSrc="/3D-textures/birch-floor-herringbone/albedo.jpg"
            name="flooring"
            value={"birch-floor-herringbone"}
            checked={flooring === "birch-floor-herringbone"}
            onChange={handleFlooringChange}
            className={styles.flooringInput}
          />
          <CircleColorInput 
            id="walnut-floor-parquet"
            label="walnut parquet"
            imageSrc="/3D-textures/walnut-floor-parquet/albedo.jpg"
            name="flooring"
            value={"walnut-floor-parquet"}
            checked={flooring === "walnut-floor-parquet"}
            onChange={handleFlooringChange}
            className={styles.flooringInput}
          />
          <CircleColorInput 
            id="walnut-floor-herringbone"
            label="walnut herringbone"
            imageSrc="/3D-textures/walnut-floor-herringbone/albedo.jpg"
            name="flooring"
            value={"walnut-floor-herringbone"}
            checked={flooring === "walnut-floor-herringbone"}
            onChange={handleFlooringChange}
            className={styles.flooringInput}
          />
        </div>
        </>
      )}
      </div>
    </div>
  );
}
