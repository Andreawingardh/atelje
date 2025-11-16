"use client";
import styles from "./ProtectedRoute.module.css";
import { ApiError, AuthService } from "@/api/generated";
import { useAuth } from "@/contexts/AuthContext";
import AlertBanner from "@/elements/AlertBanner/AlertBanner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<null | "loading" | "success" | "error">(
    null
  );
  const { user, setUser, isLoading, error } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }

    console.log("isLoading: " + isLoading);
  }, [user, isLoading, router]);

  useEffect(() => {
    if (error || errorMessage) {
      setStatus("error");
    }
  }, [error, errorMessage]);

  // Don't render children until we know auth status
  if (isLoading || !user) {
    return <p>Loading...</p>;
  }

  async function handleClick(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      console.log(user?.emailSent);
      const response = await AuthService.postApiAuthResendConfirmationEmail();
      setUser(response);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.body?.errors[0] || "Sending email failed"
          : "An unexpected error occurred"
      );
    } finally {
      setStatus(null);
    }
  }

  if (!user.emailConfirmed)
    return (
      <>
      <AlertBanner 
      message="Registration successful! Please confirm your email. If the email did not send properly, please click"
      variant="warning"
      >
        <button onClick={handleClick} className={styles.resendButton}>
          {status == "loading" ? "Sending..." : "here"}
        </button>
      </AlertBanner>
      {(status == "error") && (error || errorMessage)}
      {children}
    </>
    );

  return <>{children}</>;
}
