"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import UserDesigns from "@/features/user/UserDesigns";
import UserInfo from "@/features/user/UserInfo";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  return (
    <>
      <ProtectedRoute>
      <section className={styles.content}>
          <UserDesigns />
          <UserInfo />
      </section>
      </ProtectedRoute>
    </>
  );
}
  