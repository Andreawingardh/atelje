"use client";

import {
  createContext,
  useState,
  useContext,
} from "react";

export type ModalType = 'login' | 'register';


export interface ModalContextType {
  currentModal: ModalType | null;
  openModal: (modalType: ModalType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentModal, setCurrentModal] = useState<ModalType | null>(
    null
  );

  function openModal(modalType: ModalType) {
    setCurrentModal(modalType);
  }

  function closeModal() {
    setCurrentModal(null);
  }

  return (
    <ModalContext.Provider value={{ currentModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within Modal Context");
  }
  return context;
}
