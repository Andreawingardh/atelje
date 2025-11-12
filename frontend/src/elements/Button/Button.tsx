import React from "react";
import styles from "./Button.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "snowdrop" | "terracotta" | "cornflower" | "rosie";
  buttonText?: string;
  buttonIcon?: React.ReactNode;
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
      }[variant];
      
  return (
    <button
      className={`${styles.base} ${variantClass} ${disabled ? styles.disabled : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {buttonIcon && <span className={styles.icon}>{buttonIcon}</span>}
      {buttonText}
    </button>
  );
}