"use client";

import { useModal } from "@/contexts/ModalContext";
import { useState } from "react";

export default function SaveDesignModal() {
  const [designName, setDesignName] = useState<string>("");
  const { modalCallbacks, closeModal } = useModal();

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
          if (modalCallbacks.saveDesignName && designName)
              modalCallbacks.saveDesignName(designName);
            closeModal()
        }}
      >
        Save design
      </button>
    </form>
  );
}
