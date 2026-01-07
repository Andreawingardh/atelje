"use client";

import styles from "./HamburgerMenu.module.css";

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function HamburgerMenu({ isOpen, onToggle, children }: HamburgerMenuProps) {
  return (
    <>
      {/* Hamburger button */}
      <button className={styles.hamburger} onClick={onToggle}>
        <img src="/icons/hamburger-icon.svg" alt="Menu" width={30} height={20}  className={`${!isOpen ? styles.show : styles.hide}`}/>
        <img src="/icons/hamburger-exit-icon.svg" alt="Close" width={20} height={20} className={`${!isOpen ? styles.hide : styles.show}`}/>
      </button>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        {children}
      </div>
    </>
  );
}