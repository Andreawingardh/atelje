'use client';
import React, { useState } from "react";
import styles from "./UnitInput.module.css";

export interface UnitInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number;
  units?: 'HEX' | 'cm';
}

export default function UnitInput({
  value = "",
  units,
  className = "",
  ...props
}: UnitInputProps) {
  const [currentInput, setCurrentInput] = useState(String(value));

  return (
    <div className={styles.unitInputWrapper} style={{width: units === 'HEX' ? '8.125rem' : '5.75rem'}}>
      {units === 'HEX' && <span className={styles.units}>#</span>}
      <input
        className={`${styles.unitInput} ${className}`}
        value={value}
        maxLength={units === 'HEX' ? 6 : 3}
        style={{ width: `${Math.max(String(value).length || 1, 1)}ch` }}
        {...props}
      />
      {units === 'cm' && <span className={styles.units}>{units}</span>}
    </div>
  );
}
