'use client';
import React from "react";
import styles from "./TextInput.module.css";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  variant?: "snowdrop" |"vanilla";
}

export default function TextInput({
  value = "",
  className = "",
  variant = "vanilla",
  ...props
}: TextInputProps) {
    const variantClass = {
        snowdrop: styles.snowdrop,
        vanilla: styles.vanilla,
      }[variant];
      
  return (
    <input
      className={`${styles.textInput} ${variantClass} ${className}`}
      value={value}
      {...props}
    />
  );
}