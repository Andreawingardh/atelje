"use client";

import React, { useState } from "react";
import styles from "./RegisterForm.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, RegisterDto } from "@/api/generated";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const { user, register, isLoading, setIsLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  router.push("/new");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email")!.toString();
    const userName = formData.get("userName")!.toString();
    const password = formData.get("password")!.toString();
    const displayName = formData.get("displayName")!.toString() || null;

    const user: RegisterDto = {
      email: email,
      userName: userName,
      password: password,
      displayName: displayName,
    };

    try {
      setIsLoading(true);
      console.log("After setIsLoading(true), isLoading is:", isLoading);
      await register(user);
      router.push("/new");
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.body.errors[0]);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      console.log("In finally block");
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className={styles.title}>Sign up</h1>
      {error && <p>{error}</p>}
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <label className={styles.registerLabel} htmlFor="username">
          Username
        </label>
        <input
          className={styles.registerInput}
          type="text"
          id="userName"
          name="userName"
          key="userName"
          required
        />

        <label className={styles.registerLabel} htmlFor="username">
          Display name
        </label>
        <input
          className={styles.registerInput}
          type="text"
          id="displayName"
          name="displayName"
          key="displayName"
        />

        <label className={styles.registerLabel} htmlFor="username">
          Email
        </label>
        <input
          className={styles.registerInput}
          type="email"
          id="email"
          name="email"
          key="email"
          required
        />

        <label className={styles.registerLabel} htmlFor="password">
          Password
        </label>
        <input
          className={styles.registerInput}
          type="password"
          id="password"
          name="password"
          key="password"
          required
        />

        <button type="submit">{isLoading ? "Signing up..." : "Sign up"}</button>
      </form>
    </>
  );
}
