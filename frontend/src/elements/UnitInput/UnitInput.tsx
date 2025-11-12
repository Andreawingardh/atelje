'use client';
import React, { useState } from "react";
import styles from "./UnitInput.module.css";

export interface UnitInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  units?: 'HEX' | 'cm';
}

export default function UnitInput({
  value = "",
  units,
  className = "",
  ...props
}: UnitInputProps) {
  const [currentInput, setCurrentInput] = useState(value);

  return (
    <div className={styles.unitInputWrapper} style={{width: units === 'HEX' ? '8.125rem' : '6.75rem'}}>
      {units === 'HEX' && <span className={styles.units}>#</span>}
      <input
        className={`${styles.unitInput} ${className}`}
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        maxLength={units === 'HEX' ? 6 : 3}
        style={{ width: `${Math.max(currentInput.length || 1, 1)}ch` }}
        {...props}
      />
      {units === 'cm' && <span className={styles.units}>{units}</span>}
    </div>
  );
}
