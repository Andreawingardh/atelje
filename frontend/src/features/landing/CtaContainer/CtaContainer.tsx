"use client";

import styles from "./CtaContainer.module.css";

type CTAContainerProps = {
  children: React.ReactNode;
};

export default function CTAContainer({ children }: CTAContainerProps) {
  return (
    <section className={styles.ctaContainer}>
      {children}
    </section>
  );
}