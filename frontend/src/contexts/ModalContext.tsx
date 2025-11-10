"use client"

import { createContext, Dispatch, SetStateAction, useState, useContext } from "react";

export interface ModalContextType {
    currentModal: 'login' | 'register' | null,
    openModal: (modalType: 'login' | 'register') => void,
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default function ModalProvider ({ children }: { children: React.ReactNode }) {
    const [currentModal, setCurrentModal] = useState<'login' | 'register' | null>(null);

    function openModal(modalType: 'login' | 'register') {
        setCurrentModal(modalType)
    }

    function closeModal() {
        setCurrentModal(null);
    }

      return (
          <ModalContext.Provider value={{currentModal, openModal, closeModal}}>
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
  

