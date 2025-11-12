"use client";

import { useModal } from "@/contexts/ModalContext";
import { useState } from "react";

export default function SaveDesignModal() {
  const [designName, setDesignName] = useState<string>("");
  const { modalState, closeModal } = useModal();

  if (modalState.type != "save-design") return null;

  const { saveDesignName } = modalState.callbacks;

  return (
    <form>
      <input
        value={designName}
        onChange={(e) => setDesignName(e.target.value)}
        placeholder={designName || "Give your design a name"}
      />
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          if (saveDesignName && designName)
              saveDesignName(designName);
            closeModal()
        }}
      >
        Save design
      </button>
    </form>
  );
}
