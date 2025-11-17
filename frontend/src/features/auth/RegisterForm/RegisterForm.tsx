"use client";

import React, { useState, useEffect } from "react";
import styles from "./RegisterForm.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterDto } from "@/api/generated";
import { useRouter } from "next/navigation";
import { useModal } from "@/contexts/ModalContext";
import Button from "@/elements/Button/Button";
import TextInput from "@/elements/TextInput/TextInput";

type FieldData = {
  value: string;
  touched: boolean;
  error: string;
};

type FieldState = {
  email: FieldData;
  userName: FieldData;
  displayName: FieldData;
  confirmPassword: FieldData;
  password: Omit<FieldData, "error">; // Has value & touched, but NOT error
};

type PasswordRequirements = {
  hasLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
};

function PasswordRequirements({
  requirements,
}: {
  requirements: PasswordRequirements;
}) {
  const requirementsList: { key: keyof PasswordRequirements; label: string }[] =
    [
      { key: "hasLength", label: "At least 8 characters" },
      { key: "hasUppercase", label: "At least one uppercase letter" },
      { key: "hasLowercase", label: "At least one lowercase letter" },
      { key: "hasDigit", label: "At least one digit" },
      { key: "hasSpecialChar", label: "At least one special character" },
      // etc...
    ];
  return (
    <div className={styles.passwordRequirements}>
      {requirementsList.map((req) => (
        <div key={req.key} className={styles.passwordRequirement}>
          <img
            src={
              requirements[req.key]
                ? "/icons/success-icon.svg"
                : "/icons/error-red-icon.svg"
            }
            alt={requirements[req.key] ? "fulfilled" : "not fulfilled"}
          />
          <p>{req.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function RegisterForm() {
  const { register, isLoading, error } = useAuth();
  const { openModal } = useModal();

  const [fieldState, setFieldState] = useState<FieldState>({
    email: { value: "", touched: false, error: "" },
    userName: { value: "", touched: false, error: "" },
    displayName: { value: "", touched: false, error: "" },
    password: { value: "", touched: false },
    confirmPassword: { value: "", touched: false, error: "" },
  });

  const [passwordRequirements, setPasswordRequirements] =
    useState<PasswordRequirements>({
      hasLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasDigit: false,
      hasSpecialChar: false,
    });

  function validateUserName(value: string): string {
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }

    if (value.length > 25) {
      return "Username must be less than 25 characters";
    }

    const regex = /^[a-zA-Z0-9-_.]{3,25}$/;
    if (!regex.test(value)) {
      return "Username can only contain letters, numbers, hyphens, underscores, and periods";
    }

    return "";
  }

  function validatePassword(value: string): PasswordRequirements {
    return {
      hasLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasLowercase: /[a-z]/.test(value),
      hasDigit: /[0-9]/.test(value),
      hasSpecialChar: /[^a-zA-Z0-9]/.test(value),
    };
  }

  function validateDisplayName(value: string): string {
    if (value.length === 0) {
      return "";
    }
    if (value.length >= 50) {
      return "Display name must be less than 50 characters";
    }

    return "";
  }

  function validateEmail(value: string): string {
    if (value.length === 0) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }

    const testEmailRegex = /^test@test/i;
    if (testEmailRegex.test(value)) {
      return "Please use a real email address";
    }

    return "";
  }

  function validateConfirmPassword(
    password: string,
    confirmPassword: string
  ): string {
    if (confirmPassword.length === 0) {
      return "Please repeat your password";
    }

    if (confirmPassword !== password) {
      return "The passwords don't match";
    }

    return "";
  }

  const handleFieldChange =
    (fieldName: keyof FieldState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldState((prev) => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], value: e.target.value },
      }));
    };

  const handleFieldBlur =
    (fieldName: keyof FieldState, validationFn: (value: string) => string) =>
    () => {
      // Hint: You'll need to access the current username value from fieldState
      const result = fieldState[fieldName].value;
      // Then call validateUserName() with it
      const error = validationFn(result);

      setFieldState((prev) => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], touched: true, error: error },
      }));
    };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;

    const result = validatePassword(newPassword);

    setFieldState((prev) => ({
      ...prev,
      password: { ...prev.password, value: newPassword },
      confirmPassword: prev.confirmPassword.touched
        ? {
            ...prev.confirmPassword,
            error: validateConfirmPassword(
              newPassword,
              prev.confirmPassword.value
            ),
          }
        : prev.confirmPassword,
    }));

    setPasswordRequirements(result);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const confirmPassword = e.target.value;

    setFieldState((prev) => ({
      ...prev,
      confirmPassword: {
        ...prev.confirmPassword,
        value: confirmPassword,
        error: prev.confirmPassword.touched
          ? validateConfirmPassword(prev.password.value, confirmPassword)
          : "",
      },
    }));
  };

  const handleConfirmPasswordBlur = () => {
    const confirmPassword = fieldState.confirmPassword.value;

    const error = validateConfirmPassword(
      fieldState.password.value,
      confirmPassword
    );

    setFieldState((prev) => ({
      ...prev,
      confirmPassword: { ...prev.confirmPassword, touched: true, error: error },
    }));
  };

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

    await register(user);
  }

  function isFormValid() {
    const allPasswordReqsMet = Object.values(passwordRequirements).every(
      (req) => req === true
    );
    const noErrors =
      !fieldState.userName.error &&
      !fieldState.email.error &&
      !fieldState.confirmPassword.error &&
      !fieldState.displayName.error;
    const requiredFieldsFilled =
      fieldState.confirmPassword.value.length > 0 &&
      fieldState.email.value.length > 0 &&
      fieldState.password.value.length > 0 &&
      fieldState.userName.value.length > 0;
    const passwordsMatch =
      fieldState.confirmPassword.value === fieldState.password.value;
    return (
      allPasswordReqsMet && noErrors && requiredFieldsFilled && passwordsMatch
    );
  }

  return (
    <>
      <h1 className={styles.title}>Sign up</h1>
      {error && <p>{error}</p>}
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <label className={styles.registerLabel} htmlFor="username">
          Username
          <TextInput
            variant="vanilla"
            type="text"
            id="userName"
            name="userName"
            key="userName"
            autoComplete="off"
            value={fieldState.userName.value}
            onChange={handleFieldChange("userName")}
            onBlur={handleFieldBlur("userName", validateUserName)}
            required
          />
          <p
            className={`${
              fieldState.userName.touched && fieldState.userName.error
                ? styles.error
                : styles.noError
            }`}
          >
            {fieldState.userName.touched && fieldState.userName.error && (
              <>{fieldState.userName.error}</>
            )}
          </p>
        </label>

        <label className={styles.registerLabel} htmlFor="username">
          Display name
          <TextInput
            variant="vanilla"
            type="text"
            id="displayName"
            name="displayName"
            key="displayName"
            value={fieldState.displayName.value}
            onChange={handleFieldChange("displayName")}
            onBlur={handleFieldBlur("displayName", validateDisplayName)}
          />
          <p
            className={`${
              fieldState.displayName.touched && fieldState.displayName.error
                ? styles.error
                : styles.noError
            }`}
          >
            {fieldState.displayName.touched && fieldState.displayName.error && (
              <>{fieldState.displayName.error}</>
            )}
          </p>
        </label>

        <label className={styles.registerLabel} htmlFor="username">
          Email
          <TextInput
            variant="vanilla"
            type="email"
            id="email"
            name="email"
            key="email"
            autoComplete="username"
            value={fieldState.email.value}
            onChange={handleFieldChange("email")}
            onBlur={handleFieldBlur("email", validateEmail)}
            required
          />
          <p
            className={`${
              fieldState.email.touched && fieldState.email.error
                ? styles.error
                : styles.noError
            }`}
          >
            {fieldState.email.touched && fieldState.email.error && (
              <>{fieldState.email.error}</>
            )}
          </p>
        </label>

        <label className={styles.registerLabel} htmlFor="password">
          Password
          <TextInput
            variant="vanilla"
            type="password"
            id="password"
            name="password"
            key="password"
            autoComplete="new-password"
            value={fieldState.password.value}
            onChange={handlePasswordChange}
            required
          />
        </label>
        <label className={styles.registerLabel} htmlFor="password">
          Repeat password
          <TextInput
            variant="vanilla"
            type="password"
            id="confirm-password"
            name="confirm-password"
            key="confirm-password"
            autoComplete="new-password"
            value={fieldState.confirmPassword.value}
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            required
          />
          <p
            className={`${
              fieldState.confirmPassword.touched &&
              fieldState.confirmPassword.error
                ? styles.error
                : styles.noError
            }`}
          >
            {fieldState.confirmPassword.touched &&
              fieldState.confirmPassword.error && (
                <>{fieldState.confirmPassword.error}</>
              )}
          </p>
        </label>
        <PasswordRequirements requirements={passwordRequirements} />

        <Button
          variant="cornflower"
          disabled={!isFormValid()}
          type="submit"
          buttonText={isLoading ? "Signing up..." : "Sign up"}
        />
      </form>
      <button
        className={styles.signInButton}
        onClick={() => openModal("login")}
      >
        Already have an account? Sign in!{" "}
      </button>
    </>
  );
}
