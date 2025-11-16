import React from "react";
import styles from "./AlertBanner.module.css";

export interface AlertBannerProps {
  message: string;
  variant?: "success" | "warning" | "error";
  children?: React.ReactNode;
}

export default function AlertBanner({ message, variant="warning", children }: AlertBannerProps) {

  const variantClass = {
    success: styles.success,
    warning: styles.warning,
    error: styles.error,
  }[variant];

  return (
    <section className={`${styles.base} ${variantClass}`}>
      <p className={styles.message}>
        {message}
        {children && <> {children}</>}
      </p>
    </section>
  );
}