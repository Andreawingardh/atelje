"use client";

import { useModal } from "@/contexts/ModalContext";
import styles from "./ModalManager.module.css";
import LoginForm from "../auth/LoginForm/LoginForm";
import RegisterForm from "../auth/RegisterForm/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function ModalManager() {
    const { currentModal, closeModal } = useModal();
    const { user } = useAuth();

    useEffect(() => {
        if ((currentModal == 'login' || currentModal == 'register') && user)
        {
            closeModal();
        }
    }, [user, closeModal, currentModal])

  if (currentModal == null) return null;


    const modalMap = {
        'login': <LoginForm />,
        'register': <RegisterForm />
    }

  return (
    <div onClick={closeModal} className={styles.backdrop}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalContent}>
        {modalMap[currentModal]}
      </div>
    </div>
  );
}
