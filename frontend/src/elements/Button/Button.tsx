import React from "react";
import styles from "./Button.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "snowdrop" | "terracotta" | "cornflower" | "rosie" | "darkVanilla";
  buttonText?: string;
  buttonIcon?: string;
}

export default function Button({
  variant = "snowdrop",
  buttonText,
  buttonIcon,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
    const variantClass = {
        snowdrop: styles.snowdrop,
        terracotta: styles.terracotta,
        cornflower: styles.cornflower,
        rosie: styles.rosie,
        darkVanilla: styles.darkVanilla,
      }[variant];
      
  return (
    <button
      className={`${styles.base} ${variantClass} ${disabled ? styles.disabled : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {buttonText}
      {buttonIcon && <img className={styles.icon} src={buttonIcon}/>}
    </button>
  );
}