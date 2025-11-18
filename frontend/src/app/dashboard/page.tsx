"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import UserDesigns from "@/features/user/UserDesigns";
import UserInfo from "@/features/user/UserInfo";
import { useModal } from "@/contexts/ModalContext";
import styles from "./page.module.css";
import CircleButton from "@/elements/CircleButton/CircleButton";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { openModal } = useModal();
  return (
    <>
      <ProtectedRoute>
      <section className={styles.content}>
          <UserDesigns />
          <UserInfo />
          <CircleButton
            buttonIcon="./icons/waving-blue-icon.svg"
            className={styles.aboutUsButton}
            onClick={() => openModal("about-us")}
          />
      </section>
      </ProtectedRoute>
    </>
  );
}
  