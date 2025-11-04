"use client";

import { notFound, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { ApiError, AuthService } from "@/api/generated";
import Link from "next/link";

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState('');

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const emailToken = searchParams.get("token");

  useEffect(() => {
    if (!userId || !emailToken) {
      setStatus("error");
      return notFound();
    }
    const confirmEmail = async () => {
      try {
        const response = await AuthService.getApiAuthConfirmEmail(
          userId,
          emailToken
        );
        if (response.emailConfirmed) {
            setStatus("success");
            setSuccessMessage(response.message)
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
  }, [emailToken, userId]);

  if (status === "loading") {
    return (
      <div>
        <p>Confirming your email...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div>
        <p>Confirmation failed. Link may be expired.</p>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <p>{successMessage}</p>
      <Link href="/login">Go to Login</Link>
    </div>
  );
}
