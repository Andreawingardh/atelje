import React from 'react';
import styles from './CircleColorInput.module.css';

export interface CircleColorInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  imageSrc?: string; // Later we'll use it like: imageSrc="/3D-textures/birch-floor-parquet/albedo.jpg"
  color?: string;
  label: string;
  checked?: boolean;
}

export default function CircleColorInput({
  imageSrc,
  color,
  label,
  checked = false,
  className = '',
  ...props
}: CircleColorInputProps) {
  const backgroundStyle = imageSrc
    ? { backgroundImage: `url(${imageSrc})` }
    : { backgroundColor: color };

  return (
    <label className={styles.circleLabel}>
      <input
        type="radio"
        className={styles.visuallyHidden}
        checked={checked}
        {...props}
      />
      <span 
        className={`${styles.flooringCircle} ${checked ? styles.selected : ''} ${className}`}
        style={backgroundStyle}
        aria-label={label}
      />
    </label>
  );
}