'use client';
import React from "react";
import styles from "./TextInput.module.css";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  variant?: "vanilla" | "snowdrop";
}

export default function TextInput({
  value = "",
  className = "",
  variant = "vanilla",
  ...props
}: TextInputProps) {
  const variantClass =
    variant === "vanilla" ? styles.vanillaTextInput : styles.snowdropTextInput;
  
  return (
    <input
      className={`${styles.textInput} ${variantClass} ${className}`}
      value={value}
      {...props}
    />
  );
}