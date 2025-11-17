"use client";

import { notFound, useSearchParams } from "next/navigation";
import styles from "./ConfirmEmailComponent.module.css";
import { useEffect, useState } from "react";
import { ApiError, AuthService } from "@/api/generated";
import Link from "next/link";

export default function ConfirmEmailComponent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!userId || !token) {
      setStatus("error");
      return notFound();
    }
    const confirmEmail = async () => {
      try {
        const response = await AuthService.getApiAuthConfirmEmail(
          userId,
          token
        );
        if (response.emailConfirmed) {
          setStatus("success");
          setSuccessMessage(response.message);
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof ApiError
            ? error.body?.errors[0] || "Email confirmation failed"
            : "An unexpected error occurred"
        );
      }
    };

    confirmEmail();
  }, [token, userId]);

  if (status === "loading") {
    return (
      <div className={styles.emailConfirmationContainer}>
        <h2>Confirming your email...</h2>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.emailConfirmationContainer}>
        <h2>Confirmation failed. Link may be expired.</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.emailConfirmationContainer}>
      <h2>{successMessage}</h2>
      <Link href="/designer">Go to the design tool</Link>
    </div>
  );
}
