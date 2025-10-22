import styles from "./layout.module.css";

export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <section className={styles.modal}>
        {children}
      </section>
    );
  }
  