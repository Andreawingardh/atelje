import React from "react";
import styles from "./WarningBanner.module.css";

export interface WarningBannerProps {
  message: string;
  children?: React.ReactNode;
}

export default function WarningBanner({ message, children }: WarningBannerProps) {
  return (
    <section className={styles.warningBanner}>
      <p className={styles.message}>
        {message}
        {children && <> {children}</>}
      </p>
    </section>
  );
}