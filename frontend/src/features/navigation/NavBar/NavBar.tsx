"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./NavBar.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/contexts/ModalContext";

export default function NavBar() {
  const { openModal } = useModal();
  const { user } = useAuth();
  const [status, setStatus] = useState<"unauthorized" | "authorized">(
    "unauthorized"
  );
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setStatus("authorized");
    } else {
      setStatus("unauthorized");
    }
  }, [setStatus, user]);

  function handleLoginClick() {
    openModal("login");
  }
  function handleRegisterClick() {
    openModal("register");
  }
  function handleProfileClick() {
    router.push("/dashboard");
  }

  return (
    <nav className={styles.navBarWrapper}>
      <h1>Ateljé</h1>
      {status == "unauthorized" && (
        <>
          <button onClick={handleLoginClick} name="loginButton">
            Sign in
          </button>
          <button onClick={handleRegisterClick} name="registerButton">
            Sign up
          </button>
        </>
      )}

      {status == "authorized" && (
        <button onClick={handleProfileClick} name="profileButton">
          Profile
        </button>
      )}
    </nav>
  );
}
