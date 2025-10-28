import styles from "./FurnitureForm.module.css";
import React from "react";

interface FurnitureColor {
  sofa: string;
  // We can add future furnitures here
}

interface FurnitureFormProps {
  furnitureColor: FurnitureColor;
  setFurnitureColor: (colors: FurnitureColor) => void;
}

export default function FurnitureForm({
  furnitureColor,
  setFurnitureColor,
}: FurnitureFormProps) {
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
      </div>

      {/* Future furniture color pickers can be added here following the same pattern */}
    </form>
  );
}

export type { FurnitureColor };