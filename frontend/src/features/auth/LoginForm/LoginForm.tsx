"use client";

import React, { useEffect } from "react";
import styles from "./LoginForm.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { user, login, isLoading, error} = useAuth();
  const router = useRouter();

useEffect(() => {
  if (user) {
    router.push("/designer");
  }
}, [user, router]);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email")!.toString();
    const password = formData.get("password")!.toString();

    await login(email, password);
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
          autoComplete="email"
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
          autoComplete="current-password"
          required
        />

        <button type="submit">{isLoading ? "Logging in..." : "Log In"}</button>
      </form>
    </>
  );
}
