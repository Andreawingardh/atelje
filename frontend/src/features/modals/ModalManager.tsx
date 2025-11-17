"use client";

import { ModalType, useModal } from "@/contexts/ModalContext";
import styles from "./ModalManager.module.css";
import LoginForm from "../auth/LoginForm/LoginForm";
import RegisterForm from "../auth/RegisterForm/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import ConfirmationCloseModal from "./ConfirmationCloseModal";
import SaveDesignModal from "./SaveDesignModal";
import SingleDesignView from "../designs/SingleDesignView/SingleDesignView";

export default function ModalManager() {
  const { modalState, closeModal } = useModal();
  const { user } = useAuth();

  useEffect(() => {
    if ((modalState.type == "login" || modalState.type == "register") && user) {
      closeModal();
    }
  }, [user, closeModal, modalState.type]);

  if (modalState.type == null) return null;

  const modalMap: Record<ModalType, React.ReactNode> = {
    login: <LoginForm />,
    register: <RegisterForm />,
    "confirmation-close": <ConfirmationCloseModal />,
    "save-design": <SaveDesignModal />,
    "single-design-view": <SingleDesignView />,
  };

  return (
    <div onClick={closeModal} className={styles.backdrop}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalContent}>
        {modalMap[modalState.type]}
      </div>
    </div>
  );
}
