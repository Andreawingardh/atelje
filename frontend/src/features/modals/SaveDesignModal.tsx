"use client";

import { useModal } from "@/contexts/ModalContext";
import { useState } from "react";
import Button from "@/elements/Button/Button";
import TextInput from "@/elements/TextInput/TextInput";
import styles from "./SaveDesignModule.module.css";

export default function SaveDesignModal() {
  const [designName, setDesignName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { modalState, closeModal } = useModal();

  if (modalState.type != "save-design") return null;

  const { saveDesignName } = modalState.callbacks;

  function validateDesignName(value: string): string {
    if (value.length >= 25) {
      return "Display name must be less than 25 characters";
    }

    return "";
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const error = validateDesignName(e.target.value);
    if (error) {
      setErrorMessage(error);
    }
    if (!error) {
      setErrorMessage("")
    }
    setDesignName(e.target.value);
  }

  return (
    <form className={styles.saveDesignForm}>
      <TextInput
        variant="vanilla"
        value={designName}
        onChange={handleOnChange}
        placeholder={designName || "Name your design..."}
      />
      {errorMessage && <p>{errorMessage}</p>}
      <Button
        type="submit"
        variant="cornflower"
        onClick={(e) => {
          e.preventDefault();
          if (saveDesignName && designName) saveDesignName(designName);
          closeModal();
        }}
        buttonText="Save"
        disabled={errorMessage.length > 0}
      />
    </form>
  );
}
