import React from "react";
import styles from "./CircleButton.module.css";

export interface CircleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  "snowdrop" | "terracotta" | "cornflower" | "rosie" | "vanilla";
  buttonIcon: string;
}

export default function CircleButton({
  variant = "vanilla",
  buttonIcon,
  disabled,
  className = "",
  ...props
}: CircleButtonProps) {
    const variantClass = {
        snowdrop: styles.snowdrop,
        terracotta: styles.terracotta,
        cornflower: styles.cornflower,
        rosie: styles.rosie,
        vanilla: styles.vanilla,
      }[variant];

  return (
    <button
      className={`${styles.base} ${variantClass} ${
        disabled ? styles.disabled : ""
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      <img src={buttonIcon} alt="icon" className={`${styles.buttonIcon} ${disabled ? styles.disabledIcon : ""}`} />
    </button>
  );
}