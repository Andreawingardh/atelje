import React from "react";
import styles from "./ProfileInitial.module.css";

export interface ProfileInitialProps {
  variant?: "snowdrop" | "terracotta" | "cornflower" | "darkVanilla";
  userDisplayName?: string | null;
}

export default function ProfileInitial({
    variant = "snowdrop",
    userDisplayName
  }: ProfileInitialProps) {
      const variantClass = {
          snowdrop: styles.snowdrop,
          terracotta: styles.terracotta,
          cornflower: styles.cornflower,
          darkVanilla: styles.darkVanilla,
        }[variant];

    const userInitial = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : "";
        
    return (
      <p
        className={`${styles.base} ${variantClass}`}
      >
        {userInitial}
      </p>
    );
  }