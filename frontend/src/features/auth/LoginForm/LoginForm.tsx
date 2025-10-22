"use client";

import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/api/generated";
import { redirect } from "next/navigation";

export default function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email")!.toString();
    const password = formData.get("password")!.toString();

    try {
      await login(email, password);
      // redirect('new');
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.body.errors[0]); // Or however you want to handle it
      } else {
        setError("An unexpected error occurred");
      }
    }
  }

  return (
    <>
      <h1 className={styles.title}>Log in</h1>
      {error && <p>{error}</p>}
      <form className={styles.loginForm} action={handleSubmit}>
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

        <button type="submit">Log in</button>
      </form>
    </>
  );
}
