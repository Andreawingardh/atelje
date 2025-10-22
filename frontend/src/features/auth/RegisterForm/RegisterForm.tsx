import React from "react";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {

    return (
    <>
      <h1 className={styles.title}>Sign up</h1>
      <form className={styles.registerForm}>
        <label className={styles.registerLabel} htmlFor="username">Username</label>
        <input className={styles.registerInput} type="text" id="username" name="username" required />

        <label className={styles.registerLabel} htmlFor="username">Display name</label>
        <input className={styles.registerInput} type="text" id="displayname" name="displayname" required />

        <label className={styles.registerLabel} htmlFor="username">Email</label>
        <input className={styles.registerInput} type="text" id="email" name="email" required />

        <label className={styles.registerLabel} htmlFor="password">Password</label>
        <input className={styles.registerInput} type="password" id="password" name="password" required />

        <button type="submit">Sign up</button>
      </form>
    </>
    )
}