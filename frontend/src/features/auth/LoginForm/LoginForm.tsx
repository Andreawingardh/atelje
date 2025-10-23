"use client";

import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/api/generated";
import { redirect, useRouter } from "next/navigation";

export default function LoginForm() {
  const { user, login, isLoading, setIsLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (user) {
    router.push("/new");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email")!.toString();
    const password = formData.get("password")!.toString();

    try {
      setIsLoading(true);
      await login(email, password);
      router.push("/new");
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.body.errors[0]);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className={styles.title}>Log in</h1>
      {error && <p>{error}</p>}
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label className={styles.loginLabel} htmlFor="email">
          Email
        </label>
        <input
          className={styles.loginInput}
          type="email"
          id="email"
          name="email"
          required
          key="email"
        />

        <label className={styles.loginLabel} htmlFor="password">
          Password
        </label>
        <input
          className={styles.loginInput}
          type="password"
          id="password"
          key="password"
          name="password"
          required
        />

        <button type="submit">{isLoading ? "Logging in..." : "Log In"}</button>
      </form>
    </>
  );
}
