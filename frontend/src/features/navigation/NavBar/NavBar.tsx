"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./NavBar.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/contexts/ModalContext";
import Button from "@/elements/Button/Button";
import LogOutButton from "@/features/auth/LogOutButton/LogOutButton";

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

  function handleDesignerClick() {
    router.push("/designer");
  }

  function handleLogoClick() {
    router.push("/");
  }

  return (
    <nav className={styles.navBarWrapper}>
      <h1 onClick={handleLogoClick} className={styles.navLogo}>Ateljé</h1>
      <div className={styles.navButtons}>
        <Button onClick={handleDesignerClick} name="designerButton" variant="snowdrop" buttonText="Design tool"/>
      {status == "unauthorized" && (
        <>
          <Button onClick={handleLoginClick} name="loginButton" variant="snowdrop" buttonText="Sign in"/>
          <Button onClick={handleRegisterClick} name="registerButton" variant="snowdrop" buttonText="Sign up"/>
        </>
      )}

      {status == "authorized" && (
        <>
        <Button onClick={handleProfileClick} name="profileButton" variant="snowdrop" buttonText="Profile"/>
        <LogOutButton/>
        </>
      )}
      </div>
    </nav>
  );
}
