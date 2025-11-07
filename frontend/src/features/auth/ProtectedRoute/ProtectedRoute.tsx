"use client";

import { ApiError, AuthService } from "@/api/generated";
import { useAuth } from "@/contexts/AuthContext";
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
      console.log(user?.emailSent)
      const response = await AuthService.postApiAuthResendConfirmationEmail();
      setUser(response);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message || "Sending email failed"
          : "An unexpected error occurred"
      );
    } finally {
      setStatus(null);
    }
  }
  if (!user.emailSent && !user.emailConfirmed) {
    return (
      <>
        <p>Confirmation email not sent successfully.</p>
        <button onClick={handleClick}>
          {status == "loading" ? "Sending" : "Resend confirmation email"}
        </button>
        {(status == "error" && error) || errorMessage}
        {children}
      </>
    );
  }

  if (!user.emailConfirmed)
    return (
      <>
        <p>Registration successful! Please confirm your email</p>
        {children}
      </>
    );

  return <>{children}</>;
}
