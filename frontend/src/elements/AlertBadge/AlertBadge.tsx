import React from "react";
import styles from "./AlertBadge.module.css";

interface AlertBadgeProps {
    message: string;
    variant?: "success" | "warning" | "error";
    children?: React.ReactNode;
}

  export default function AlertBadge({ message, variant="warning", children }: AlertBadgeProps) {
  
    const variantClass = {
      success: styles.success,
      warning: styles.warning,
      error: styles.error,
    }[variant];
  
    return (
        <p className={`${styles.base} ${variantClass}`}>
          {message}
          {children && <> {children}</>}
        </p>
    );
  }