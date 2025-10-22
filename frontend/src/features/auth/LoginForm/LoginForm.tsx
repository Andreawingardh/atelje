import React from "react";
import styles from "./LoginForm.module.css";

export default function LoginForm() {

    return (
    <>
      <h1 className={styles.title} >Log in</h1>
      <form className={styles.loginForm}>
        <label className={styles.loginLabel} htmlFor="username">Username</label>
        <input className={styles.loginInput} type="text" id="username" name="username" required />

        <label className={styles.loginLabel} htmlFor="password">Password</label>
        <input className={styles.loginInput} type="password" id="password" name="password" required />

        <button type="submit">Log in</button>
      </form>
    </>
    )
}