"use client";

import { DesignDto } from "@/api/generated";
import { createContext, useState, useContext } from "react";

export type ModalType = keyof ModalConfig;

// export type ModalType =
//   | "login"
//   | "register"
//   | "confirmation-close"
//   | "save-design"
//   | "single-design-view";

type ModalConfig = {
  login: {
    data: never;
    callbacks: never;
  };
  register: {
    data: never;
    callbacks: never;
  };
  "save-design": {
    data: never; // No data needed
    callbacks: {
      saveDesignName: (name: string) => void;
    };
  };
  "single-design-view": {
    data: {
      design: DesignDto;
    };
    callbacks: {
      onDelete?: (id: number) => void;
      saveDesignName?: (designId: number, name: string) => void;
    };
  };
  "confirmation-close": {
    data: never;
    callbacks: {
      onConfirm: () => void;
      onCancel: () => void;
    };
  };
};

// type ModalRequiresConfig<T extends ModalType> =
//   ModalConfig[T]["data"] extends never
//     ? ModalConfig[T]["callbacks"] extends never
//       ? false // Both are never = no config needed
//       : true // Has callbacks = needs config
//     : true; // Has data = needs config

export interface ModalContextType {
  modalState: ModalState;
  openModal: <T extends keyof ModalConfig>(
    type: T,
    config?: {
      data?: ModalConfig[T]['data'];
      callbacks?: ModalConfig[T]['callbacks'];
    }
  ) => void;
  closeModal: () => void;
}


type ModalState =
  {
    [K in keyof ModalConfig]: {
      type: K;
      data: ModalConfig[K]["data"];
      callbacks: ModalConfig[K]["callbacks"];
    };
  }[keyof ModalConfig]
  | { type: null };

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
  });

const openModal: ModalContextType["openModal"] = (type, config) => {
  setModalState({
    type,
    data: config?.data,
    callbacks: config?.callbacks,
  } as ModalState);
};

function closeModal() {
  setModalState({ type: null });
}

  return (
    <ModalContext.Provider
      value={{
        modalState,
        openModal,
        closeModal
      }}
    >
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
