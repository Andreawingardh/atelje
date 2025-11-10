import React from "react";
import styles from "./Button.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  buttonText,
  buttonIcon,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary" ? styles.primary : styles.secondary;

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