/* <!-- From Uiverse.io by dovatgabriel -->  */
import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className={styles.threeBody}>
      <div className={styles.threeBody__dot}></div>
      <div className={styles.threeBody__dot}></div>
      <div className={styles.threeBody__dot}></div>
    </div>
  );
}
