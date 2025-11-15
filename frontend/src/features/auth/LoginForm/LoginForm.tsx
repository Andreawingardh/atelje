"use client";

import React, { useEffect } from "react";
import styles from "./LoginForm.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useModal } from "@/contexts/ModalContext";
import Button from "@/elements/Button/Button";
import TextInput from "@/elements/TextInput/TextInput";

export default function LoginForm() {
  const { user, login, isLoading, error } = useAuth();
  const { openModal } = useModal();
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
      <h1 className={styles.title}>Sign in</h1>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label className={styles.loginLabel} htmlFor="email">
            Email
          <TextInput
            variant="vanilla"
            type="email"
            id="email"
            name="email"
            required
            key="email"
            autoComplete="email"
          />
        </label>

        <label className={styles.loginLabel} htmlFor="password">
            Password
          <TextInput
            variant="vanilla"
            type="password"
            id="password"
            key="password"
            name="password"
            autoComplete="current-password"
            required
          />
          <p className={`${ error ? styles.error : styles.noError}`}>
          {error && (
            <>
            {error}
            </>
          )}
        </p>
        </label>
        <Button type="submit" variant="cornflower" buttonText={isLoading ? "Signing in..." : "Sign in"}/>
        <button className={styles.signUpButton} onClick={() => openModal("register")}>Do not have an account? Sign up!</button>
      </form>
    </>
  );
}
