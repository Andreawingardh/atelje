"use client";

import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

export type ModalType = 'login' | 'register' | 'confirmation-close';


export interface ModalContextType {
  currentModal: ModalType | null;
  openModal: (modalType: ModalType) => void;
  closeModal: () => void;
  modalCallbacks: { onConfirm: (() => void) | null, onCancel: (() => void) | null },
  setModalCallbacks: Dispatch<SetStateAction<{ onConfirm: (() => void) | null, onCancel: (() => void) | null }>>
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
const [modalCallbacks, setModalCallbacks] = useState<{onConfirm: (() => void) | null, onCancel: (() => void) | null}>({ onConfirm: null, onCancel: null });

  function openModal(modalType: ModalType) {
    setCurrentModal(modalType);
  }

  function closeModal() {
    setCurrentModal(null);
  }

  return (
    <ModalContext.Provider value={{ currentModal, openModal, closeModal, modalCallbacks, setModalCallbacks }}>
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
